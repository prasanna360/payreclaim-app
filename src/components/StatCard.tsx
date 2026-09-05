import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  accent: 'brand' | 'sky' | 'warn' | 'danger';
  trend?: { value: string; positive: boolean };
}

const accentMap = {
  brand: { bg: 'bg-brand-500/10', text: 'text-brand-400', ring: 'ring-brand-500/20' },
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-400', ring: 'ring-sky-500/20' },
  warn: { bg: 'bg-warn-500/10', text: 'text-warn-400', ring: 'ring-warn-500/20' },
  danger: { bg: 'bg-danger-500/10', text: 'text-danger-400', ring: 'ring-danger-500/20' },
};

export default function StatCard({ label, value, subValue, icon: Icon, accent, trend }: Props) {
  const a = accentMap[accent];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-600/60 bg-ink-800/80 p-5 shadow-card transition-all hover:border-ink-500/60 hover:shadow-card-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold text-white">{value}</p>
          {subValue && <p className="mt-1 text-xs text-slate-500">{subValue}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.bg} ${a.text} ring-1 ${a.ring}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={`text-xs font-semibold ${trend.positive ? 'text-brand-400' : 'text-danger-400'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-xs text-slate-500">vs last period</span>
        </div>
      )}
    </div>
  );
}
