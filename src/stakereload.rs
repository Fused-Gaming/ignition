//! Stakereload branding — site-specific workflow for stakereload.com and stakereloadxs.com.
//!
//! Provides a high-level [`StakereloadWorkflow`] wrapper around [`IgnitionPage`] with
//! constants, selectors, and action sequences tailored to both site variants.
//!
//! # Quick start
//!
//! ```no_run
//! use ignition::stakereload::{StakereloadSite, StakereloadWorkflow};
//! use ignition::{Browser, BrowserConfig, IgnitionPage, IgnitionProfile};
//! use futures::StreamExt;
//!
//! #[tokio::main]
//! async fn main() -> anyhow::Result<()> {
//!     let profile = IgnitionProfile::stakereload().build();
//!
//!     let (browser, mut handler) = Browser::launch(BrowserConfig::builder().build()?).await?;
//!     tokio::spawn(async move { while let Some(_) = handler.next().await {} });
//!
//!     let page = browser.new_page("about:blank").await?;
//!     let ignition = IgnitionPage::new(page);
//!     ignition.apply_profile(&profile).await?;
//!
//!     let wf = StakereloadWorkflow::new(ignition, StakereloadSite::Standard);
//!     wf.open_home().await?;
//!
//!     let state = wf.page_state().await?;
//!     println!("State: {:?}", state);
//!     Ok(())
//! }
//! ```

use crate::ignition::IgnitionPage;
use anyhow::Result;
use std::time::Duration;

// ─── URL constants ────────────────────────────────────────────────────────────

/// Base URL for the standard Stakereload site.
pub const URL_STANDARD: &str = "https://stakereload.com";

/// Base URL for the XS (extended/alternative) Stakereload site.
pub const URL_XS: &str = "https://stakereloadxs.com";

// ─── CSS selectors ────────────────────────────────────────────────────────────

/// Selector for the Cloudflare Turnstile challenge iframe.
pub const SEL_CF_CHALLENGE: &str = "iframe[src*='challenges.cloudflare.com']";

/// Selector for the Cloudflare interstitial title text.
pub const SEL_CF_TITLE: &str = "#challenge-running, .lds-ring, #cf-content";

/// Selector for a generic page-ready indicator (main content wrapper).
pub const SEL_MAIN_CONTENT: &str = "main, #app, #root, .main-content, body > div";

// ─── Site variant ─────────────────────────────────────────────────────────────

/// Identifies which Stakereload site variant is being automated.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StakereloadSite {
    /// <https://stakereload.com>
    Standard,
    /// <https://stakereloadxs.com>
    Xs,
}

impl StakereloadSite {
    /// Returns the base URL for this variant.
    pub fn base_url(self) -> &'static str {
        match self {
            StakereloadSite::Standard => URL_STANDARD,
            StakereloadSite::Xs => URL_XS,
        }
    }

    /// Human-readable label used in log output.
    pub fn label(self) -> &'static str {
        match self {
            StakereloadSite::Standard => "stakereload.com",
            StakereloadSite::Xs => "stakereloadxs.com",
        }
    }
}

// ─── Page state ───────────────────────────────────────────────────────────────

/// Observed state of the page after a navigation attempt.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PageState {
    /// Page loaded and main content is visible.
    Ready,
    /// Cloudflare challenge (Turnstile / interstitial) is in progress.
    CloudflareChallenge,
    /// Page loaded but could not be identified as ready or challenged.
    Unknown,
}

// ─── Workflow ─────────────────────────────────────────────────────────────────

/// High-level automation workflow for Stakereload sites.
///
/// Wraps an [`IgnitionPage`] with site-specific helpers so callers can
/// express actions at the level of the Stakereload product rather than raw CDP.
#[derive(Debug, Clone)]
pub struct StakereloadWorkflow {
    ignition: IgnitionPage,
    site: StakereloadSite,
}

impl StakereloadWorkflow {
    /// Create a new workflow for the given site variant.
    ///
    /// The supplied `ignition` page must already have a profile applied via
    /// [`IgnitionPage::apply_profile`] before any navigation methods are called.
    pub fn new(ignition: IgnitionPage, site: StakereloadSite) -> Self {
        Self { ignition, site }
    }

    /// Returns the underlying [`IgnitionPage`] for low-level access.
    pub fn page(&self) -> &IgnitionPage {
        &self.ignition
    }

    /// Returns the site variant this workflow is targeting.
    pub fn site(&self) -> StakereloadSite {
        self.site
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    /// Navigate to the site's home page and wait for an initial render.
    ///
    /// A short settle delay is included to allow client-side frameworks to
    /// hydrate before subsequent interactions.
    pub async fn open_home(&self) -> Result<()> {
        self.ignition.goto(self.site.base_url()).await?;
        tokio::time::sleep(Duration::from_millis(1500)).await;
        Ok(())
    }

    /// Navigate to an arbitrary path within the current site.
    ///
    /// # Example
    /// ```no_run
    /// wf.goto_path("/promotions").await?;
    /// ```
    pub async fn goto_path(&self, path: &str) -> Result<()> {
        let url = format!("{}{}", self.site.base_url(), path);
        self.ignition.goto(&url).await?;
        tokio::time::sleep(Duration::from_millis(1500)).await;
        Ok(())
    }

    // ── Page state detection ──────────────────────────────────────────────────

    /// Detect the current state of the page.
    ///
    /// Returns [`PageState::CloudflareChallenge`] if a Turnstile or Cloudflare
    /// interstitial is detected, [`PageState::Ready`] when main content is
    /// present, or [`PageState::Unknown`] otherwise.
    pub async fn page_state(&self) -> Result<PageState> {
        // Check for Cloudflare challenge markers
        let cf_check = format!(
            "document.querySelector('{}') !== null || document.querySelector('{}') !== null",
            SEL_CF_CHALLENGE, SEL_CF_TITLE
        );
        if let Some(val) = self.ignition.evaluate(&cf_check).await? {
            if val.as_bool().unwrap_or(false) {
                return Ok(PageState::CloudflareChallenge);
            }
        }

        // Check for main content
        let content_check = format!(
            "document.querySelector('{}') !== null",
            SEL_MAIN_CONTENT
        );
        if let Some(val) = self.ignition.evaluate(&content_check).await? {
            if val.as_bool().unwrap_or(false) {
                return Ok(PageState::Ready);
            }
        }

        Ok(PageState::Unknown)
    }

    /// Wait until the page leaves a Cloudflare challenge state, polling every
    /// `interval` until `timeout` is reached. Returns `true` if the challenge
    /// cleared, `false` if it timed out.
    pub async fn wait_for_cf_clearance(
        &self,
        timeout: Duration,
        interval: Duration,
    ) -> Result<bool> {
        let deadline = tokio::time::Instant::now() + timeout;
        loop {
            if tokio::time::Instant::now() >= deadline {
                return Ok(false);
            }
            match self.page_state().await? {
                PageState::CloudflareChallenge => {
                    tokio::time::sleep(interval).await;
                }
                _ => return Ok(true),
            }
        }
    }

    // ── Page metadata ─────────────────────────────────────────────────────────

    /// Read the document title via stealth execution.
    pub async fn title(&self) -> Result<Option<String>> {
        let val = self.ignition.evaluate("document.title").await?;
        Ok(val.and_then(|v| v.as_str().map(str::to_owned)))
    }

    /// Read the current page URL as seen by the browser.
    pub async fn current_url(&self) -> Result<Option<String>> {
        self.ignition.url().await
    }

    // ── Cookie helpers ────────────────────────────────────────────────────────

    /// Read the `cf_clearance` cookie value if present.
    ///
    /// This cookie is set by Cloudflare after a successful challenge and is
    /// required for subsequent requests to bypass the interstitial.
    pub async fn cf_clearance_cookie(&self) -> Result<Option<String>> {
        let val = self
            .ignition
            .evaluate(
                "document.cookie.split(';').map(c=>c.trim())\
                 .find(c=>c.startsWith('cf_clearance='))\
                 ?.split('=').slice(1).join('=') ?? null",
            )
            .await?;
        Ok(val.and_then(|v| {
            let s = v.as_str().map(str::to_owned)?;
            if s.is_empty() { None } else { Some(s) }
        }))
    }

    // ── Human-like interaction helpers ────────────────────────────────────────

    /// Scroll the page down by `pixels` with human-like easing.
    pub async fn scroll_down(&self, pixels: i32) -> Result<()> {
        self.ignition.scroll_human(pixels).await
    }

    /// Scroll back to the top of the page.
    pub async fn scroll_to_top(&self) -> Result<()> {
        self.ignition.evaluate("window.scrollTo(0,0)").await?;
        Ok(())
    }
}
