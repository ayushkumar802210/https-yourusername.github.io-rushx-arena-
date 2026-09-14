import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { calculateMeterConsumption } from '@/lib/electricity/normalization/meter-calculation';

const readingSchema = z.object({
  meterNumber: z.string().trim().max(100).optional(),
  provider: z.string().trim().max(120).optional(),
  consumerNumber: z.string().trim().max(120).optional(),
  billDate: z.string().date().optional(),
  dueDate: z.string().date().optional(),
  totalPayable: z.number().finite().nonnegative().optional(),
  unitsKwh: z.number().finite().nonnegative().optional(),
  previousReading: z.number().finite().nonnegative().optional(),
  currentReading: z.number().finite().nonnegative().optional(),
  multiplier: z.number().finite().positive().optional(),
  readingDate: z.string().date().optional(),
  readingStatus: z.enum(['ACTUAL', 'ESTIMATED', 'PROVISIONAL', 'UNKNOWN']).default('UNKNOWN')
}).refine((value) => value.meterNumber || value.previousReading !== undefined || value.currentReading !== undefined, {
  message: 'Enter at least a meter number or a meter reading.'
}).refine((value) => value.previousReading === undefined || value.currentReading === undefined || value.currentReading >= value.previousReading, {
  message: 'Current reading cannot be lower than previous reading without documented rollover or meter replacement.'
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 });

  const parsed = readingSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? 'Invalid meter details.' }, { status: 400 });

  const input = parsed.data;
  const calculation = calculateMeterConsumption(input.previousReading, input.currentReading, input.multiplier);
  if (calculation.status === 'invalid') return Response.json({ error: 'Meter readings or multiplier are invalid.' }, { status: 400 });
  const consumption = calculation.consumption;

  const { data, error } = await supabase.from('meter_readings').insert({
    user_id: user.id,
    meter_number: input.meterNumber || null,
    previous_reading: input.previousReading ?? null,
    current_reading: input.currentReading ?? null,
    multiplier: input.multiplier ?? null,
    reading_date: input.readingDate || null,
    reading_status: input.readingStatus,
    calculated_consumption_kwh: consumption
  }).select('id, meter_number, calculated_consumption_kwh, reading_status').single();

  if (error) return Response.json({ error: 'Meter details could not be saved.' }, { status: 500 });

  const suppliedBillData = input.provider || input.consumerNumber || input.billDate || input.dueDate || input.totalPayable !== undefined || input.unitsKwh !== undefined;
  if (suppliedBillData) {
    const { data: bill, error: billError } = await supabase.from('electricity_bills').insert({
      user_id: user.id,
      provider: input.provider || null,
      consumer_number: input.consumerNumber || null,
      meter_number: input.meterNumber || null,
      bill_date: input.billDate || null,
      due_date: input.dueDate || null,
      units_kwh: input.unitsKwh ?? consumption,
      total_payable: input.totalPayable ?? null,
      verification_status: 'verified',
      verified_at: new Date().toISOString()
    }).select('id').single();
    if (billError) return Response.json({ error: 'Meter was saved, but bill details could not be saved.' }, { status: 500 });
    await supabase.from('bill_verification_events').insert({ bill_id: bill.id, user_id: user.id, event_type: 'verified', event_data: { source: 'USER_PROVIDED' } });
  }

  return Response.json({ ok: true, data, message: consumption === null ? 'Meter number saved. No electricity consumption or bill amount is available yet.' : 'Meter reading saved. Consumption is calculated by RushXArena from the provided readings.' });
}
