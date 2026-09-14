'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SignInPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState('/dashboard');
  const [configurationError, setConfigurationError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    if (next?.startsWith('/') && !next.startsWith('//')) setNextPath(next);
    const errorCode = params.get('error');
    setConfigurationError(errorCode === 'auth_not_configured' ? 'Authentication is not configured. Please configure Supabase credentials.' : errorCode === 'callback_failed' ? 'Authentication callback failed. Please try again.' : errorCode === 'invalid_callback' ? 'The authentication callback was invalid.' : '');
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const { error: signInError } = await createClient().auth.signInWithPassword({ email, password });
      if (signInError) {
        const message = signInError.message.toLowerCase().includes('invalid login credentials')
          ? 'Email or password is incorrect.'
          : signInError.message.toLowerCase().includes('email not confirmed')
            ? 'Please confirm your email before signing in.'
            : signInError.message;
        setError(message);
        return;
      }
      router.push(nextPath as '/dashboard');
      router.refresh();
    } catch (authError) {
      setError(authError instanceof Error && authError.message.includes('not configured') ? 'Authentication is not configured. Please configure Supabase credentials.' : 'Authentication service is temporarily unavailable.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    setError('');
    try {
      const destination = nextPath;
      const { error: providerError } = await createClient().auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}` } });
      if (providerError) setError(`${provider[0].toUpperCase()}${provider.slice(1)} sign-in is not configured yet.`);
    } catch (authError) {
      setError(authError instanceof Error && authError.message.includes('configured') ? authError.message : 'Authentication service is temporarily unavailable.');
    }
  };

  const sendOtp = async () => {
    setError('');
    try {
      const { error: otpError } = await createClient().auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
      setError(otpError ? otpError.message : 'A sign-in code has been sent to your email.');
    } catch {
      setError('Authentication service is temporarily unavailable.');
    }
  };

  const verifyOtp = async () => {
    setIsSubmitting(true);
    try {
      const { error: otpError } = await createClient().auth.verifyOtp({ email, token: otp, type: 'email' });
      if (otpError) { setError(otpError.message); return; }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('The sign-in code is invalid or expired.');
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
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Sign in</div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Continue tracking your bill, meter reading, and home energy clarity.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              required
            />
          </label>

          {configurationError || error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{configurationError || error}</div>
          ) : null}

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="btn-secondary" onClick={() => signInWithProvider('google')}>Continue with Google</button>
            <button type="button" className="btn-secondary" onClick={() => signInWithProvider('facebook')}>Continue with Facebook</button>
          </div>
          <button type="button" className="w-full text-sm font-semibold text-brand-700" onClick={() => setOtpMode(!otpMode)}>{otpMode ? 'Use password instead' : 'Sign in with email code'}</button>
          {otpMode ? <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><input type="text" inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="Enter email code" className="w-full rounded-xl border border-slate-200 px-3 py-2" /><div className="flex gap-2"><button type="button" className="btn-secondary flex-1" onClick={sendOtp}>Send code</button><button type="button" className="btn-primary flex-1" disabled={isSubmitting} onClick={verifyOtp}>Verify code</button></div></div> : null}

          <div className="text-center text-sm text-slate-500">
            Need an account?{' '}
            <Link href="/signup" className="font-semibold text-brand-700">Create one</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
