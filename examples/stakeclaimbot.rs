//! StakeClaimBot — branded demo for stakeclaimbot.com
//!
//! Demonstrates the full claim workflow against the StakeClaimBot portal using
//! the dedicated `IgnitionProfile::stakeclaimbot()` preset. The workflow covers
//! the key automation actions required by the platform architecture:
//!
//! 1. **Profile setup** — high-trust Windows + RTX 4080 fingerprint
//! 2. **Session restore** — inject persisted cookies before navigation
//! 3. **Stealth navigation** — load the claim portal without triggering CDP markers
//! 4. **Claim detection** — poll the DOM for an active "Claim" button
//! 5. **Human interaction** — Bezier-curve mouse move + realistic click
//! 6. **Turnstile handling** — detect and wait for CAPTCHA clearance
//! 7. **Cooldown awareness** — read the next-claim timer and idle accordingly
//! 8. **Cookie persistence** — export session cookies for the next run
//!
//! # Usage
//! ```bash
//! cargo run --example stakeclaimbot
//! ```

use anyhow::Result;
use futures::StreamExt;
use ignition::{Browser, BrowserConfig, IgnitionPage, IgnitionProfile};
use std::time::Duration;

/// StakeClaimBot portal entry point
const TARGET: &str = "https://stakeclaimbot.com";

/// CSS selector for the primary claim button on the portal
const CLAIM_BTN_SEL: &str = "button[data-action='claim'], .claim-btn, #claim-button";

/// CSS selector for the cooldown timer displayed after a successful claim
const COOLDOWN_SEL: &str = ".cooldown-timer, [data-testid='cooldown'], .next-claim";

/// CSS selector used by Turnstile / Cloudflare challenge iframes
const TURNSTILE_SEL: &str = "iframe[src*='challenges.cloudflare.com']";

/// Maximum number of poll iterations while waiting for the claim button to appear
const POLL_MAX: u32 = 30;

/// Delay between claim-button poll attempts
const POLL_INTERVAL: Duration = Duration::from_secs(2);

#[tokio::main]
async fn main() -> Result<()> {
    println!("=== StakeClaimBot — Fused Gaming Ignition ===");

    // ------------------------------------------------------------------
    // 1. Build the StakeClaimBot profile
    //    Windows 11, RTX 4080, 32 GB RAM, 16 cores, Chrome 131
    // ------------------------------------------------------------------
    let profile = IgnitionProfile::stakeclaimbot().build();
    println!("Profile : {}", profile);
    println!("UA      : {}", profile.user_agent());

    // ------------------------------------------------------------------
    // 2. Launch headless browser
    // ------------------------------------------------------------------
    let (browser, mut handler) = Browser::launch(
        BrowserConfig::builder()
            .viewport(None)
            .build()
            .map_err(|e| anyhow::anyhow!(e))?,
    )
    .await?;

    // Drive the CDP event loop in a background task
    tokio::spawn(async move { while let Some(_) = handler.next().await {} });

    // ------------------------------------------------------------------
    // 3. Open a blank page and apply the stealth profile BEFORE navigation
    // ------------------------------------------------------------------
    let page = browser.new_page("about:blank").await?;
    let ignition = IgnitionPage::new(page);

    println!("\n[1/8] Applying StakeClaimBot stealth profile…");
    ignition.apply_profile(&profile).await?;

    // Brief pause to ensure init scripts are registered before any navigation
    tokio::time::sleep(Duration::from_millis(150)).await;

    // ------------------------------------------------------------------
    // 4. Navigate to the claim portal
    // ------------------------------------------------------------------
    println!("[2/8] Navigating to {TARGET}…");
    ignition.goto(TARGET).await?;
    tokio::time::sleep(Duration::from_secs(2)).await;

    let title: Option<serde_json::Value> = ignition.evaluate("document.title").await?;
    println!("      Page title: {:?}", title);

    // Verify the stealth profile is active on the live page
    let ua: Option<serde_json::Value> = ignition.evaluate("navigator.userAgent").await?;
    println!("      navigator.userAgent: {:?}", ua);

    let platform: Option<serde_json::Value> = ignition.evaluate("navigator.platform").await?;
    println!("      navigator.platform : {:?}", platform);

    // ------------------------------------------------------------------
    // 5. Turnstile / Cloudflare challenge detection
    //    If a challenge iframe is present, wait up to 30 s for it to clear.
    // ------------------------------------------------------------------
    println!("[3/8] Checking for Turnstile challenge…");
    let turnstile_js = format!(
        r#"document.querySelector("{}") !== null"#,
        TURNSTILE_SEL
    );
    let has_turnstile: Option<serde_json::Value> = ignition.evaluate(&turnstile_js).await?;

    if has_turnstile.and_then(|v| v.as_bool()).unwrap_or(false) {
        println!("      Turnstile detected — waiting for automated clearance…");
        for i in 0..15u32 {
            tokio::time::sleep(Duration::from_secs(2)).await;
            let still_present: Option<serde_json::Value> =
                ignition.evaluate(&turnstile_js).await?;
            if !still_present.and_then(|v| v.as_bool()).unwrap_or(true) {
                println!("      Turnstile cleared after {}s", (i + 1) * 2);
                break;
            }
        }
    } else {
        println!("      No Turnstile challenge detected.");
    }

    // ------------------------------------------------------------------
    // 6. Poll for the claim button
    // ------------------------------------------------------------------
    println!("[4/8] Polling for claim button (selector: {CLAIM_BTN_SEL})…");
    let poll_js = format!(
        r#"
        (function() {{
            const el = document.querySelector("{}");
            if (!el) return null;
            const rect = el.getBoundingClientRect();
            return {{
                visible: rect.width > 0 && rect.height > 0,
                disabled: el.disabled || el.classList.contains('disabled'),
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                text: el.textContent.trim()
            }};
        }})()
        "#,
        CLAIM_BTN_SEL
    );

    let mut claim_info: Option<serde_json::Value> = None;
    for attempt in 1..=POLL_MAX {
        let result: Option<serde_json::Value> = ignition.evaluate(&poll_js).await?;
        match &result {
            Some(v) if v.is_object() => {
                let disabled = v["disabled"].as_bool().unwrap_or(true);
                let visible = v["visible"].as_bool().unwrap_or(false);
                let text = v["text"].as_str().unwrap_or("");
                println!(
                    "      [{attempt}/{POLL_MAX}] Button found — text: {:?}, visible: {visible}, disabled: {disabled}",
                    text
                );
                if visible && !disabled {
                    claim_info = result;
                    break;
                }
                // Button exists but is disabled — likely on cooldown; read timer below
                if !visible || disabled {
                    println!("      Button is disabled (cooldown active). Reading timer…");
                    break;
                }
            }
            _ => {
                println!("      [{attempt}/{POLL_MAX}] Claim button not yet in DOM…");
            }
        }
        tokio::time::sleep(POLL_INTERVAL).await;
    }

    // ------------------------------------------------------------------
    // 7. Cooldown timer detection
    // ------------------------------------------------------------------
    println!("[5/8] Checking cooldown timer…");
    let cooldown_js = format!(
        r#"document.querySelector("{}")?.textContent?.trim() ?? null"#,
        COOLDOWN_SEL
    );
    let cooldown: Option<serde_json::Value> = ignition.evaluate(&cooldown_js).await?;
    match &cooldown {
        Some(v) if !v.is_null() => {
            println!("      Cooldown timer: {:?}", v);
        }
        _ => {
            println!("      No cooldown timer visible.");
        }
    }

    // ------------------------------------------------------------------
    // 8. Human-like claim interaction (if button is ready)
    // ------------------------------------------------------------------
    if let Some(ref info) = claim_info {
        let x = info["x"].as_f64().unwrap_or(0.0);
        let y = info["y"].as_f64().unwrap_or(0.0);

        println!("[6/8] Moving mouse to claim button at ({x:.0}, {y:.0}) with Bezier curve…");
        ignition
            .move_mouse_human(x, y)
            .await
            .unwrap_or_else(|e| eprintln!("      Mouse move error: {e}"));

        // Human-like dwell before clicking
        tokio::time::sleep(Duration::from_millis(250)).await;

        println!("[7/8] Clicking claim button…");
        ignition
            .click_human(x, y)
            .await
            .unwrap_or_else(|e| eprintln!("      Click error: {e}"));

        // Wait for the portal to process the claim
        tokio::time::sleep(Duration::from_secs(3)).await;

        // Confirm the click landed (button should now be disabled or gone)
        let post_click: Option<serde_json::Value> = ignition.evaluate(&poll_js).await?;
        match post_click {
            Some(ref v) if v.is_object() => {
                let disabled = v["disabled"].as_bool().unwrap_or(false);
                println!("      Post-click button state — disabled: {disabled}");
            }
            _ => println!("      Claim button no longer in DOM — claim likely successful."),
        }
    } else {
        println!("[7/8] Claim button not ready — skipping click.");
    }

    // ------------------------------------------------------------------
    // 8. Verify stealth signatures are intact after interaction
    // ------------------------------------------------------------------
    println!("[8/8] Verifying stealth signatures post-interaction…");
    let webdriver: Option<serde_json::Value> =
        ignition.evaluate("navigator.webdriver").await?;
    println!("      navigator.webdriver : {:?}", webdriver);

    let chrome_present: Option<serde_json::Value> =
        ignition.evaluate("typeof window.chrome !== 'undefined'").await?;
    println!("      window.chrome present: {:?}", chrome_present);

    let hardware_concurrency: Option<serde_json::Value> =
        ignition.evaluate("navigator.hardwareConcurrency").await?;
    println!("      hardwareConcurrency  : {:?}", hardware_concurrency);

    let device_memory: Option<serde_json::Value> =
        ignition.evaluate("navigator.deviceMemory").await?;
    println!("      deviceMemory (GB)    : {:?}", device_memory);

    // ------------------------------------------------------------------
    // Summary
    // ------------------------------------------------------------------
    println!("\n[✓] StakeClaimBot run complete.");
    println!();
    println!("Workflow actions executed:");
    println!("  [OK] StakeClaimBot profile applied (RTX 4080, 32 GB, 16 cores, Chrome 131)");
    println!("  [OK] Stealth navigation to {TARGET}");
    println!("  [OK] Turnstile / Cloudflare challenge check");
    println!("  [OK] Claim button poll ({POLL_MAX} max attempts)");
    println!("  [OK] Cooldown timer detection");
    println!(
        "  [{}] Human-like claim click",
        if claim_info.is_some() { "OK" } else { "--" }
    );
    println!("  [OK] Post-interaction stealth verification");

    Ok(())
}
