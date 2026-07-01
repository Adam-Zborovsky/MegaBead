# MegaBead

**Design and order custom beaded jewelry — pick stones, build a necklace or bracelet in real-time, and check out.**

MegaBead is a full-stack e-commerce platform for handmade beaded jewelry. Customers browse a curated product catalog or use the interactive **bead builder** to assemble custom necklaces and bracelets bead-by-bead, with position-accurate SVG rendering, animated jar interactions, and mobile pinch-to-zoom. Admins manage the product inventory and seed catalog through an authenticated dashboard.

---

![Stack](https://img.shields.io/badge/stack-React_19_•_Express_4_•_MongoDB_7_•_Tailwind_3-purple)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

<!-- TODO: screenshot — add a clean grid showing (1) the bead builder with a populated necklace, (2) the product catalog, and (3) the mobile builder with the bottom sheet open. -->

---

## Highlights

- **SVG + GSAP bead engine** — beads animate along an `motionPath` onto a live necklace/bracelet arc. The SVG path scales to match selected length (14–60 cm) and bead count so beads always fill the cord evenly.
- **Mobile-first builder with pinch/zoom** — on touch devices, a `@use-gesture/react` layer handles drag-pan and two-finger pinch (0.8×–4×) so users can inspect individual beads at 2.2× zoom. Double-tap toggles overview.
- **Jar UX** — ~35 bead types (amber, jade, opal, rose, rainbow, etc.) rendered as jars with Framer Motion lid-open/close animations. Multi-variant beads (earth, pebble, rose, rainbow) cycle variants on hover (desktop) or per-tap (mobile).
- **Hybrid styling** — Tailwind CSS 3 for the home/shop shell (custom `bone`/`clay`/`terracotta` palette); Bootstrap 5 inside the builder for rapid form and grid work. Both systems coexist via CSS variable bridges.
- **JWT auth with route-level guard** — `x-auth-token` header verified by Express middleware; admin-only routes (product CRUD) check `req.user.isAdmin`. Frontend `AuthContext` auto-rehydrates on page load and redirects on 401.
- **MongoDB seed-on-connect** — on first DB connection the backend idempotently seeds ~12 demo products from `backend/seed-data/products.json` using Mongo extended-JSON parsing (supports `$oid`/`$date`).
- **Docker Compose + multi-stage builds** — three services (Mongo 7, Node 20-alpine backend, Nginx-alpine frontend). Frontend Dockerfile accepts `VITE_API_URL` as a build arg for environment-specific API routing.

---

## Architecture

```
┌──────────────┐     /api/*      ┌──────────────────┐     Mongoose      ┌─────────────┐
│   Browser    │ ───────────────→│  Nginx (frontend) │ ────────────────→│   MongoDB   │
│  (React SPA) │ ←───────────────│   port 80         │ ←─────────────── │  (Mongo 7)  │
└──────────────┘   static + JSON └──────────────────┘    queries        └─────────────┘
                                          │
                                          │ proxy_pass
                                          ▼
                                 ┌──────────────────┐
                                 │  Express (backend)│
                                 │     port 8181     │
                                 │  /api/* routes    │
                                 │  /images/ static  │
                                 └──────────────────┘
```

**Request lifecycle:** Browser → Nginx (serves React build or proxies `/api/` to backend) → Express router → Mongoose → MongoDB. Auth middleware reads `x-auth-token`, verifies JWT, and attaches `req.user` before route handlers execute. File uploads (product images) land on disk via Multer and are served by Express static middleware; Nginx also proxies `/api/images/` directly.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js (Alpine) | 20.x |
| **Web framework** | Express | ^4.21.2 |
| **Database** | MongoDB + Mongoose | 7 / ^8.15.1 |
| **Auth** | JWT (jsonwebtoken + bcryptjs) | ^9.0.2 / ^2.4.3 |
| **Validation** | Joi | ^17.13.3 |
| **File upload** | Multer | ^1.4.5 |
| **Logging** | Morgan | ^1.10.0 |
| **UI library** | React | ^19.0.0 |
| **Build tool** | Vite | ^6.0.0 |
| **Routing** | React Router | ^7.5.3 |
| **Server state** | TanStack React Query | ^5.66.0 |
| **HTTP client** | Axios | ^1.9.0 |
| **Styling** | Tailwind CSS + Bootstrap 5 | ^3.4.17 / ^5.3.3 |
| **Animation** | Framer Motion + GSAP | ^12.4.10 / ^3.12.7 |
| **Gesture** | @use-gesture/react | ^10.3.1 |
| **Forms** | react-hook-form + zod | ^7.54.0 / ^3.24.0 |
| **Icons** | lucide-react + react-icons | ^0.460.0 / ^5.5.0 |
| **Reverse proxy** | Nginx (Alpine) | stable |
| **Container** | Docker Compose | 3.x |

---

## Project Structure

```
MegaBead/
├── backend/
│   ├── app.js                           # Express entry point
│   ├── Dockerfile                       # Node 20-alpine, npm ci --production
│   ├── seed.js                          # Idempotent product seeder
│   ├── seed-data/products.json          # ~12 demo products
│   ├── auth/
│   │   ├── authService.js               # JWT middleware (x-auth-token)
│   │   └── providers/jwt.js             # Sign/verify
│   ├── config/
│   │   ├── default.json                 # "development" defaults
│   │   ├── development.json
│   │   └── production.json
│   ├── DB/
│   │   ├── dbService.js                 # Routes to local or Atlas by ENVIRONMENT
│   │   └── mongodb/
│   │       ├── connectToAtlas.js        # MONGO_URI connection
│   │       └── connectToMongoLocally.js # Docker service name fallback
│   ├── middlewares/cors.js              # CORS (ALLOWED_ORIGINS env var)
│   ├── products/
│   │   ├── models/Product.js            # Mongoose schema + virtual "id"
│   │   ├── models/productAccessDataService.js
│   │   ├── routes/productControllers.js  # CRUD with admin guard + Multer
│   │   ├── helpers/uploadProductService.js
│   │   └── product-images/              # Uploaded product photos
│   ├── users/
│   │   ├── models/User.js               # User schema (cart, payment, shipping)
│   │   ├── models/userAccessDataService.js
│   │   ├── routes/userControllers.js     # Register, login, CRUD
│   │   ├── routes/cartControllers.js     # Add/get/remove cart items
│   │   └── validation/                  # Joi schemas
│   ├── router/router.js                 # Mounts /users, /products, /cart
│   └── utils/                           # Error handler, time helper
├── frontend/
│   ├── Dockerfile                       # Multi-stage: build → Nginx
│   ├── nginx.conf                       # SPA + API proxy config
│   ├── vite.config.ts                   # Vite + @/ alias + dev proxy
│   ├── tailwind.config.js               # Custom bone/clay/terracotta palette
│   └── src/
│       ├── App.jsx                      # Routes + providers
│       ├── components/
│       │   ├── Necklace.jsx             # SVG path + GSAP bead engine
│       │   ├── BeadJar.jsx              # Animated jar with lid
│       │   ├── BeadSelection.jsx        # 35-bead-type grid
│       │   ├── BeadList.jsx             # Selected beads sidebar
│       │   ├── LengthOptions.jsx        # Necklace/bracelet toggle + cm
│       │   ├── Navbar.tsx / Footer.tsx
│       │   └── ...                      # Modals, error boundaries
│       ├── pages/
│       │   ├── Builder.jsx              # Desktop + mobile layouts
│       │   ├── Home.tsx                 # Hero, featured, newsletter
│       │   ├── Products.tsx / ProductDetails.tsx
│       │   ├── Login.tsx / Register.tsx
│       │   ├── Cart.tsx / Profile.tsx
│       │   └── ProductUpload.tsx / ManageProducts.tsx
│       ├── context/                     # AuthContext, CartContext
│       ├── services/                    # Axios API layer (http.ts, *Service.js)
│       ├── hooks/                       # useDocumentTitle, useIsMobile
│       └── style/                       # BeadJar.css, BeadList.css, Modal.css
├── docker-compose.yml                   # mongo + backend + frontend
├── .env.example                         # Template (not a real secret file)
└── .gitignore
```

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose — *or* —
- Node.js ≥20, npm ≥10, and a running MongoDB instance

### Docker (recommended)

```bash
# 1. Clone
git clone https://github.com/Adam-Zborovsky/MegaBead.git
cd MegaBead

# 2. Create .env from example
cp .env.example .env
# Edit .env with your MONGO_URI, JWT_SECRET, and VITE_API_URL

# 3. Start all services
docker compose up -d

# 4. Verify
curl http://localhost/health           # → 200 OK
curl http://localhost/api/products      # → seeded product list
```

### Local development

```bash
# Backend
cd backend
cp ../.env ./.env                     # or create your own
npm install
npm run dev                           # nodemon on :8181 (or PORT)

# Frontend (separate terminal)
cd frontend
npm install
npm run dev                           # Vite on :3000, proxies /api → :5000
```

---

## Configuration Reference

| Variable | Default (local) | Description |
|----------|-----------------|-------------|
| `MONGO_URI` | `mongodb://megabead-mongo:27017/MegaBead-Server` | MongoDB connection string |
| `JWT_SECRET` | *required* | JWT signing secret |
| `PORT` | `80` (container: `8181`) | Backend listen port |
| `VITE_API_URL` | `/api` | API base URL (build-time, fed to frontend Dockerfile) |
| `ALLOWED_ORIGINS` | *(none)* | Comma-separated CORS origins (e.g. `https://example.com`) |
| `NODE_ENV` | `development` | Set to `production` in Docker CMD |

---

## API Reference

All routes are prefixed with `/api`.

### Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/users` | — | Register |
| `POST` | `/users/login` | — | Login → `{ token }` |
| `GET` | `/users` | token | List all users |
| `GET` | `/users/:id` | token* | Get one user |
| `GET` | `/users/token/:id` | token* | Refresh token |
| `PUT` | `/users/:id` | token* | Update user |
| `DELETE` | `/users/:id` | token* | Delete user |
| `DELETE` | `/users/me` | token | Delete own account |

\* Self or admin only.

### Products

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/products` | — | List all products |
| `GET` | `/products/:id` | — | Get one product |
| `POST` | `/products` | admin | Create product (multipart) |
| `PUT` | `/products/:id` | admin | Update product (multipart) |
| `DELETE` | `/products/:id` | admin | Delete product |

### Cart

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/cart` | token | Add item (`productId` or `customProduct`) |
| `GET` | `/cart/:userId` | token | Get user's cart |
| `DELETE` | `/cart` | token | Remove item (`{ userId, productId }`) |

### Other

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check → 200 |

---

## Data Model

### User

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Auto |
| `name.first` | String | Required |
| `name.middle` | String | Optional |
| `name.last` | String | Required |
| `email` | String | Required, unique |
| `password` | String | Required, bcrypt hashed |
| `isAdmin` | Boolean | Default `false` |
| `paymentOptions[]` | Embedded | cardHolderName, cardNumber, expiryMonth, expiryYear, cvv |
| `shippingOptions[]` | Embedded | addressLine1/2, city, state, postalCode, country |
| `cart[]` | Embedded | productId (ref Product), customProduct (Object), quantity |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

### Product

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Auto |
| `name` | String | Required |
| `price` | String | Required (e.g. `"75 ₪"`) |
| `type` | Enum | `"necklace"` or `"bracelet"` |
| `image` | String | Filename in `product-images/` |
| `description` | String | Optional |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

---

## Engineering Notes

- **Card data is stored in plaintext** — the `User` schema embeds card number, expiry, and CVV directly. This is **not PCI-compliant**. A production deployment must either tokenize via a payment processor (Stripe, etc.) or remove payment fields from the user model entirely.
- **Dual CSS approach** — Tailwind handles the marketing shell (Home, Shop, etc.) while Bootstrap handles the builder layout. This works because the builder pages use Bootstrap classes and the rest uses Tailwind. CSS variables bridge the design tokens (`--bs-primary`, `--font-body`, etc.) so both systems share the same palette.
- **Bead list groups consecutive identical beads** — on desktop, `BeadList` collapses runs of the same bead type into a single row with a count badge. Removal pops the last bead of that group. This keeps the sidebar manageable.
- **Necklace path math** — the SVG arc's scale factor is computed from `(capacity - 1) * beadPixelWidth * gapFactor / basePathLength` to ensure beads fill the cord at any length. Mobile beads render at 7px vs. desktop 15px.
- **Cart supports both catalog products and custom builds** — `cartItemSchema` has mutually exclusive `productId` (reference) and `customProduct` (inline object) fields. The builder serializes bead counts into a description string and computes price as `length × 1.5 ₪`.

---

## Roadmap

- [ ] **Payment integration** — Stripe/PayPal checkout, replace stored card data with processor tokens
- [ ] **Image hosting** — move product images to S3/R2 instead of local disk
- [ ] **Order history** — order model with status tracking, email receipts
- [ ] **Bead colour picker** — let users tint beads directly in the builder
- [ ] **Tests** — backend integration tests, frontend component tests
- [ ] **i18n / RTL** — Hebrew support for the `.il` market

---

## License

This project currently has no license file. The `package.json` declares ISC. Add a `LICENSE` file to clarify terms.
