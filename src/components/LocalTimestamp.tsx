'use client';

export default function LocalTimestamp({ iso }: { iso: string }) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  });
  return <>{date} · {time}</>;
}
