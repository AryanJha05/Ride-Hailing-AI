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

**UX Goal:** Within 5 seconds communicate "this predicts real money outcomes using real ML, and it's built like a premium product," then let visitors self-select into Driver / Fleet Operator / Developer paths.

**Stitch Prompt:**
> Design a dark-mode SaaS landing page for "Ride AI," an intelligent ride-hailing driver assistant platform, built with Material UI components. Background #0A0A0D. Hero section: left-aligned headline "Know where the ride is before it happens," subheadline about ML demand forecasting + AI driver recommendations, two CTAs using MUI Button components ("View Live Demand Map" primary, filled, in Royal Amethyst #7C3AED with a subtle #9161F5 hover glow; "For Fleets" secondary, outlined, purple border on transparent). Right side of hero: an angled, slightly rotated mockup of the Live Demand Map dashboard showing a dark map with teal (#00D9C0) heatmap blobs and floating driver-position pins — depth via a subtle drop shadow and a soft radial glow behind it in purple at 10% opacity (not orange). Below hero: a horizontal metric strip in JetBrains Mono showing animated count-up stats (e.g. "2.3M trips forecasted," "94% forecast accuracy," "35% avg earnings uplift") on MUI Paper surface #131217 with thin 1px dividers between each stat. Next section "How It Works": a horizontal 4-step flow diagram (ML Prediction (XGBoost V3) → FastAPI → Driver Recommendation) connected by thin animated flowing dashed lines in teal, each step as a minimal MUI outlined icon + label. Next section "Built On" tech strip: logos/wordmarks for React, FastAPI, PostgreSQL, Material UI in muted gray, single row, understated. Final CTA section: full-width dark surface #131217 with centered headline and a single large filled Royal Amethyst MUI Button, subtle champagne-gold #D4AF37 sparkle/accent line above the headline to signal premium positioning (used once, not repeated). Footer: minimal, three columns, dark. Use Inter for all text, JetBrains Mono only for numbers. No glassmorphism on this page. No orange anywhere. No generic blue-purple AI gradient blobs — the purple used here is flat/solid brand purple, not a decorative gradient mesh.

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
│   │ (Student A    │   │ (Student B        │   │ (Student C      │ │
│   │ XGBoost V3)   │   │ Pending)         │   │ Pending)       │ │
│   └───────┬───────┘   └────────┬──────────┘   └────────┬────────┘ │
│           └────────────────────┴──────────────────────┘          │
│                              │ structured JSON context            │
│                     ┌────────▼────────┐                          │
│                     │ AI Assistant    │                          │
│                     │ Framework       │                          │
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

**Key architectural principle:** The machine learning layer (Student A XGBoost V3) directly powers real-time inferences. The LLM microservice is planned for a future development phase.

---

# PART 4 — DATABASE SCHEMA

```sql
-- ai_recommendations (audit log of recommendations)
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES drivers(id),
    input_context JSONB,
    recommendation TEXT,
    reason TEXT,
    confidence NUMERIC(4,3),
    model_used VARCHAR(60) DEFAULT 'ai-reasoning-planned',
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

# PART 5 — API DOCUMENTATION

| Method | Endpoint | Description | Request | Response |
|---|---|---|---|---|
| GET | `/health` | Liveness/readiness check | — | `{status, timestamp, services:{db, trip_duration_model}}` |
| POST | `/driver-advice` | Driver advice endpoint (503 if disconnected) | `{location, query}` | 503 Service Unavailable (LLM integration pending) |
| GET | `/forecast` | Hourly demand forecast | Query: `zone`, `horizon_hours` | `[{hour, predicted_demand}]` |
| GET | `/demand-zones` | Ranked current demand zones | — | `[{zone, demand_score, lat, lng, trend}]` |
| GET | `/driver-performance` | Driver performance summary | Query: `driver_id` | `{trips, earnings, rating, acceptance_rate, weekly_trend[]}` |

---

# PART 6 — DEVELOPMENT ROADMAP

**Phase 1 — Foundation**
Scaffold monorepo, FastAPI backend, React+Vite+MUI with Velour custom theme, PostgreSQL/SQLite.

**Phase 2 — Student A XGBoost V3 Integration (Completed)**
Integrate Student A's XGBoost V3 Trip Duration model into FastAPI and bind to React frontend.

**Phase 3 — AI Reasoning Microservice Integration (Planned Future Phase)**
Implement containerized LLM reasoning service when scope requires natural language driver advice synthesis.