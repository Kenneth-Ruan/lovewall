import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { BoostType } from '@/lib/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { messageId, boostType } = session.metadata ?? {};
    if (!messageId || !boostType) return NextResponse.json({ ok: true });

    const supabase = await createClient();

    if (boostType === 'sticky') {
      const stickyUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await supabase
        .from('messages')
        .update({ is_sticky: true, sticky_until: stickyUntil })
        .eq('id', messageId);
    } else {
      await supabase
        .from('messages')
        .update({ premium_style: boostType as BoostType })
        .eq('id', messageId);
    }

    revalidatePath(`/message/${messageId}`);
    revalidatePath('/');
  }

  return NextResponse.json({ ok: true });
}
