//! Stakereload branding — workflow demo for stakereload.com and stakereloadxs.com
//!
//! Demonstrates the site-specific [`StakereloadWorkflow`] wrapper with per-site
//! profile presets, page-state detection, and Cloudflare challenge awareness.
//!
//! # Usage
//! ```bash
//! cargo run --example stakereload_workflow
//! ```

use anyhow::Result;
use futures::StreamExt;
use ignition::stakereload::{StakereloadSite, StakereloadWorkflow};
use ignition::{Browser, BrowserConfig, IgnitionPage, IgnitionProfile};
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<()> {
    println!("=== Stakereload Branding Workflow ===\n");

    // Launch a single shared browser instance
    let (browser, mut handler) = Browser::launch(
        BrowserConfig::builder()
            .viewport(None)
            .build()
            .map_err(|e| anyhow::anyhow!(e))?,
    )
    .await?;

    tokio::spawn(async move { while handler.next().await.is_some() {} });

    // ── Standard site ──────────────────────────────────────────────────────────
    {
        println!("[1/2] stakereload.com");

        let profile = IgnitionProfile::stakereload().build();
        println!("  Profile : {}", profile);

        let page = browser.new_page("about:blank").await?;
        let ignition = IgnitionPage::new(page);
        ignition.apply_profile(&profile).await?;

        // Settle before navigation so the bootstrap script is registered
        tokio::time::sleep(Duration::from_millis(100)).await;

        let wf = StakereloadWorkflow::new(ignition, StakereloadSite::Standard);
        wf.open_home().await?;

        let state = wf.page_state().await?;
        println!("  State   : {:?}", state);

        match state {
            ignition::stakereload::PageState::CloudflareChallenge => {
                println!("  CF challenge detected — waiting up to 30 s for clearance…");
                let cleared = wf
                    .wait_for_cf_clearance(Duration::from_secs(30), Duration::from_secs(2))
                    .await?;
                println!("  CF cleared: {}", cleared);
            }
            ignition::stakereload::PageState::Ready => {
                let title = wf.title().await?;
                let url = wf.current_url().await?;
                println!("  Title   : {:?}", title);
                println!("  URL     : {:?}", url);
            }
            ignition::stakereload::PageState::Unknown => {
                println!("  Page state unknown — inspect manually");
            }
        }
    }

    // ── XS site ────────────────────────────────────────────────────────────────
    {
        println!("\n[2/2] stakereloadxs.com");

        // XS variant uses a distinct RTX 4080 fingerprint
        let profile = IgnitionProfile::stakereloadxs().build();
        println!("  Profile : {}", profile);

        let page = browser.new_page("about:blank").await?;
        let ignition = IgnitionPage::new(page);
        ignition.apply_profile(&profile).await?;

        tokio::time::sleep(Duration::from_millis(100)).await;

        let wf = StakereloadWorkflow::new(ignition, StakereloadSite::Xs);
        wf.open_home().await?;

        let state = wf.page_state().await?;
        println!("  State   : {:?}", state);

        match state {
            ignition::stakereload::PageState::CloudflareChallenge => {
                println!("  CF challenge detected — waiting up to 30 s for clearance…");
                let cleared = wf
                    .wait_for_cf_clearance(Duration::from_secs(30), Duration::from_secs(2))
                    .await?;
                println!("  CF cleared: {}", cleared);
            }
            ignition::stakereload::PageState::Ready => {
                let title = wf.title().await?;
                let url = wf.current_url().await?;
                println!("  Title   : {:?}", title);
                println!("  URL     : {:?}", url);
            }
            ignition::stakereload::PageState::Unknown => {
                println!("  Page state unknown — inspect manually");
            }
        }
    }

    println!("\nStakereload workflow demo complete.");
    Ok(())
}
