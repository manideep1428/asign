import { BACKEND_URL } from "@/config"
import axios from "axios"
import { create } from "zustand"

type StockAllocation = Record<string, number>
type SectorAllocation = Record<string, number>
type MarketCapAllocation = Record<string, number>

interface FundData {
  id: string
  investment_id: string
  sector_allocation: SectorAllocation
  stock_allocation: StockAllocation
  market_cap_allocation: MarketCapAllocation
}

interface InvestmentStore {
  funds: FundData[]
  fetchInvestments: () => Promise<void>
}

export const useInvestmentStore = create<InvestmentStore>((set) => ({
  funds: [],
  fetchInvestments: async () => {
    try {
      const response = await axios.get<FundData[]>("/api/investments" ,
      )
      const data: FundData[] = response.data
      set({ funds: data })
    } catch (error) {
      console.error("Failed to fetch investments:", error)
    }
  }
}))
