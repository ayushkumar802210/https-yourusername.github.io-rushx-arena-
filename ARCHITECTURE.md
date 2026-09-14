# RushXArena Technical Architecture Plan

## 1. Current repository assessment

The existing repository is not a Next.js application. It is a static browser app with:

- HTML/CSS/JS front end in [index.html](index.html), [style.css](style.css), and [script.js](script.js)
- Deterministic calculations in [energy-engine.js](energy-engine.js)
- Supabase integration and auth hooks in [config.js](config.js) and [script.js](script.js)
- SQL schema in [supabase-schema.sql](supabase-schema.sql)
- AI helper logic in [ai-assistant.js](ai-assistant.js)
- Security guidance in [backend-SECURITY.md](backend-SECURITY.md)

This repo already contains the product concept, a role-based admin design, and a working security architecture model. The main gap is that it is not yet a framework-based full-stack app with real server-side routes, server actions, middleware, and deployable runtime configuration.

## 2. Target production architecture

### Frontend
- Next.js 15 app router
- React 19
- TypeScript
- Tailwind CSS
- Route-based pages for landing, auth, dashboard, profile, and admin-ready surfaces

### Backend and services
- Next.js server routes under app/api
- Supabase server client with SSR cookies for authenticated actions
- Provider abstraction for AI, payment, and biller integrations
- Service layer for profile, bill, home, insights, payment, and admin access

### Database and storage
- Supabase PostgreSQL for profiles, bills, homes, user settings, activity logs, and admin metadata
- Supabase Storage for avatar uploads under per-user paths
- RLS policies and database functions for ownership, auth enforcement, and role checks

### Authentication
- Supabase Auth with email/password and OAuth support
- User profiles created server-side from trusted auth events
- Immutable user ID used as primary identity
- Role assignment limited to the configured super-admin email

### AI and billing integrations
- AI provider abstraction with secure server-side calls only
- Payment provider service abstraction for checkout and refunds
- BBPS-compatible provider abstraction for bill payment and recharge flows

### Hosting and deployment
- Vercel-ready Next app
- Environment variables stored in hosting provider settings only
- No secrets checked into source control

## 3. Recommended implementation order

1. Stabilize the Next.js app shell and runtime config
2. Implement Supabase auth/session bootstrap
3. Add profile creation, settings, avatar upload, and ownership checks
4. Add dashboard, bill scanner, and investigation APIs
5. Add AI assistant server route abstraction with fallback safe outputs
6. Add payment and biller service layer stubs behind secure routes
7. Add admin analytics route and RBAC enforcement
8. Add deployment configuration and verification tasks

## 4. Security principles

- Never trust browser state for authorization.
- Use Supabase Auth as the source of truth for session identity.
- Use RLS and server-side auth checks before serving any protected data.
- Keep service keys server-only; never expose them to the browser.
- Treat all AI, OCR, and payment flows as server-side only.

## 5. Production checklist

- Supabase project configured with Auth providers and redirect URLs
- Storage bucket for avatars with path-based ownership policies
- Database schema executed in Supabase SQL editor
- SUPER_ADMIN_EMAIL set in environment/provider config
- Real env vars added to hosting provider settings
- Payment and AI providers configured on the server only
- Monitoring, logs, and automated health checks enabled
- User-data privacy review completed before launch

## 6. Implementation status in this workspace

This workspace now includes the foundation for the Next.js architecture, while preserving the original RushXArena project artifacts. The project remains pending final runtime verification because the Node.js toolchain is not currently installed in this environment.
