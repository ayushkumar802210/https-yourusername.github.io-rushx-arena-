# RushXArena

RushXArena is an electricity intelligence platform for understanding bill changes, modeling appliance demand, and exploring energy scenarios. It labels calculations as estimates and keeps the reasoning visible.

## Included now

- Demo and Supabase email authentication
- Google and Facebook OAuth handlers through the official Supabase Auth flow when providers are enabled
- **Single Super Admin system with role-based access control (RBAC)**
- **Secure Admin Dashboard for platform oversight**
- Bill Scanner upload -> review -> save flow (provider-independent OCR placeholder)
- Bill Detective with month-over-month change and low/medium/high confidence
- Electricity Twin with deterministic appliance calculations
- Profile management with validated avatar preview/removal and user-scoped Supabase Storage policies
- What-if, EV and Solar estimation views
- Responsive dashboard with light mode

## Run locally

This is a dependency-free static site. Serve this folder with any static web server, then open `index.html`. GitHub Pages is configured from the `main` branch root.

For real accounts, create a Supabase project, run `supabase-schema.sql` in SQL Editor, enable Email authentication, and put the browser-safe project URL and publishable/anon key in `config.js`. Set `DEMO_MODE` to `false` after configuration. The SQL creates a private `avatars` bucket with policies requiring the first path segment to equal the authenticated user ID. The current demo stores a validated image preview in local storage; production image storage uses Supabase Storage with a user ID path rather than data URLs.

## 👑 Super Admin Setup (Owner Only)

RushXArena includes a **Single Super Admin Access Control System** that restricts admin access to only the website owner's explicitly configured account.

### Configuration Steps

1. **Configure the owner email** in `.env` or your hosting provider's environment variables:
   ```
   SUPER_ADMIN_EMAIL=ayushkmr802210@gmail.com
   ```

2. **Run the database schema** in Supabase SQL Editor:
   - Open your Supabase project → SQL Editor
   - Create a new query and run the entire contents of `supabase-schema.sql`
   - This creates the `profiles` table with a `role` column (default: 'user')
   - The schema includes secure Row Level Security (RLS) policies

3. **The owner signs up** with their configured email:
   - When the user with the configured `SUPER_ADMIN_EMAIL` creates an account, they are automatically assigned the `super_admin` role
   - All other users are automatically assigned the `user` role
   - The role assignment happens server-side and cannot be bypassed

4. **Owner sets their password**:
   - Use Supabase Auth's secure Sign Up or password reset flow
   - Never hardcode or store the password in code
   - The password is securely managed by Supabase Auth

### Testing the Super Admin Implementation

Before deploying, test the following scenarios:

**Test 1: Authorized owner can access admin**
```
1. Sign up/in with the configured owner email
2. Profile menu should show "👑 Admin Dashboard"
3. Click to access the dashboard
4. Should see platform statistics and user management
```

**Test 2: Normal users cannot access admin**
```
1. Sign up/in with a different email
2. Profile menu should NOT show "👑 Admin Dashboard"
3. Manually navigating to /admin should show "Unauthorized" message
4. No admin data should be accessible
```

**Test 3: Admin APIs are protected**
```
1. Attempt to call get_admin_analytics() as normal user
2. Should receive "Unauthorized: Admin access required" error
3. No data should be returned
4. Call succeeds only for users with super_admin role
```

**Test 4: Role escalation is prevented**
```
1. Sign in as normal user
2. Attempt to modify profile with role field
3. Database RLS policies should reject the change
4. User's role should remain "user"
5. Frontend should show no admin access
```

**Test 5: Logout removes admin access**
```
1. Sign in as owner with admin access
2. Log out
3. Admin menu link should disappear
4. Cannot access /admin without signing back in
5. All admin data access blocked
```

### Automatic Flow Verification

The implementation follows this secure flow:

```
User Signs In/Up
        ↓
Supabase Auth provides verified email
        ↓
Database trigger fires on new user
        ↓
Trigger reads get_super_admin_email()
        ↓
Email matches? → Assign super_admin role
        ↓
loadUserData() fetches role from database
        ↓
updateProfileMenu() shows/hides admin link based on role
        ↓
Route authorization checks role before rendering /admin
        ↓
Admin RPC functions verify role server-side
        ↓
Access granted or denied server-side
```

All authorization is enforced server-side through:
- Supabase authentication (trusted session)
- Database role verification (role column in profiles table)
- Row Level Security policies (prevent unauthorized data access)
- RPC function authorization checks (verify role before returning data)

### Accessing the Admin Dashboard

- **Super Admin**: Sign in with the configured owner email → Click avatar → Select "👑 Admin Dashboard"
- **Normal Users**: The Admin Dashboard link is not visible in the profile menu
- **Route Protection**: Attempting to access `/admin` without authorization returns a 403 Unauthorized response

### Admin Dashboard Features

The Admin Dashboard (accessible to Super Admin only) includes:

- **Platform Overview**
  - Total registered users
  - Active Super Admins (system configuration)
  - Total bills analyzed
  - Total energy simulations performed
  - New users this month

- **Subscription Overview**
  - Free plan users
  - Pro plan users
  - Business plan users

- **Recent Users**
  - User names, emails, and registration dates
  - Account status and plan information
  - No sensitive data (passwords, tokens, credentials) are displayed

- **Security Status**
  - Verification that all admin functions are protected
  - Server-side role authorization status
  - Data exposure safeguards

### 🔐 Security Architecture

#### Role-Based Access Control (RBAC)

**Profiles Table Schema**:
```sql
- id: UUID (primary key, references auth.users)
- full_name, display_name, avatar_url, phone, location
- role: 'user' | 'super_admin' (default: 'user')
- plan: 'Free' | 'Pro' | 'Business' (default: 'Free')
- created_at, updated_at
```

**Role Assignment Rules**:
- ✓ Every new user is automatically assigned `role = 'user'`
- ✓ Only the explicitly configured owner email receives `super_admin` role
- ✗ Users cannot change their own role through the UI or API
- ✗ Normal users cannot call admin functions
- ✗ No public API endpoint allows self-service admin assignment

#### Row Level Security (RLS) Policies

**Profiles Table**:
- Users can only SELECT their own profile
- Users can only UPDATE their own profile (specific fields only)
- Users cannot INSERT new profiles (only the trigger can)
- Users cannot modify the `role` field
- Users cannot modify the `plan` field (reserved for backend processing)

**Bills, Appliances, Energy Reports**:
- Users can only access their own data
- Strict ownership verification (`auth.uid() = user_id`)

**Admin Functions** (Supabase RPC functions):
- `get_admin_analytics()`: Returns platform statistics (requires `super_admin` role)
- `get_admin_users()`: Returns paginated user list with non-sensitive fields (requires `super_admin` role)
- Both functions verify the caller's role server-side

#### Protection Against Role Escalation

Protections are enforced at multiple levels:

1. **Frontend**:
   - Admin menu item only shown to Super Admins
   - `/admin` route checks authorization before rendering
   - Regular users cannot navigate to admin features

2. **Backend/Database** (enforced by Supabase):
   - RLS policies prevent role modification through direct table updates
   - The `role` field has CHECK constraint: `role IN ('user', 'super_admin')`
   - Trigger function verifies Super Admin email during new user creation
   - RPC functions validate user role server-side before returning data

3. **API Level**:
   - No public endpoint allows users to assign themselves or others a role
   - All admin endpoints require valid Supabase session
   - Session validation happens server-side

#### What's NOT Stored in Source Code

❌ Owner's password - Set via Supabase Auth secure flow
❌ Supabase service-role key - Never exposed to frontend
❌ API keys or database passwords - Configured in hosting provider's environment
❌ OAuth secrets - Configured in Supabase dashboard only
❌ Payment credentials - Handled by server-side endpoints (not implemented yet)

✓ Public configuration (project URL, anon key) in `config.js`
✓ Environment variable names in `.env.example`

### OAuth setup

In Supabase Dashboard, open Authentication > Providers and enable Google and/or Facebook with credentials created in the provider console. Add the Supabase callback URL shown in the provider settings, and add the GitHub Pages URL (`https://ayushkumar802210.github.io/rushxarena-ai-electricity-detective/`) under Authentication > URL Configuration as an allowed redirect URL. The app calls `signInWithOAuth` only when Supabase is configured; otherwise it shows a configuration-required message and never fakes social authentication. OAuth metadata is used to create a profile once, subject to the same profile RLS policy.

## Architecture

- `index.html` contains the accessible application shell and views.
- `script.js` owns UI state, auth, persistence, and view rendering.
- `energy-engine.js` contains deterministic calculations independent of UI.
- `supabase-schema.sql` defines owned data tables, role-based access control, and Row Level Security policies.
- `config.js` contains public Supabase configuration (never store secrets here).
- `.env.example` documents all required environment variables.

## Calculation assumptions

Appliance energy is calculated as watts / 1,000 * quantity * hours per day * days per month. EV charging defaults to a 10% loss assumption. Solar uses capacity * monthly generation per kW and an editable 80% self-consumption assumption. Actual bills vary with slabs, taxes, fees, weather, meter data, and utility rules.

## Production roadmap and limitations

The Scanner currently provides a reviewable demo adapter and does not claim OCR accuracy. AI, OCR, payment, and webhook credentials must be used only by secure server-side routes; none are present in this browser project. Add server endpoints before enabling those integrations. Final pricing is not configured.

Never put service-role, AI, OCR, payment, or database passwords in browser code. Use `.env.example` as the variable checklist and keep real `.env` files uncommitted. All sensitive credentials must be configured through your hosting provider's secure environment variable settings.
