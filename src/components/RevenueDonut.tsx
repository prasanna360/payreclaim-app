interface Props {
  recovered: number;
  lost: number;
}

export default function RevenueDonut({ recovered, lost }: Props) {
  const total = recovered + lost;
  const recoveredPct = total > 0 ? (recovered / total) * 100 : 0;
  const lostPct = total > 0 ? (lost / total) * 100 : 0;

  const r = 60;
  const circumference = 2 * Math.PI * r;
  const recoveredDash = (recoveredPct / 100) * circumference;

  return (
    <div className="rounded-2xl border border-ink-600/60 bg-ink-800/80 p-5 shadow-card">
      <div className="mb-5">
        <h3 className="font-display text-base font-semibold text-white">Revenue Recovered vs Lost</h3>
        <p className="mt-0.5 text-xs text-slate-500">Total payment value outcome</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative h-40 w-40 shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 150 150">
            <circle cx="75" cy="75" r={r} fill="none" stroke="#1b263b" strokeWidth="16" />
            <circle
              cx="75"
              cy="75"
              r={r}
              fill="none"
              stroke="#34d399"
              strokeWidth="16"
              strokeDasharray={`${recoveredDash} ${circumference}`}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold text-white">{Math.round(recoveredPct)}%</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Recovered</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-brand-500" />
                <span className="text-sm font-medium text-slate-300">Recovered</span>
              </div>
              <span className="font-display text-lg font-bold text-brand-400">${recovered.toLocaleString()}</span>
            </div>
            <p className="mt-0.5 pl-5 text-xs text-slate-500">{recoveredPct.toFixed(1)}% of total value</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-ink-600" />
                <span className="text-sm font-medium text-slate-300">Lost</span>
              </div>
              <span className="font-display text-lg font-bold text-slate-400">${lost.toLocaleString()}</span>
            </div>
            <p className="mt-0.5 pl-5 text-xs text-slate-500">{lostPct.toFixed(1)}% of total value</p>
          </div>
          <div className="border-t border-ink-600/40 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total at Risk</span>
              <span className="font-display text-base font-bold text-white">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
