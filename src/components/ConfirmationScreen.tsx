"use client";

import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { COLORS } from '@/constants';
import { PendingTransaction } from '@/types';

interface ConfirmationScreenProps {
  transaction: PendingTransaction;
  currentBalance: number;
  onConfirm: () => void;
  onBack: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  transaction,
  currentBalance,
  onConfirm,
  onBack
}) => {
  if (!transaction.recipient) return null;

  const newBalance = currentBalance - transaction.amount;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-6 pt-4 pb-4 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} color={COLORS.secondary} />
        </button>
        <h2 className="ml-4 text-lg font-bold" style={{ color: COLORS.secondary }}>Review</h2>
      </div>

      <div className="flex-1 px-6 pt-4 flex flex-col items-center">

        {/* Avatar Bubble */}
        <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4 shadow-inner">
            <span className="text-2xl font-bold text-purple-700">{transaction.recipient.initials}</span>
        </div>

        <p className="text-gray-500 text-sm mb-1">Sending to</p>
        <h3 className="text-xl font-bold text-gray-900 mb-8">{transaction.recipient.name}</h3>

        <h1 className="text-5xl font-bold mb-8" style={{ color: COLORS.secondary }}>
            ¥{transaction.amount.toLocaleString()}
        </h1>

        {/* Details Card */}
        <div className="w-full bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
            <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Current Balance</span>
                <span className="font-medium text-gray-900">¥{currentBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Amount to Send</span>
                <span className="font-medium text-red-500">- ¥{transaction.amount.toLocaleString()}</span>
            </div>
            <div className="h-px bg-gray-200 w-full my-2"></div>
            <div className="flex justify-between items-center">
                <span className="text-gray-900 font-semibold text-sm">Balance After</span>
                <span className="font-bold text-gray-900">¥{newBalance.toLocaleString()}</span>
            </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-center gap-2 mb-4 text-gray-400">
            <ShieldCheck size={16} />
            <span className="text-xs">Secure Transaction</span>
        </div>
        <Button fullWidth onClick={onConfirm}>
            Confirm & Send
        </Button>
      </div>
    </div>
  );
};
