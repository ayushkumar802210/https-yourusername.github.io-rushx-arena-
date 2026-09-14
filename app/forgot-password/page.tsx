'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      const { error } = await createClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      setMessage(error ? error.message : 'If an account exists for that email, a reset link has been sent.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to request a reset link.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-black text-white">⚡</div>
          <div>
            <div className="text-xl font-black text-slate-900">RushXArena</div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Reset password</div>
          </div>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Reset your password</h1>
        <p className="mt-2 text-sm text-slate-600">Enter your account email and follow the secure reset flow provided by the configured authentication service.</p>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-brand-500" placeholder="you@example.com" required />
          </label>
          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send reset link'}</button>
          {message ? <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{message}</p> : null}
        </form>
      </div>
    </main>
  );
}
