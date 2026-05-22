import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_placeholder', {
  apiVersion: '2026-04-22.dahlia',
});

export const BOOSTS = {
  sticky: {
    name: 'Sticky Note (24 hours)',
    description: 'Your note stays pinned to the top of the wall for 24 hours.',
    unit_amount: 500,
    emoji: '📌',
    label: 'Pin to top for 24h',
  },
  gold: {
    name: 'Gold Border',
    description: 'A shimmering gold border that makes your note stand out.',
    unit_amount: 200,
    emoji: '✨',
    label: 'Gold border',
  },
  glow: {
    name: 'Glow Effect',
    description: 'A soft rose glow that draws the eye.',
    unit_amount: 100,
    emoji: '💫',
    label: 'Glow effect',
  },
} as const;

export type BoostType = keyof typeof BOOSTS;
