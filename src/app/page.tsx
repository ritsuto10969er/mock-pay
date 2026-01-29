"use client";

import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { HomeScreen } from '@/components/HomeScreen';
import { TransferScreen } from '@/components/TransferScreen';
import { ConfirmationScreen } from '@/components/ConfirmationScreen';
import { CompletionScreen } from '@/components/CompletionScreen';
import { HistoryScreen } from '@/components/HistoryScreen';
import { Screen, User, Transaction, PendingTransaction } from '@/types';
import { INITIAL_BALANCE } from '@/constants';

export default function Home() {
  const [screen, setScreen] = useState<Screen>(Screen.HOME);
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [pendingTxn, setPendingTxn] = useState<PendingTransaction>({ amount: 0, recipient: null });

  const navigateTo = (nextScreen: Screen) => {
    setScreen(nextScreen);
  };

  const handleStartTransfer = (amount: number, recipient: User) => {
    setPendingTxn({ amount, recipient });
    navigateTo(Screen.CONFIRMATION);
  };

  const handleConfirmTransaction = () => {
    if (!pendingTxn.recipient || pendingTxn.amount <= 0) return;

    // Deduct Balance
    const newBalance = balance - pendingTxn.amount;
    setBalance(newBalance);

    // Add to History
    const newTxn: Transaction = {
      id: Date.now().toString(),
      amount: pendingTxn.amount,
      recipient: pendingTxn.recipient,
      date: new Date().toISOString(),
      type: 'debit',
    };
    setHistory(prev => [newTxn, ...prev]);

    navigateTo(Screen.COMPLETION);
  };

  const handleReset = () => {
    setPendingTxn({ amount: 0, recipient: null });
    navigateTo(Screen.HOME);
  };

  const renderScreen = () => {
    switch (screen) {
      case Screen.HOME:
        return (
          <HomeScreen
            balance={balance}
            onSend={() => navigateTo(Screen.TRANSFER)}
            onHistory={() => navigateTo(Screen.HISTORY)}
          />
        );
      case Screen.TRANSFER:
        return (
          <TransferScreen
            balance={balance}
            onBack={() => navigateTo(Screen.HOME)}
            onNext={handleStartTransfer}
          />
        );
      case Screen.CONFIRMATION:
        return (
          <ConfirmationScreen
            transaction={pendingTxn}
            currentBalance={balance}
            onConfirm={handleConfirmTransaction}
            onBack={() => navigateTo(Screen.TRANSFER)}
          />
        );
      case Screen.COMPLETION:
        return (
          <CompletionScreen
            amount={pendingTxn.amount}
            recipientName={pendingTxn.recipient?.name || 'Unknown'}
            onHome={handleReset}
          />
        );
      case Screen.HISTORY:
        return (
          <HistoryScreen
            history={history}
            onBack={() => navigateTo(Screen.HOME)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      {renderScreen()}
    </Layout>
  );
}
