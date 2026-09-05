export type FailureReason =
  | 'Insufficient Funds'
  | 'OTP Timeout'
  | 'Network Drop'
  | 'Card Declined'
  | 'Expired Card'
  | 'Fraud Suspected';

export type TxnStatus = 'Pending' | 'Recovery Sent' | 'Recovered' | 'Lost';

export interface RecoveryMessage {
  channel: 'SMS' | 'Email';
  subject?: string;
  body: string;
  tone: string;
}

export interface Transaction {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  avatarColor: string;
  amount: number;
  currency: string;
  merchant: string;
  productDescription: string;
  failureReason: FailureReason;
  status: TxnStatus;
  recoveryScore: number;
  attemptedAt: string; // ISO date
  recoverySentAt: string | null;
  recoveredAt: string | null;
  aiReasoning: string;
  recoveryMessage: RecoveryMessage;
}

export interface FailureSummary {
  reason: FailureReason;
  count: number;
  recovered: number;
  lost: number;
  pending: number;
  amount: number;
}

export interface TrendPoint {
  date: string;
  recovered: number;
  lost: number;
}
