# Fused Gaming Ignition

[![Crates.io](https://img.shields.io/crates/v/ignition.svg)](https://crates.io/crates/ignition)
[![Documentation](https://docs.rs/ignition/badge.svg)](https://docs.rs/ignition)
[![License](https://img.shields.io/crates/l/ignition.svg)](https://github.com/Fused-Gaming/ignition)

**Stealth browser automation for gaming platforms — powered by Rust.**

Fused Gaming Ignition is a hardened fork of `chromiumoxide` built for the Fused Gaming platform.
It incorporates protocol-level stealth modifications to the Chrome DevTools Protocol (CDP) client
to reduce the detection footprint of automated browser sessions on:

- **[stakereload.com](https://stakereload.com)**
- **[stakereloadxs.com](https://stakereloadxs.com)**
- **[gambareload.com](https://gambareload.com)**
- **[stakeclaimbot.com](https://stakeclaimbot.com)**
- **[gambarewards.com](https://gambarewards.com)**
- **[hedgedhog.com](https://hedgedhog.com)**

## Features

- **Protocol-Level Stealth**: Patches CDP at the transport layer, not via JavaScript wrappers
- **Fused Gaming Profile**: Pre-built `IgnitionProfile::fused_gaming()` preset for all three domains
- **Fingerprint Profiles**: Windows, Linux, macOS profiles with consistent hardware fingerprints
- **Human Interaction Engine**: Physics-based Bezier mouse curves and realistic typing patterns
- **Request Interception**: Built-in request modification and blocking capabilities
- **Low Memory Footprint**: ~50-100MB vs ~500MB+ for Node.js alternatives

## Installation

```bash
cargo add ignition tokio futures
```

Or add to your `Cargo.toml`:

```toml
[dependencies]
ignition = "0.1"
tokio = { version = "1", features = ["full"] }
futures = "0.3"
```

## Requirements

- Rust 1.75+
- Chrome/Chromium browser installed
- Supported platforms: Windows, macOS, Linux

## Quick Start

```rust
use ignition::{Browser, BrowserConfig, IgnitionPage, IgnitionProfile};
use futures::StreamExt;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // 1. Create the Fused Gaming fingerprint profile
    let profile = IgnitionProfile::fused_gaming().build();

    // 2. Launch browser
    let (browser, mut handler) = Browser::launch(
        BrowserConfig::builder().build()?
    ).await?;

    tokio::spawn(async move {
        while let Some(_) = handler.next().await {}
    });

    // 3. Create page and wrap in IgnitionPage
    let page = browser.new_page("about:blank").await?;
    let ignition = IgnitionPage::new(page);

    // 4. Apply profile (sets UA + injects stealth scripts) - BEFORE navigation
    ignition.apply_profile(&profile).await?;

    // 5. Navigate to a Fused Gaming domain
    ignition.goto("https://stakereload.com").await?;

    // 6. Execute JS safely (stealth - no Runtime.enable leak)
    let title: Option<serde_json::Value> = ignition.evaluate("document.title").await?;

    // 7. Human-like interaction
    ignition.move_mouse_human(400.0, 300.0).await?;
    ignition.click_human(500.0, 400.0).await?;
    ignition.type_text("Search query").await?;

    Ok(())
}
```

## Target Platforms

| Domain | Description |
|--------|-------------|
| [stakereload.com](https://stakereload.com) | Stake reload bonus tracker |
| [stakereloadxs.com](https://stakereloadxs.com) | Stake reload XS platform |
| [gambareload.com](https://gambareload.com) | Gamba reload bonus tracker |

Run the branded demo:

```bash
cargo run --example fused_gaming
```

## API Reference

### IgnitionProfile Builder

Create customized browser fingerprint profiles:

```rust
use ignition::{IgnitionProfile, Gpu};

// Fused Gaming preset (Windows, RTX 3080, 16 GB, 12 cores)
let profile = IgnitionProfile::fused_gaming().build();

// Other OS presets
let windows = IgnitionProfile::windows().build();
let linux   = IgnitionProfile::linux().build();
let mac_arm = IgnitionProfile::macos_arm().build();

// Fully custom profile
let custom = IgnitionProfile::windows()
    .chrome_version(130)           // Chrome version for UA
    .gpu(Gpu::NvidiaRTX4080)       // WebGL renderer
    .memory_gb(32)                 // navigator.deviceMemory
    .cpu_cores(16)                 // navigator.hardwareConcurrency
    .locale("de-DE")               // navigator.language
    .timezone("Europe/Berlin")     // Intl timezone
    .screen(2560, 1440)            // screen.width/height
    .build();
```

### Available GPUs

```rust
pub enum Gpu {
    NvidiaRTX3080, NvidiaRTX4080, NvidiaGTX1660,
    IntelUHD630, IntelIrisXe,
    AppleM1Pro, AppleM2Max, AppleM4Max,
    AmdRadeonRX6800,
}
```

### IgnitionPage Methods

```rust
impl IgnitionPage {
    // Profile
    async fn apply_profile(&self, profile: &IgnitionProfile) -> Result<()>;

    // Safe Page Operations
    async fn goto(&self, url: &str) -> Result<()>;
    async fn content(&self) -> Result<String>;
    async fn url(&self) -> Result<Option<String>>;
    async fn evaluate(&self, script: &str) -> Result<Option<Value>>;  // Stealth!

    // Human-like Mouse Movement (Bezier curves)
    async fn move_mouse_human(&self, x: f64, y: f64) -> Result<()>;
    async fn click_human(&self, x: f64, y: f64) -> Result<()>;
    async fn scroll_human(&self, delta_y: i32) -> Result<()>;

    // Human-like Typing
    async fn type_text(&self, text: &str) -> Result<()>;
    async fn type_text_with_typos(&self, text: &str) -> Result<()>;

    // Request Interception
    async fn enable_request_interception(&self, pattern: &str, resource_type: Option<ResourceType>) -> Result<()>;
    async fn disable_request_interception(&self) -> Result<()>;
    async fn fulfill_request_html(&self, request_id: impl Into<String>, html: &str, status: i64) -> Result<()>;
    async fn continue_request(&self, request_id: impl Into<String>) -> Result<()>;

    // Access underlying Page (use raw_page().evaluate() with caution - triggers detection!)
    fn raw_page(&self) -> &Page;
}
```

### BrowserConfig

```rust
let config = BrowserConfig::builder()
    .chrome_executable("/path/to/chrome")  // Custom Chrome path
    .with_head()                           // Show browser window
    .headless()                            // Run headless
    .viewport(Viewport {
        width: 1920,
        height: 1080,
        device_scale_factor: None,
        emulating_mobile: false,
        is_landscape: false,
        has_touch: false,
    })
    .build()?;
```

## Core Modifications

### 1. Protocol-Level Stealth

* **`Runtime.enable` Mitigation**: Uses `Page.createIsolatedWorld` to execute scripts in a secondary environment that bypasses detection vectors.
* **Utility World Renaming**: The default "Puppeteer" / "Chromiumoxide" utility world names have been neutralised.

### 2. Fingerprint Synchronization

* **State Management**: Injects scripts during document creation to synchronize `navigator.platform`, `WebGL` vendor/renderer strings, and hardware concurrency values.
* **Consistency Enforcement**: Values are enforced via the `IsolatedWorld` mechanism to ensure they are available before the target site's scripts execute.

### 3. Human Interaction Simulation

* **Bezier Mouse Curves**: Mouse movements follow randomized Bezier paths with acceleration and deceleration profiles.
* **Typing Physics**: Keypresses include variable inter-character delays and optional typo-correction simulation.

### 4. JavaScript-Level Stealth

The `IgnitionProfile.bootstrap_script()` injects comprehensive stealth at page load:

| Feature | What It Does |
|---------|-------------|
| CDP Marker Cleanup | Removes `cdc_`, `$cdc_`, `__webdriver`, `__selenium` markers |
| `navigator.webdriver` | Set to `false` (not deleted) |
| `navigator.platform` | Matches profile OS (e.g., "Win32") |
| `navigator.hardwareConcurrency` | Profile-configurable CPU cores |
| `navigator.deviceMemory` | Profile-configurable RAM |
| WebGL Spoofing | Custom GPU vendor/renderer strings |
| Client Hints | `navigator.userAgentData` with matching brands |
| `window.chrome` | Complete runtime object with `connect()`, `sendMessage()` |
| `chrome.csi()` | Chrome Speed Index mock |
| `chrome.loadTimes()` | Deprecated API mock (still checked by some sites) |
| `chrome.app` | Chrome app object mock |

**Tested against**: Cloudflare Turnstile, bot.sannysoft.com, CreepJS

## Technical Comparison

| Metric | Fused Gaming Ignition | Node.js Alternatives |
| --- | --- | --- |
| **Language** | Rust | JavaScript |
| **Memory Footprint** | ~50MB – 100MB (per process) | ~500MB+ (per process) |
| **Transport Patching** | Protocol-level (Internal Fork) | High-level (Wrapper/Plugin) |

## Dependencies

- [chromiumoxide](https://github.com/mattsse/chromiumoxide) - Base CDP client (forked)
- [tokio](https://tokio.rs) - Async runtime
- [futures](https://docs.rs/futures) - Async utilities

## Acknowledgements

This project is a specialized fork of **[chromiumoxide](https://github.com/mattsse/chromiumoxide)**. The core CDP client and session management are derived from their excellent work.

## License

Licensed under either of:

* Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
* MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)
