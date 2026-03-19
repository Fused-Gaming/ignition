# Design Token ASCII Mockups — 5 Resolutions

Each token category is shown at:
- **XS** — 320px mobile (40-col)
- **SM** — 640px mobile-lg (64-col)
- **MD** — 768px tablet (80-col)
- **LG** — 1024px desktop (100-col)
- **XL** — 1280px wide desktop (120-col)

Token categories: Color · Typography · Spacing · Border/Radius · Shadow/Glow · Animation State

---

## TOKEN: `--brand-primary` (#dc2626 Red)

### XS — 320px (40 col)
```
┌──────────────────────────────────────┐
│  ██████████████████████████  PRIMARY │
│  #dc2626                             │
│                                      │
│  ┌──────────────────────────┐        │
│  │  [ CLAIM NOW  ▶ ]        │        │
│  └──────────────────────────┘        │
│  ● Live — Claiming Now               │
└──────────────────────────────────────┘
```

### SM — 640px (64 col)
```
┌────────────────────────────────────────────────────────────────┐
│  COLOR SWATCH             USAGE CONTEXT                        │
│  ┌────────┐               Buttons · Badges · Alerts            │
│  │ ██████ │  #dc2626      Hover: #ef4444   Active: #b91c1c     │
│  │ ██████ │  Red-600      Border-glow · Stat numbers           │
│  └────────┘                                                    │
│                                                                │
│  [ CLAIM YOUR XS RELOAD ▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶ ]  ← btn-primary │
└────────────────────────────────────────────────────────────────┘
```

### MD — 768px (80 col)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TOKEN: --brand-primary                                                       │
│ ─────────────────────────────────────────────────────────────────────────── │
│  SWATCH          HEX        RGB              USAGE                           │
│  ┌──────────┐   #dc2626    rgb(220,38,38)   • CTA buttons (fill)            │
│  │ ████████ │                               • Live pulse dot                │
│  │ ████████ │   Contrast    On black: ✓     • Metric numbers                │
│  │ ████████ │   ratio       On white: ✗     • FAQ chevron                   │
│  └──────────┘   5.8:1      (WCAG AA pass)   • Border on hover               │
│                                                                              │
│  States:  DEFAULT #dc2626 ──hover──▶ #ef4444 ──active──▶ #b91c1c           │
└──────────────────────────────────────────────────────────────────────────────┘
```

### LG — 1024px (100 col)
```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DESIGN TOKEN: --brand-primary                                                                    │
│ ──────────────────────────────────────────────────────────────────────────────────────────────── │
│                                                                                                  │
│  SWATCH SCALE (tints → shades)                          COMPONENT USAGE MAP                     │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐           ┌──────────────────────────────────────┐ │
│  │░░░│ │▒▒▒│ │▓▓▓│ │███│ │███│ │███│ │███│           │  <CTAButton />       fill bg          │ │
│  │   │ │   │ │   │ │   │ │   │ │   │ │   │           │  <Badge />           bg + text        │ │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘           │  <LiveDot />         pulse animation  │ │
│  100   200   300   400  [600]  700   800               │  <StatNumber />      text color       │ │
│                          ▲ brand-primary               │  <CardHover />       border glow      │ │
│                                                        └──────────────────────────────────────┘ │
│  [ TRY IT FREE ▶ ]   [ TOP UP CREDITS ]                                                         │
│   ████████████████    ░░░░░░░░░░░░░░░░ ← btn-secondary (no fill, border only)                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### XL — 1280px (120 col)
```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DESIGN TOKEN: --brand-primary  ·  #dc2626  ·  Red-600  ·  Role: ACTION / ATTENTION                                    │
│ ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── │
│                                                                                                                        │
│  FULL SCALE                                    INTERACTION STATES                  SEMANTIC PAIRINGS                   │
│  ┌───┬───┬───┬───┬[═══]┬───┬───┬───┬───┐      DEFAULT  ──────── #dc2626           --brand-primary   + --brand-bg     │
│  │░░░│▒▒▒│▓▓▓│▓▓▓│████│███│███│███│███│      HOVER    ──────── #ef4444           --brand-primary   + white           │
│  │050│100│200│300│ 600 │700│800│900│950│      ACTIVE   ──────── #b91c1c           --brand-primary   + transparent    │
│  └───┴───┴───┴───┴[═══]┴───┴───┴───┴───┘      FOCUS    ──────── #dc2626 + ring   --brand-primary/15 (bg alpha)       │
│                    ▲ brand-primary             DISABLED ──────── #dc2626 @ 40%                                        │
│                                                                                                                        │
│  FULL COMPONENT PREVIEW (hero section)                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │  ● Live — Claiming Now                                                                                           │ │
│  │                                                                                                                  │ │
│  │  Xtremely Simple Reloads                                                                                         │ │
│  │                                                                                                                  │ │
│  │  [ TRY IT FREE ▶ ]███████████████   [ Top Up Credits ]░░░░░░░░░░░░░░░                                           │ │
│  │   ▲── btn-primary (--brand-primary fill)  ▲── btn-secondary (--brand-primary border on hover)                   │ │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## TOKEN: `--brand-bg` / `--brand-bg-secondary` / `--brand-bg-tertiary`

### XS — 320px
```
┌──────────────────────────────────────┐
│ ████████████████████████████████████ │ ← --brand-bg #000
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← --brand-bg-secondary #111
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │ ← --brand-bg-tertiary #1a1a1a
└──────────────────────────────────────┘
```

### SM — 640px
```
┌────────────────────────────────────────────────────────────────┐
│  LAYER         HEX      USAGE                                  │
│  bg            #000000  Page background, main sections         │
│  bg-secondary  #111111  Cards, nav, footer, alt sections       │
│  bg-tertiary   #1a1a1a  Input fields, nested cards, dropdowns  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ #000  PAGE                                               │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ #111  CARD / SECTION                               │  │  │
│  │  │  ┌──────────────────────────────────────────────┐  │  │  │
│  │  │  │ #1a1a1a  INPUT / NESTED ELEMENT              │  │  │  │
│  │  │  └──────────────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### MD — 768px
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND LAYERS                                                            │
│ ─────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  ████████████████████████████████████████████████████████████  #000  Z:0   │
│  ┌──────────────────────────────────────────────────────────┐               │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  #111  Z:1   │
│  │  ┌────────────────────────────────────────────────────┐  │               │
│  │  │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  │  #1a1a Z:2  │
│  │  │  [ @telegram_input                              ]  │  │               │
│  │  └────────────────────────────────────────────────────┘  │               │
│  └──────────────────────────────────────────────────────────┘               │
│                                                                              │
│  Contrast ratios (white text):  #000 21:1  #111 19:1  #1a1a 17:1           │
└──────────────────────────────────────────────────────────────────────────────┘
```

### LG — 1024px
```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND TOKEN SYSTEM — ELEVATION MODEL                                                        │
│                                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │  PAGE  #000000                                                                              │ │
│  │  ┌─────────────────────────────┐  ┌─────────────────────────────┐                         │ │
│  │  │  SECTION ALT  #111111       │  │  NAV / FOOTER  #111111       │                         │ │
│  │  │  ┌───────────────────────┐  │  │                              │                         │ │
│  │  │  │  CARD  #111111        │  │  │  [Home] [Shop] [Affiliates]  │                         │ │
│  │  │  │  ┌─────────────────┐  │  │  │  [ TOP UP ████████████ ]    │                         │ │
│  │  │  │  │ INPUT #1a1a1a   │  │  │  └──────────────────────────── ┘                         │ │
│  │  │  │  │ @username       │  │  │                                                           │ │
│  │  │  │  └─────────────────┘  │  │  MODAL BACKDROP  rgba(0,0,0,0.85)                        │ │
│  │  │  └───────────────────────┘  │  ┌─────────────────────────────┐                         │ │
│  │  └─────────────────────────────┘  │  MODAL  #111111              │                         │ │
│  │                                   │  ┌─────────────────────────┐ │                         │ │
│  │                                   │  │  MODAL INPUT  #1a1a1a   │ │                         │ │
│  │                                   │  └─────────────────────────┘ │                         │ │
│  │                                   └──────────────────────────────┘                         │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### XL — 1280px
```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TOKEN: BACKGROUND SYSTEM  ·  3-layer depth model                                                                       │
│ ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── │
│                                                                                                                        │
│  TOKEN NAME           VALUE     OPACITY VARIANTS                ASSIGNED COMPONENTS                                    │
│  --brand-bg           #000000   /5 /10 /15 /20 /30 /50 /75    body, main sections, hero, page wrapper                 │
│  --brand-bg-secondary #111111   /5 /10 /15 /20 /30 /50 /75    cards, navbar, footer, alt sections, modal bg           │
│  --brand-bg-tertiary  #1a1a1a   /5 /10 /15 /20 /30 /50 /75    inputs, nested cards, service tiers, tooltips           │
│                                                                                                                        │
│  FULL PAGE WIREFRAME                                                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ NAV #111      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │
│  │                                                                                                                  │ │
│  │  HERO ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ #000 (page bg)                                  │ │
│  │                                                                                                                  │ │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ FEATURES #111 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐   CARDS #111                                                      │ │
│  │  │▒▒▒▒▒▒▒▒▒▒▒│  │▒▒▒▒▒▒▒▒▒▒▒│  │▒▒▒▒▒▒▒▒▒▒▒│   INPUT#1a                                                       │ │
│  │  └───────────┘  └───────────┘  └───────────┘                                                                   │ │
│  │  METRICS ██████████████████████████████████████████████████████████████████ #dc2626 full bleed                  │ │
│  │  SHOP ░░ CARDS ▓▓▓ INPUTS ▒▒▒ FOOTER ▓▓▓                                                                       │ │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## TOKEN: `--brand-text` / `--brand-muted` / `--brand-faint`

### XS — 320px
```
┌──────────────────────────────────────┐
│ Heading text                  #f3f4f6│
│ Body copy text                #f3f4f6│
│ Supporting detail             #9ca3af│
│ Placeholder / disabled        #4b5563│
└──────────────────────────────────────┘
```

### SM — 640px
```
┌────────────────────────────────────────────────────────────────┐
│  --brand-text   #f3f4f6  ██████████████  Primary copy          │
│  --brand-muted  #9ca3af  ██████          Secondary / supporting│
│  --brand-faint  #4b5563  ████            Placeholder / disabled│
│                                                                │
│  "Xtremely Simple Reloads"        ← brand-text  (hero h1)     │
│  "Automated claims in 2 seconds"  ← brand-muted (subheading)  │
│  "Powered by NOWPayments"         ← brand-faint (footer note) │
└────────────────────────────────────────────────────────────────┘
```

### MD — 768px
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TYPOGRAPHY TOKEN MAP                                                         │
│ ─────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  Xtremely Simple Reloads                 ← Poppins 900 · brand-text         │
│  ──────────────────────────────                                              │
│  Automated bonus claims for Stake.com    ← Poppins 400 · brand-muted        │
│  in under 2 seconds.                                                         │
│                                                                              │
│  700+ Monthly Users  ·  25+ Years Dev  ·  0 Complaints                     │
│  ─── brand-primary ──   ─── brand-primary ────  ── brand-primary ──         │
│                                                                              │
│  Powered by NOWPayments · BTC, ETH, USDT accepted                           │
│  ────────────────────── brand-faint ──────────────────────────              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### LG — 1024px
```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TEXT TOKEN HIERARCHY                                                                             │
│                                                                                                  │
│  SIZE     WEIGHT   TOKEN           SAMPLE                                                        │
│  4.5rem   900      brand-text      Xtremely Simple Reloads                                       │
│  1.25rem  400      brand-muted     Automated bonus claims for Stake in under 2 seconds           │
│  0.875rem 600      brand-text      Why StakeReloadXS? (section heading)                          │
│  0.875rem 400      brand-muted     Dedicated infrastructure for your account.                    │
│  0.75rem  500      brand-primary   Read more →                                                   │
│  0.75rem  400      brand-faint     Powered by NOWPayments · BTC, ETH, USDT accepted             │
│                                                                                                  │
│  CONTRAST CHECK ON #000000 BG:                                                                   │
│  brand-text  #f3f4f6  ──── 19.3:1  ✓ AAA                                                        │
│  brand-muted #9ca3af  ──── 7.2:1   ✓ AA+                                                        │
│  brand-faint #4b5563  ──── 3.1:1   △ AA (large text only)                                       │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### XL — 1280px
```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TYPOGRAPHY TOKEN SYSTEM  ·  Poppins (headings) + Inter (body)                                                          │
│ ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── │
│                                                                                                                        │
│  SCALE      TOKEN           HEX       WEIGHT    COMPONENT ROLE                         SAMPLE TEXT                    │
│  ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────   │
│  text-7xl   brand-text      #f3f4f6   900       Hero headline                           Xtremely Simple Reloads       │
│  text-4xl   brand-text      #f3f4f6   700       Section headings                        Credit Packages               │
│  text-xl    brand-text      #f3f4f6   600       Card titles, nav links                  Private Servers               │
│  text-base  brand-muted     #9ca3af   400       Body copy, descriptions                 Dedicated infrastructure...   │
│  text-sm    brand-muted     #9ca3af   400       Sub-labels, captions                    5,000 credits                 │
│  text-xs    brand-primary   #dc2626   600       Badges, boost tags                      Popular · 10% Boost           │
│  text-xs    brand-faint     #4b5563   400       Legal, disclaimers, footnotes            Not affiliated with Stake.com │
│                                                                                                                        │
│  FLUID SCALING (clamp):                                                                                                │
│  h1: clamp(2.5rem, 5vw + 1rem, 4.5rem)   h2: clamp(1.75rem, 3vw + 0.5rem, 2.5rem)                                   │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## TOKEN: `--brand-border` / Border Radius

### XS — 320px
```
┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │  CARD  border: 1px #222          │ │
│ │  ┌──────────────────────────┐    │ │
│ │  │ INPUT border: 1px #222   │    │ │
│ │  └──────────────────────────┘    │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │ ← hover: border #dc2626
└──────────────────────────────────────┘
```

### SM — 640px
```
┌────────────────────────────────────────────────────────────────┐
│  TOKEN            VALUE     USAGE                              │
│  --brand-border   #222222   Default card/input border          │
│  + hover state    #dc2626   Card hover, input focus            │
│  radius-sm        6px       Inputs, badges, small elements     │
│  radius-md        12px      Cards, modals, sections            │
│  radius-full      9999px    Pills, live dots, round badges     │
│                                                                │
│  ┌────────────────────────────┐  ┌──────────────────────────┐  │
│  │  radius-md (card)          │  │  radius-md (modal)       │  │
│  └────────────────────────────┘  └──────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### MD — 768px
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ BORDER + RADIUS SYSTEM                                                       │
│                                                                              │
│  DEFAULT STATE           HOVER / FOCUS STATE                                 │
│  ┌──────────────────┐    ┌──────────────────┐                               │
│  │                  │    │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← border #dc2626             │
│  │  CARD            │    │  CARD (hovered)  │                               │
│  │  border: #222    │    │  border: #dc2626 │                               │
│  └──────────────────┘    └──────────────────┘                               │
│                                                                              │
│  RADIUS VALUES:                                                              │
│  none ┌─────────────┐  sm ┌─────────────╮  md ╭─────────────╮  full ●      │
│       └─────────────┘      └─────────────╯     ╰─────────────╯              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### LG — 1024px
```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ BORDER SYSTEM — States × Components                                                              │
│                                                                                                  │
│  COMPONENT        DEFAULT           HOVER             FOCUS            ACTIVE                   │
│  Card             1px #222222       1px #dc2626       —                1px #dc2626              │
│  Input            1px #222222       1px #dc2626       1px #dc2626      1px #dc2626              │
│  Button-primary   none              none              2px ring #dc2626 none                     │
│  Button-secondary 1px #222222       1px #dc2626       2px ring #dc2626 1px #b91c1c              │
│  Modal            1px #222222       —                 —                —                        │
│  Service tier     1px #222222       1px #dc2626       —                —                        │
│                                                                                                  │
│  BOX SHADOWS (neon-glow system):                                                                 │
│  neon-sm:  0 0 8px #dc2626                  → hover on interactive elements                     │
│  neon-md:  0 0 20px #dc2626                 → active CTA, pulsing badge                         │
│  neon-lg:  0 0 20px #dc2626, 0 0 40px ...   → hero pulse, modal active state                    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### XL — 1280px
```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ BORDER + SHADOW TOKEN SYSTEM  ·  Full specification                                                                    │
│                                                                                                                        │
│  BORDER TOKENS                                                                                                         │
│  --brand-border:      #222222   →  1px solid border (all resting states)                                              │
│  --brand-border-glow: #dc2626   →  border color on hover/focus (same as primary)                                      │
│                                                                                                                        │
│  RADIUS SCALE                                                                                                          │
│  --radius-none:  0px       form inline elements                                                                        │
│  --radius-sm:    6px       badges, tags, inputs, small buttons                                                        │
│  --radius-md:    12px      cards, modals, section containers, service tiers                                           │
│  --radius-lg:    16px      large modals, feature panels                                                               │
│  --radius-xl:    20px      credit package cards, hero CTA containers                                                  │
│  --radius-full:  9999px    live dot, pill badges, circular avatars                                                    │
│                                                                                                                        │
│  SHADOW SCALE (using --brand-primary color)                                                                            │
│  --shadow-neon-xs:   0 0 4px rgba(220,38,38,0.4)   subtle highlight                                                  │
│  --shadow-neon-sm:   0 0 8px rgba(220,38,38,0.6)   card hover                                                        │
│  --shadow-neon-md:   0 0 20px rgba(220,38,38,0.5), 0 0 40px rgba(220,38,38,0.2)   CTA pulse                          │
│  --shadow-neon-lg:   0 0 40px rgba(220,38,38,0.7), 0 0 80px rgba(220,38,38,0.3)   hero glow                          │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## TOKEN: Animation / Motion

### XS — 320px
```
┌──────────────────────────────────────┐
│ smooth   duration: 300ms ease-out    │
│ fast     duration: 150ms ease-in-out │
│ fade     opacity 0→1 400ms           │
│ slide-up translateY(20px)→0 400ms    │
└──────────────────────────────────────┘
```

### SM — 640px
```
┌────────────────────────────────────────────────────────────────┐
│  MOTION TOKEN     VALUE           USE CASE                     │
│  ─────────────────────────────────────────────────────────────│
│  --dur-fast       150ms           Button hover, toggle         │
│  --dur-base       300ms           Card transitions, nav        │
│  --dur-slow       500ms           Page fade, hero entrance     │
│  --ease-out       ease-out        Most enter animations        │
│  --ease-spring    cubic-bezier    Modal pop, scale effects     │
│                                                                │
│  [  frame 0  ]→[  frame 1  ]→[  frame 2  ]→[  frame 3  ] ←smooth │
│  [f0]→[f1]→[f2]→[f3] ←fast                                    │
└────────────────────────────────────────────────────────────────┘
```

### MD — 768px
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ANIMATION TOKEN SYSTEM                                                       │
│                                                                              │
│  ENTRANCE (scroll-triggered via Framer Motion whileInView):                 │
│  opacity: 0→1,  translateY: 20px→0,  duration: 400ms,  delay: i*100ms      │
│                                                                              │
│  [░░░░░░░░░░░░░░░░░] card 1 → fades in                                      │
│  [░░░░░░░░░░░░░░░░░░░] card 2 → fades in (100ms delay)                      │
│  [░░░░░░░░░░░░░░░░░░░░░] card 3 → fades in (200ms delay)                    │
│                                                                              │
│  LIVE DOT PULSE:  scale 1→2, opacity 0.75→0 infinite 1s ease-out           │
│  ● ←── ping layer (expand)    ● ←── base layer (static)                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### LG — 1024px
```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MOTION SYSTEM — All animation tokens                                                             │
│                                                                                                  │
│  TOKEN               VALUE                          USAGE                                        │
│  --dur-instant       50ms                           Immediate feedback (click flash)             │
│  --dur-fast          150ms                          Hover states, toggles                        │
│  --dur-base          300ms  ease-out                Nav, card transitions                        │
│  --dur-slow          500ms  ease-out                Hero entrance, page fade                     │
│  --dur-very-slow     800ms  ease-in-out             Metrics counter, page mount                  │
│                                                                                                  │
│  STAGGER: children delay = index × 80ms  (features, credit packages)                            │
│  VIEWPORT TRIGGER: { once: true, margin: "-50px" }  (scroll-into-view)                          │
│                                                                                                  │
│  MODAL:  scale(0.95)+opacity(0)→scale(1)+opacity(1)  200ms  ease-out                           │
│  FAQ:    height(0)→height(auto)  250ms  ease-in-out                                             │
│  NAV:    translateY(-100%)→0  300ms  on scroll threshold                                        │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### XL — 1280px
```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ANIMATION TOKEN SYSTEM  ·  Full specification for brand = "smooth"                                                     │
│ ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── │
│                                                                                                                        │
│  DURATION TOKENS              EASING TOKENS                     KEYFRAME DEFINITIONS                                   │
│  --dur-instant   50ms         --ease-linear    linear           @fadeIn:   0%{opacity:0} 100%{opacity:1}              │
│  --dur-fast      150ms        --ease-out       ease-out         @slideUp:  0%{transform:translateY(20px);opacity:0}   │
│  --dur-base      300ms        --ease-in-out    ease-in-out                 100%{transform:translateY(0);opacity:1}    │
│  --dur-slow      500ms        --ease-spring    cubic-bezier(    @pulse:    0%,100%{opacity:1} 50%{opacity:0.4}        │
│  --dur-slow2     800ms                          0.34,1.56,      @ping:     to{transform:scale(2);opacity:0}           │
│                                                 0.64,1)                                                               │
│                                                                                                                        │
│  PER-BRAND ANIMATION PRESET (brand.animation field):                                                                   │
│  "smooth"      → dur-base=300ms,  easing=ease-out,    stagger=80ms   (StakeReloadXS, Stakereload)                     │
│  "fast"        → dur-base=150ms,  easing=ease-in-out, stagger=50ms   (StakeClaimBot)                                  │
│  "glitch"      → dur-base=100ms,  easing=steps(2),    stagger=30ms   (GambaReload dark variant)                       │
│  "static"      → dur-base=0ms,    easing=linear,      stagger=0ms    (accessibility mode)                             │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
