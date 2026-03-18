//! Hedgehog branding demo for hedgehog.com
//!
//! Demonstrates applying the Hedgehog profile and navigating hedgehog.com
//! with full stealth mode active.
//!
//! # Usage
//! ```bash
//! cargo run --example hedgehog
//! ```

use anyhow::Result;
use futures::StreamExt;
use ignition::{Browser, BrowserConfig, IgnitionPage, IgnitionProfile};
use std::time::Duration;

/// Hedgehog target domain
const TARGET: &str = "https://hedgehog.com";

#[tokio::main]
async fn main() -> Result<()> {
    println!("=== Fused Gaming Ignition — Hedgehog ===");

    // Build the Hedgehog profile (Windows, RTX 4080, 32 GB, 16 cores)
    let profile = IgnitionProfile::hedgehog().build();
    println!("Profile: {}", profile);

    // Launch browser
    let (browser, mut handler) = Browser::launch(
        BrowserConfig::builder()
            .viewport(None)
            .build()
            .map_err(|e| anyhow::anyhow!(e))?,
    )
    .await?;

    tokio::spawn(async move { while let Some(_) = handler.next().await {} });

    println!("\n-> Loading {TARGET}");

    let page = browser.new_page("about:blank").await?;
    let ignition = IgnitionPage::new(page);

    // Apply profile BEFORE navigation
    ignition.apply_profile(&profile).await?;

    // Small delay to ensure scripts are registered
    tokio::time::sleep(Duration::from_millis(100)).await;

    // Navigate
    ignition.goto(TARGET).await?;

    // Wait for page to settle
    tokio::time::sleep(Duration::from_secs(2)).await;

    // Read page title via stealth execution (no Runtime.enable leak)
    let title = ignition.evaluate("document.title").await?;
    println!("   Title: {:?}", title);

    // Read user agent as seen by the site
    let ua = ignition.evaluate("navigator.userAgent").await?;
    println!("   UA:    {:?}", ua);

    // Verify spoofed hardware values
    let platform = ignition.evaluate("navigator.platform").await?;
    println!("   Platform: {:?}", platform);

    let cores = ignition.evaluate("navigator.hardwareConcurrency").await?;
    println!("   CPU cores: {:?}", cores);

    let memory = ignition.evaluate("navigator.deviceMemory").await?;
    println!("   Device memory: {:?}", memory);

    println!("\nHedgehog demo complete.");
    Ok(())
}
