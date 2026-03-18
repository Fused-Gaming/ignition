//! # Fused Gaming Ignition
//!
//! Stealth browser automation for gaming platforms — built on Chrome DevTools Protocol (CDP).
//!
//! Designed for use with [stakereload.com](https://stakereload.com),
//! [stakereloadxs.com](https://stakereloadxs.com), and
//! [gambareload.com](https://gambareload.com).
//!
//! # Example
//! ```no_run
//! use futures::StreamExt;
//! use ignition::{Browser, BrowserConfig, IgnitionPage, IgnitionProfile};
//!
//! #[tokio::main]
//! async fn main() -> anyhow::Result<()> {
//!     let profile = IgnitionProfile::fused_gaming().build();
//!
//!     let (browser, mut handler) =
//!         Browser::launch(BrowserConfig::builder().build()?).await?;
//!
//!     tokio::spawn(async move { while let Some(_) = handler.next().await {} });
//!
//!     let page = browser.new_page("about:blank").await?;
//!     let ignition = IgnitionPage::new(page);
//!     ignition.apply_profile(&profile).await?;
//!     ignition.goto("https://stakereload.com").await?;
//!
//!     let title = ignition.evaluate("document.title").await?;
//!     println!("Title: {:?}", title);
//!     Ok(())
//! }
//! ```

#![warn(missing_debug_implementations, rust_2018_idioms)]

use crate::handler::http::HttpRequest;
use std::sync::Arc;

/// reexport the generated cdp types
pub use chromiumoxide_cdp::cdp;
pub use chromiumoxide_types::{self as types, Binary, Command, Method, MethodType};

pub use crate::browser::{Browser, BrowserConfig};
pub use crate::conn::Connection;
pub use crate::element::Element;
pub use crate::error::Result;
#[cfg(feature = "fetcher")]
pub use crate::fetcher::{BrowserFetcher, BrowserFetcherOptions};
pub use crate::handler::Handler;
pub use crate::page::Page;

pub mod auth;
pub mod browser;
pub mod cmd;
pub mod conn;
pub mod detection;
pub mod element;
pub mod error;
#[cfg(feature = "fetcher")]
pub mod fetcher {
    pub use chromiumoxide_fetcher::*;
}
pub mod async_process;
pub mod handler;
pub mod js;
pub mod keys;
pub mod layout;
pub mod listeners;
pub mod page;
pub(crate) mod utils;

pub type ArcHttpRequest = Option<Arc<HttpRequest>>;

pub mod ignition;
pub use crate::ignition::*;

pub mod stealth;
pub use crate::stealth::*;

pub mod profiles;
pub use crate::profiles::*;

pub mod stakereload;

// Re-export useful CDP types for request interception
pub use chromiumoxide_cdp::cdp::browser_protocol::network::ResourceType;
