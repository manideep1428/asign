"use client"

import { useInvestmentStore } from "@/store/invesments";
import { useEffect, useState } from "react"

export function SectorAllocation() {
  const investmentStore = useInvestmentStore()
  const [sectorData, setSectorData] = useState<{ name: string; value: string; amount: string; color: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Array of background colors for sectors
  const bgColors = [
    "bg-blue-200", "bg-green-200", "bg-purple-200", "bg-yellow-200", 
    "bg-indigo-200", "bg-pink-200", "bg-red-200", "bg-teal-200"
  ]

  useEffect(() => {
    const loadData = async () => {
      await investmentStore.fetchInvestments()
      setIsLoading(false)
    }
    
    loadData()
  }, [])

  useEffect(() => {
    if (isLoading) return
    
    // Combine sector allocations from all funds
    const combinedSectors: Record<string, number> = {}
    let totalInvestment = 0
    
    // Iterate through all funds and aggregate sector allocations
    investmentStore.funds.forEach(fund => {
      if (fund.sector_allocation) {
        Object.entries(fund.sector_allocation).forEach(([sector, allocation]) => {
          if (!combinedSectors[sector]) {
            combinedSectors[sector] = 0
          }
          combinedSectors[sector] += allocation
          totalInvestment += allocation
        })
      }
    })
    
    // Transform the data into the format required by the component
    const formattedData = Object.entries(combinedSectors)
      .map(([name, value], index) => {
        const percentage = ((value / totalInvestment) * 100).toFixed(1)
        // Format amount with Indian currency format
        const amount = `₹${Math.round(value).toLocaleString('en-IN')}`
        
        return {
          name,
          value: `${percentage}%`,
          amount,
          color: bgColors[index % bgColors.length]
        }
      })
      // Sort by value in descending order
      .sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
    
    // Add "Other Sectors" category if there are more than 5 sectors
    if (formattedData.length > 5) {
      const topSectors = formattedData.slice(0, 5)
      const otherSectors = formattedData.slice(5)
      
      // Calculate combined data for "Other Sectors"
      const otherValue = otherSectors.reduce((sum, sector) => sum + parseFloat(sector.value), 0)
      const otherAmount = otherSectors.reduce((sum, sector) => {
        const amountValue = parseInt(sector.amount.replace(/[₹,]/g, ''))
        return sum + amountValue
      }, 0)
      
      // Add "Other Sectors" to the list
      topSectors.push({
        name: "Other Sectors",
        value: `${otherValue.toFixed(1)}%`,
        amount: `₹${otherAmount.toLocaleString('en-IN')}`,
        color: bgColors[5 % bgColors.length]
      })
      
      setSectorData(topSectors)
    } else {
      setSectorData(formattedData)
    }
  }, [isLoading, investmentStore.funds])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg p-6 relative overflow-hidden animate-pulse h-32">
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sectorData.map((sector, index) => (
        <div key={index} className={`${sector.color} text-black rounded-lg p-6 relative overflow-hidden`}>
          <div className="text-gray-700 font-medium">{sector.name}</div>
          <div className="text-gray-700 text-sm mb-4">{sector.amount}</div>
          <div className="text-3xl font-bold">{sector.value}</div>
        </div>
      ))}
    </div>
  )
}