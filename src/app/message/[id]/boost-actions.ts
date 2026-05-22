'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getStripe, BOOSTS, type BoostType } from '@/lib/stripe';

export async function createBoostCheckout(messageId: string, boostType: BoostType): Promise<void> {
  if (!process.env.STRIPE_SECRET_KEY) {
    redirect(`/message/${messageId}`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: message } = await supabase
    .from('messages')
    .select('id, author_id')
    .eq('id', messageId)
    .single();
  if (!message || message.author_id !== user.id) redirect(`/message/${messageId}`);

  const boost = BOOSTS[boostType];
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.lovewall.space';

  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: boost.name, description: boost.description },
        unit_amount: boost.unit_amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${origin}/message/${messageId}?boost_success=${boostType}`,
    cancel_url: `${origin}/message/${messageId}`,
    metadata: { messageId, boostType, userId: user.id },
  });

  redirect(session.url!);
}
