'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (fullName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const { data, error: signUpError } = await createClient().auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName.trim() }, emailRedirectTo: `${window.location.origin}/auth/callback?next=%2Fdashboard` }
      });
      if (signUpError) {
        const message = signUpError.message.toLowerCase().includes('already registered') || signUpError.message.toLowerCase().includes('already been registered')
          ? 'This email is already registered. Please sign in.'
          : signUpError.message.toLowerCase().includes('rate limit')
            ? 'Too many attempts. Please wait and try again.'
            : signUpError.message;
        setError(message);
        return;
      }
      if (data.session) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Account created. Check your email to confirm your address before signing in.');
      }
    } catch (authError) {
      setError(authError instanceof Error && authError.message.includes('not configured') ? 'Authentication is not configured. Please configure Supabase credentials.' : 'Authentication service is temporarily unavailable.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-black text-white">⚡</div>
          <div>
            <div className="text-xl font-black text-slate-900">RushXArena</div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Create account</div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900">Start smarter energy decisions</h1>
        <p className="mt-2 text-sm text-slate-600">Create your account and begin understanding your bill, usage, and home energy profile.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-brand-500"
              placeholder="Your name"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-brand-500"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-brand-500"
              placeholder="Minimum 6 characters"
              required
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          ) : null}

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>

          <div className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/signin" className="font-semibold text-brand-700">Sign in</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
