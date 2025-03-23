"use client";

import { useEffect, useRef, useState } from "react";
import { useMutualFundsStore } from "@/store/mutualFunds";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";

Chart.register(...registerables);

interface TimeframeData {
  timeframe: string;
}

interface ChartDataPoint {
  date: Date;
  value: number;
}

interface Fund {
  amount_invested: number;
  returns_since: number;
}

export function PerformanceChart({ timeframeData }: { timeframeData: TimeframeData }): JSX.Element {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const { funds } = useMutualFundsStore();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (!funds.length) return;

    const generateChartData = (): ChartDataPoint[] => {
      const today = new Date();
      const dataPoints: ChartDataPoint[] = [];
      let numPoints = 30, intervalDays = 1;
      
      switch (timeframeData.timeframe) {
        case "3M": numPoints = 20; intervalDays = 4; break;
        case "6M": numPoints = 24; intervalDays = 7; break;
        case "1Y": numPoints = 12; intervalDays = 30; break;
        case "3Y": numPoints = 18; intervalDays = 60; break;
        case "MAX": numPoints = 24; intervalDays = 90; break;
        default: numPoints = 30; intervalDays = 1;
      }

      const avgReturnRate = funds.reduce((sum, fund) => sum + fund.returns_since, 0) / funds.length;
      const volatility = Math.abs(avgReturnRate) * 0.2;
      let totalInvestment = funds.reduce((sum, fund) => sum + fund.amount_invested, 0);
      
      for (let i = numPoints; i >= 0; i--) {
        const pointDate = new Date(today);
        pointDate.setDate(today.getDate() - i * intervalDays);
        const progress = i / numPoints;
        const randomFactor = 1 + ((Math.random() - 0.5) * volatility * 0.01);
        const linearGrowth = totalInvestment * (1 + (avgReturnRate / 100) * progress);
        const value = linearGrowth * randomFactor;
        
        dataPoints.push({ date: pointDate, value });
      }
      return dataPoints;
    };

    setChartData(generateChartData());
  }, [funds, timeframeData]);

  useEffect(() => {
    if (!chartRef.current || !chartData.length) return;
    
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;
    
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.4)");
    gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
    
    const data: ChartData<"line"> = {
      labels: chartData.map((point) => point.date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })),
      datasets: [{
        label: "Portfolio Value",
        data: chartData.map((point) => point.value),
        borderColor: "#10b981",
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
      }],
    };
    
    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#ccc" } },
        y: { ticks: { color: "#ccc", callback: (value) => `₹${value}` } },
      },
    };
    
    chartInstanceRef.current = new Chart(ctx, { type: "line", data, options });
  }, [chartData]);

  return (
    <div className="w-full h-full relative">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
}
