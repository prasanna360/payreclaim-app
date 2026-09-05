import type { TxnStatus } from '@/types';

const statusConfig: Record<TxnStatus, { label: string; classes: string; dot: string }> = {
  Pending: {
    label: 'Pending',
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-400',
  },
  'Recovery Sent': {
    label: 'Recovery Sent',
    classes: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    dot: 'bg-sky-400',
  },
  Recovered: {
    label: 'Recovered',
    classes: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    dot: 'bg-brand-400',
  },
  Lost: {
    label: 'Lost',
    classes: 'bg-danger-500/10 text-danger-400 border-danger-500/20',
    dot: 'bg-danger-400',
  },
};

export default function StatusBadge({ status, size = 'md' }: { status: TxnStatus; size?: 'sm' | 'md' }) {
  const cfg = statusConfig[status];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${cfg.classes} ${padding}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${status === 'Pending' ? 'animate-pulse-soft' : ''}`} />
      {cfg.label}
    </span>
  );
}
