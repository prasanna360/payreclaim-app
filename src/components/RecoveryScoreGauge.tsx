interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function RecoveryScoreGauge({ score, size = 'md', showLabel = false }: Props) {
  const dimensions = {
    sm: { box: 'h-9 w-9', text: 'text-[10px]', stroke: 3, r: 14 },
    md: { box: 'h-12 w-12', text: 'text-xs', stroke: 4, r: 18 },
    lg: { box: 'h-20 w-20', text: 'text-lg', stroke: 5, r: 30 },
  };
  const d = dimensions[size];
  const circumference = 2 * Math.PI * d.r;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 75 ? '#34d399' : score >= 50 ? '#fbbf24' : score >= 30 ? '#fb923c' : '#f87171';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative ${d.box} flex items-center justify-center`}>
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r={d.r} fill="none" stroke="#243049" strokeWidth={d.stroke} />
          <circle
            cx="20"
            cy="20"
            r={d.r}
            fill="none"
            stroke={color}
            strokeWidth={d.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className={`relative font-bold ${d.text}`} style={{ color }}>
          {score}
        </span>
      </div>
      {showLabel && <span className="text-[10px] font-medium text-slate-500">Recovery Score</span>}
    </div>
  );
}
