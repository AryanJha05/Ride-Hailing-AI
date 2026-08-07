# Ride AI — Intelligent Ride-Hailing Demand Forecasting & Driver Assistant Platform
### Complete Product, Design & Engineering Blueprint
**Prepared as Lead Architect / Senior Product Designer** · Version 2.0 — Luxury Purple / Material UI Edition

---

## 0. Architect's Note — Revised Design Direction

**Updated identity: "Velour."**

Orange is out. The brand now runs on a deep, confident purple with a champagne-gold luxury accent — think private-aviation apps and premium fintech (Revolut Metal, Amex Platinum digital experiences) rather than taxi-app orange. Purple reads as premium, intelligent, and calmer at night than orange, which fits a driver staring at this screen for hours. Implementation also moves from Tailwind to **Material UI (MUI v5)**, since MUI gives us a mature theming system, accessible components out of the box, and a component library an enterprise reviewer will recognize as production-grade rather than hand-rolled.

| Decision | Choice | Why |
|---|---|---|
| Theme | Dark-first, light mode secondary | Same rationale as before — glare-sensitive, in-car use, reads as a pro tool. |
| **Primary/Luxury accent** | **Royal Amethyst** `#7C3AED` (primary.main), hover/active `#9161F5` | Deep, saturated purple — premium without being juvenile. Used for CTAs, active nav states, primary buttons, key live-state indicators. |
| **Luxury highlight accent** | **Champagne Gold** `#D4AF37` | Reserved for genuinely premium/earned moments only: top ratings, best-performer badges, milestone callouts. Used sparingly — gold everywhere cheapens it. |
| Secondary/data accent | **Signal Teal** `#00D9C0` | Kept — needed as a *functionally distinct* color from brand purple so demand/positive-trend data doesn't visually collide with UI chrome. Purple = brand & action. Teal = "this is live data." |
| AI-specific accent | **Orchid Lavender** `#C4B5FD` (a lighter, desaturated tint of the primary) | The AI Assistant surface now uses a lighter tint of the *same* purple family rather than a separate hue — reinforces that the AI is a first-class part of the Velour brand, not a bolted-on chatbot, while still being visually distinguishable from primary CTA purple at a glance. |
| Base surfaces | `#0A0A0D`, `#131217`, `#1C1A24` (3-tier elevation, with a faint violet undertone rather than neutral gray) | A true neutral gray next to a rich purple looks cheap; surfaces are given a whisper of violet in the shadows so the whole UI feels color-coordinated. |
| Typography | **Inter** (UI text) + **JetBrains Mono** (all numeric values) — MUI theme typography overridden away from default Roboto | Roboto reads as "generic Android app"; Inter is what premium fintech/SaaS products actually ship. Mono-for-numbers rule is unchanged — it's still the single biggest trick for an "engineered" feel. |
| Library | **Material UI v5** (`@mui/material`, `@mui/icons-material`, `@mui/x-charts` or Recharts) | Full custom `createTheme()` override — MUI's defaults must be completely re-skinned; nothing should look like default MUI blue. |
| Layout system | 12-col grid via MUI `Grid`/`Box`, 8px spacing scale (MUI's default spacing unit already matches), bento-style asymmetric modules | Repeated identical `Card` components is the fastest way to make an MUI app look like a tutorial project — explicitly avoided per page. |
| Motion | Framer Motion layered on top of MUI components, 150–220ms ease-out, count-up numerics, no bounce/spring on data | Unchanged rationale. |
| Glassmorphism | Used exactly once — the floating AI Assistant panel — via MUI `Paper` with custom `backdropFilter` | Unchanged — restraint makes it meaningful. |
| Iconography | `@mui/icons-material` (outlined variants only) supplemented by Lucide where MUI lacks a needed glyph, 1.5–2px visual stroke weight | Outlined-only keeps the system feeling engineered, not filled/cartoonish. |

This direction replaces all prior orange/Tailwind references. Do not reintroduce orange or Tailwind utility classes anywhere in this build.

---

# PART 1 — STITCH UI/UX DESIGN PROMPTS

Design system tokens to reuse verbatim in every Stitch prompt and in the MUI `createTheme()` config:

```
COLOR SYSTEM (MUI palette mapping)
--bg-base:            #0A0A0D   (palette.background.default)
--bg-surface-1:       #131217   (palette.background.paper)
--bg-surface-2:       #1C1A24
--bg-surface-3:       #262230
--border-subtle:      #322D3D
--text-primary:       #F5F4F7   (palette.text.primary)
--text-secondary:     #A79FB5   (palette.text.secondary)
--text-tertiary:      #766E85

--accent-primary:     #7C3AED   (palette.primary.main)   "Royal Amethyst"
--accent-primary-hover: #9161F5 (palette.primary.light)
--accent-primary-dark: #5B21B6  (palette.primary.dark)
--accent-primary-dim:  #7C3AED1A  (10% opacity fill, for subtle backgrounds)
--accent-gold:        #D4AF37   (palette.warning custom / "luxury" token — earned moments only)
--accent-teal:        #00D9C0   (custom palette.data.main — demand/live data only)
--accent-lavender:    #C4B5FD   (custom palette.ai.main — AI Assistant surface only)

--success: #22C55E
--warning: #F59E0B
--danger:  #EF4444

TYPOGRAPHY
UI font: Inter, weights 400/500/600/700 (override MUI default Roboto in theme.typography.fontFamily)
Data font: JetBrains Mono, weights 400/500 — used for ALL numeric values
Type scale: 12 / 14 / 16 / 20 / 24 / 32 / 48 (px), 1.4 line-height for body

SPACING
MUI default 8px spacing unit used as-is: theme.spacing(1) = 8px. Scale: 0.5 1 1.5 2 3 4 6 8 12 (× 8px)

RADIUS
theme.shape.borderRadius: 12 (cards), buttons override to 8, chips/pills to 999, inputs to 8

ELEVATION
Custom elevation via border + surface color, NOT MUI's default box-shadow elevation scale:
Surface-1 on Surface-base with 1px border-subtle, elevation={0} + manual border on Paper/Card.
Only floating elements (Dialog/Modal, AI panel, Tooltip, Popover) get shadow: 0 8px 32px rgba(0,0,0,0.55)
```

---

## 1. Landing Page

**Purpose:** Convert visitors (drivers, fleet operators, investors/evaluators) by establishing Ride AI as a serious, premium operational intelligence product.

**UX Goal:** Within 5 seconds communicate "this predicts real money outcomes using real ML + LLM reasoning, and it's built like a premium product," then let visitors self-select into Driver / Fleet Operator / Developer paths.

**Stitch Prompt:**
> Design a dark-mode SaaS landing page for "Ride AI," an intelligent ride-hailing driver assistant platform, built with Material UI components. Background #0A0A0D. Hero section: left-aligned headline "Know where the ride is before it happens," subheadline about ML demand forecasting + AI driver recommendations, two CTAs using MUI Button components ("View Live Demand Map" primary, filled, in Royal Amethyst #7C3AED with a subtle #9161F5 hover glow; "For Fleets" secondary, outlined, purple border on transparent). Right side of hero: an angled, slightly rotated mockup of the Live Demand Map dashboard showing a dark map with teal (#00D9C0) heatmap blobs and floating driver-position pins — depth via a subtle drop shadow and a soft radial glow behind it in purple at 10% opacity (not orange). Below hero: a horizontal metric strip in JetBrains Mono showing animated count-up stats (e.g. "2.3M trips forecasted," "94% forecast accuracy," "35% avg earnings uplift") on MUI Paper surface #131217 with thin 1px dividers between each stat. Next section "How It Works": a horizontal 4-step flow diagram (ML Prediction → FastAPI → LLM Reasoning → Driver Recommendation) connected by thin animated flowing dashed lines in teal, each step as a minimal MUI outlined icon + label. Next section "Built On" tech strip: logos/wordmarks for React, FastAPI, PostgreSQL, Ollama, Material UI in muted gray, single row, understated. Final CTA section: full-width dark surface #131217 with centered headline and a single large filled Royal Amethyst MUI Button, subtle champagne-gold #D4AF37 sparkle/accent line above the headline to signal premium positioning (used once, not repeated). Footer: minimal, three columns, dark. Use Inter for all text, JetBrains Mono only for numbers. No glassmorphism on this page. No orange anywhere. No generic blue-purple AI gradient blobs — the purple used here is flat/solid brand purple, not a decorative gradient mesh.

**Components:** Sticky MUI AppBar (logo, Product/Pricing/Docs, Sign In, Get Started Button), hero mockup card, animated stat strip (Paper), step-flow diagram, tech logo strip, final CTA band, footer (MUI Grid, 3 columns).

**Layout Structure:** 12-col MUI Grid, max-width 1280px (Container maxWidth="lg"), hero split 55/45, full-bleed sections between.

**Colors:** Base `#0A0A0D`; hero glow purple 10% opacity radial; stat strip surface `#131217`; dividers `#322D3D`; primary CTA `#7C3AED`; one-time gold accent line on final CTA.

**Typography:** Hero H1 48px/600 Inter (MUI `variant="h1"` override), subhead 18px/400 `#A79FB5`, stats 32px JetBrains Mono/600.

**Animations:** Count-up on stat strip on scroll-into-view (Framer Motion `useInView`); dashed connector lines animate a subtle marching-ants flow in teal; hero mockup slow 6s idle float; MUI Buttons get a custom hover state (scale 1.02, 150ms, plus a soft purple glow via boxShadow, overriding MUI's default ripple-only feedback so it feels premium, not stock).

**Responsive:** Hero stacks to single column under 768px (MUI `useMediaQuery`/`Grid` breakpoints), mockup moves below text; stat strip becomes 2×2 grid on mobile; step-flow becomes vertical stack.

---

## 2. Driver Dashboard

**Purpose:** The driver's home screen post-login — a real-time operational cockpit.

**UX Goal:** Answer "where am I, what's happening near me, what should I do right now" in a single glance, with the AI recommendation as the visual focal point.

**Stitch Prompt:**
> Design a dark-mode driver dashboard for "Ride AI" built with Material UI. Left side: a persistent collapsible MUI Drawer (72px collapsed / 220px expanded) on surface #131217 with icon nav (MUI ListItemButton + outlined icons): Dashboard, Live Map, AI Assistant, Analytics, Profile — active item marked with a 3px Royal Amethyst left border and a very subtle #7C3AED 8%-opacity background tint, not a filled solid block. Main content area on #0A0A0D uses an asymmetric bento layout via MUI Grid with custom column spans, NOT a repeating grid of equal Cards: top-left large module (spans 8 of 12) is a mini live map preview with the driver's position pulsing in teal and 2-3 nearby demand zone labels; top-right module (4 cols) is the "AI Recommendation" card as an MUI Card/Paper with a lavender (#C4B5FD) 30%-opacity border and a soft violet glow, showing a short recommendation sentence, a confidence percentage in JetBrains Mono, and a "View Reasoning" MUI Link/Button. Second row: three unequal-width MUI Card modules — Expected Rides (small, big JetBrains Mono number, small trend arrow icon), Earnings Prediction (medium, tiny 7-point sparkline in teal), Demand Level gauge (small, horizontal segmented bar gray→teal→purple indicating current zone demand intensity, using purple instead of orange for the "high" end since purple is now the brand's high-intensity/premium signal color). Third row: a wide Driver Performance module (12 cols) with horizontal bars comparing this week vs last week across Trips, Rating, Acceptance Rate. Top bar: MUI Avatar, an MUI Switch styled in teal for Online/Offline status, and a live clock in JetBrains Mono. 24px gaps, 12px radius, 1px #322D3D borders, no shadows except the AI card's violet glow.

**Components:** Collapsible MUI Drawer nav, MUI AppBar top status bar, live-map preview module, AI recommendation Card (lavender accent), stat modules, performance comparison bars, MUI Switch online/offline toggle.

**Layout Structure:** Drawer (fixed) + 12-col MUI Grid bento main area, asymmetric spans (8/4, 4/4/4, 12).

**Colors:** Base dark surfaces per system; AI card lavender `#C4B5FD` 30%-opacity border + glow; demand gauge gradient gray→teal→purple (`#7C3AED` at the high end, no orange).

**Typography:** Module titles 14px/600 uppercase-tracked `#A79FB5`; all numeric values JetBrains Mono 24–32px/600; recommendation sentence 16px Inter/400.

**Animations:** Sparkline draws in on load; demand gauge fill animates on data update; AI card glow subtly pulses (4s loop, low intensity, violet not orange); MUI Switch has its default transition retained but recolored to teal-when-on.

**Responsive:** Drawer collapses to icon-only under 1024px (MUI temporary Drawer variant under 768px behind a hamburger IconButton); bento modules stack single-column, AI card second after map.

---

## 3. Live Demand Map Page

**Purpose:** Full operational map view for spatial decision-making.

**UX Goal:** Instantly see where demand is and where to go, with the recommended zone visually unmistakable.

**Stitch Prompt:**
> Design a full-screen dark map interface for "Ride AI" using a dark Mapbox-style basemap and Material UI floating chrome (MUI Paper components for all overlays). Map fills the viewport. Overlay a translucent heatmap in teal-to-purple gradient (teal = moderate demand, Royal Amethyst #7C3AED = highest demand — replacing the old orange-topped gradient) with soft blurred blob edges. Driver location marker: small white dot with a pulsing teal ring. Other active drivers: small gray dots, lower opacity. The single AI-recommended zone gets a distinct dashed purple outline ring with a floating MUI Chip label above it reading "Recommended · +35% demand" in JetBrains Mono, styled with a purple-tinted Chip variant, elevated above other zone labels. Left floating panel: an MUI Paper card, 320px width, surface #131217, 12px radius, elevation shadow, 16px inset from edge — MUI ToggleButtonGroup for "All Zones / Recommended Only / High Demand," a small legend, and an MUI List of top 5 zones ranked by demand with mini stat rows (zone name, demand %, est. wait time in JetBrains Mono). Bottom-right floating MUI IconButtons: zoom +/-, recenter-on-me, layer toggle (Heatmap/Zones/Traffic) grouped in a small Paper pill. Top-right: a compact MUI TextField search/address bar with rounded pill styling.

**Components:** Full-bleed map canvas, heatmap overlay, driver markers, recommended-zone ring + MUI Chip label, floating filter Paper panel (ToggleButtonGroup + List), map control IconButton cluster, MUI TextField search bar.

**Layout Structure:** Map is the entire canvas; all MUI overlay components floated with fixed margins (16–24px).

**Colors:** Dark basemap; heatmap gradient teal `#00D9C0` → purple `#7C3AED`; recommended-zone ring dashed purple; floating panels `#131217`.

**Typography:** Panel headers 14px/600; zone list numbers JetBrains Mono 14px/500.

**Animations:** Heatmap blobs slowly breathe (scale 0.98–1.02, 8s loop); driver marker pulse ring continuous; recommended-zone Chip has a one-time gentle bounce-in only, then static; List rows highlight on hover (MUI's built-in hover state, recolored to purple 6% tint instead of default gray).

**Responsive:** Floating panel collapses into an MUI SwipeableDrawer bottom sheet on mobile (40% height when expanded); controls reposition to avoid thumb zones; search bar becomes a floating pill at top.

---

## 4. AI Driver Assistant Page

**Purpose:** Conversational interface where the LLM converts ML predictions into explained, trustworthy recommendations.

**UX Goal:** Feel like a knowledgeable dispatcher, not a generic chatbot — every recommendation shows *why*.

**Stitch Prompt:**
> Design a dark-mode AI chat interface for "Ride AI's" driver assistant using Material UI. This is the one screen permitted a restrained glassmorphism treatment: the chat panel sits on an MUI Paper with `backdropFilter: blur(20px)`, background `#1C1A24` at 85% opacity, floating over a subtly blurred map background at low opacity behind it. Chat messages: driver messages right-aligned in a simple `#262230` MUI Paper bubble; AI messages left-aligned with NO bubble — instead a small Orchid Lavender (#C4B5FD) AI avatar (MUI Avatar with a subtle icon), text flowing directly on the transparent surface for a "briefing" feel. Below each AI recommendation, a compact inline "Reasoning" expandable strip using MUI Accordion or Collapse: a thin bordered row expanding to show 2-3 MUI Chips with data points (e.g. "Demand forecast: +35%" · "Historical pattern: Fri 6-8PM" · "Distance: 4.2km"), numeric parts in JetBrains Mono, chip border in lavender at low opacity. Include the example: driver asks "Where should I move now?", AI responds "Airport zone is recommended — predicted demand is up 35% for the next hour," reasoning strip below with data chips. Bottom input: MUI TextField pill-shaped, background #131217, placeholder "Ask about demand, earnings, or routes...", a purple (not orange) MUI IconButton send button, and 3 quick-suggestion MUI Chips above it ("Best zone now?", "Should I keep driving?", "Compare to yesterday"), chip variant purple-outlined. Top of panel: header "AI Assistant" with a small teal pulse-dot + "reasoning from real-time data" status label.

**Components:** Chat message stream, AI avatar (MUI Avatar), expandable reasoning strip (MUI Accordion/Collapse + Chips), quick-suggestion Chips, MUI TextField pill input + IconButton send, live status indicator.

**Layout Structure:** Centered chat column max-width 720px, floating over full-bleed background, input fixed to panel bottom.

**Colors:** Glass panel `#1C1A24` @ 85% + blur; AI glyph and reasoning accents in lavender `#C4B5FD`; data chips on `#262230` with teal (positive) / muted gray (declining) numeric highlights; send button purple `#7C3AED`.

**Typography:** Chat text 15px/400 Inter; reasoning chip labels 12px/500; chip numeric values JetBrains Mono 12px/600.

**Animations:** New AI messages stream in with a fast typewriter-lite reveal (~15ms/char, skippable); MUI Collapse expands reasoning strip with default 200ms transition; suggestion chips stagger fade-in on load; a 3-dot typing indicator in lavender while a response generates.

**Responsive:** Glass panel becomes full-screen on mobile (blur reduced/removed for performance), suggestion chips horizontally scrollable, reasoning strip collapsed by default.

---

## 5. Demand Forecast Analytics Page

**Purpose:** Deeper time-series and comparative analytics.

**UX Goal:** Make dense forecasting data scannable and comparative — proves the ML is rigorous.

**Stitch Prompt:**
> Design a dark-mode analytics page for "Ride AI" using Material UI. Top: a wide (12-col) MUI Paper chart module titled "Hourly Demand Forecast — Next 24h," an area chart (Recharts or MUI X Charts) with teal gradient fill, a thin purple dashed vertical line marking "now" (replacing orange), hover tooltips in JetBrains Mono. Below, two modules: left (7 cols) "Area Comparison" horizontal grouped bar chart comparing 5 zones, bars in teal-to-purple intensity scale based on value, JetBrains Mono percentage labels; right (5 cols) "Trend Summary" as an MUI List of insight rows (e.g. "Airport zone trending up 12% vs last week"), each with a small colored trend arrow icon (teal up / red down) and mono percentage. Bottom row: "Weekly Pattern" heatmap grid (7×24) as a custom CSS grid inside an MUI Paper, cell intensity scaling from dark surface to Royal Amethyst purple (not orange) representing historical average demand, GitHub-contributions-graph aesthetic, MUI Tooltip per cell on hover. Top filter bar: MUI Select for zone, MUI date range picker, and an MUI Switch "Compare to last week" toggle, all compact pill-style controls on surface #131217.

**Components:** Primary area chart, comparison bar chart, insight List, weekly heatmap grid, filter bar (Select, date picker, Switch).

**Layout Structure:** 12-col MUI Grid: chart(12) → comparison(7)+insights(5) → heatmap(12), 24px gaps.

**Colors:** Area chart teal gradient fill; "now" marker dashed purple; heatmap cells scale `#1C1A24` (low) → `#7C3AED` (high); trend arrows teal/red.

**Typography:** Chart axis labels 12px/400 `#766E85`; all data values JetBrains Mono; insight row text 14px Inter.

**Animations:** Area chart draws left-to-right on load; bars grow from 0 width, staggered 40ms each; heatmap cells fade in staggered by day-column; hover crosshair line follows smoothly.

**Responsive:** Comparison bars and insight list stack vertically under 1024px; heatmap horizontally scrollable with sticky day labels under 768px; filter bar collapses into a single "Filters" MUI Button opening a bottom sheet on mobile.

---

## 6. Driver Profile Page

**Purpose:** Personal performance record and identity/settings hub.

**UX Goal:** Performance feels like meaningful progress without cartoonish gamification — professional and, where earned, quietly premium (gold accents on top performance).

**Stitch Prompt:**
> Design a dark-mode driver profile page for "Ride AI" using Material UI. Top: a wide profile header (12 cols) MUI Paper on #131217 with MUI Avatar (64px), name, member-since date, and rating shown as a large JetBrains Mono number (e.g. "4.92") next to a minimal 5-star row using thin outlined stars filled in **Champagne Gold #D4AF37** (not orange) — this is one of the few sanctioned uses of the gold luxury accent, since a top rating is a genuinely "earned premium" moment. To the right, three inline key stats separated by thin vertical dividers: Total Trips, Total Earnings, Acceptance Rate, each value large JetBrains Mono. Below: two-column layout — left (7 cols) "Earnings Over Time" line chart with a Week/Month/Year MUI ToggleButtonGroup, teal line with subtle area fill; right (5 cols) "Performance Insights" as a short MUI List of AI-generated observations (e.g. "You earn 18% more on Friday evenings") in lavender-accented text rows matching the AI Assistant's visual language, no chat bubble. Bottom: "Trip History" as an MUI Table (dense, dark-styled, not default browser table look) — near-imperceptible alternating row background (#0A0A0D / #0D0C11), columns Date/Zone/Duration/Fare/Rating, numeric columns right-aligned JetBrains Mono, sticky header row, subtle purple-tinted row hover.

**Components:** Profile header (MUI Avatar + rating), inline key-stat row, earnings line chart with ToggleButtonGroup period switch, AI performance-insights List, MUI Table trip history.

**Layout Structure:** 12-col Grid: header(12) → chart(7)+insights(5) → table(12).

**Colors:** Header surface `#131217`; rating stars gold `#D4AF37` (the one deliberate luxury-gold moment on this page); insights text lavender-accented; table zebra rows near-imperceptible.

**Typography:** Rating number 32px JetBrains Mono/700; key stats 20px JetBrains Mono/600; table cells 13px JetBrains Mono (numeric) / Inter (text).

**Animations:** Rating stars fill on load with a quick left-to-right sweep; ToggleButtonGroup period switch cross-fades chart data (200ms); MUI Table rows fade/slide in with a subtle stagger on initial load only.

**Responsive:** Header stats wrap below avatar/name on mobile as a 3-col mini-grid; chart and insights stack; table becomes horizontally scrollable (MUI Table container overflow) with Date/Fare pinned on narrow screens.

---

## 7. Admin Analytics Dashboard

**Purpose:** Operations/fleet-manager control room view.

**UX Goal:** Convey system health and scale at a glance — the most "enterprise software" screen in the app.

**Stitch Prompt:**
> Design a dark-mode admin/ops dashboard for "Ride AI" using Material UI. Top: a full-width system status strip (12 cols, 56px height) on #131217 with 4 inline live metrics with small teal pulse-dot indicators: Active Drivers, Active Rides, System Uptime, Avg Model Latency — thin dividers, JetBrains Mono values, NOC/status-page feel. Below: asymmetric bento via MUI Grid — large module (8 cols) "Live System Map" with clustered driver-density dots and active-ride lines animating pickup→dropoff in teal; adjacent (4 cols) "Demand Overview" stacked mini bar chart per zone with compact legend. Second row, three MUI Card modules: "Model Health" (each ML service — trip-duration, demand-zone, forecast — as a status row with green/amber/red dot, JetBrains Mono last-updated timestamp, mini uptime sparkline), "Driver Growth" (simple teal area chart with a JetBrains Mono delta badge like "+4.2% WoW" — badge styled as a purple-tinted MUI Chip, not orange), "Alerts & Anomalies" (compact MUI List of system flags like "Forecast confidence dropped in Zone 3," severity-colored left border amber/red). Bottom: wide "Ride Volume Trend" chart (12 cols) with an MUI ToggleButtonGroup for Hourly/Daily/Weekly and an overlay comparison line for "predicted vs actual" (predicted dashed purple — not teal, to keep the predicted/actual contrast high — actual solid white #F5F4F7).

**Components:** Live status strip, system map with clustered activity, demand overview mini-chart, Model Health status rows, Driver Growth chart, Alerts & Anomalies List, predicted-vs-actual volume chart with ToggleButtonGroup.

**Layout Structure:** Status strip(12) → map(8)+demand(4) → health(4)+growth(4)+alerts(4) → volume chart(12).

**Colors:** Status dots green/amber/red semantic; system map activity lines teal; predicted line dashed purple `#7C3AED`, actual line solid white; alert borders amber/red; growth delta Chip purple-tinted.

**Typography:** Status strip values 18px JetBrains Mono/600; module titles 13px/600 uppercase-tracked; alert text 13px Inter.

**Animations:** Status pulse dots continuous soft pulse (2s loop); system map ride-lines draw pickup→dropoff over ~1.5s then fade; predicted-vs-actual lines draw in sequentially; Alerts List items slide in from the right on new alert.

**Responsive:** Bento modules reflow to single column below 1024px in priority order (status strip, map, alerts, health, growth, demand, volume); system map fixed reduced height (240px) on mobile; status strip horizontally scrollable on narrow screens.

---

# PART 2 — ANTIGRAVITY / AI CODING AGENT IMPLEMENTATION PROMPT

Use the block below verbatim as the instruction to the coding agent.

```l
ROLE
You are a senior full-stack engineer building a production-grade monorepo for
"Ride AI" — an intelligent ride-hailing demand forecasting and driver
assistant platform. Follow the "Velour" design system exactly as specified:
dark-first UI, Royal Amethyst #7C3AED as the primary/CTA accent, Champagne
Gold #D4AF37 reserved strictly for earned/premium moments (top ratings,
milestone badges — never used decoratively or repeatedly), Signal Teal
#00D9C0 reserved for live/demand data only, Orchid Lavender #C4B5FD reserved
for the AI Assistant surface only. Do NOT use orange anywhere in this build.
Build the entire UI with Material UI v5 (@mui/material, @mui/icons-material)
with a fully custom theme — the app must never look like default MUI (no
default blue, no default Roboto, no default elevation shadows). Do not use
Tailwind CSS. Glass effects are reserved solely for the AI Assistant chat
panel via MUI Paper + backdropFilter.

============================================================
1. MONOREPO STRUCTURE
============================================================
ride-ai/
├── frontend/
│   ├── src/
│   │   ├── theme/
│   │   │   ├── theme.ts         (MUI createTheme() — palette, typography, component overrides)
│   │   │   └── palette.ts       (exported color tokens, single source of truth)
│   │   ├── components/
│   │   │   ├── layout/          (SidebarDrawer, TopAppBar, PageShell)
│   │   │   ├── dashboard/       (DemandGauge, EarningsSparkline, AIRecommendationCard)
│   │   │   ├── map/             (MapCanvas, HeatmapLayer, ZonePanel, DriverMarker)
│   │   │   ├── assistant/       (ChatStream, MessageBubble, ReasoningAccordion, SuggestionChips)
│   │   │   ├── analytics/       (ForecastChart, ComparisonBars, WeeklyHeatmap)
│   │   │   ├── profile/         (ProfileHeader, TripHistoryTable, InsightsList)
│   │   │   └── ui/              (shared thin wrappers around MUI Button/Card/Chip where the
│   │   │                         custom theme alone isn't enough, e.g. GlowCard, LuxuryStarRating)
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── DriverDashboard.tsx
│   │   │   ├── LiveDemandMap.tsx
│   │   │   ├── AIAssistant.tsx
│   │   │   ├── ForecastAnalytics.tsx
│   │   │   ├── DriverProfile.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── services/            (api.ts — axios instance + typed endpoint wrappers)
│   │   ├── hooks/                (useDriverAdvice, useForecast, useDemandZones, useLiveLocation)
│   │   ├── utils/                 (formatters.ts, mapHelpers.ts, colorScales.ts)
│   │   ├── types/                  (api.types.ts — mirrors backend Pydantic schemas)
│   │   ├── App.tsx                 (wraps app in <ThemeProvider theme={theme}><CssBaseline /> ...)
│   │   └── main.tsx
│   ├── package.json               (@mui/material, @mui/icons-material, @emotion/react,
│   │                                @emotion/styled, framer-motion, recharts or @mui/x-charts,
│   │                                react-query, react-router-dom, axios, react-map-gl or leaflet)
│   └── vite.config.ts
│
├── backend/         (unchanged from prior version — see Part 3-5 below)
├── docker-compose.yml
├── .env.example
└── README.md

============================================================
2. FRONTEND REQUIREMENTS
============================================================
- React 18 + TypeScript + Vite.
- **Material UI v5** as the component library. Create a single custom theme
  in `theme/theme.ts` using `createTheme()`:
    - palette.mode = 'dark'
    - palette.primary = { main: '#7C3AED', light: '#9161F5', dark: '#5B21B6' }
    - palette.background = { default: '#0A0A0D', paper: '#131217' }
    - Custom palette extensions (declare via TypeScript module augmentation)
      for `data` (teal, #00D9C0), `ai` (lavender, #C4B5FD), and `luxury`
      (gold, #D4AF37) — these are NOT standard MUI palette keys, extend the
      Palette/PaletteOptions interfaces.
    - typography.fontFamily = '"Inter", sans-serif' (load Inter via
      @fontsource/inter); define a separate `monoFontFamily` constant for
      JetBrains Mono, applied via `sx={{ fontFamily: monoFontFamily }}` on
      every numeric Typography instance — never mix mono into body text.
    - components overrides: MuiButton (custom hover glow, no default
      ripple-only elevation change), MuiCard/MuiPaper (flat elevation=0 +
      manual 1px border instead of MUI's default box-shadow elevation
      scale), MuiChip (custom outlined-purple and outlined-lavender
      variants), MuiSwitch (teal track when checked).
  Wrap the app root in `<ThemeProvider theme={theme}><CssBaseline />`.
- React Router v6 for routing across the 7 pages.
- Server state: React Query (TanStack Query) for all API data. Lightweight
  Zustand only for UI-only state (drawer collapsed, active map layer).
- API layer in `services/api.ts`, single typed Axios instance.
- Every numeric display MUST render inside a `Typography` (or plain span)
  with the JetBrains Mono font family applied — never MUI's default body
  font for numbers.
- Charts: Recharts (or `@mui/x-charts` if preferred) restyled to match the
  palette — no default chart-library blue/green. Build the weekly heatmap
  grid as a custom CSS-grid component, not a chart library, for full control
  of the GitHub-contributions aesthetic.
- Map: react-map-gl (Mapbox) with graceful fallback to react-leaflet + a
  dark CartoDB tile layer when `VITE_MAPBOX_TOKEN` is absent.
- Animations: Framer Motion layered on top of MUI components for count-up
  numerics, staggered reveals, and the AI chat streaming-text effect.
  150–600ms range, ease-out, no spring/bounce on data elements.
- Fully responsive using MUI's `useMediaQuery` + `Grid`/`Stack` breakpoints
  per the behavior specified for each page in Part 1 (Drawer→temporary
  variant, bento reflow, SwipeableDrawer bottom-sheet pattern on mobile).
- Accessibility: MUI components are accessible by default — do not override
  focus rings or aria attributes when re-theming; verify color contrast of
  the purple-on-dark and gold-on-dark combinations meets AA.

============================================================
3. BACKEND REQUIREMENTS
============================================================
(Unchanged from the original architecture — the theme/library change is
frontend-only and does not affect the API contract.)

Build a FastAPI application with the following endpoints, Pydantic v2
schemas, auto-generated OpenAPI docs at /docs.

GET  /                        → basic API info payload
GET  /health                  → { status: "ok", timestamp, services: {db, ollama} }

POST /driver-advice
  Request:  { location:{lat,lng}, demand, expected_rides, weather, time }
  Response: { recommendation, reason, suggested_area, confidence }
  Logic: gather structured context from demand_prediction_service +
  forecast_service, pass into llm_service to generate the natural-language
  recommendation. The LLM never invents numeric values — all numbers come
  from the ML service layer; the LLM only explains/phrases them.

GET  /forecast?zone={zone}&horizon_hours={int}
GET  /demand-zones
GET  /driver-performance?driver_id={id}

Keep route files thin; business logic lives in services/.

============================================================
4. LLM INTEGRATION (llm_service.py)
============================================================
- Connect to a local Ollama instance (OLLAMA_HOST env, default
  http://localhost:11434). Model via OLLAMA_MODEL, default "gemma2".
- PromptBuilder with three grounded templates: driver recommendation, demand
  explanation, earnings suggestion — each explicitly instructing the model
  to only use provided numbers, never invent statistics.
- `generate_recommendation(context: dict) -> dict` builds the prompt, calls
  Ollama, parses to {recommendation, reason} with strict-JSON output,
  fallback parser (strip markdown fences, retry once, then a safe templated
  response so the API never 500s on an LLM formatting error).
- 8s timeout + circuit-breaker: if Ollama is unreachable, return a
  deterministic rule-based recommendation derived directly from ML outputs.

============================================================
5. ML MODEL INTEGRATION LAYER (placeholder services)
============================================================
trip_duration_service.py       — Student A integration point
demand_prediction_service.py   — Student B integration point
forecast_service.py            — Student C integration point

Each returns realistic dummy data matching the final contract today; each
docstring documents "INTEGRATION POINT — do not change the function
signature or return shape."

============================================================
6. DATABASE
============================================================
PostgreSQL (prod) / SQLite (dev) via DATABASE_URL, SQLAlchemy + Alembic.
Tables: drivers, trips, demand_zones, forecast_logs, ai_recommendations.

============================================================
7. DEPLOYMENT
============================================================
docker-compose.yml with postgres, backend, frontend, ollama services.
.env.example covers DATABASE_URL, OLLAMA_HOST, OLLAMA_MODEL,
VITE_API_BASE_URL, VITE_MAPBOX_TOKEN.

============================================================
8. QUALITY BAR
============================================================
- No default MUI blue, no default Roboto, no default box-shadow elevation
  anywhere — the custom theme must be applied consistently.
- No inline hex colors in components — reference `theme.palette.*` (or the
  custom `data`/`ai`/`luxury` tokens) only.
- Every API call has loading, error, and empty states styled to the dark
  theme (MUI Skeleton components recolored to the surface palette, not
  default gray).
- Gold luxury accent must appear in genuinely limited, earned contexts only
  — code review should flag any additional decorative use of gold.
```

---

# PART 3 — SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                CLIENT (React + Material UI SPA)                 │
│  Pages → Hooks (React Query) → services/api.ts (Axios)          │
│  Theme: MUI ThemeProvider (Velour palette: purple/teal/lavender/gold)│
└───────────────────────────────┬─────────────────────────────────┘
                                 │ REST / JSON (HTTPS)
┌───────────────────────────────▼─────────────────────────────────┐
│                      FASTAPI BACKEND (app/)                     │
│  routes/  →  services/  →  models/ (SQLAlchemy)                 │
│                                                                   │
│   ┌───────────────┐   ┌──────────────────┐   ┌────────────────┐ │
│   │ trip_duration │   │ demand_prediction │   │ forecast        │ │
│   │ _service.py   │   │ _service.py       │   │ _service.py     │ │
│   │ (Student A)   │   │ (Student B)       │   │ (Student C)     │ │
│   └───────┬───────┘   └────────┬──────────┘   └────────┬────────┘ │
│           └────────────────────┴──────────────────────┘          │
│                              │ structured JSON context            │
│                     ┌────────▼────────┐                          │
│                     │  llm_service.py │──── Ollama (local LLM)   │
│                     │ (PromptBuilder) │     Gemma / Llama / Qwen │
│                     └────────┬────────┘                          │
│                              │ recommendation + reason            │
└──────────────────────────────┼────────────────────────────────────┘
                                │
                     ┌──────────▼──────────┐
                     │   PostgreSQL / SQLite│
                     │  drivers, trips,      │
                     │  demand_zones,         │
                     │  ai_recommendations    │
                     └────────────────────────┘
```

**Key architectural principle (unchanged):** the LLM never touches raw model inference or the database directly — it only receives pre-structured, validated JSON context and converts it to language. Numeric accuracy stays owned by the ML layer.

---

# PART 4 — DATABASE SCHEMA

```sql
-- drivers
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    rating NUMERIC(3,2) DEFAULT 5.00,
    total_trips INT DEFAULT 0,
    total_earnings NUMERIC(12,2) DEFAULT 0,
    acceptance_rate NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- trips
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES drivers(id),
    origin_lat NUMERIC(9,6), origin_lng NUMERIC(9,6),
    destination_lat NUMERIC(9,6), destination_lng NUMERIC(9,6),
    predicted_duration_minutes NUMERIC(6,2),
    actual_duration_minutes NUMERIC(6,2),
    fare NUMERIC(8,2),
    rating NUMERIC(3,2),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- demand_zones
CREATE TABLE demand_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_name VARCHAR(120) NOT NULL,
    lat NUMERIC(9,6), lng NUMERIC(9,6),
    demand_score NUMERIC(5,2),
    trend VARCHAR(20),                 -- 'up' | 'down' | 'flat'
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- forecast_logs
CREATE TABLE forecast_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID REFERENCES demand_zones(id),
    forecast_hour TIMESTAMPTZ,
    predicted_demand NUMERIC(5,2),
    model_version VARCHAR(40),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ai_recommendations (audit log of every LLM call)
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES drivers(id),
    input_context JSONB,
    recommendation TEXT,
    reason TEXT,
    confidence NUMERIC(4,3),
    model_used VARCHAR(60),
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

# PART 5 — API DOCUMENTATION

| Method | Endpoint | Description | Request | Response |
|---|---|---|---|---|
| GET | `/health` | Liveness/readiness check | — | `{status, timestamp, services:{db, ollama}}` |
| POST | `/driver-advice` | Core AI recommendation endpoint | `{location, demand, expected_rides, weather, time}` | `{recommendation, reason, suggested_area, confidence}` |
| GET | `/forecast` | Hourly demand forecast | Query: `zone`, `horizon_hours` | `[{hour, predicted_demand}]` |
| GET | `/demand-zones` | Ranked current demand zones | — | `[{zone, demand_score, lat, lng, trend}]` |
| GET | `/driver-performance` | Driver performance summary | Query: `driver_id` | `{trips, earnings, rating, acceptance_rate, weekly_trend[]}` |

Interactive OpenAPI/Swagger docs auto-generated by FastAPI at `/docs` and `/redoc`.

---

# PART 6 — DEVELOPMENT ROADMAP

**Phase 1 — Foundation (Week 1)**
Scaffold monorepo, FastAPI skeleton with `/health`, React+Vite+MUI with the Velour custom theme (`theme.ts`) configured and verified against every color token, PostgreSQL + Alembic, docker-compose baseline working end-to-end.

**Phase 2 — Core Data Layer (Week 2)**
Build the three placeholder ML services, implement `/forecast`, `/demand-zones`, `/driver-performance`, seed database with representative sample data.

**Phase 3 — LLM Integration (Week 3)**
Stand up Ollama locally, build `llm_service.py` with PromptBuilder, implement `/driver-advice` end-to-end, add fallback/circuit-breaker, log every call to `ai_recommendations`.

**Phase 4 — Frontend Build-Out (Weeks 4–5)**
Build all 7 pages per the Stitch specs above, with strict adherence to the MUI theme (no default MUI blue/Roboto anywhere), wire React Query hooks, implement map + charts, implement responsive behavior.

**Phase 5 — ML Model Integration (Week 6)**
Replace placeholder services with Student A/B/C's real models, validate the interface contract, re-test `/driver-advice` against real predictions.

**Phase 6 — Polish & Hardening (Week 7)**
Accessibility pass (verify purple/gold contrast ratios on dark backgrounds), loading/error/empty states, animation polish, performance pass on map rendering, README + setup docs.

**Phase 7 — Presentation Readiness (Week 8)**
Demo flow, architecture walkthrough, live LLM-fallback stress test, final QA across breakpoints.

---

# PART 7 — INTEGRATION CHECKLIST

**Backend ↔ ML Models**
- [ ] `trip_duration_service.py` signature confirmed with Student A, dummy replaced
- [ ] `demand_prediction_service.py` signature confirmed with Student B, dummy replaced
- [ ] `forecast_service.py` signature confirmed with Student C, dummy replaced
- [ ] All services return within acceptable latency (<500ms) or run async/background
- [ ] Response shapes validated against Pydantic schemas after real-model swap

**Backend ↔ LLM**
- [ ] Ollama reachable in all environments (local, docker, demo machine)
- [ ] Prompt templates tested against edge cases (missing field, zero-demand zone, extreme confidence)
- [ ] JSON parsing fallback verified with a deliberately malformed LLM response
- [ ] Every `/driver-advice` call logged in `ai_recommendations`

**Frontend ↔ Backend**
- [ ] `VITE_API_BASE_URL` correct in dev/docker/prod
- [ ] TypeScript types in `types/api.types.ts` kept in sync with Pydantic schemas
- [ ] Loading/error/empty states implemented for every data-fetching hook
- [ ] Map gracefully falls back to Leaflet when no Mapbox token present

**Design System Compliance (Velour / MUI)**
- [ ] No orange anywhere in the codebase or assets
- [ ] No default MUI blue, default Roboto, or default box-shadow elevation left unstyled
- [ ] Custom `theme.ts` is the single source of truth — no inline hex colors in components
- [ ] JetBrains Mono applied to every numeric display across all 7 pages
- [ ] Champagne Gold `#D4AF37` used only in earned/premium contexts (ratings, milestones) — audit for decorative overuse
- [ ] Lavender `#C4B5FD` used only on the AI Assistant surface
- [ ] Glassmorphism used only on the AI Assistant panel
- [ ] All 7 pages verified responsive at 375px, 768px, 1024px, 1440px

**Deployment**
- [ ] `docker-compose up` brings up all four services from a clean clone
- [ ] `.env.example` covers every required variable with sane defaults
- [ ] README includes exact Ollama model-pull command and expected first-run time
- [ ] Demo dataset seeded so the app looks populated on first load

---

*End of blueprint — Velour / Material UI edition. Intended to be handed directly to Stitch (for UI generation) and an Antigravity-class coding agent (for implementation) without further clarification.*