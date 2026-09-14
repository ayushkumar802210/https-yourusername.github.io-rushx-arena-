# 👑 RushXArena Super Admin System — Deployment Guide

## Overview

The RushXArena application now includes a **Single Super Admin Access Control System** that automatically grants admin access only to the website owner's explicitly configured account. All other users receive the standard "user" role.

---

## ⚙️ Pre-Deployment Configuration

### 1. Supabase Project Setup

Before deploying, ensure you have:
- A Supabase project created at [https://supabase.com](https://supabase.com)
- Project URL and Anon/Publishable API Key

### 2. Database Schema Installation

**Step A: Run the SQL Schema**

1. Open your Supabase project → **SQL Editor**
2. Create a new query and copy the entire contents of `supabase-schema.sql`
3. Execute the script

This creates:
- `profiles` table with `role` column (user/super_admin)
- Row Level Security (RLS) policies
- Role assignment trigger
- Admin RPC functions

**Step B: Configure the Owner Email**

In the `supabase-schema.sql` file, find the `get_super_admin_email()` function:

```sql
create or replace function public.get_super_admin_email()
returns text language sql immutable as $$
  select 'ayushkmr802210@gmail.com'::text
$$;
```

**Replace `'ayushkmr802210@gmail.com'` with the actual owner's email address.**

Then re-run this function in SQL Editor:

```sql
create or replace function public.get_super_admin_email()
returns text language sql immutable as $$
  select 'YOUR_OWNER_EMAIL@example.com'::text
$$;
```

### 3. Authentication Configuration

In Supabase Dashboard:

1. Go to **Authentication > Providers**
2. Enable **Email Auth** (already enabled by default)
3. (Optional) Enable Google, Facebook, or other providers
4. Go to **Authentication > URL Configuration**
5. Add your deployment URL to the allowed redirect URLs

Example for GitHub Pages:
```
https://ayushkumar802210.github.io/rushxarena-ai-electricity-detective/
```

---

## 🔧 Application Configuration

### 1. Update config.js

Add your Supabase credentials to `config.js`:

```javascript
window.RUSHXARENA_CONFIG = {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-publishable-or-anon-key",
  DEMO_MODE: false  // Set to false for production
};
```

**WARNING:** Use only the browser-safe Anon/Publishable Key. Never include the service_role key.

### 2. Environment Variables (for static hosting)

For GitHub Pages or other static hosting, environment variables can be managed through:

- **GitHub Secrets** (if using GitHub Actions)
- **Netlify Environment Variables** (if using Netlify)
- **Vercel Environment Variables** (if using Vercel)

Store these values:
```
SUPER_ADMIN_EMAIL=your.owner@email.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-publishable-key
DEMO_MODE=false
```

### 3. .env File (Local Development Only)

For local development, create a `.env` file in the project root:

```
SUPER_ADMIN_EMAIL=your.owner@email.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-publishable-key
DEMO_MODE=false
```

**IMPORTANT:** The `.env` file is in `.gitignore` and will NOT be committed to GitHub.

---

## 🚀 Deployment Steps

### 1. Verify .gitignore Configuration

Ensure `.env` files are excluded:

```bash
# Check .gitignore
cat .gitignore
```

Should show:
```
.env
.env.*
!.env.example
```

### 2. Deploy to GitHub Pages

```bash
# Stage all changes
git add -A

# Commit with a meaningful message
git commit -m "Deploy Super Admin system with production configuration"

# Push to GitHub
git push origin main
```

GitHub Pages will automatically deploy the changes from the `main` branch.

### 3. Deploy to Other Platforms

**Netlify:**
1. Connect your GitHub repository
2. Set environment variables in Netlify Dashboard
3. Deploy (automatic on push to main)

**Vercel:**
1. Import your GitHub repository
2. Set environment variables in Vercel Dashboard
3. Deploy (automatic on push to main)

**Custom Server:**
1. Clone the repository
2. Install environment variables
3. Serve with any static server (nginx, Apache, etc.)

---

## ✅ Testing Checklist

### Test 1: Owner Can Access Admin Dashboard

1. Navigate to the application
2. Click "Sign In"
3. Enter the configured owner email
4. Enter the password (set via Supabase)
5. **Expected:** Admin Dashboard option appears in profile menu
6. Click **👑 Admin Dashboard**
7. **Expected:** Dashboard shows platform statistics

### Test 2: Normal Users Cannot Access Admin

1. Sign in with a different email (not the owner)
2. **Expected:** Admin Dashboard option is NOT in profile menu
3. Manually navigate to `/admin` (if applicable)
4. **Expected:** Redirected to dashboard with "Unauthorized" message

### Test 3: Admin APIs Are Protected

Using browser DevTools or curl:

```bash
# This will fail with "Unauthorized" if user is not super_admin
curl -X GET "https://your-supabase.supabase.co/rest/v1/rpc/get_admin_analytics" \
  -H "Authorization: Bearer <user-token>" \
  -H "apikey: <anon-key>"
```

### Test 4: Role Assignment on Signup

1. Create a new account with the owner's configured email
2. **Expected:** Automatically receives `super_admin` role
3. Create another account with a different email
4. **Expected:** Automatically receives `user` role

### Test 5: Users Cannot Escalate Their Role

1. Sign in as normal user
2. Open browser DevTools → Network tab
3. Try to modify profile (e.g., update name)
4. Check the request payload
5. **Expected:** Even if you add `role: "super_admin"` to the request, the database rejects it
6. **Expected:** Role remains `user`

### Test 6: Logout Removes Admin Access

1. Sign in as owner
2. Access Admin Dashboard
3. Click logout
4. **Expected:** Admin Dashboard option disappears
5. **Expected:** Cannot access `/admin` without signing in

### Test 7: No Sensitive Data Exposed

1. Sign in as admin
2. Open browser DevTools → Application → Local Storage
3. **Expected:** No passwords, OAuth tokens, or API keys visible
4. Open Network tab while accessing admin functions
5. **Expected:** No sensitive data in request/response bodies

### Test 8: Secrets Not in Repository

```bash
# Check for hardcoded secrets
git log -p --all -S "password" | grep -i password
git log -p --all -S "secret" | grep -i secret
git log -p --all -S "token" | grep -i token

# Should find NO results in committed code
```

---

## 🔒 Security Verification Checklist

Before going live:

- [ ] Owner email is configured securely (not in GitHub)
- [ ] `.env` file is in `.gitignore` and not committed
- [ ] `.env.example` contains only placeholders
- [ ] No passwords hardcoded in `config.js`
- [ ] No Supabase service_role key in browser code
- [ ] All admin functions verify `super_admin` role server-side
- [ ] RLS policies prevent normal users from accessing admin data
- [ ] Normal users cannot modify the `role` field
- [ ] `/admin` route checks authorization before rendering
- [ ] Admin menu link is hidden for normal users
- [ ] Logout clears all admin permissions

---

## 📊 Admin Dashboard Features

When accessed by the Super Admin, the dashboard shows:

### Overview Metrics
- **Total Registered Users** — Complete user count
- **Super Admins** — System admin count
- **Total Bills Analyzed** — Platform usage metric
- **Energy Simulations** — User engagement metric

### Subscription Breakdown
- Free Plan users
- Pro Plan users
- Business Plan users

### Recent Users
- User names and emails
- Registration dates
- Account status
- Plan information

### Security Status
- Authentication system status
- Role enforcement verification
- Data exposure safeguards

---

## 🛠️ Troubleshooting

### Issue: Admin Dashboard Link Not Appearing

**Cause:** Role not loaded from database

**Solution:**
1. Verify the database trigger is active: `select * from pg_trigger where tgname = 'on_auth_user_created';`
2. Check the user's profile row: `select id, email, role from auth.users join public.profiles on auth.users.id = public.profiles.id where auth.users.email = 'owner@example.com';`
3. Ensure `get_super_admin_email()` returns the correct email

### Issue: Admin Cannot Access Analytics

**Cause:** RPC function authorization failed

**Solution:**
1. Check user role in database: `select role from public.profiles where id = 'user-id-here';`
2. Verify RPC function exists: `select * from pg_proc where proname = 'get_admin_analytics';`
3. Test the function: `select * from public.get_admin_analytics();` (as super_admin user)

### Issue: Normal Users Can See Admin Menu

**Cause:** Frontend JavaScript error

**Solution:**
1. Check browser console for errors
2. Verify `state.role` is being set correctly: Open DevTools → Console → type `state.role`
3. Verify `updateProfileMenu()` is being called: Add breakpoint in script.js

### Issue: Unauthorized Error in Browser

**Cause:** User session expired or invalid

**Solution:**
1. Clear browser cache and localStorage
2. Log out and log back in
3. Check Supabase session: Open DevTools → Application → Local Storage → look for Supabase session

---

## 📚 Environment Variables Reference

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `SUPER_ADMIN_EMAIL` | Yes | `owner@example.com` | Owner's email for super_admin role |
| `SUPABASE_URL` | Yes | `https://xxx.supabase.co` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | `eyJhb...` | Browser-safe anon key only |
| `DEMO_MODE` | No | `false` | Set to false for production |

---

## 🔐 Security Best Practices

1. **Never commit `.env` files**
   - They are in `.gitignore` for a reason
   - Use hosting provider's environment variables instead

2. **Rotate credentials regularly**
   - Generate new Supabase API keys periodically
   - Update them in your deployment environment

3. **Monitor admin access**
   - Log admin actions (future feature)
   - Review admin user list regularly
   - Remove admin access when no longer needed

4. **Use HTTPS only**
   - Ensure your deployment URL is HTTPS
   - Authentication tokens are encrypted in transit

5. **Keep dependencies updated**
   - Supabase JavaScript library receives security updates
   - Update to latest version regularly

---

## 📞 Support & Documentation

- **Supabase Documentation:** https://supabase.com/docs
- **RushXArena README:** See `README.md` for full project documentation
- **Security Documentation:** See `backend-SECURITY.md` for production security guidelines

---

## ✅ Deployment Verification

After deployment, verify:

```bash
# Check that the app loads
curl https://your-deployment-url.com/index.html | grep -i "rushxarena"

# Check that config is correct
curl https://your-deployment-url.com/config.js | grep -i SUPABASE_URL

# Verify no secrets in codebase
git log -p | grep -i "api_key\|password\|secret" | wc -l
# Should output: 0
```

---

## 🎉 Next Steps

1. ✅ Run the SQL schema in Supabase
2. ✅ Configure owner email in `get_super_admin_email()`
3. ✅ Update `config.js` with Supabase credentials
4. ✅ Set `DEMO_MODE = false`
5. ✅ Deploy to your hosting platform
6. ✅ Run the testing checklist
7. ✅ Monitor logs and admin access
8. ✅ Communicate deployment to users

Congratulations! Your RushXArena Super Admin System is ready for production. 👑
