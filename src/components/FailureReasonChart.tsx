import type { FailureSummary } from '@/types';

const reasonColors: Record<string, string> = {
  'Insufficient Funds': '#f87171',
  'OTP Timeout': '#34d399',
  'Network Drop': '#38bdf8',
  'Card Declined': '#fbbf24',
  'Expired Card': '#a78bfa',
  'Fraud Suspected': '#fb923c',
};

export default function FailureReasonChart({ data }: { data: FailureSummary[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...sorted.map((d) => d.count));

  return (
    <div className="rounded-2xl border border-ink-600/60 bg-ink-800/80 p-5 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-white">Failure Reasons Breakdown</h3>
          <p className="mt-0.5 text-xs text-slate-500">Distribution of payment failures by type</p>
        </div>
        <span className="rounded-lg bg-ink-700/50 px-2.5 py-1 text-xs font-medium text-slate-400">{total} total</span>
      </div>

      <div className="space-y-3.5">
        {sorted.map((item) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
          return (
            <div key={item.reason}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: reasonColors[item.reason] }} />
                  <span className="font-medium text-slate-300">{item.reason}</span>
                </div>
                <span className="text-slate-500">
                  {item.count} <span className="text-slate-600">({pct}%)</span>
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-ink-700/50">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: reasonColors[item.reason],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
