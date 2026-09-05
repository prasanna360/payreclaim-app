import { useState } from 'react';
import type { Transaction, TxnStatus } from '@/types';
import { transactions as initialTransactions } from '@/data';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/pages/Dashboard';
import TransactionDetail from '@/pages/TransactionDetail';
import Analytics from '@/pages/Analytics';

type Page = 'dashboard' | 'analytics';

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedTxn = transactions.find((t) => t.id === selectedId) || null;

  const handleSelectTransaction = (id: string) => {
    setSelectedId(id);
  };

  const handleBack = () => {
    setSelectedId(null);
  };

  const handleSendRecovery = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newStatus: TxnStatus = t.status === 'Recovered' ? 'Recovered' : 'Recovery Sent';
        return {
          ...t,
          status: newStatus,
          recoverySentAt: t.recoverySentAt || new Date().toISOString(),
        };
      }),
    );
  };

  const handleNavigate = (p: Page) => {
    setSelectedId(null);
    setPage(p);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-ink-900 text-slate-200">
      {/* Background grid pattern */}
      <div className="pointer-events-none fixed inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 flex h-full w-full">
        {/* Sidebar — hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar current={page} onNavigate={handleNavigate} />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Mobile top bar */}
          <div className="flex items-center justify-between border-b border-ink-600/60 bg-ink-850/80 px-4 py-3 backdrop-blur-sm md:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-sky-500">
                <span className="font-display text-sm font-bold text-ink-900">P</span>
              </div>
              <span className="font-display text-base font-bold text-white">PayReclaim</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleNavigate('dashboard')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  page === 'dashboard' && !selectedTxn ? 'bg-brand-500/15 text-brand-400' : 'text-slate-400'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigate('analytics')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  page === 'analytics' ? 'bg-brand-500/15 text-brand-400' : 'text-slate-400'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>

          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {selectedTxn ? (
              <TransactionDetail
                transaction={selectedTxn}
                onBack={handleBack}
                onSendRecovery={handleSendRecovery}
              />
            ) : page === 'dashboard' ? (
              <Dashboard transactions={transactions} onSelectTransaction={handleSelectTransaction} />
            ) : (
              <Analytics transactions={transactions} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
