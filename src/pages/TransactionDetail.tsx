import { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Package,
  CreditCard,
  Calendar,
  Copy,
  Check,
} from 'lucide-react';
import type { Transaction, TxnStatus } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import RecoveryScoreGauge from '@/components/RecoveryScoreGauge';

interface Props {
  transaction: Transaction;
  onBack: () => void;
  onSendRecovery: (id: string) => void;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const reasonColors: Record<string, string> = {
  'Insufficient Funds': 'text-danger-400 bg-danger-500/10',
  'OTP Timeout': 'text-brand-400 bg-brand-500/10',
  'Network Drop': 'text-sky-400 bg-sky-500/10',
  'Card Declined': 'text-warn-400 bg-warn-500/10',
  'Expired Card': 'text-violet-400 bg-violet-500/10',
  'Fraud Suspected': 'text-orange-400 bg-orange-500/10',
};

export default function TransactionDetail({ transaction: txn, onBack, onSendRecovery }: Props) {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(txn.status === 'Recovery Sent' || txn.status === 'Recovered');

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      onSendRecovery(txn.id);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(txn.recoveryMessage.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const detailRows = [
    { icon: Package, label: 'Product', value: txn.productDescription },
    { icon: CreditCard, label: 'Merchant', value: txn.merchant },
    { icon: Calendar, label: 'Attempted', value: formatDateTime(txn.attemptedAt) },
    ...(txn.recoverySentAt ? [{ icon: Send, label: 'Recovery Sent', value: formatDateTime(txn.recoverySentAt) }] : []),
    ...(txn.recoveredAt ? [{ icon: CheckCircle2, label: 'Recovered', value: formatDateTime(txn.recoveredAt) }] : []),
  ];

  const reasonClass = reasonColors[txn.failureReason] || 'text-slate-400 bg-slate-500/10';

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-brand-400"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${txn.avatarColor} text-lg font-bold text-ink-900`}>
            {txn.customerName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">{txn.customerName}</h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="font-mono text-xs text-slate-500">{txn.id}</span>
              <span className="text-slate-600">·</span>
              <span>{txn.customerEmail}</span>
              <span className="text-slate-600">·</span>
              <span>{txn.customerPhone}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Amount</p>
            <p className="font-display text-3xl font-bold text-white">${txn.amount.toFixed(2)}</p>
          </div>
          <RecoveryScoreGauge score={txn.recoveryScore} size="lg" showLabel />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column — details + AI reasoning */}
        <div className="space-y-5 lg:col-span-2">
          {/* Transaction details card */}
          <div className="rounded-2xl border border-ink-600/60 bg-ink-800/80 p-5 shadow-card">
            <h3 className="mb-4 font-display text-base font-semibold text-white">Transaction Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {detailRows.map((row, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-700/50">
                    <row.icon size={15} className="text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{row.label}</p>
                    <p className="mt-0.5 text-sm text-slate-200">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Reasoning card */}
          <div className="rounded-2xl border border-brand-500/20 bg-gradient-to-br from-ink-800/80 to-ink-850/80 p-5 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/15">
                <Sparkles size={16} className="text-brand-400" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-white">AI Failure Analysis</h3>
                <p className="text-xs text-slate-500">Classified by PayReclaim AI Engine</p>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${reasonClass}`}>
                <AlertTriangle size={14} />
                {txn.failureReason}
              </div>
              <StatusBadge status={txn.status as TxnStatus} />
            </div>

            <div className="rounded-xl border border-ink-600/40 bg-ink-900/40 p-4">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp size={14} className="text-brand-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">AI Reasoning</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{txn.aiReasoning}</p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-ink-600/40 bg-ink-900/40 p-3 text-center">
                <p className="text-xs text-slate-500">Recovery Score</p>
                <p className={`mt-1 font-display text-xl font-bold ${
                  txn.recoveryScore >= 75 ? 'text-brand-400' : txn.recoveryScore >= 50 ? 'text-warn-400' : 'text-danger-400'
                }`}>{txn.recoveryScore}</p>
              </div>
              <div className="rounded-lg border border-ink-600/40 bg-ink-900/40 p-3 text-center">
                <p className="text-xs text-slate-500">Channel</p>
                <p className="mt-1 flex items-center justify-center gap-1.5 font-display text-xl font-bold text-sky-400">
                  {txn.recoveryMessage.channel === 'Email' ? <Mail size={18} /> : <MessageSquare size={18} />}
                  {txn.recoveryMessage.channel}
                </p>
              </div>
              <div className="rounded-lg border border-ink-600/40 bg-ink-900/40 p-3 text-center">
                <p className="text-xs text-slate-500">Tone</p>
                <p className="mt-1 text-xs font-medium text-slate-300">{txn.recoveryMessage.tone}</p>
              </div>
            </div>
          </div>

          {/* Recovery message card */}
          <div className="rounded-2xl border border-ink-600/60 bg-ink-800/80 p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15">
                  {txn.recoveryMessage.channel === 'Email' ? <Mail size={16} className="text-sky-400" /> : <MessageSquare size={16} className="text-sky-400" />}
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">AI-Generated Recovery Message</h3>
                  <p className="text-xs text-slate-500">Personalized {txn.recoveryMessage.channel.toLowerCase()} draft</p>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-ink-600/60 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:border-ink-500 hover:text-slate-200"
              >
                {copied ? <Check size={14} className="text-brand-400" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="rounded-xl border border-ink-600/40 bg-ink-900/40 p-4">
              {txn.recoveryMessage.subject && (
                <div className="mb-3 border-b border-ink-600/30 pb-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Subject</p>
                  <p className="mt-1 text-sm font-semibold text-slate-200">{txn.recoveryMessage.subject}</p>
                </div>
              )}
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">Message</p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">{txn.recoveryMessage.body}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSend}
                disabled={sent || sending}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  sent
                    ? 'cursor-default bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/30'
                    : sending
                      ? 'cursor-wait bg-brand-500/20 text-brand-300'
                      : 'bg-gradient-to-r from-brand-500 to-brand-600 text-ink-900 shadow-glow hover:from-brand-400 hover:to-brand-500'
                }`}
              >
                {sent ? (
                  <>
                    <CheckCircle2 size={18} />
                    Recovery Sent
                  </>
                ) : sending ? (
                  <>
                    <Clock size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Recovery
                  </>
                )}
              </button>
              {!sent && !sending && (
                <p className="text-xs text-slate-500">
                  Send via {txn.recoveryMessage.channel} to {txn.recoveryMessage.channel === 'Email' ? txn.customerEmail : txn.customerPhone}
                </p>
              )}
              {sent && (
                <p className="text-xs text-brand-400">Recovery message delivered successfully</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column — sidebar info */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-ink-600/60 bg-ink-800/80 p-5 shadow-card">
            <h3 className="mb-4 font-display text-sm font-semibold text-white">Customer Profile</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Name</span>
                <span className="font-medium text-slate-200">{txn.customerName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-200">{txn.customerEmail}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Phone</span>
                <span className="font-medium text-slate-200">{txn.customerPhone}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-ink-600/60 bg-ink-800/80 p-5 shadow-card">
            <h3 className="mb-4 font-display text-sm font-semibold text-white">Failure Classification</h3>
            <div className={`mb-3 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${reasonClass}`}>
              <AlertTriangle size={15} />
              {txn.failureReason}
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <p>This failure type has been classified by the AI engine based on:</p>
              <ul className="space-y-1.5 pl-1">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                  Transaction metadata & error codes</li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                  Customer behavioral signals</li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                  Historical recovery patterns</li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                  Purchase intent scoring</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-ink-600/60 bg-ink-800/80 p-5 shadow-card">
            <h3 className="mb-4 font-display text-sm font-semibold text-white">Recovery Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-danger-500/15 text-danger-400">
                    <AlertTriangle size={13} />
                  </div>
                  <div className="mt-1 h-full w-px bg-ink-600" />
                </div>
                <div className="pb-2">
                  <p className="text-xs font-medium text-slate-200">Payment Failed</p>
                  <p className="text-[10px] text-slate-500">{formatDateTime(txn.attemptedAt)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    txn.recoverySentAt || sent ? 'bg-sky-500/15 text-sky-400' : 'bg-ink-700/50 text-slate-600'
                  }`}>
                    <Send size={13} />
                  </div>
                  <div className="mt-1 h-full w-px bg-ink-600" />
                </div>
                <div className="pb-2">
                  <p className="text-xs font-medium text-slate-200">Recovery Sent</p>
                  <p className="text-[10px] text-slate-500">
                    {txn.recoverySentAt ? formatDateTime(txn.recoverySentAt) : sent ? 'Just now' : 'Pending'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    txn.status === 'Recovered' ? 'bg-brand-500/15 text-brand-400' : 'bg-ink-700/50 text-slate-600'
                  }`}>
                    <CheckCircle2 size={13} />
                  </div>
                </div>
                <div>
                  <p className={`text-xs font-medium ${txn.status === 'Recovered' ? 'text-slate-200' : 'text-slate-600'}`}>
                    {txn.status === 'Recovered' ? 'Payment Recovered' : txn.status === 'Lost' ? 'Marked as Lost' : 'Awaiting Recovery'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {txn.recoveredAt ? formatDateTime(txn.recoveredAt) : txn.status === 'Lost' ? 'Recovery abandoned' : 'In progress'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
