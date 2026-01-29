export enum Screen {
  HOME = 'HOME',
  TRANSFER = 'TRANSFER',
  CONFIRMATION = 'CONFIRMATION',
  COMPLETION = 'COMPLETION',
  HISTORY = 'HISTORY',
}

export interface User {
  id: string;
  name: string;
  initials: string;
}

export interface Transaction {
  id: string;
  amount: number;
  recipient: User;
  date: string; // ISO string
  type: 'debit' | 'credit';
}

// Temporary state to hold transfer details before confirmation
export interface PendingTransaction {
  amount: number;
  recipient: User | null;
}
