import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';

const orderSchema = z.object({ amount: z.number().finite().positive().max(1000000), plan: z.string().trim().max(50).optional() });

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 });
  const parsed = orderSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: 'Invalid payment amount.' }, { status: 400 });
  if (env.PAYMENT_PROVIDER !== 'razorpay' || !env.PAYMENT_KEY_ID || !env.PAYMENT_KEY_SECRET) return Response.json({ error: 'Payment gateway is not configured.' }, { status: 503 });

  const receipt = `rushxarena_${user.id.slice(0, 8)}_${Date.now()}`;
  const response = await fetch('https://api.razorpay.com/v1/orders', { method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`${env.PAYMENT_KEY_ID}:${env.PAYMENT_KEY_SECRET}`).toString('base64')}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: Math.round(parsed.data.amount * 100), currency: 'INR', receipt, notes: { user_id: user.id, plan: parsed.data.plan || '' } }) });
  if (!response.ok) return Response.json({ error: 'Payment gateway could not create an order.' }, { status: 502 });
  const order = await response.json() as { id: string; amount: number; currency: string };
  const { error } = await supabase.from('payments').insert({ user_id: user.id, order_id: order.id, gateway: 'razorpay', amount: parsed.data.amount, currency: order.currency, status: 'created' });
  if (error) return Response.json({ error: 'Payment order could not be recorded.' }, { status: 500 });
  return Response.json({ ok: true, orderId: order.id, amount: order.amount, currency: order.currency, keyId: env.PAYMENT_KEY_ID });
}
