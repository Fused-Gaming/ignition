//! GambaReload Ignition — branded demo for gambareload.com
//!
//! Demonstrates applying the GambaReload-specific profile and navigating
//! gambareload.com with full stealth mode active.
//!
//! The `gambareload()` preset uses a distinct fingerprint from the shared
//! `fused_gaming()` preset: Chrome 132, RTX 4080, 32 GB RAM, 16 CPU cores.
//!
//! # Usage
//! ```bash
//! cargo run --example gambareload
//! ```

use anyhow::Result;
use futures::StreamExt;
use ignition::{Browser, BrowserConfig, IgnitionPage, IgnitionProfile};
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<()> {
    println!("=== GambaReload Ignition ===");

    // Build the GambaReload-specific profile (Windows, RTX 4080, 32 GB, 16 cores, Chrome 132)
    let profile = IgnitionProfile::gambareload().build();
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

    println!("\n-> Loading https://gambareload.com");

    let page = browser.new_page("about:blank").await?;
    let ignition = IgnitionPage::new(page);

    // Apply profile BEFORE navigation
    ignition.apply_profile(&profile).await?;

    // Small delay to ensure scripts are registered
    tokio::time::sleep(Duration::from_millis(100)).await;

    // Navigate to gambareload.com
    ignition.goto("https://gambareload.com").await?;

    // Wait for page to settle
    tokio::time::sleep(Duration::from_secs(2)).await;

    // Read page title via stealth execution (no Runtime.enable leak)
    let title = ignition.evaluate("document.title").await?;
    println!("   Title: {:?}", title);

    // Confirm the spoofed User-Agent is active
    let ua = ignition.evaluate("navigator.userAgent").await?;
    println!("   UA:    {:?}", ua);

    // Confirm hardware fingerprint
    let cores = ignition.evaluate("navigator.hardwareConcurrency").await?;
    println!("   Cores: {:?}", cores);

    let memory = ignition.evaluate("navigator.deviceMemory").await?;
    println!("   RAM:   {:?} GB", memory);

    // Confirm WebGL renderer
    let webgl_renderer = ignition
        .evaluate(
            r#"(function() {
                const c = document.createElement('canvas');
                const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
                if (!gl) return 'unavailable';
                const ext = gl.getExtension('WEBGL_debug_renderer_info');
                return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(0x1F01);
            })()"#,
        )
        .await?;
    println!("   GPU:   {:?}", webgl_renderer);

    println!("\nGambaReload Ignition demo complete.");
    Ok(())
}
