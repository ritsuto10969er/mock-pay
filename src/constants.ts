import { User } from '@/types';

export const COLORS = {
  primary: '#85409D', // Gentle Purple
  secondary: '#4D2B8C', // Deep Purple
  accent: '#EEA727', // Mustard Gold
  bgLight: '#F9FAFB', // Light Gray/White
  white: '#FFFFFF',
  textGray: '#6B7280',
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Walker', initials: 'AW' },
  { id: '2', name: 'Bob Johnson', initials: 'BJ' },
  { id: '3', name: 'Charlie Davis', initials: 'CD' },
  { id: '4', name: 'Diana Prince', initials: 'DP' },
];

export const INITIAL_BALANCE = 10000;
