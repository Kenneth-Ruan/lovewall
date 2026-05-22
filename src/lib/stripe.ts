import Stripe from 'stripe';
export { BOOSTS, type BoostType } from './boost-config';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
    });
  }
  return _stripe;
}
