import Stripe from 'stripe';
export { BOOSTS, type BoostType } from './boost-config';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_placeholder', {
  apiVersion: '2026-04-22.dahlia',
});
