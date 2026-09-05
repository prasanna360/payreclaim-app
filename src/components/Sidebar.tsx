import { LayoutDashboard, BarChart3, Sparkles, ShieldCheck } from 'lucide-react';

type Page = 'dashboard' | 'analytics';

interface Props {
  current: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar({ current, onNavigate }: Props) {
  return (
    <aside className="flex h-full w-60 flex-col border-r border-ink-600/60 bg-ink-850/60 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-sky-500 shadow-glow">
          <ShieldCheck size={22} className="text-ink-900" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-white leading-none">PayReclaim</h1>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-brand-400">AI Recovery Engine</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 px-3">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">Menu</p>
        {navItems.map((item) => {
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group relative mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'text-slate-400 hover:bg-ink-700/50 hover:text-slate-200'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-400" />
              )}
              <item.icon size={18} strokeWidth={2} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mx-3 mb-4 rounded-xl border border-ink-600/50 bg-gradient-to-br from-ink-700/50 to-ink-800/50 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/15">
            <Sparkles size={16} className="text-brand-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">AI Engine Active</p>
            <p className="text-[10px] text-slate-500">Monitoring 24/7</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse-soft" />
          <span className="text-[10px] text-slate-500">Real-time recovery scoring</span>
        </div>
      </div>

      <div className="border-t border-ink-600/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-brand-500 text-xs font-bold text-ink-900">
            AD
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">Alex Demon</p>
            <p className="truncate text-[10px] text-slate-500">Merchant Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
