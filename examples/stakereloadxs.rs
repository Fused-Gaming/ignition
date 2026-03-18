//! StakeReloadXS — branded demo for stakereloadxs.com
//!
//! Demonstrates the `stakereloadxs()` profile preset, which presents a
//! high-end Windows gaming PC fingerprint optimised for the XS (exclusive)
//! tier of the Fused Gaming platform.
//!
//! # Usage
//! ```bash
//! cargo run --example stakereloadxs
//! ```

use anyhow::Result;
use futures::StreamExt;
use ignition::{Browser, BrowserConfig, IgnitionPage, IgnitionProfile};
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<()> {
    println!("=== StakeReloadXS — Fused Gaming Ignition ===");

    // Build the StakeReloadXS profile (Windows, RTX 4080, 32 GB, 16 cores, Chrome 130)
    let profile = IgnitionProfile::stakereloadxs().build();
    println!("Profile: {}", profile);
    println!("User-Agent: {}", profile.user_agent());

    // Launch browser
    let (browser, mut handler) = Browser::launch(
        BrowserConfig::builder()
            .viewport(None)
            .build()
            .map_err(|e| anyhow::anyhow!(e))?,
    )
    .await?;

    tokio::spawn(async move { while let Some(_) = handler.next().await {} });

    println!("\n-> Loading https://stakereloadxs.com");

    let page = browser.new_page("about:blank").await?;
    let ignition = IgnitionPage::new(page);

    // Apply profile BEFORE navigation
    ignition.apply_profile(&profile).await?;

    // Small delay to ensure scripts are registered
    tokio::time::sleep(Duration::from_millis(100)).await;

    // Navigate to StakeReloadXS
    ignition.goto("https://stakereloadxs.com").await?;

    // Wait for page to settle
    tokio::time::sleep(Duration::from_secs(2)).await;

    // Read page title via stealth execution (no Runtime.enable leak)
    let title = ignition.evaluate("document.title").await?;
    println!("   Title:    {:?}", title);

    // Verify the spoofed fingerprint values
    let ua = ignition.evaluate("navigator.userAgent").await?;
    println!("   UA:       {:?}", ua);

    let platform = ignition.evaluate("navigator.platform").await?;
    println!("   Platform: {:?}", platform);

    let cores = ignition.evaluate("navigator.hardwareConcurrency").await?;
    println!("   Cores:    {:?}", cores);

    let memory = ignition.evaluate("navigator.deviceMemory").await?;
    println!("   Memory:   {:?} GB", memory);

    println!("\nStakeReloadXS demo complete.");
    Ok(())
}
