import type { TrendPoint } from '@/types';

export default function RecoveryTrendChart({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) return null;

  const width = 520;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 36, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => Math.max(d.recovered, d.lost)), 1);
  const stepX = data.length > 1 ? chartW / (data.length - 1) : 0;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const buildPath = (key: 'recovered' | 'lost') => {
    return data
      .map((d, i) => {
        const x = padding.left + i * stepX;
        const y = padding.top + chartH - (d[key] / maxValue) * chartH;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  const buildArea = (key: 'recovered' | 'lost') => {
    const linePath = data
      .map((d, i) => {
        const x = padding.left + i * stepX;
        const y = padding.top + chartH - (d[key] / maxValue) * chartH;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
    const lastX = padding.left + (data.length - 1) * stepX;
    const firstX = padding.left;
    return `${linePath} L ${lastX} ${padding.top + chartH} L ${firstX} ${padding.top + chartH} Z`;
  };

  const yTicks = [0, 0.5, 1].map((t) => Math.round(maxValue * t));

  return (
    <div className="rounded-2xl border border-ink-600/60 bg-ink-800/80 p-5 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-white">Recovery Rate Trend</h3>
          <p className="mt-0.5 text-xs text-slate-500">Daily recovered vs lost transactions</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
            <span className="text-xs text-slate-400">Recovered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-danger-500" />
            <span className="text-xs text-slate-400">Lost</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto scrollbar-thin">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[400px]" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="recoveredGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lostGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((tick, i) => {
            const y = padding.top + chartH - (tick / maxValue) * chartH;
            return (
              <g key={i}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#1b263b" strokeWidth="1" />
                <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-slate-600 text-[10px]">
                  {tick}
                </text>
              </g>
            );
          })}

          <path d={buildArea('lost')} fill="url(#lostGrad)" />
          <path d={buildArea('recovered')} fill="url(#recoveredGrad)" />

          <path d={buildPath('lost')} fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d={buildPath('recovered')} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {data.map((d, i) => {
            const x = padding.left + i * stepX;
            return (
              <text key={i} x={x} y={height - 12} textAnchor="middle" className="fill-slate-600 text-[10px]">
                {formatDate(d.date)}
              </text>
            );
          })}

          {data.map((d, i) => {
            const x = padding.left + i * stepX;
            const yR = padding.top + chartH - (d.recovered / maxValue) * chartH;
            const yL = padding.top + chartH - (d.lost / maxValue) * chartH;
            return (
              <g key={i}>
                <circle cx={x} cy={yR} r="3.5" fill="#0a0e1a" stroke="#34d399" strokeWidth="2" />
                {d.lost > 0 && <circle cx={x} cy={yL} r="3" fill="#0a0e1a" stroke="#f87171" strokeWidth="2" />}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
