import { useMemo } from 'react';
import { DollarSign, TrendingUp, Percent, Target, Award, AlertTriangle } from 'lucide-react';
import type { Transaction } from '@/types';
import { getStats, getFailureSummaries, getTrendData } from '@/data';
import StatCard from '@/components/StatCard';
import FailureReasonChart from '@/components/FailureReasonChart';
import RevenueDonut from '@/components/RevenueDonut';
import RecoveryTrendChart from '@/components/RecoveryTrendChart';

interface Props {
  transactions: Transaction[];
}

const reasonColors: Record<string, string> = {
  'Insufficient Funds': '#f87171',
  'OTP Timeout': '#34d399',
  'Network Drop': '#38bdf8',
  'Card Declined': '#fbbf24',
  'Expired Card': '#a78bfa',
  'Fraud Suspected': '#fb923c',
};

export default function Analytics({ transactions }: Props) {
  const stats = useMemo(() => getStats(transactions), [transactions]);
  const failureData = useMemo(() => getFailureSummaries(transactions), [transactions]);
  const trendData = useMemo(() => getTrendData(transactions), [transactions]);

  const totalAtRisk = stats.recoveredAmount + stats.lostAmount + stats.pendingAmount;

  const bestRecovery = useMemo(() => {
    return [...failureData]
      .filter((d) => d.count > 0)
      .sort((a, b) => {
        const aRate = a.count > 0 ? a.recovered / a.count : 0;
        const bRate = b.count > 0 ? b.recovered / b.count : 0;
        return bRate - aRate;
      })
      .slice(0, 3);
  }, [failureData]);

  const worstRecovery = useMemo(() => {
    return [...failureData]
      .filter((d) => d.count > 0)
      .sort((a, b) => {
        const aRate = a.count > 0 ? a.lost / a.count : 0;
        const bRate = b.count > 0 ? b.lost / b.count : 0;
        return bRate - aRate;
      })
      .slice(0, 3);
  }, [failureData]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-white">Analytics & Insights</h2>
        <p className="mt-1 text-sm text-slate-400">
          Deep dive into recovery performance and failure patterns
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Recovered"
          value={`$${stats.recoveredAmount.toLocaleString()}`}
          subValue={`${stats.recoveredCount} transactions`}
          icon={DollarSign}
          accent="brand"
          trend={{ value: '12.4%', positive: true }}
        />
        <StatCard
          label="Total Lost"
          value={`$${stats.lostAmount.toLocaleString()}`}
          subValue={`${stats.lostCount} transactions`}
          icon={TrendingUp}
          accent="danger"
          trend={{ value: '2.1%', positive: false }}
        />
        <StatCard
          label="Recovery Rate"
          value={`${stats.recoveryRate}%`}
          subValue="recovered / total failed"
          icon={Percent}
          accent="sky"
        />
        <StatCard
          label="Total at Risk"
          value={`$${totalAtRisk.toLocaleString()}`}
          subValue={`${stats.total} failed payments`}
          icon={Target}
          accent="warn"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RevenueDonut recovered={stats.recoveredAmount} lost={stats.lostAmount} />
        <FailureReasonChart data={failureData} />
      </div>

      <div className="mb-6">
        <RecoveryTrendChart data={trendData} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Best recovery types */}
        <div className="rounded-2xl border border-ink-600/60 bg-ink-800/80 p-5 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/15">
              <Award size={16} className="text-brand-400" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white">Best Recovery Rates</h3>
              <p className="text-xs text-slate-500">Failure types with highest recovery success</p>
            </div>
          </div>
          <div className="space-y-3">
            {bestRecovery.map((item) => {
              const rate = item.count > 0 ? Math.round((item.recovered / item.count) * 100) : 0;
              return (
                <div key={item.reason} className="flex items-center gap-3 rounded-xl border border-ink-600/40 bg-ink-900/40 p-3">
                  <span className="h-8 w-8 shrink-0 rounded-lg" style={{ backgroundColor: reasonColors[item.reason] + '20' }}>
                    <span className="flex h-full w-full items-center justify-center rounded-lg" style={{ backgroundColor: reasonColors[item.reason] + '15' }}>
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: reasonColors[item.reason] }} />
                    </span>
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{item.reason}</p>
                    <p className="text-xs text-slate-500">{item.recovered} of {item.count} recovered</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-brand-400">{rate}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Worst recovery types */}
        <div className="rounded-2xl border border-ink-600/60 bg-ink-800/80 p-5 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger-500/15">
              <AlertTriangle size={16} className="text-danger-400" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white">Hardest to Recover</h3>
              <p className="text-xs text-slate-500">Failure types with highest loss rates</p>
            </div>
          </div>
          <div className="space-y-3">
            {worstRecovery.map((item) => {
              const rate = item.count > 0 ? Math.round((item.lost / item.count) * 100) : 0;
              return (
                <div key={item.reason} className="flex items-center gap-3 rounded-xl border border-ink-600/40 bg-ink-900/40 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: reasonColors[item.reason] + '15' }}>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: reasonColors[item.reason] }} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{item.reason}</p>
                    <p className="text-xs text-slate-500">{item.lost} of {item.count} lost</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-danger-400">{rate}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
