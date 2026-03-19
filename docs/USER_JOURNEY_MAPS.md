# Fused Gaming — User Journey Maps

Five distinct personas interact with the platform at very different depths.
Each journey is mapped below as a Mermaid flowchart, followed by a state diagram
showing the emotional arc, then a sequence diagram for the critical path.

---

## Persona Definitions

| # | Persona | Entry Point | Goal | Key Fear |
|---|---------|-------------|------|----------|
| 1 | **Prospective Customer** | Affiliate link / social | Understand the offer | Scam / account ban |
| 2 | **First-Time Customer** | Direct purchase | Activate credits, see first claim | Setup complexity |
| 3 | **Returning Customer** | Bookmark / Telegram reminder | Top up, check stats, re-claim | Credits running out |
| 4 | **Super Agent** | Admin subdomain | Manage affiliate network, view volumes | Fraud, bad actors |
| 5 | **Administrator** | Internal admin panel | Deploy brands, configure tokens, monitor all | System instability |

---

## 1. Prospective Customer Journey

```mermaid
journey
  title Prospective Customer: Discovery → First Purchase
  section Awareness
    Sees affiliate link / ad:           3: Prospective
    Lands on hero section:              4: Prospective
    Reads tagline "Xtremely Simple":    4: Prospective
  section Consideration
    Scrolls to Features:                4: Prospective
    Watches demo video:                 5: Prospective
    Reads Metrics bar (400+ clients):   4: Prospective
    Checks FAQ (legit? ban risk?):      3: Prospective
    Views credit packages + prices:     4: Prospective
  section Decision
    Clicks "Try It Free" ($5 package):  5: Prospective
    Opens PaymentModal:                 3: Prospective
    Enters Telegram username:           3: Prospective
    Completes crypto payment:           4: Prospective
    Lands on /payment-success:          5: Prospective
  section Post-Purchase
    Gets Telegram message w/ XSID:      5: Prospective
    Becomes First-Time Customer:        5: Prospective
```

```mermaid
stateDiagram-v2
  direction LR
  [*] --> Skeptical : arrives via affiliate link
  Skeptical --> Curious : hero + stats land
  Curious --> Interested : demo video watched
  Interested --> Hesitant : sees payment required
  Hesitant --> Convinced : FAQ resolves ban concern
  Convinced --> Converting : clicks package
  Converting --> Purchased : payment complete
  Purchased --> [*] : Telegram confirmation received
```

---

## 2. First-Time Customer Journey

```mermaid
journey
  title First-Time Customer: Activation → First Successful Claim
  section Onboarding
    Receives Telegram welcome message:  5: FirstTime
    Follows setup instructions:         3: FirstTime
    Connects account credentials:       3: FirstTime
    Sees first automation run:          5: FirstTime
  section First Use
    Monitors claim progress:            4: FirstTime
    Sees first reload claimed (<2s):    5: FirstTime
    Checks credit balance in dashboard: 4: FirstTime
  section Expansion
    Explores affiliate program link:    4: FirstTime
    Shares referral URL with friend:    4: FirstTime
    Bookmarks site for top-up:          4: FirstTime
  section Retention Hook
    Receives "Low credits" Telegram DM: 3: FirstTime
    Returns to shop to top up:          4: FirstTime
    Becomes Returning Customer:         5: FirstTime
```

```mermaid
sequenceDiagram
  actor U as First-Time User
  participant TG as Telegram Bot
  participant SYS as Claim System
  participant DB as Credits DB

  U->>TG: completes payment (NOWPayments webhook)
  TG->>DB: allocate 5000 credits to XSID
  TG-->>U: "Welcome! Your XSID is active."
  U->>SYS: connects Stake account
  SYS->>DB: deduct 1 credit per claim attempt
  SYS-->>U: claim triggered < 2s
  SYS-->>TG: notify U "Reload claimed: $X"
  DB-->>TG: credit balance < 500 → alert
  TG-->>U: "Running low — top up here 👇"
```

---

## 3. Returning Customer Journey

```mermaid
journey
  title Returning Customer: Re-engagement → Ongoing Value Loop
  section Re-entry
    Receives Telegram low-credit alert: 4: Returning
    Opens site from bookmark:           4: Returning
    Skips hero (already knows it):      5: Returning
  section Top-Up
    Goes directly to #shop:             5: Returning
    Selects larger package (more value):5: Returning
    Opens PaymentModal:                 4: Returning
    Pre-filled Telegram from memory:    5: Returning
    Completes payment quickly:          5: Returning
  section Loyalty Loop
    Checks affiliate earnings:          4: Returning
    Sees compounding commission:        5: Returning
    Shares link to earn more:           5: Returning
    Credits replenished, loop restarts: 5: Returning
```

```mermaid
stateDiagram-v2
  direction TB
  [*] --> Active : credits loaded
  Active --> LowCredits : balance < 500
  LowCredits --> Notified : Telegram alert sent
  Notified --> ReturningToShop : clicks top-up link
  ReturningToShop --> Active : new credits purchased
  Active --> Advocate : shares affiliate link
  Advocate --> Active : earns commission credit
  Active --> Churned : no login for 30 days
  Churned --> Notified : win-back campaign
```

---

## 4. Super Agent Journey

```mermaid
journey
  title Super Agent: Affiliate Network Management
  section Dashboard Access
    Logs into agent subdomain:           4: SuperAgent
    Views total referral volume:         5: SuperAgent
    Sees pending commission payouts:     4: SuperAgent
  section Network Management
    Reviews referred user list:          4: SuperAgent
    Flags suspicious referral pattern:   3: SuperAgent
    Contacts support about fraud case:   3: SuperAgent
    Fraud flagged + commission withheld: 4: SuperAgent
  section Growth Actions
    Generates new campaign referral URL: 5: SuperAgent
    Posts to community channels:         5: SuperAgent
    Tracks click-through → conversion:   5: SuperAgent
  section Payout
    Requests weekly commission payout:   5: SuperAgent
    Receives crypto to wallet:           5: SuperAgent
    Reviews payout history:              4: SuperAgent
```

```mermaid
sequenceDiagram
  actor A as Super Agent
  participant AP as Agent Portal
  participant AFF as Affiliate Engine (Rust)
  participant FD as Fraud Detector
  participant PAY as Payout Service

  A->>AP: view dashboard
  AP->>AFF: GET /affiliate/stats?agentId=xxx
  AFF-->>AP: { referrals: 42, volume: $4200, pending: $840 }
  AP-->>A: renders commission overview

  A->>AP: request payout
  AP->>AFF: POST /affiliate/payout
  AFF->>FD: validate referral authenticity
  FD-->>AFF: PASS (no fraud signals)
  AFF->>PAY: initiate crypto transfer $840
  PAY-->>A: Telegram: "Payout sent ✓"
```

---

## 5. Administrator Journey

```mermaid
journey
  title Administrator: Brand Deployment + Platform Operations
  section Brand Launch
    Opens Admin Panel (/admin):          5: Admin
    Clicks "New Brand" button:           5: Admin
    Fills brand config form:             4: Admin
    Previews ASCII token samples:        5: Admin
    Selects deploy target (Vercel/VPS):  4: Admin
    Clicks "Deploy Brand":               5: Admin
    Monitors build log output:           4: Admin
    Brand live on new domain:            5: Admin
  section Operations
    Views all active brands + uptime:    4: Admin
    Checks payment success rates:        4: Admin
    Reviews affiliate fraud queue:       3: Admin
    Patches brand copy variant (A/B):    5: Admin
    Pushes config update (no redeploy):  5: Admin
  section Monitoring
    Views event stream (Rust service):   4: Admin
    Sees funnel drop-off by brand:       4: Admin
    Tunes credit package pricing:        5: Admin
```

```mermaid
flowchart TD
  A([Admin opens /admin]) --> B{Action?}

  B --> C[New Brand]
  C --> C1[Fill brand config form]
  C1 --> C2[Select tone + copy variant]
  C2 --> C3[Preview ASCII token samples]
  C3 --> C4{Deploy target}
  C4 --> C4a[Vercel] --> DEPLOY
  C4 --> C4b[VPS] --> DEPLOY
  C4 --> C4c[Docker] --> DEPLOY
  DEPLOY([🚀 Brand Live])

  B --> D[Edit Brand]
  D --> D1[Update JSON config]
  D1 --> D2[Hot-reload CSS vars]
  D2 --> D3[No rebuild needed]

  B --> E[Monitor]
  E --> E1[Uptime per domain]
  E --> E2[Payment conversion rate]
  E --> E3[Active credits issued]
  E --> E4[Fraud queue]

  B --> F[Affiliates]
  F --> F1[Agent list + volumes]
  F --> F2[Payout queue]
  F --> F3[Fraud flags]
```

---

## Cross-Persona Funnel Overlap

```mermaid
flowchart LR
  PROSPECT([Prospective\nCustomer]) -->|purchases| FIRST([First-Time\nCustomer])
  FIRST -->|repeats| RETURNING([Returning\nCustomer])
  RETURNING -->|recruits| AGENT([Super\nAgent])
  AGENT -->|scales network| RETURNING

  ADMIN([Administrator]) -->|deploys brand| PROSPECT
  ADMIN -->|manages agents| AGENT
  ADMIN -->|monitors all| FIRST & RETURNING
```
