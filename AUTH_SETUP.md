# Supabase Authentication Setup

1. Create a Supabase project and copy its Project URL and publishable/anon key.
2. Create `.env.local` from `.env.example` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

3. Run `supabase-schema.sql` in the Supabase SQL Editor so the profile trigger and RLS policies exist.
4. In Authentication > Providers, enable Email. Configure email confirmation according to the deployment policy.
5. Set the Supabase Site URL to the deployed application origin.
6. Add these redirect URLs in Authentication > URL Configuration:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR-DOMAIN.example/auth/callback`
7. For Google or Facebook, enable the provider in Supabase and add its provider credentials there. The application sends users to `/auth/callback` and does not handle provider secrets in the browser.
8. For email recovery, allow the same origins and `/reset-password` destination.

The application uses `@supabase/ssr` browser and server clients. Protected routes derive identity from the server session and redirect unauthenticated requests to `/signin`. Missing Supabase variables produce an authentication configuration error; no local or demo identity is created.
