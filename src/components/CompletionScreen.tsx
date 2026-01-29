"use client";

import React from 'react';
import { Check, Share2 } from 'lucide-react';
import { Button } from './Button';
import { COLORS } from '@/constants';

interface CompletionScreenProps {
  amount: number;
  recipientName: string;
  onHome: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ amount, recipientName, onHome }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8 bg-white text-center relative overflow-hidden">

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[15%] left-[10%] w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-[15%] right-[10%] w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-8 shadow-lg shadow-green-50 animate-bounce-short">
                <Check size={48} className="text-green-600" strokeWidth={3} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Complete!</h2>
            <p className="text-gray-500 mb-8 max-w-[200px]">
                You successfully sent <strong className="text-gray-900">¥{amount.toLocaleString()}</strong> to {recipientName}.
            </p>

            <div className="w-full space-y-4">
                <Button fullWidth onClick={onHome}>
                    Done
                </Button>
                <Button fullWidth variant="ghost">
                    <span className="flex items-center gap-2">
                        <Share2 size={18} /> Share Receipt
                    </span>
                </Button>
            </div>
        </div>
    </div>
  );
};
