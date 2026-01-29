"use client";

import React from 'react';
import { Send, Clock, Wallet, CreditCard } from 'lucide-react';
import { Button } from './Button';
import { COLORS } from '@/constants';

interface HomeScreenProps {
  balance: number;
  onSend: () => void;
  onHistory: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ balance, onSend, onHistory }) => {
  return (
    <div className="h-full flex flex-col px-6">
      {/* Header */}
      <div className="mt-8 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: COLORS.secondary }}
          >
            MP
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Welcome back,</p>
            <h2 className="text-sm font-bold" style={{ color: COLORS.secondary }}>User</h2>
          </div>
        </div>
        <div className="p-2 bg-gray-50 rounded-full">
            <Wallet size={20} style={{ color: COLORS.primary }} />
        </div>
      </div>

      {/* Balance Card */}
      <div
        className="rounded-3xl p-8 mb-8 text-center shadow-xl shadow-purple-100 transform transition-transform hover:scale-[1.01]"
        style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)` }}
      >
        <p className="text-purple-200 text-sm font-medium mb-2">Total Balance</p>
        <h1 className="text-4xl font-bold text-white mb-2">
          ¥{balance.toLocaleString()}
        </h1>
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-xs text-white font-medium">Active Account</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={onSend}
          className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-purple-50 shadow-sm hover:shadow-md transition-all active:scale-95 group"
        >
          <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center bg-purple-50 group-hover:bg-purple-100 transition-colors">
            <Send size={24} style={{ color: COLORS.primary }} />
          </div>
          <span className="font-semibold text-gray-700">Send Money</span>
        </button>

        <button
          onClick={onHistory}
          className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-purple-50 shadow-sm hover:shadow-md transition-all active:scale-95 group"
        >
          <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center bg-orange-50 group-hover:bg-orange-100 transition-colors">
            <Clock size={24} style={{ color: COLORS.accent }} />
          </div>
          <span className="font-semibold text-gray-700">History</span>
        </button>
      </div>

      {/* Promotional / Info Area */}
      <div className="mt-auto mb-8 p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-white rounded-xl shadow-sm">
            <CreditCard size={20} className="text-gray-400" />
        </div>
        <div>
            <h3 className="text-sm font-bold text-gray-700">Mock Pay Pro</h3>
            <p className="text-xs text-gray-500">Upgrade for higher limits</p>
        </div>
      </div>
    </div>
  );
};
