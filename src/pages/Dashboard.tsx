import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Clock, Zap, Search, ChevronRight, ArrowUpDown } from 'lucide-react';
import type { Transaction, TxnStatus } from '@/types';
import { getStats } from '@/data';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import RecoveryScoreGauge from '@/components/RecoveryScoreGauge';

type SortKey = 'attemptedAt' | 'amount' | 'recoveryScore' | 'customerName';
type SortDir = 'asc' | 'desc';

interface Props {
  transactions: Transaction[];
  onSelectTransaction: (id: string) => void;
}

const statusFilters: (TxnStatus | 'All')[] = ['All', 'Pending', 'Recovery Sent', 'Recovered', 'Lost'];

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date('2026-09-05T12:00:00Z');
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'Yesterday';
  return `${diffD}d ago`;
}

export default function Dashboard({ transactions, onSelectTransaction }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TxnStatus | 'All'>('All');
  const [sortKey, setSortKey] = useState<SortKey>('attemptedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const stats = useMemo(() => getStats(transactions), [transactions]);

  const filtered = useMemo(() => {
    let result = transactions;
    if (statusFilter !== 'All') {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.customerName.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.failureReason.toLowerCase().includes(q) ||
          t.merchant.toLowerCase().includes(q),
      );
    }
    result = [...result].sort((a, b) => {
      let cmp: number;
      if (sortKey === 'amount') cmp = a.amount - b.amount;
      else if (sortKey === 'recoveryScore') cmp = a.recoveryScore - b.recoveryScore;
      else if (sortKey === 'customerName') cmp = a.customerName.localeCompare(b.customerName);
      else cmp = a.attemptedAt.localeCompare(b.attemptedAt);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [transactions, search, statusFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-white">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-400">
          Monitor failed payments and track AI-powered recovery performance
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Revenue Recovered"
          value={`$${stats.recoveredAmount.toLocaleString()}`}
          subValue={`${stats.recoveredCount} transactions`}
          icon={DollarSign}
          accent="brand"
          trend={{ value: '12.4%', positive: true }}
        />
        <StatCard
          label="Recovery Rate"
          value={`${stats.recoveryRate}%`}
          subValue="of all failed payments"
          icon={TrendingUp}
          accent="sky"
          trend={{ value: '3.2%', positive: true }}
        />
        <StatCard
          label="Pending Recovery"
          value={`${stats.pendingCount}`}
          subValue={`$${stats.pendingAmount.toLocaleString()} at stake`}
          icon={Clock}
          accent="warn"
        />
        <StatCard
          label="Avg Recovery Score"
          value={`${stats.avgScore}`}
          subValue="AI confidence rating"
          icon={Zap}
          accent="danger"
        />
      </div>

      <div className="rounded-2xl border border-ink-600/60 bg-ink-800/80 shadow-card">
        <div className="flex flex-col gap-4 border-b border-ink-600/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-white">Failed Transactions</h3>
            <p className="mt-0.5 text-xs text-slate-500">{filtered.length} transactions found</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search customer, ID, reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-ink-600/60 bg-ink-850/60 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/10 sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-5 pt-4">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/30'
                  : 'bg-ink-700/40 text-slate-400 hover:bg-ink-700/70 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-600/40 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">
                  <button onClick={() => toggleSort('customerName')} className="flex items-center gap-1 hover:text-slate-300">
                    Customer
                    <ArrowUpDown size={12} className={sortKey === 'customerName' ? 'text-brand-400' : 'text-slate-600'} />
                  </button>
                </th>
                <th className="px-5 py-3 font-medium">
                  <button onClick={() => toggleSort('amount')} className="flex items-center gap-1 hover:text-slate-300">
                    Amount
                    <ArrowUpDown size={12} className={sortKey === 'amount' ? 'text-brand-400' : 'text-slate-600'} />
                  </button>
                </th>
                <th className="px-5 py-3 font-medium">Failure Reason</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">
                  <button onClick={() => toggleSort('recoveryScore')} className="flex items-center gap-1 hover:text-slate-300">
                    Recovery Score
                    <ArrowUpDown size={12} className={sortKey === 'recoveryScore' ? 'text-brand-400' : 'text-slate-600'} />
                  </button>
                </th>
                <th className="px-5 py-3 font-medium">
                  <button onClick={() => toggleSort('attemptedAt')} className="flex items-center gap-1 hover:text-slate-300">
                    Time
                    <ArrowUpDown size={12} className={sortKey === 'attemptedAt' ? 'text-brand-400' : 'text-slate-600'} />
                  </button>
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => (
                <tr
                  key={txn.id}
                  onClick={() => onSelectTransaction(txn.id)}
                  className="group cursor-pointer border-b border-ink-700/30 transition-colors hover:bg-ink-700/30"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${txn.avatarColor} text-xs font-bold text-ink-900`}>
                        {txn.customerName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-200">{txn.customerName}</p>
                        <p className="truncate text-xs text-slate-500">{txn.id} · {txn.merchant}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-display text-sm font-semibold text-white">${txn.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-slate-300">{txn.failureReason}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={txn.status} size="sm" />
                  </td>
                  <td className="px-5 py-3.5">
                    <RecoveryScoreGauge score={txn.recoveryScore} size="sm" />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-slate-500">{formatTime(txn.attemptedAt)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <ChevronRight size={16} className="text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">No transactions match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
