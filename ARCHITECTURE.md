# Stawi — Colour System, Cart Architecture, Promo Codes & User Context

This adds four platform capabilities to the existing Stawi frontend (Vite + React 19 + Tailwind v4), plus a new
`server/` API (Express + Postgres) so promo codes and checkout totals are never trusted from the client.

## Running it

**Frontend** (unchanged — Figma Make runs this for you):
```
pnpm install
pnpm dev
```
Copy `.env.example` to `.env` if you want the frontend to talk to a real backend instead of failing over to
its "API not running" states (`VITE_API_BASE_URL`, default `http://localhost:4000`).

**Backend** (new — run separately, e.g. in Docker, Render, Railway, or locally):
```
cd server
cp .env.example .env   # set DATABASE_URL to a real Postgres instance
pnpm install
pnpm db:migrate         # runs src/db/schema.sql
pnpm dev                # http://localhost:4000
```

## 1. Colour system
`src/styles/tokens.css` is the single source of truth, imported by `src/index.css`. It keeps your existing
brand values (`--color-primary: #E85D04` etc.) and adds the missing tokens the brief asked for: `--color-info`,
hover/active/disabled states, and inverse text. Because these are declared inside Tailwind v4's `@theme` block,
they're also available as utility classes (`bg-primary`, `text-text-muted`, `border-border`, `bg-success-bg`,
`hover:bg-primary-hover`, `disabled:bg-disabled-bg`, …) — new components (cart, checkout, promo admin) use these
utilities instead of hard-coded hex values. Existing components still using literal hex codes weren't rewritten
wholesale to keep this change reviewable; new/touched files show the pattern to follow.

## 2. Cart architecture (3 cart types, 1 codebase)
- `src/lib/cart/types.ts` — `CartType` enum + which `itemType`s each cart accepts (enforced, not just documented)
- `src/lib/cart/pricingEngine.ts` — shared subtotal/fee/VAT math (display-only; see below)
- `src/context/CartContext.tsx` — one reducer/provider backing all three carts, persisted to `localStorage`
- `src/components/cart/*`, `src/pages/CartPage.tsx`, `src/pages/CheckoutPage.tsx` — shared UI, tabbed by cart type
- Wired examples: `PropertyDetailPage` adds to Cart 1 (verification service) and Cart 2 (unit reservation, only
  shown for `listing === 'new-development'`, explicitly labelled "does not transfer ownership"); `AgentCRMPage`
  adds to Cart 3 via `SubscriptionPlans`.

Cart item statuses (`added → reserved → pending_payment → payment_processing → confirmed / cancelled / expired`)
are modeled in `CartItem.status` and the `cart_status` Postgres enum, and are distinct from the cart itself
being "active" — see `carts.status` vs `cart_items.status` in `schema.sql`.

## 3. Promo codes — server is authoritative
The frontend (`src/lib/promo/promoCodeClient.ts`) sends `{code, cartType, items}` — never a discount amount — to
`POST /api/promo-codes/validate`. `server/src/services/discountCalculator.ts` re-derives everything from
Postgres: existence, active flag, start/expiry, cart-type/item-type/role/location eligibility, minimum
transaction value, total usage limit, and **per-user** usage limit (checked against `promo_code_usage`, not a
counter the client could resend). `POST /api/checkout` recomputes the same thing inside a transaction and only
then writes `promo_code_usage` + increments `promo_codes.times_used`, so two concurrent checkouts can't both
spend the last redemption of a limited code. Admin CRUD lives behind `requirePermission('manage_promo_codes')`
in `server/src/routes/promoCodes.ts`, surfaced in `src/components/admin/PromoCodeManager.tsx` (Admin →
Promo Codes tab) — create, disable/enable, and see redemptions + revenue impact per code.

## 4. User Context
`src/context/UserContext.tsx` centralizes auth state, profile, role, a role→permission map (for UI gating only),
preferences (property type, locations, budget, beds/baths, comms), saved properties, recent searches/viewed, and
`featureAccess` flags used to show/hide role-specific UI (e.g. the Admin nav item, the promo-code manager).
**Security note, stated directly in the file:** none of this is a security boundary. Every endpoint that
matters — `manage_promo_codes`, checkout, admin CRUD — re-checks the user's role against
`server/src/middleware/auth.ts`'s own role→permission map, derived from a verified JWT, never from anything the
client sends. The two permission maps are intentionally kept in sync but the server's copy is the one that's
actually enforced.

## Not yet done
- Wiring `UserContext.preferences` into `SearchPage` for personalized recommendations (the plumbing exists;
  the search-ranking logic doesn't yet)
- Per-role dashboards already existed as separate pages (`LandlordPage`, `TenantPage`, etc.) before this change —
  they aren't yet driven by `UserContext.role` for auto-redirect, `Header.tsx`'s `dashboardPage` lookup does that
  today and still works
- Real password auth (`AuthModal` still mocks sign-in); `UserContext.signIn` is written to swap in a real
  `/api/auth/login` call without changing its external shape
- Payment provider integration in `CheckoutPage` (M-Pesa/card selection is UI-only, `PaymentService` from the
  architecture diagram is a placeholder)
