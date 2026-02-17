# Heritage Wala – Production Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL (or Neon/hosted Postgres)
- Stripe account (for card payments)
- Resend account (for transactional email)
- Upstash Redis (for rate limiting)

## Environment Variables

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL` – Postgres connection string
- `JWT_SECRET` – long random secret (min 64 chars)
- `NODE_ENV` – `development` or `production`
- `NEXT_PUBLIC_APP_URL` – public URL (e.g. `http://localhost:3000` or your domain)
- `RESEND_API_KEY` – Resend API key
- `SENTRY_DSN` – Sentry DSN (optional)
- `UPSTASH_REDIS_REST_URL` – Upstash Redis REST URL (optional)
- `UPSTASH_REDIS_REST_TOKEN` – Upstash Redis REST token (optional)
- `STRIPE_SECRET_KEY` – Stripe secret key
- `STRIPE_WEBHOOK_SECRET` – Stripe webhook secret (not used yet, reserved)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – Stripe publishable key

## Install Dependencies

```bash
npm install
```

## Database Setup

1. Ensure `DATABASE_URL` is set in `.env`.
2. Run Prisma migrations and generate the client:

```bash
npx prisma migrate dev
```

3. Seed initial data (admin user, menu, settings):

```bash
npx ts-node prisma/seed.ts
```

Admin login after seeding:

- Email: `admin@sheritagewala.com`
- Password: `admin123`

## Running the App Locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Building for Production

```bash
npm run build
npm start
```

## Production Features Enabled

- Strict environment validation via Zod (`src/lib/env.ts`)
- Secure JWT auth with required `JWT_SECRET`
- Admin cookie hardened (HTTP‑only, secure, same‑site)
- Security headers and CSP via `next.config.mjs`
- Centralized logging with optional Sentry integration
- Resend email for orders and reservations
- Stripe Checkout for card payments
- Rate limiting on login, orders, reservations, and checkout
- CSRF protection for forms (login, checkout, reservations)
- Input sanitization on server
- Reservation capacity controlled via `Settings` model
- Health check endpoint at `/api/health`

## Stripe Flow

1. Checkout form posts to `/api/checkout` to create a Stripe Checkout Session.
2. Customer is redirected to Stripe for payment.
3. On success, Stripe redirects to `/checkout/success?session_id=...`.
4. The success page calls `/api/stripe/complete`:
   - Verifies the session and payment status.
   - Reads order details from Stripe metadata.
   - Creates the order in Postgres.
   - Sends confirmation email.

If Stripe is not configured, checkout falls back to creating orders directly via `/api/orders`.

## Deployment Notes

- Set all environment variables in your hosting platform (Vercel, etc.).
- Ensure `NODE_ENV=production` in production.
- Use HTTPS so security headers and secure cookies behave correctly.

