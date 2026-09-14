# RushXArena Production Setup Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Git

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your values
4. Run the database migration in Supabase SQL Editor
5. Start development server: `npm run dev`

## Supabase Configuration

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key
3. Set a secure database password

### 2. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPER_ADMIN_EMAIL=owner@yourdomain.com
```

### 3. Database Migration

1. Go to Supabase Dashboard > SQL Editor
2. Copy the contents of `supabase-schema.sql`
3. Execute the script
4. Configure the super admin email:

```sql
SELECT set_config('app.settings.super_admin_email', 'owner@yourdomain.com', false);
```

### 4. Authentication Settings

1. Go to Authentication > Providers > Email
2. Enable "Confirm email" (recommended for production)
3. Configure redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### 5. Google OAuth (Optional)

1. Go to Authentication > Providers > Google
2. Enable Google provider
3. Add your Google Client ID and Secret
4. Configure redirect URI: `https://your-project.supabase.co/auth/v1/callback`

### 6. Facebook OAuth (Optional)

1. Go to Authentication > Providers > Facebook
2. Enable Facebook provider
3. Add your Facebook App ID and Secret

### 7. Storage Buckets

The schema creates these buckets automatically:
- `electricity-bills` - Private bill document storage
- `avatars` - Private avatar storage
- `reports` - Private report storage
- `bills` - Private bill file storage

## OCR Configuration (Azure Document Intelligence)

Required environment variables:

```env
OCR_PROVIDER=azure
OCR_API_KEY=your-azure-key
OCR_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
OCR_MODEL_ID=prebuilt-layout
```

## Payment Configuration (Razorpay)

Required environment variables:

```env
PAYMENT_PROVIDER=razorpay
PAYMENT_KEY_ID=your-razorpay-key-id
PAYMENT_KEY_SECRET=your-razorpay-key-secret
PAYMENT_WEBHOOK_SECRET=your-webhook-secret
```

### Webhook URL

Configure in Razorpay Dashboard:
- URL: `https://yourdomain.com/api/payments/webhook`
- Events: `payment.captured`, `payment.failed`

## AI Configuration (OpenAI)

```env
LLM_API_KEY=your-openai-key
LLM_MODEL=gpt-4o-mini
```

## Electricity Data Provider (BBPS/Utility API)

```env
ELECTRICITY_DATA_PROVIDER=manual
ELECTRICITY_API_URL=
ELECTRICITY_API_KEY=
```

## Testing

```bash
npm test          # Run unit tests
npm run typecheck # TypeScript type checking
npm run lint      # ESLint
npm run build     # Production build
```

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Service role key never exposed to browser
- [ ] Webhook signatures verified
- [ ] Payment verification is server-side
- [ ] Admin routes protected server-side
- [ ] No fake electricity data in UI
- [ ] File uploads validated (type, size, signature)
- [ ] Redirect URLs validated (no open redirects)
