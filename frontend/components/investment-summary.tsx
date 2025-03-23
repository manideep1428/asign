"use client";

import { useEffect, useMemo } from "react";
import { useMutualFundsStore } from "@/store/mutualFunds";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function InvestmentSummary() {
  const { funds, bestPerformingFund, worstPerformingFund, loading, error, fetchFunds } = useMutualFundsStore();

  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);

  // Calculate total investment and current values
  const investmentSummary = useMemo(() => {
    if (!funds.length) return { initialValue: 0, currentValue: 0, totalReturns: 0 };
    
    const initialValue = funds.reduce((sum, fund) => sum + fund.amount_invested, 0);
    
    // Calculate current value: initial investment + returns
    const currentValue = funds.reduce((sum, fund) => {
      const returnAmount = fund.amount_invested * (fund.returns_since / 100);
      return sum + fund.amount_invested + returnAmount;
    }, 0);
    
    // Calculate total returns percentage
    const totalReturns = initialValue > 0 ? ((currentValue - initialValue) / initialValue) * 100 : 0;
    
    return {
      initialValue,
      currentValue,
      totalReturns: parseFloat(totalReturns.toFixed(2))
    };
  }, [funds]);

  if (loading) return <p className="text-center text-gray-500">Loading investments...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Investment Value */}
      <Card className="bg-[#0f1c2e] border-none overflow-hidden relative">
        <div className="absolute left-2 top-4 h-12 w-1 bg-blue-400 rounded-sm"></div>
        <CardContent className="p-4 pl-6">
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 mb-1">Current</div>
            <div className="text-xs text-gray-500">Investment Value</div>
            <div className="text-2xl font-bold mt-2">
              ₹{investmentSummary.currentValue.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="absolute top-4 right-4 flex items-center text-xs">
            <div className={investmentSummary.totalReturns >= 0 ? "text-green-500 flex items-center" : "text-red-500 flex items-center"}>
              {investmentSummary.totalReturns >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              <span>{investmentSummary.totalReturns >= 0 ? "+" : ""}{investmentSummary.totalReturns}%</span>
            </div>
            <div className="text-xs text-gray-500 ml-1">Overall Return</div>
          </div>
        </CardContent>
      </Card>

      {/* Initial Investment Value */}
      <Card className="bg-[#0f1c2e] border-none overflow-hidden relative">
        <div className="absolute left-2 top-4 h-12 w-1 bg-blue-400 rounded-sm"></div>
        <CardContent className="p-4 pl-6">
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 mb-1">Initial</div>
            <div className="text-xs text-gray-500">Investment Value</div>
            <div className="text-2xl font-bold mt-2">
              ₹{investmentSummary.initialValue.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="absolute top-4 right-4 flex items-center text-gray-500 text-xs">
            <span>{funds.length} {funds.length === 1 ? 'Fund' : 'Funds'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Best Performing Scheme */}
      <Card className="bg-[#0f1c2e] border-none overflow-hidden relative">
        <div className="absolute left-2 top-4 h-12 w-1 bg-blue-400 rounded-sm"></div>
        <CardContent className="p-4 pl-6">
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 mb-1">Best</div>
            <div className="text-xs text-gray-500">Performing Scheme</div>
            <div className="text-lg font-bold mt-2 line-clamp-2">
              {bestPerformingFund?.mutual_fund || "N/A"}
            </div>
          </div>
          {bestPerformingFund && (
            <div className="absolute top-4 right-4 flex items-center text-green-500 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+{bestPerformingFund.returns_since}%</span>
              <div className="text-xs text-gray-500 ml-1">Return</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Worst Performing Scheme */}
      <Card className="bg-[#0f1c2e] border-none overflow-hidden relative">
        <div className="absolute left-2 top-4 h-12 w-1 bg-blue-400 rounded-sm"></div>
        <CardContent className="p-4 pl-6">
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 mb-1">Worst</div>
            <div className="text-xs text-gray-500">Performing Scheme</div>
            <div className="text-lg font-bold mt-2 line-clamp-2">
              {worstPerformingFund?.mutual_fund || "N/A"}
            </div>
          </div>
          {worstPerformingFund && (
            <div className="absolute top-4 right-4 flex items-center text-red-500 text-xs">
              <TrendingDown className="h-3 w-3 mr-1" />
              <span>{worstPerformingFund.returns_since}%</span>
              <div className="text-xs text-gray-500 ml-1">Return</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}