# MegaBead Frontend — Fix & Redesign Plan

> Living document. Each phase ships as its own PR. No phase starts until the previous one is merged, except where explicitly noted.

---

## Hard constraints (set by user)

1. **Builder is off-limits.** `pages/Builder.jsx`, `components/Necklace.jsx`, `components/BeadJar.jsx`, `components/BeadSelection.jsx`, `components/BeadList.jsx`, `components/LengthOptions.jsx`, `style/BeadJar.css`, `style/BeadList.css` — *do not visually redesign or restyle these*. Animations (GSAP MotionPath, framer-motion jar reveal) and the bead-jar interaction were hand-tuned; any change risks regressing the marquee feature. Allowed edits to Builder:
   - **Bug fixes only** (e.g. the removal-crash on reset in `Necklace.jsx:43`).
   - **Token/color reskin via CSS variables only** — no markup changes, no class renames. The Builder picks up the new palette through `:root` vars; nothing else changes.
   - **No mobile responsive rewrite.** The desktop-only experience stays. We will improve the mobile *entry point* (Home + a clearer "desktop only" message) but the Builder itself remains as-is.
2. **Stitch-first design approval.** Every page outside Builder gets a Stitch design generated via the Stitch MCP server. The user approves each screen before any code is written for that page. No free-handing the UI.
3. **Backend is solid — do not modify** unless a frontend bug fix genuinely requires a contract change. Flag if so; do not change unilaterally.

---

## Phase 0 — Stop the bleeding (bug fixes only, ~1 day)

No visual changes. No new dependencies. Ships as one PR. Each item below is a discrete commit.

### 0.1 — Service-call signature mismatches

`services/userService.js` exports `updateUser(id, data, token)` and `deleteUser(id, token)`. Multiple call sites pass the wrong shape, so the requests go to `PUT /users/[object Object]` with the token as the body. Visible symptom: profile/cart updates "succeed" in toast but never persist.

Fix each call site:

| File:line | Current (broken) | Correct |
|---|---|---|
| `pages/Profile.jsx:45` | `updateUser(updatedUser, token)` | `updateUser(user._id, updatedUser, token)` |
| `pages/Profile.jsx:54` | `deleteUser(token)` | `deleteUser(user._id, token)` |
| `pages/Cart.jsx:27` | `updateUser({ shippingOptions: ... })` | `updateUser(user._id, { shippingOptions: ... }, token)` |
| `pages/Cart.jsx:39` | `updateUser({ paymentOptions: ... })` | `updateUser(user._id, { paymentOptions: ... }, token)` |

Also: `cartService.removeFromCart` sends `userId` in the body, but the backend already has it from `req.user._id`. Leave the API as-is for now (backend solid), but note it in `docs/api-cleanup.md` for a later sweep.

### 0.2 — `Profile` name handling

`pages/Profile.jsx:13-18` stores `name` as the joined string `"first last"`, then `:38-41` splits on `" "`. Breaks on:
- empty user (`" "` → `first: ""`, `last: undefined`)
- single-word names (no space → `last: undefined`)
- 3+ word names (`"Jean Luc Picard"` → loses "Picard")

Fix: store `firstName` and `lastName` as separate fields in `formData`, render two inputs, send `{ name: { first, last } }` to the backend (which already expects that shape per `userControllers.js:119`).

### 0.3 — `ProductUpload` correctness

`pages/ProductUpload.jsx`:

- **Line 65** — `formData.price = formData.price + " ₪"` mutates React state directly. Build a local payload: `const payload = { ...formData, price: \`${formData.price} ₪\` }; await createProduct(payload, token);`
- **Lines 170-177** — `toast.success` and `navigate` are wired to the button `onClick`, not to the submit promise. Move them into `.then()` of `handleSubmit`; surface failures with `toast.error(err.response?.data?.message || "Upload failed")`.
- **Line 113** — `type` is a freetext input. The backend only honors `"necklace"` or `"bracelet"`. Replace with `<select>` of those two values.

### 0.4 — `Cart` state collisions and reload

`pages/Cart.jsx`:

- **Lines 169 & 179** — two `<select>` controls both bound to `shippingOption`. Pick the address-select and delete the static "Standard/Express" select for now (it's not wired to anything backend-side). Same fix for payment lines 199 & 209.
- **Line 73** — `window.location.reload()` after remove. Replace with state update: the `removeItemFromCart` already updates context state; trust it.
- **Lines 50-61** — `handleCheckout` is misleading. It clears temporary items but doesn't actually check out. Until a real checkout flow exists, change the button label to "Save Cart" and the toast to "Cart saved" — or hide the button. Confirm with user.

### 0.5 — Routing hygiene (`App.js`)

- Line 1: change `from "react-router"` to `from "react-router-dom"`. All pages already use `react-router-dom`; the mixed import works on v7 but is fragile.
- Lines 39 & 42: duplicate `<Route path="/products">`. Delete one.
- Add `<Route path="*" element={<NotFound />} />` at the end. Build a minimal `pages/NotFound.jsx` (Phase 0 just needs a placeholder — Stitch will design the real one in Phase 3).
- Wrap protected routes in a `<ProtectedRoute>` component that redirects to `/login?next=<path>` when `user` is `null`. Protects: `/profile`, `/cart`, `/manage_products`, `/create_product`, `/edit_product/:id`.

### 0.6 — Auth token expiry

`context/AuthContext.jsx:12-26` decodes the JWT but never checks `exp`. Add:

```js
const decoded = jwtDecode(token);
if (decoded.exp * 1000 < Date.now()) {
  localStorage.removeItem("token");
  setToken(null);
  return;
}
```

Run on mount and on any 401 response (add an axios response interceptor that purges the token on 401 and dispatches a logout).

### 0.7 — Invisible text contrast

`index.css:73-75`:

```css
.text-secondary { color: var(--bs-secondary-text) !important; }
/* --bs-secondary-text is #fff, so prices on cream cards are white-on-cream */
```

Delete this rule and `--bs-secondary-text`/`--bs-light-text`/`--bs-primary-text` overrides. Let Bootstrap's defaults render — Phase 2 will replace the whole system anyway, but this rule causes the most visible defect right now (prices unreadable on Products list, descriptions unreadable on ProductDetails).

### 0.8 — `Necklace.jsx` removal crash

`components/Necklace.jsx:43-47`: if `findIndex` returns `-1`, the next line `oldBeads[removedIndex].id` crashes. Guard:

```js
const removedIndex = oldBeads.findIndex(b => !newBeads.some(n => n.id === b.id));
if (removedIndex === -1) { prevBeadsRef.current = beads; return; }
```

This is the only allowed Builder edit — pure crash fix, no behavior change.

### 0.9 — Error boundary

Wrap `<Routes>` in an `ErrorBoundary` that renders a static fallback. Minimal class component in `components/ErrorBoundary.jsx`. Prevents single-component throws from blanking the whole tree.

### 0.10 — Home mobile builder link

`pages/Home.jsx:28-33`: instead of `to="#" className="disabled"`, render a non-link element (a `<button disabled>` or a `<div>`) with copy `"Builder is desktop-only — visit on a larger screen"`. The current `<Link to="#">` is what pushes `/#` into history when tapped.

**Phase 0 exit criteria:** all 10 items above merged; manual smoke test covers login, register, view products, view product details, add to cart, remove from cart, profile update, profile delete, admin upload, admin edit, admin delete, navigate to a wrong URL.

---

## Phase 1 — Stack modernization (~2-3 days)

Foundation for the rebuild. One PR. No visual change yet — every page must look identical before and after.

### 1.1 — CRA → Vite + TypeScript

Drop `react-scripts` (5.0.1, unmaintained). New stack:
- **Vite 5** with `@vitejs/plugin-react`
- **TypeScript 5** in `strict` mode
- File extensions: `.jsx` → `.tsx`, `.js` → `.ts` where applicable

Migration notes:
- `process.env.REACT_APP_API_URL` → `import.meta.env.VITE_API_URL`. Rename `.env` keys accordingly.
- `public/index.html` becomes root-level `index.html` with `<script type="module" src="/src/index.tsx">`.
- Move `setupTests.js`, `reportWebVitals.js` out (or delete — neither is meaningfully used).

Justification: 10× dev-server startup, types catch the entire class of bugs from Phase 0 (#0.1, #0.2, #0.3 would all be compile errors).

### 1.2 — Tailwind CSS + shadcn/ui

Replace Bootstrap + react-bootstrap + the four ad-hoc CSS files.

- **Tailwind 3.4** with custom tokens in `tailwind.config.ts` (Phase 2 fills these in).
- **shadcn/ui** components owned in `src/components/ui/` — Button, Input, Select, Dialog, Card, Badge, Tabs, Skeleton, Toast, Sheet, DropdownMenu, Form.
- **Remove**: `bootstrap`, `react-bootstrap`, `react-icons` (Bootstrap classes deleted from every JSX file in Phase 3; Phase 1 just installs Tailwind in parallel — both can coexist briefly).
- **Replace**: `react-icons` → `lucide-react`. Keep `customIcons/` (`NecklaceIcon`, `BraceletIcon`) as-is — they're brand assets.

Constraint: **`pages/Builder.jsx` and its components stay on Bootstrap classes until last**. Phase 3 ends with a one-shot Builder reskin that swaps only the CSS variables and Bootstrap utility classes that map cleanly to Tailwind equivalents — no markup edits.

### 1.3 — TanStack Query

`@tanstack/react-query 5`. Replaces hand-rolled `useEffect + axios + setState` across `Products`, `ProductDetails`, `ManageProducts`, `Cart`, `Profile`. Gives loading / error / cache invalidation for free.

Wrap app in `<QueryClientProvider>` in `index.tsx`. Build query hooks in `src/queries/`:
- `useProducts()`
- `useProduct(id)`
- `useMe()` (replaces the manual `getUserById` in `AuthContext`)
- `useCart()` and `useCartMutations()`

Keep `AuthContext` but slim it to just `token` + `login` + `logout` — the user object moves to `useMe()`.

### 1.4 — Forms: react-hook-form + zod

Every form (Login, Register, Profile, ProductUpload, AddShippingModal, AddPaymentModal, Cart selects) migrates to `react-hook-form` with a `zod` schema. Inline error messages render under each field. No more `required` HTML attribute as the only validation.

### 1.5 — Tooling

- **ESLint** flat config + `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`.
- **Prettier** with `printWidth: 100`, tabs (matches current style).
- **Husky + lint-staged** pre-commit: typecheck + lint + format on staged files.

### 1.6 — Axios interceptor

Single `services/http.ts` exports a configured axios instance:
- Base URL from `import.meta.env.VITE_API_URL`.
- Request interceptor attaches `x-auth-token` from localStorage.
- Response interceptor: on 401, purge token + redirect to `/login`.

All `services/*.ts` files use this instance — no more per-call `config` objects.

**Phase 1 exit criteria:** `npm run dev` (Vite) works; every existing page renders and behaves identically; `tsc --noEmit` is clean; lint is clean.

---

## Phase 2 — Stitch design workflow (~2 days, in parallel with Phase 1's tail)

This is the **design approval gate** — no UI code in Phase 3 begins until each screen has an approved Stitch artifact.

### 2.1 — Create Stitch project

Use the Stitch MCP server:

1. `mcp__Stitch__create_project` — project name `"MegaBead"`, description `"Handcrafted bead jewelry — custom builder + ready-made shop. Warm, tactile, editorial; small-studio feel, not mass retail."`
2. Save the returned project ID to `docs/stitch.md` for reference.

### 2.2 — Author the design brief

Write `docs/DESIGN.md` (single source of truth for the brand). Sections:

- **Brand essence** — one paragraph: who, what, tone, references (Aesop, Le Labo, small Tel Aviv ceramics studios — *not* generic Shopify).
- **Palette** — proposal below; user approves before Stitch sees it.
- **Type pair** — proposal below.
- **Radii / shadow / spacing tokens.**
- **Voice** — copy register for buttons, empty states, errors.

Proposed palette (all subject to user approval):

| Token | Hex | Role |
|---|---|---|
| `bone` | `#F6F1E7` | page background |
| `linen` | `#EDE3D2` | cards, surfaces |
| `clay` | `#3E2B23` | body text, headings |
| `terracotta` | `#B8553A` | primary accent (CTAs, links) |
| `moss` | `#5B6E4F` | secondary accent (badges, tags) |
| `ink` | `#1A1612` | footer, overlays |

Proposed type pair: **Fraunces** (display, editorial serif with optical sizing) + **Inter** (body). Headings tight-tracked at large sizes.

Radii: `0`, `2px`, `12px`, `9999px` — no `rounded-md` default.
Shadows: single layered card shadow; zero shadow on buttons.
Spacing rhythm: 4 / 8 / 16 / 24 / 40 / 72 / 120.

### 2.3 — Upload brief to Stitch

`mcp__Stitch__upload_design_md` with `docs/DESIGN.md` → produces a Stitch design system.
Then `mcp__Stitch__create_design_system_from_design_md` to register it on the project.

### 2.4 — Generate screens (in this order, one at a time, approval-gated)

For each screen below: call `mcp__Stitch__generate_screen_from_text` with a tight brief, show the user, iterate via `mcp__Stitch__edit_screens` until approved, *then* check off and move to the next.

| # | Screen | Stitch prompt seed | Notes |
|---|---|---|---|
| 1 | Home | Asymmetric hero (left-aligned Fraunces headline ~88px, right-side product photo), editorial how-it-works section (Builder vs Shop, real screenshots), featured products strip, maker's story, footer | This sets the visual tone for everything else — get it right first |
| 2 | Products (shop list) | Grid of necklaces/bracelets, filter bar (type, price, length, sort), aspect-square images, badge for type, empty state, skeleton state | |
| 3 | ProductDetails | Two-column md+, stacked mobile; large image + thumb gallery; price, length, add-to-cart; accordion for description / materials / shipping | Backend currently has one image per product — design supports gallery for later, falls back gracefully |
| 4 | Login | Two-column auth: brand imagery left, form right; inline validation; "next" redirect; link to register | |
| 5 | Register | Same shell as Login; first/last/email/password fields; password strength meter | |
| 6 | Cart | Two-column md+: line items left with qty steppers + remove, summary card right (subtotal, shipping select, payment select, total, checkout); empty-cart state | |
| 7 | Profile | Tabbed layout: Account / Addresses / Payment Methods / (Order History — placeholder for now); replace cramped 400px card | |
| 8 | ManageProducts (admin) | Table view with thumbnail, name, type, price, actions; "Upload New" button top-right; empty state | |
| 9 | ProductUpload (admin) | Single-column form with dropzone image upload, type select, preview pane on right at md+ | |
| 10 | NotFound | On-brand 404; link home | |
| 11 | Navbar | Slim top bar; brand wordmark left (custom-set Fraunces, not generic text); links center; auth/cart right; mobile turns into a sheet drawer | |
| 12 | Footer | Three columns: brand + tagline, links, contact/IG; bottom bar with copyright | Doesn't exist today |

**Explicitly NOT designed in Stitch:** Builder. It stays as-is structurally; only the palette swaps via CSS variables.

### 2.5 — Stitch → Tailwind translation

For each approved Stitch screen, save the export to `docs/stitch-exports/<screen>.html` (or the JSON the MCP returns). Phase 3 reads these as the source of truth.

**Phase 2 exit criteria:** all 12 screens have an approved Stitch artifact saved under `docs/stitch-exports/`. User signs off in the PR thread or in `docs/DESIGN.md`.

---

## Phase 3 — Page rebuilds (~4-6 days)

One page per PR. Each PR:
1. Cites the approved Stitch artifact at the top.
2. Rewrites the page in TSX using Tailwind + shadcn primitives.
3. Replaces data fetching with the relevant TanStack Query hook.
4. Replaces forms with react-hook-form + zod.
5. Adds loading skeleton, error state, empty state.
6. Includes a manual test plan in the PR description.

### Order

1. **Navbar + Footer** (touches every page, do first)
2. **Home**
3. **Products**
4. **ProductDetails**
5. **Login + Register** (small, ship together)
6. **Profile** (incl. address/payment modals)
7. **Cart**
8. **ManageProducts**
9. **ProductUpload**
10. **NotFound**
11. **Builder reskin** (last, smallest PR) — swap CSS variables in `index.css` to the new palette, sanity-check that Bootstrap classes still resolve via a thin compatibility shim or via leaving Bootstrap loaded *only* for `/builder`. No JSX edits.

### Builder reskin specifics

Two options to discuss before this PR opens:

**Option A — Keep Bootstrap loaded globally.** Tailwind + Bootstrap coexist site-wide. Larger CSS bundle but zero risk to Builder.

**Option B — Scoped Bootstrap.** Move Bootstrap import out of `src/index.tsx` and into `pages/Builder.tsx` (or lazy-load it on the `/builder` route via dynamic import). Smaller global bundle; Builder still untouched markup-wise.

Recommend Option B but A is acceptable. User picks before the Builder reskin PR.

---

## Phase 4 — Polish (~1-2 days)

One PR, one commit per item.

- Real favicon set (16/32/180/512, `manifest.json`).
- `<title>` and `<meta>` per route (use a `<Helmet>` component or React Router 7's loader meta).
- OG tags for share previews.
- Route-level code-splitting via `React.lazy` + `<Suspense>` with skeleton fallbacks.
- Image optimization: serve `webp` from backend (one-line `sharp` middleware — confirm with backend owner first), `srcset`/`sizes` on every `<img>`.
- Toast styling matched to design system; remove `theme="colored"`.
- Lighthouse pass — target Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- A11y sweep: focus rings, skip-link, semantic landmarks, alt text on all images.

---

## Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Stitch designs feel generic / off-brief | Medium | Tight `DESIGN.md`, hand-picked references, iterate via `edit_screens` not regenerate |
| Phase 1 (Vite/TS migration) breaks Builder | Medium | Migrate Builder files last; keep them as `.jsx` for now (allowed in mixed TS/JS Vite setup); test Builder after every Phase 1 commit |
| Tailwind ↔ Bootstrap class collisions on Builder page | Low | Phase 3 #11 picks Option A or B explicitly to avoid this |
| Backend contract changes needed mid-rebuild (e.g. multi-image, real checkout) | Medium | Flag in PR; do not change backend without separate scope |
| Token expiry interceptor logs user out mid-flow on slow backend | Low | Only purge on actual 401, not on network timeout |

---

## Open questions for user

1. **Palette and type pair** — approve the proposal in §2.2, or steer toward a different direction before Stitch sees it?
2. **Cart "checkout" semantics** — is there a real payment processor planned (Stripe / Tranzila / PayPlus), or is "checkout" a stub for now? Affects Phase 0 #0.4 wording and Phase 3 #7 design.
3. **Hebrew/RTL support** — the price uses ₪ and the live URL is `.adamzborovsky.com`. Is the audience Hebrew-speaking? If yes, Phase 2 design must consider RTL early.
4. **Builder reskin** — Option A (keep Bootstrap global) or Option B (scoped to `/builder` route)?
5. **Product images** — backend currently stores one image per product. Phase 3 #3 (ProductDetails gallery) needs either a multi-image backend extension or fall back to a single hero image. Which?
6. **Order history** — does the backend have orders, or is "Order History" in Profile a placeholder until orders are built backend-side?

---

## File map (target end state)

```
frontend/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── docs/
│   ├── DESIGN.md
│   ├── stitch.md                  # project ID + design system ID
│   └── stitch-exports/            # approved screens
├── public/
│   ├── favicon.ico
│   └── images/                    # bead/jar PNGs (untouched)
└── src/
    ├── index.tsx
    ├── App.tsx
    ├── components/
    │   ├── ui/                    # shadcn primitives
    │   ├── ErrorBoundary.tsx
    │   ├── ProtectedRoute.tsx
    │   ├── Navbar.tsx
    │   ├── Footer.tsx
    │   ├── AddPaymentModal.tsx
    │   ├── AddShippingModal.tsx
    │   ├── BeadJar.jsx            # ← UNTOUCHED
    │   ├── BeadList.jsx           # ← UNTOUCHED
    │   ├── BeadSelection.jsx      # ← UNTOUCHED
    │   ├── LengthOptions.jsx      # ← UNTOUCHED
    │   └── Necklace.jsx           # ← only the removal-crash fix
    ├── context/
    │   └── AuthContext.tsx
    ├── customIcons/               # untouched
    ├── pages/
    │   ├── Home.tsx
    │   ├── Products.tsx
    │   ├── ProductDetails.tsx
    │   ├── Login.tsx
    │   ├── Register.tsx
    │   ├── Profile.tsx
    │   ├── Cart.tsx
    │   ├── ManageProducts.tsx
    │   ├── ProductUpload.tsx
    │   ├── NotFound.tsx
    │   └── Builder.jsx            # ← UNTOUCHED markup; reskinned via tokens only
    ├── queries/
    │   ├── products.ts
    │   ├── user.ts
    │   └── cart.ts
    ├── services/
    │   ├── http.ts                # axios instance + interceptors
    │   ├── productService.ts
    │   ├── userService.ts
    │   └── cartService.ts
    └── styles/
        ├── globals.css            # Tailwind base + design tokens
        └── builder-bootstrap.css  # only if Option B picked
```

---

## Estimated timeline (working days, sequential)

| Phase | Days |
|---|---|
| 0 — Bug fixes | 1 |
| 1 — Vite/TS/Tailwind/Query/forms | 2-3 |
| 2 — Stitch design + approval | 2 (calendar — depends on user review speed) |
| 3 — Page rebuilds | 4-6 |
| 4 — Polish | 1-2 |
| **Total** | **10-14 days** |

Phase 0 ships value immediately (broken site → working site) regardless of whether the rest proceeds.
