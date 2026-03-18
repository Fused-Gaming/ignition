//! Fused Gaming Ignition — branded demo for stakereload.com, stakereloadxs.com, gambareload.com, gambarewards.com
//!
//! Demonstrates applying the Fused Gaming profile and navigating the four
//! branded gaming platforms with full stealth mode active.
//!
//! # Usage
//! ```bash
//! cargo run --example fused_gaming
//! ```

use anyhow::Result;
use futures::StreamExt;
use ignition::{Browser, BrowserConfig, IgnitionPage, IgnitionProfile};
use std::time::Duration;

/// Fused Gaming Ignition target domains
const TARGETS: &[&str] = &[
    "https://stakereload.com",
    "https://stakereloadxs.com",
    "https://gambareload.com",
    "https://gambarewards.com",
];

#[tokio::main]
async fn main() -> Result<()> {
    println!("=== Fused Gaming Ignition ===");

    // Build the Fused Gaming profile (Windows, RTX 3080, 16 GB, 12 cores)
    let profile = IgnitionProfile::fused_gaming().build();
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

    // Visit each Fused Gaming domain
    for target in TARGETS {
        println!("\n-> Loading {target}");

        let page = browser.new_page("about:blank").await?;
        let ignition = IgnitionPage::new(page);

        // Apply profile BEFORE navigation
        ignition.apply_profile(&profile).await?;

        // Small delay to ensure scripts are registered
        tokio::time::sleep(Duration::from_millis(100)).await;

        // Navigate
        ignition.goto(target).await?;

        // Wait for page to settle
        tokio::time::sleep(Duration::from_secs(2)).await;

        // Read page title via stealth execution (no Runtime.enable leak)
        let title = ignition.evaluate("document.title").await?;
        println!("   Title: {:?}", title);

        // Read user agent as seen by the site
        let ua = ignition.evaluate("navigator.userAgent").await?;
        println!("   UA:    {:?}", ua);
    }

    println!("\nFused Gaming Ignition demo complete.");
    Ok(())
}
