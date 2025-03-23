"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PerformanceChart } from "./performance-chart"
import { useMutualFundsStore } from "@/store/mutualFunds"

export function PerformanceMetrics() {
  const [timeframe, setTimeframe] = useState("1M")
  const { funds, loading, error } = useMutualFundsStore()

  // Calculate performance metrics based on the funds data
  const performanceData = useMemo(() => {
    if (!funds.length) return { currentValue: 0, profit: 0, profitPercentage: 0 }
    
    const initialInvestment = funds.reduce((sum, fund) => sum + fund.amount_invested, 0)
    
    // Calculate current value
    const currentValue = funds.reduce((sum, fund) => {
      const returnAmount = fund.amount_invested * (fund.returns_since / 100)
      return sum + fund.amount_invested + returnAmount
    }, 0)
    
    const profit = currentValue - initialInvestment
    const profitPercentage = initialInvestment > 0 ? (profit / initialInvestment) * 100 : 0
    
    return {
      currentValue: Math.round(currentValue),
      profit: Math.round(profit),
      profitPercentage: parseFloat(profitPercentage.toFixed(2))
    }
  }, [funds])

  // Generate chart data based on selected timeframe
  const getTimeframeData = (period:any ) => {
    // In a real implementation, this would filter/adjust data based on the selected timeframe
    // For now, we're just passing the timeframe to the chart component
    return { timeframe: period }
  }

  if (loading) return <div className="space-y-6"><p className="text-center text-gray-500">Loading performance data...</p></div>
  if (error) return <div className="space-y-6"><p className="text-center text-red-500">Error: {error}</p></div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-4">Performance Summary</h2>
        <Card className="bg-[#111111] border-none px-5 w-fit overflow-hidden relative">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ₹{performanceData.currentValue.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center mt-1">
              <span className={performanceData.profit >= 0 ? "text-green-500 text-sm mr-2" : "text-red-500 text-sm mr-2"}>
                {performanceData.profit >= 0 ? '₹' : '-₹'}
                {Math.abs(performanceData.profit).toLocaleString('en-IN')}
              </span>
              <span className="text-gray-400">|</span>
              <span className={performanceData.profitPercentage >= 0 ? "text-green-500 text-sm ml-2" : "text-red-500 text-sm ml-2"}>
                {performanceData.profitPercentage >= 0 ? '+' : ''}
                {performanceData.profitPercentage}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="h-[300px]">
        <PerformanceChart timeframeData={getTimeframeData(timeframe)} />
      </div>

      <div className="flex justify-center space-x-2">
        {["1M", "3M", "6M", "1Y", "3Y", "MAX"].map((period) => (
          <Button
            key={period}
            variant={timeframe === period ? "default" : "outline"}
            className={`rounded-md px-4 py-1 h-8 ${
              timeframe === period
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-transparent text-gray-400 hover:text-white"
            }`}
            onClick={() => setTimeframe(period)}
          >
            {period}
          </Button>
        ))}
      </div>
    </div>
  )
}