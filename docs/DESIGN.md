# MegaBead Design System

## Brand Essence

MegaBead is a handcrafted bead jewelry studio — not a mass-market retailer. The brand voice is warm, tactile, and editorial. Think Aesop's minimal product storytelling, Le Labo's intimate craft aesthetic, or a small Tel Aviv ceramics studio where every piece has a maker behind it. The site should feel like walking into a curated atelier, not scrolling through a generic Shopify template.

## Palette

| Token | Hex | Role |
|---|---|---|
| `bone` | `#F6F1E7` | Page background |
| `linen` | `#EDE3D2` | Cards, surfaces, secondary backgrounds |
| `clay` | `#3E2B23` | Body text, headings, primary dark |
| `terracotta` | `#B8553A` | Primary accent — CTAs, links, active states |
| `moss` | `#5B6E4F` | Secondary accent — badges, tags, success states |
| `ink` | `#1A1612` | Footer, overlays, deep contrast |

**Light mode only.** Dark mode is not in scope.

## Typography

- **Display / Headlines:** Fraunces (editorial serif with optical sizing)
- **Body / UI:** Inter (clean, highly legible sans-serif)
- **Headings:** Tight tracking at large sizes (`letter-spacing: -0.02em` for display sizes)
- **Scale:** 
  - Display: 64–88px (hero headlines)
  - H1: 40px
  - H2: 32px
  - H3: 24px
  - Body: 16px
  - Small/Label: 14px

## Shape Tokens

| Token | Value | Usage |
|---|---|---|
| `radius-none` | `0` | Tables, data-dense layouts |
| `radius-sm` | `2px` | Subtle corners on inputs |
| `radius-lg` | `12px` | Cards, modals, containers |
| `radius-full` | `9999px` | Pills, badges, avatars |

**No default `8px` (`rounded-md`).** Every radius choice must be intentional.

## Shadows

- **Card shadow:** `0 1px 3px rgba(26, 22, 18, 0.08), 0 4px 12px rgba(26, 22, 18, 0.05)`
- **Button shadow:** `none` — buttons are flat with background color only
- **Modal/overlay shadow:** `0 8px 30px rgba(26, 22, 18, 0.12)`

## Spacing Rhythm

Base unit: `4px`

| Token | Value |
|---|---|
| `space-1` | `4px` |
| `space-2` | `8px` |
| `space-3` | `16px` |
| `space-4` | `24px` |
| `space-5` | `40px` |
| `space-6` | `72px` |
| `space-7` | `120px` |

## Voice & Copy Register

- **Buttons:** Action-oriented, lowercase feel. "Add to cart" not "Add to Cart". "Save changes" not "Save Changes".
- **Empty states:** Warm and helpful, not apologetic. "Your cart is waiting for its first treasure."
- **Errors:** Clear and specific. "We couldn't find that product." not "Error 404."
- **Form labels:** Sentence case. "First name" not "First Name".

## Builder Constraint

The Builder page (`/builder`) and its components (`BeadJar`, `BeadList`, `BeadSelection`, `LengthOptions`, `Necklace`) are structurally frozen. Only the CSS variables above are applied via `:root` — no markup changes, no class renames.

## Open Questions

1. **Hebrew / RTL:** The domain is `.adamzborovsky.com` and prices use ₪. Is Hebrew the primary language? If yes, the design must support RTL from the ground up.
2. **Product images:** Backend currently stores one image per product. Should the ProductDetails design support a gallery layout (with graceful fallback to single image), or stay single-image?
3. **Order history:** Does the backend have orders, or is "Order History" in Profile a placeholder?
4. **Builder reskin strategy:** Option A (keep Bootstrap loaded globally, coexist with Tailwind) or Option B (scope Bootstrap to `/builder` route only)?
