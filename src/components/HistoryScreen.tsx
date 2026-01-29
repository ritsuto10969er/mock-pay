"use client";

import React from 'react';
import { ArrowLeft, Search, Calendar } from 'lucide-react';
import { COLORS } from '@/constants';
import { Transaction } from '@/types';

interface HistoryScreenProps {
  history: Transaction[];
  onBack: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onBack }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-6 pt-4 pb-4 flex items-center justify-between bg-white z-10 sticky top-0">
        <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} color={COLORS.secondary} />
            </button>
            <h2 className="ml-4 text-lg font-bold" style={{ color: COLORS.secondary }}>History</h2>
        </div>
        <button className="p-2 bg-gray-50 rounded-full">
            <Search size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="flex-1 px-4 overflow-y-auto no-scrollbar pb-8">
        {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 pb-20">
                <Calendar size={48} strokeWidth={1.5} className="mb-4 text-gray-300" />
                <p>No recent transactions</p>
            </div>
        ) : (
            <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide px-2">Recent</h3>
                {history.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-sm font-bold text-gray-700">
                                {txn.recipient.initials}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 text-sm">{txn.recipient.name}</h4>
                                <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className="font-bold text-gray-900">- ¥{txn.amount.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
