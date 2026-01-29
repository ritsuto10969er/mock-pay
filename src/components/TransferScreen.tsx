"use client";

import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, User as UserIcon } from 'lucide-react';
import { Button } from './Button';
import { COLORS, MOCK_USERS } from '@/constants';
import { User } from '@/types';

interface TransferScreenProps {
  balance: number;
  onBack: () => void;
  onNext: (amount: number, recipient: User) => void;
}

export const TransferScreen: React.FC<TransferScreenProps> = ({ balance, onBack, onNext }) => {
  const [amount, setAmount] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const numericAmount = parseFloat(amount);
  const isValidAmount = !isNaN(numericAmount) && numericAmount > 0 && numericAmount <= balance;
  const canProceed = isValidAmount && selectedUser !== null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-4 pb-4 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} color={COLORS.secondary} />
        </button>
        <h2 className="ml-4 text-lg font-bold" style={{ color: COLORS.secondary }}>Send Money</h2>
      </div>

      <div className="flex-1 px-6 pt-4">
        {/* Recipient Selector */}
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recipient</label>
        <div className="relative mb-8">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-purple-300 transition-colors"
          >
            {selectedUser ? (
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">
                    {selectedUser.initials}
                 </div>
                 <span className="font-semibold text-gray-800">{selectedUser.name}</span>
               </div>
            ) : (
                <span className="text-gray-400">Select a person</span>
            )}
            <ChevronDown size={20} className="text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-10 overflow-hidden">
                {MOCK_USERS.map(user => (
                    <button
                        key={user.id}
                        onClick={() => {
                            setSelectedUser(user);
                            setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-4 hover:bg-purple-50 transition-colors text-left border-b border-gray-50 last:border-0"
                    >
                         <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            {user.initials}
                         </div>
                        <span className="text-gray-700 font-medium">{user.name}</span>
                    </button>
                ))}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Amount</label>
        <div className="relative mb-2">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">¥</span>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-4 text-4xl font-bold text-gray-900 bg-transparent border-b-2 border-gray-200 focus:border-purple-500 focus:outline-none placeholder-gray-200 transition-colors"
            />
        </div>

        {/* Helper Text */}
        <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">Available: ¥{balance.toLocaleString()}</span>
            {numericAmount > balance && (
                <span className="text-sm text-red-500 font-medium">Insufficient funds</span>
            )}
        </div>

      </div>

      {/* Footer Action */}
      <div className="p-6">
        <Button
            fullWidth
            disabled={!canProceed}
            onClick={() => selectedUser && onNext(numericAmount, selectedUser)}
        >
            Review Transfer
        </Button>
      </div>
    </div>
  );
};
