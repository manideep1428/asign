import { create } from 'zustand';

interface InvestmentState {
  currentValue: number;
  initialValue: number;
  bestPerforming: {
    name: string;
    change: number;
  };
  worstPerforming: {
    name: string;
    change: number;
  };
}

export const useInvestmentStore = create<InvestmentState>((set) => ({
  currentValue: 575000,
  initialValue: 500000,
  bestPerforming: {
    name: 'ICICI Prudential Midcap Fund',
    change: 19,
  },
  worstPerforming: {
    name: 'Axis Flexi Cap Fund',
    change: -5,
  },
}));