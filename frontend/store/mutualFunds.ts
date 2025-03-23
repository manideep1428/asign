import { create } from "zustand";
import axios from "axios";

export interface MutualFund {
  id: string;
  user_id: string;
  mutual_fund: string;
  investment_date: string;
  amount_invested: number;
  isn: string;
  nav_at_investment: number;
  returns_since: number;
}

interface MutualFundsState {
  funds: MutualFund[];
  bestPerformingFund: MutualFund | null;
  worstPerformingFund: MutualFund | null;
  loading: boolean;
  error: string | null;
  fetchFunds: () => Promise<void>;
}

export const useMutualFundsStore = create<MutualFundsState>((set) => ({
  funds: [],
  bestPerformingFund: null,
  worstPerformingFund: null,
  loading: false,
  error: null,

  fetchFunds: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get<MutualFund[]>("http://localhost:8000/api/mutual-funds");
      const data = response.data;
      
      if (data.length === 0) {
        set({ funds: data, bestPerformingFund: null, worstPerformingFund: null, loading: false });
        return;
      }
      
      // Determine the worst (lowest returns) and best (highest returns) performing funds
      const worstFund = data.reduce((prev, curr) => (curr.returns_since < prev.returns_since ? curr : prev), data[0]);
      const bestFund = data.reduce((prev, curr) => (curr.returns_since > prev.returns_since ? curr : prev), data[0]);

      set({ funds: data, bestPerformingFund: bestFund, worstPerformingFund: worstFund, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
