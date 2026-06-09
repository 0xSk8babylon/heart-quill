## Goal

Port the standalone "Twin Layer — Energy Planner" prototype into this TanStack Start app as a real, navigable React app. Match the original UI, copy, mock data, and the confirm-loop interaction. No backend yet — pure frontend with in-memory state, exactly like the prototype.

## What the app is

A residential energy-planning "digital twin" with three tabs:

1. **Home Twin** — interactive node diagram (Solar, Utility, Battery, Main Panel, Meter, EV, Backup Loads, Generator) wired to a central panel hub. Clicking a node opens an Inspector side-sheet showing status, trust, facts, missing info, and a "Confirm" action that flips status to `known` and updates the passport.
2. **Scenario Builder** — three pathway cards (Critical Backup, Balanced Resilience, Future-Ready Expansion) with cost + compare bars (backup, expansion, complexity) and a "Share with contractor" action.
3. **In Progress** — contractor workflow lanes (planning review, missing input, confirmation gate, option candidate, proposal prep) plus an activity log; deep-links back to Home Twin to clear flags.

Plus: top nav with brand mark, tab switching (hash-synced), bell badge for items needing confirmation, toast notifications, and a Tweaks panel for theme/density/accent.

## Routing

Use real routes instead of the prototype's hash-based tab switch:

```
src/routes/
  __root.tsx           (existing; keep)
  index.tsx            -> redirect to /twin
  _app.tsx             -> layout: top nav + <Outlet />
  _app.twin.tsx        -> Home Twin
  _app.scenario.tsx    -> Scenario Builder
  _app.progress.tsx    -> In Progress
```

Each route gets its own `head()` with title + description. Inspector is rendered as an overlay from the twin route (selected node state lives in the layout via a small zustand-style React context so the bell badge can read `needsConfirmation` count from anywhere).

## Component breakdown

```
src/
  components/twin-layer/
    AppShell.tsx          (top nav, brand, tabs, bell, avatar, toast host)
    Icon.tsx              (inline SVG set: spark, home, layers, users, bell, gear, check, plus solar/utility/battery/panel/meter/ev/backup/generator glyphs)
    HomeTwin.tsx          (diagram canvas, nodes positioned on 0–100 grid, SVG edges, glow effect)
    NodeChip.tsx          (single node with status ring + dot)
    Inspector.tsx         (side-sheet: headline, summary, facts, missing, basis, Confirm button)
    ScenarioBuilder.tsx   (three cards, compare bars, share CTA)
    ScenarioCard.tsx
    InProgress.tsx        (lanes + activity log + contractor header)
    LaneCard.tsx
    Toast.tsx
  lib/twin-layer/
    data.ts               (STATUS, TRUST, CONFIDENCE, HOME, NODES, EDGES, SCENARIOS, COMPARE_KEYS, CONTRACTOR, LANES, LANE_STATUS, ACTIVITY — typed)
    store.tsx             (React context: nodes state, selectedNodeId, scenarioId, toast, confirmNode action)
    types.ts
  styles/twin-layer.css   (scoped class styles ported from prototype: .app, .topnav, .tab, .stage, .node, .ring, .inspector, .lane, .toast, etc.)
```

The prototype uses raw class names + CSS custom properties (`--accent-warn`, `--twin-glow`) with `data-theme` / `data-density` on `<html>`. Port those styles into `src/styles/twin-layer.css` and import from the layout route. Keep the prototype's dark default and color tokens (`#e0913f` accent, `#8fb8d8` glow, `#11151a` background, `#faf9f5` light bg).

## Behavior parity

- Tab switching clears the selected node (matches prototype).
- Clicking a node opens the Inspector; "Confirm" mutates that node to `status: known, trust: user_created`, scrubs missing[], rewrites "assumed/unknown" facts to "confirmed", closes inspector, fires a toast.
- Bell badge count = nodes where `status === "needs_confirmation"`.
- "Share with contractor" on a scenario navigates to `/progress` and fires a toast.
- In Progress "Open a flagged system" CTA navigates back to `/twin`.

## Out of scope (for this pass)

- The Tweaks dev panel (it's an authoring tool for the standalone prototype, not user-facing). Skip unless you want it.
- Persistence — everything resets on reload, same as the prototype.
- Auth, multi-home support, real utility data — none in the source.
- Custom fonts from the bundle (the prototype ships woff2s; we'll use the project's default system font stack unless you want them ported).

## Technical notes

- All in client components; no server functions, no Lovable Cloud, no DB.
- Data file becomes typed TS with `as const` where helpful so STATUS keys are a union.
- The diagram is a single SVG with absolutely-positioned node buttons over it; edges are computed from node x/y. No external graph lib.
- The Inspector is a fixed right-side panel with a backdrop on mobile.
- Replace the existing placeholder `src/routes/index.tsx` content with a redirect to `/twin`.

## Open questions (optional — defaults shown)

- Tweaks panel: **skip by default**. Tell me if you want it kept as a dev-only toggle.
- Fonts: **use system stack by default**. Tell me if you want the prototype's woff2s ported as Lovable assets.
- Light theme: prototype defaults to dark; **ship dark-only first**, add the toggle later if you want it.
