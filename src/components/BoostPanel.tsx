'use client';

import { useFormStatus } from 'react-dom';
import { createBoostCheckout } from '@/app/message/[id]/boost-actions';
import { BOOSTS, type BoostType } from '@/lib/boost-config';

function BoostButton({ label, emoji, price }: { label: string; emoji: string; price: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-3 w-full bg-white/70 hover:bg-white border border-white/80 rounded-xl px-4 py-3 text-left transition hover:shadow-sm active:scale-[0.99] disabled:opacity-50"
    >
      <span className="text-xl">{emoji}</span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-[#1a1a2e]">{label}</span>
      </span>
      <span className="text-sm font-bold text-[#f43f5e]">
        {pending ? '...' : `$${(price / 100).toFixed(2)}`}
      </span>
    </button>
  );
}

export default function BoostPanel({
  messageId,
  stickyUntil,
  premiumStyle,
  paymentsEnabled,
}: {
  messageId: string;
  stickyUntil?: string | null;
  premiumStyle?: string | null;
  paymentsEnabled: boolean;
}) {
  const isStillSticky = stickyUntil && new Date(stickyUntil) > new Date();

  if (!paymentsEnabled) {
    return (
      <div className="mt-6 pt-5 border-t border-white/60">
        <p className="text-xs text-[#9ca3af]">✨ Boost options coming soon</p>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-5 border-t border-white/60">
      <h3 className="text-sm font-semibold text-[#374151] mb-3">✨ Boost your note</h3>

      {isStillSticky && (
        <p className="text-xs text-[#9ca3af] mb-3">
          📌 Pinned until {new Date(stickyUntil!).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </p>
      )}
      {premiumStyle && (
        <p className="text-xs text-[#9ca3af] mb-3">
          {premiumStyle === 'gold' ? '✨' : '💫'} {premiumStyle === 'gold' ? 'Gold border' : 'Glow effect'} active
        </p>
      )}

      <div className="space-y-2">
        {(Object.entries(BOOSTS) as [BoostType, typeof BOOSTS[BoostType]][]).map(([type, boost]) => (
          <form key={type} action={createBoostCheckout.bind(null, messageId, type)}>
            <BoostButton label={boost.label} emoji={boost.emoji} price={boost.unit_amount} />
          </form>
        ))}
      </div>
      <p className="text-xs text-[#9ca3af] mt-3">Secure payment via Stripe. No recurring charges.</p>
    </div>
  );
}
