# Builder — Quick Fixes + Mobile Plan

> Supersedes the "Builder is off-limits" constraint in `REDESIGN_PLAN.md` §Hard constraints #1. The structural untouched-Builder rule was written for the broader redesign; this document is the explicit plan to (a) clean up a few small UI defects and (b) bring the Builder to mobile without regressing the desktop interactions.

---

## Part A — Quick UI fixes (single PR, ~1–2h)

Three small defects in `LengthOptions.jsx` and `BeadList.jsx`. No new dependencies, no animation changes.

### A.1 — Necklace/Bracelet icons not centered

**File:** `frontend/src/components/LengthOptions.jsx:69-80`

The toggle button currently relies on `text-center` on a `btn` that contains a raw SVG. Bootstrap's `.btn` is `display: inline-block` and the SVG inherits text-align centering inconsistently across browsers — and the button's left/right padding is asymmetric once `flex-fill` stretches it.

**Fix:** make the button a flex container so the SVG is centered on both axes.

```jsx
className={`flex-fill d-flex align-items-center justify-content-center py-1 btn fw-bold ${
    selectedType === type ? "text-primary-text" : "text-primary"
}`}
```

### A.2 — Hover tooltip on each mode button

Same buttons in `LengthOptions.jsx:69-80`. Currently the icons stand alone — a new user has no way to know what they mean.

**Fix:** native `title` for accessibility-free hover, plus `aria-label` for screen readers. No extra library needed.

```jsx
<button
    key={type}
    type="button"
    title={type === "necklace" ? "Necklace mode" : "Bracelet mode"}
    aria-label={type === "necklace" ? "Necklace mode" : "Bracelet mode"}
    ...
>
```

If a richer tooltip is desired later, swap to a shadcn `Tooltip` primitive — but that requires shadcn to be installed first (Phase 1 of `REDESIGN_PLAN.md`).

### A.3 — "Bead List" header font + alignment

**File:** `frontend/src/components/BeadList.jsx:31-33`

The header reads "weird" because the global `h1–h6` rule in `index.css:28-30` applies the **Fraunces** display serif to `h5.card-title` — Fraunces is meant for editorial headlines, not a small inline list header. Also, the header is left-aligned while the rest of the card body is centered around the badge column.

**Fix:** override the font to the body font for this one header and center it.

```jsx
<div className="card-header">
    <h5
        className="card-title mb-0 text-center"
        style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}
    >
        Bead List
    </h5>
</div>
```

(Do **not** edit the global `h1–h6` rule — other pages depend on Fraunces.)

### A.4 — Smoke test for Part A

- Desktop: open `/builder`, confirm both icons are pixel-centered, hover shows the right tooltip, BeadList header reads in Inter and is centered.
- Confirm the active-mode pill animation (left/right slide) still works.
- Confirm no regressions in length radio buttons.

---

## Part B — Mobile Builder (big plan)

The Builder is currently rendered three columns wide at full viewport height (`Builder.jsx:62-87`), all dimensions hard-coded in pixels (400 / 75 / 400). On any device narrower than ~900px it overflows horizontally and is unusable. Home and the toggle in `Home.tsx:83-95` therefore gate the route behind an `isMobile` check.

The goal: make the Builder a first-class mobile experience without breaking the desktop one. Two distinct workstreams: **layout** (how the four panels arrange on small screens) and **interaction** (how the hover-driven jar opens with no hover).

### B.1 — Anatomy of the desktop Builder (so we know what we're porting)

| Panel | Component | Desktop size | Role |
|---|---|---|---|
| Left | `BeadList` | 400px fixed, `marginLeft: 75px` | Shows beads added in order, grouped + counted; remove/reset/add-to-cart actions. |
| Center top | `Necklace` | 80% wide × 80vh (`min-height: 400px`), SVG with GSAP MotionPath | Visualizes the necklace/bracelet as beads dropping in along an arc. |
| Center bottom | `LengthOptions` | `w-50`, `max-width: 400px` | Necklace/bracelet toggle + length radios + optional custom input. |
| Right | `BeadSelection` | 400px scrollable, 3-col grid of `BeadJar` | The jar shelves the user picks beads from. |
| Atomic | `BeadJar` | 120 × 300px (already shrinks to 100×170 / 80×140 via media query in `BeadJar.css:11-23`) | One jar per bead color; closed lid on rest, lid floats off + bead rises on hover, click adds. |

Key facts that constrain the mobile design:
1. **GSAP MotionPath** drives the bead positions along an SVG path scaled by `scaleFactor` derived from capacity. Capacity scales with length (`Math.floor((length/10) * 35)`), so a 45cm necklace can hold ~157 beads. At small SVG widths the beads become sub-pixel dust.
2. **`BeadJar.jsx:32-47` is hover-gated.** The jar open animation, lid-floating, and multi-bead variant cycling all live behind `isHovered`. Mobile has no hover — we need a deliberate alternative gesture.
3. **`BeadJar.jsx:68-82` adds one bead per click.** Click and hover are independent today; on touch they collapse into the same gesture.
4. **All three panels are mutually visible at all times** on desktop. The user picks a bead with their eyes on the jar, sees it drop onto the necklace, and reads it in the list — a tight feedback loop. Any mobile layout that hides one of these three loses information.

### B.2 — Mobile layout: stacked + sticky preview

Stack the panels vertically with the **Necklace preview pinned to the top** of the viewport (sticky), so the feedback loop is preserved as the user scrolls down to the jar shelves.

```
┌─────────────────────────────┐  ← top of viewport
│  Necklace preview (sticky)  │  ~38vh, sticky top: 0
│  + active-jar HUD           │
├─────────────────────────────┤
│  Length / Type tabs         │  collapsed into a thin pill bar
├─────────────────────────────┤
│  Bead Selection grid        │  3 cols → 4 cols on wider phones
│  (the rest of the page)     │
├─────────────────────────────┤
│  Bead List drawer button    │  floating "View list (12)" pill
└─────────────────────────────┘
```

Specifics:
- **Breakpoint:** `< 900px` switches to mobile layout. Use a single `useIsMobile` hook (matchMedia on `(max-width: 899px)`) so the same hook drives layout, gesture mode, and zoom defaults.
- **`Necklace`** wrapper height shrinks to `38vh` on mobile (was `80vh`). Capacity stays a function of length, but the SVG viewBox stays at `0 0 1000 600` so the path math is unchanged.
- **`LengthOptions`** collapses to a single-row pill: type toggle on the left, length value as a chip that opens a bottom-sheet on tap (avoids the 4-radio row eating vertical space).
- **`BeadSelection`** becomes the bulk of the scrollable area. Jars shrink further (60×120 at `< 480px`). Already partially supported by the existing media queries in `BeadJar.css`.
- **`BeadList`** moves into a **bottom sheet** triggered by a floating pill ("Bead List · 12"). On desktop it stays as the left column unchanged.
- **Add-to-cart** lives inside the BeadList sheet, plus a small inline button next to the floating pill when the necklace is full.

The desktop layout in `Builder.jsx:61-87` is preserved verbatim — the mobile branch is a separate render path gated on the hook.

### B.3 — Mobile jar interaction (the core question)

User-specified contract:

> One click to open the jar. Subsequent clicks (while open) add a bead per click. Closes when the user taps elsewhere or another jar.

Mapping to `BeadJar.jsx` state:

| State | Desktop trigger | Mobile trigger |
|---|---|---|
| `isHovered: false` | mouse leaves | jar not the active one |
| `isHovered: true` | mouse enters | first tap (becomes the active jar) |
| `addBead()` | every click | every tap **after** the open tap |

Implementation:

1. **Lift the "active jar" state** out of `BeadJar` and into `BeadSelection` (or a shared context — context is cleaner since `BeadSelection` already maps over all jars). New state: `activeJarId: string | null`.
2. **`BeadJar` reads `isActive` prop** instead of (or in addition to) `isHovered`. On mobile, `isActive` replaces `isHovered` for the lid-float and bead-rise animations; on desktop, hover continues to drive the visual state and `isActive` is unused.
3. **Tap handler** on mobile:
   ```js
   const handleTap = () => {
       if (!isMobile) { addBead(); return; }      // desktop unchanged
       if (!isActive) { setActive(beadColor); return; }   // first tap = open
       addBead();                                          // subsequent taps = add
   };
   ```
4. **Tapping a different jar** closes the previous one (the new jar becomes active, the old one falls back to `isActive=false` which restores the closed lid).
5. **Tap outside any jar** (handled by an outside-click listener on `BeadSelection`) closes the active jar.
6. **No auto-close on timeout.** It was considered but breaks the "keep clicking to keep adding" promise — leave it open until the user explicitly moves on.
7. **Multi-bead variant cycling** (`BeadJar.jsx:32-47`): currently rotates while `isHovered`. On mobile, swap to "advance variant on every tap **after** the open tap, before the bead is added," so the user can pick which variant they want by tapping until they see it. Random fallback (the current desktop click behavior) is preserved when the user opens-then-adds quickly.
8. **Visual affordance for active state:** subtle outline + slight scale-up on the active jar so it's obvious which one is "armed." Implementation: `ring-2 ring-terracotta/40 scale-105` (or the bootstrap-flavored equivalent — `border` + `transform: scale(1.05)` in `BeadJar.css`).

Edge cases:
- **Necklace full + active jar:** taps on the jar do nothing visually except a small "shake" + toast "Necklace is full." (Today desktop sets `isFull` and the BeadList shows Add-to-Cart — preserve that, just add the rejection feedback on mobile.)
- **Scroll vs. tap:** distinguish a scroll-touch from a tap by listening for `pointerup` only when no movement > 8px occurred since `pointerdown`. Avoid `onClick` swallowing scroll intents.
- **First-time hint:** the very first time a user lands on the Builder on mobile, show a one-line hint over the BeadSelection grid: "Tap a jar to open · tap again to add." Dismissed by first add. Persist dismissal in `localStorage` under `mb.builder.tipSeen`.

### B.4 — Necklace zoom + auto-follow (small-screen visibility)

At `38vh` and 1000-unit viewBox, a 15px-wide bead in the SVG renders at roughly 5–6 CSS pixels on a 390px-wide phone — too small to recognize a color. Solution: zoom and pan the visualization so the most recently added bead is centered, with a re-follow rule when the user has manually panned away.

#### Why this is feasible

The `Necklace` SVG path is already programmatically positioned via GSAP MotionPath. Every bead's screen position is `pathEl.getPointAtLength(offset * totalLength)` where `offset = 1 - idx/(capacity-1)` (`Necklace.jsx:60`). That same math gives us the target focal point in SVG coordinates — no extra geometry work.

The bead `<img>` overlay (`Necklace.jsx:157-175`) is positioned in DOM space, not SVG space, because GSAP MotionPath writes inline transforms. To zoom both together we wrap **both the SVG and the bead overlay** in a single transformed container; scaling that container scales both layers identically.

#### Implementation

1. **Wrap SVG + bead overlay** in a `<div ref={zoomRef}>` inside `Necklace.jsx`. Animate `transform: translate3d(x, y, 0) scale(s)` via GSAP.
2. **Zoom level on mobile:** default `s = 1.8` once any bead exists; `s = 1` (overview) when the necklace is empty.
3. **Focal point on bead-add:** target `{ x, y } = pathEl.getPointAtLength(offset * pathLen)` translated into container coordinates, then negated and added to `(containerW/2, containerH/2)` so the bead lands in the middle of the viewport area.
4. **Tween:** chain the pan as a third step of the existing add timeline in `Necklace.jsx:76-113`, after the drop and slide tweens — same `duration: 0.6, ease: "power2.out"`. This way the camera follows the bead naturally, not as a snap.
5. **Removal:** on bead removal, re-focus on the new last bead (or zoom back to overview if the necklace is empty).

#### Re-follow on next bead (user's requested behavior)

The user must be able to pinch out / scroll to inspect the rest of the necklace without the camera fighting them, but the next bead they add should snap focus back.

Logic:
- Track `userOverride: boolean` in `Necklace.jsx` state.
- On any pinch / pan / wheel gesture inside `zoomRef`, set `userOverride = true` and stop the auto-follow tween mid-flight if one is running.
- On the next bead-add (`newBeads.length > oldBeads.length`), unconditionally:
  - Reset `userOverride = false`.
  - Run the auto-follow pan to the new bead.
- On bead-removal while `userOverride === true`: do **not** re-pan. Only the next add re-establishes follow.

This gives the user a clean mental model: *pinch around to look freely, drop a bead to snap back*.

#### Gestures

- **Pinch-zoom** and **two-finger pan**: use `@use-gesture/react` (~14kB, well-maintained) — `usePinch` and `useDrag` hooks bound to `zoomRef`. Clamp `s` to `[0.8, 4]`, clamp translate to keep the path inside the container.
- **Double-tap** to toggle between overview (`s = 1`) and current zoom. Cheap quality-of-life.
- **Single-finger drag inside the necklace area** also pans (but only while zoomed in — at `s = 1` a drag is a vertical scroll for the page).

#### Desktop behavior

Unchanged. The wrapper exists, but `s` stays at `1` and gestures are disabled (`useIsMobile` gate). The transformed wrapper is a no-op at scale 1.

### B.5 — Touch-tuned animation timings

A handful of GSAP/framer-motion durations were tuned for mouse cadence. On touch the user's perception of latency is different — input is direct, animations should be slightly snappier.

| Animation | Desktop (current) | Mobile |
|---|---|---|
| Lid float-off on `BeadJar` (`BeadJar.jsx:108-144`) | ~0.3s | 0.2s |
| Bead rise inside jar | 0.4s + 0.2s delay | 0.25s, no delay |
| Drop-in onto necklace (`Necklace.jsx:84-98`) | 0.8s | 0.55s |
| Slide along path (`Necklace.jsx:101-112`) | 0.8s | 0.55s |
| Zoom-follow pan (new) | n/a | 0.6s |

These are passed as props/constants gated by `useIsMobile()`.

### B.6 — Files touched (mobile work)

| File | Change |
|---|---|
| `frontend/src/hooks/useIsMobile.ts` *(new)* | matchMedia hook, default breakpoint `899px`. |
| `frontend/src/pages/Builder.jsx` → `.tsx` | Branch on `useIsMobile()` between desktop layout (unchanged) and new mobile layout. Owns `activeJarId` state and outside-click handler. |
| `frontend/src/components/BeadSelection.jsx` | Accept `activeJarId` + `onJarActivate`. Pass `isActive` to each `BeadJar`. |
| `frontend/src/components/BeadJar.jsx` | New tap-state logic per B.3. Variant cycling becomes step-based on mobile. Timings parameterized. |
| `frontend/src/components/Necklace.jsx` | Add zoom wrapper, follow tween, `userOverride` state, gesture handlers. Desktop path untouched at runtime. |
| `frontend/src/components/BeadList.jsx` | New `variant="sheet"` prop that renders inside a bottom sheet on mobile. Desktop variant unchanged. |
| `frontend/src/components/LengthOptions.jsx` | Compact mobile variant: pill row + bottom-sheet for custom length. |
| `frontend/src/components/MobileBeadListSheet.tsx` *(new)* | Bottom-sheet wrapper (shadcn `Sheet` if installed in Phase 1; otherwise a small hand-rolled `Dialog`). |
| `frontend/src/pages/Home.tsx` | Remove the desktop-only gate at `:83-95` and `:189-201` — Builder now works on mobile. Replace the "Builder is desktop-only" copy with the regular CTA. |
| `frontend/src/style/BeadJar.css` | Add `.bead-jar-container.is-active` styles for the mobile active-state ring. |
| `frontend/src/style/Necklace.css` *(new)* | Styles for the zoom wrapper and gesture hit area. |
| `package.json` | `+@use-gesture/react` (gesture handling). |

### B.7 — Phased rollout (mobile)

One PR per phase, each independently shippable.

**PR-M1 — Layout + active-jar interaction.** Items B.2 and B.3 only. No zoom yet. The mobile Builder is *usable* at the end of this PR, just with tiny beads. Unblocks the Home CTA.

**PR-M2 — Zoom + auto-follow.** Item B.4. Adds the gesture layer and the camera-follow behavior including re-follow on next bead.

**PR-M3 — Polish.** Item B.5 timings, the first-time hint, the active-state outline, the necklace-full shake, telemetry on which beads get used most (optional).

### B.8 — Exit criteria

- [ ] On an iPhone-class viewport (390 × 844), every Builder feature is reachable without horizontal scroll.
- [ ] Tapping a jar opens it; tapping again adds a bead; tapping a different jar transfers focus; tapping outside closes.
- [ ] At ≥3 beads on the necklace, the latest bead is centered and rendered at ≥18px on screen.
- [ ] Pinching out shows the full necklace; the next bead-add re-focuses without the user resetting anything.
- [ ] Desktop `/builder` looks and behaves identically to before this work (manual diff against pre-PR-M1 screenshots).
- [ ] No regressions in the existing GSAP add/remove timelines on either platform.

---

## Open decisions (for user to confirm before PR-M1 opens)

1. **Breakpoint:** `899px` proposed (mid-tablet is desktop). Confirm or steer.
2. **Bottom-sheet library:** roll our own (no new deps) vs. wait for shadcn `Sheet` from `REDESIGN_PLAN.md` Phase 1? If Phase 1 is happening soon, batch it; otherwise hand-roll for now.
3. **Gesture lib:** `@use-gesture/react` (recommended) vs. native touch listeners. `@use-gesture` adds ~14kB but solves pinch + clamp + momentum out of the box.
4. **First-time hint copy:** "Tap a jar to open · tap again to add." — okay or rephrase?
