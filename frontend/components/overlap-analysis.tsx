"use client"

import { useEffect, useRef, useState } from "react"
import { useMutualFundsStore } from "@/store/mutualFunds"
import { useInvestmentStore } from "@/store/invesments"

export function OverlapAnalysis() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mutualFundsStore = useMutualFundsStore()
  const investmentStore = useInvestmentStore()
  const [isLoading, setIsLoading] = useState(true)

  // Calculate connections between funds and stocks
  const generateConnections = () => {
    const connections: { from: number; to: number; strength: number }[] = []
    
    // Map investment funds to their stocks and calculate connections
    investmentStore.funds.forEach((fund, fundIndex) => {
      // Get stock allocations for this fund
      const stockAllocations = fund.stock_allocation || {}
      
      // Map through all stocks in all funds to create a unique list
      const allStocks = investmentStore.funds.flatMap(investment => 
        investment.stock_allocation ? Object.keys(investment.stock_allocation) : []
      )
      
      // Create unique stock list
      const uniqueStocks = Array.from(new Set(allStocks))
      
      // For each stock in the fund, create a connection
      Object.entries(stockAllocations).forEach(([stockName, allocation]) => {
        const stockIndex = uniqueStocks.indexOf(stockName)
        if (stockIndex !== -1) {
          // Normalize allocation as a decimal (assuming it's a percentage)
          const strength = typeof allocation === 'number' ? allocation / 100 : 0.1
          connections.push({
            from: fundIndex,
            to: stockIndex,
            strength: strength
          })
        }
      })
    })
    
    return connections
  }

  useEffect(() => {
    // Load data from stores
    const loadData = async () => {
      // Fetch data from both stores
      await Promise.all([
        mutualFundsStore.fetchFunds(),
        investmentStore.fetchInvestments()
      ])
      setIsLoading(false)
    }
    
    loadData()
  }, [])

  useEffect(() => {
    if (isLoading) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharpness
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Get actual canvas drawing dimensions
    const canvasWidth = rect.width
    const canvasHeight = rect.height

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Generate colors for funds and stocks
    const generateColor = (index: number, isStock = false) => {
      const colors = [
        "#FF5733", "#33FF57", "#3357FF", "#F4C430", "#A020F0",
        "#E63946", "#457B9D", "#1D3557", "#F4A261", "#2A9D8F",
        "#E76F51", "#264653", "#6D597A", "#B5838D", "#FFB400"
      ]
      // Use different color palettes for funds and stocks
      const offset = isStock ? 5 : 0
      return colors[(index + offset) % colors.length]
    }

    // Get list of mutual funds from store
    const funds = mutualFundsStore.funds.map((fund, index) => ({
      name: fund.mutual_fund || `Fund ${index + 1}`,
      color: generateColor(index)
    }))

    // Extract stocks from investments
    const allStocks = investmentStore.funds.flatMap(fund => 
      fund.stock_allocation ? Object.keys(fund.stock_allocation) : []
    )
    const uniqueStocks = Array.from(new Set(allStocks))
    const stocks = uniqueStocks.map((stock, index) => ({
      name: stock,
      color: generateColor(index, true)
    }))

    // Generate connections between funds and stocks
    const connections = generateConnections()

    // Calculate maximum text width for funds and stocks
    ctx.font = "bold 14px Arial, sans-serif"
    let maxFundTextWidth = 0
    funds.forEach(fund => {
      const textWidth = ctx.measureText(fund.name).width
      maxFundTextWidth = Math.max(maxFundTextWidth, textWidth)
    })
    
    let maxStockTextWidth = 0
    stocks.forEach(stock => {
      const textWidth = ctx.measureText(stock.name).width
      maxStockTextWidth = Math.max(maxStockTextWidth, textWidth)
    })
    
    // Add padding to the text width to get box width
    const textPadding = 30
    const fundBoxWidth = maxFundTextWidth + textPadding
    const stockBoxWidth = maxStockTextWidth + textPadding
    
    // Calculate available space
    const margin = 50
    const centerSpaceWidth = canvasWidth - (2 * margin) - fundBoxWidth - stockBoxWidth
    
    // Position of stock boxes
    const stockBoxX = margin + fundBoxWidth + centerSpaceWidth
    
    // Adjust spacing for better layout
    const fundSpacing = Math.min(90, (canvasHeight - 100) / Math.max(1, funds.length))
    const stockSpacing = Math.min(60, (canvasHeight - 100) / Math.max(1, stocks.length))

    // Draw connections
    connections.forEach((conn) => {
      const fundY = 50 + conn.from * fundSpacing
      const stockY = 50 + conn.to * stockSpacing

      ctx.beginPath()
      ctx.moveTo(margin + fundBoxWidth, fundY)
      
      // Calculate control points for the bezier curve
      const controlPoint1X = margin + fundBoxWidth + centerSpaceWidth * 0.3
      const controlPoint2X = stockBoxX - centerSpaceWidth * 0.3
      
      ctx.bezierCurveTo(controlPoint1X, fundY, controlPoint2X, stockY, stockBoxX, stockY)
      if (funds[conn.from]) {
        ctx.strokeStyle = funds[conn.from].color
      } else {
        ctx.strokeStyle = "#999999" // Fallback color
      }
      ctx.lineWidth = conn.strength * 20
      ctx.globalAlpha = 0.6
      ctx.stroke()
      ctx.globalAlpha = 1.0
    })

    // Draw funds
    funds.forEach((fund, i) => {
      const y = 50 + i * fundSpacing
      
      // Create a rounded rectangle for better appearance
      const boxHeight = 36  // Increased from 30
      ctx.fillStyle = fund.color
      drawRoundedRect(ctx, margin, y - boxHeight/2, fundBoxWidth, boxHeight, 5)
      
      // Add an outline for better definition
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 1
      ctx.stroke()
      
      // Improve text rendering
      ctx.fillStyle = getContrastColor(fund.color)
      ctx.font = "bold 14px Arial, sans-serif"
      ctx.textBaseline = "middle"
      
      // Center text in the box
      const textX = margin + 15
      ctx.fillText(fund.name, textX, y)
    })

    // Draw stocks
    stocks.forEach((stock, i) => {
      const y = 50 + i * stockSpacing
      
      // Create a rounded rectangle
      const boxHeight = 32
      ctx.fillStyle = stock.color
      drawRoundedRect(ctx, stockBoxX, y - boxHeight/2, stockBoxWidth, boxHeight, 5)
      
      // Add an outline
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 1
      ctx.stroke()
      
      // Improve text rendering
      ctx.fillStyle = getContrastColor(stock.color)
      ctx.font = "bold 14px Arial, sans-serif"
      ctx.textBaseline = "middle"
      
      // Center text in the box
      const textX = stockBoxX + 10
      ctx.fillText(stock.name, textX, y)
    })
    
    // Helper function to draw rounded rectangles
    function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
      ctx.fill()
    }
    
    // Helper function to determine contrasting text color
    function getContrastColor(hexColor: string): string {
      // Convert hex to RGB
      const r = parseInt(hexColor.slice(1, 3), 16)
      const g = parseInt(hexColor.slice(3, 5), 16)
      const b = parseInt(hexColor.slice(5, 7), 16)
      
      // Calculate luminance - standard formula for perceived brightness
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      
      // Return white for dark colors, black for light colors
      return luminance > 0.5 ? "#000000" : "#FFFFFF"
    }
    
  }, [isLoading, mutualFundsStore.funds, investmentStore.funds])

  if (isLoading) {
    return (
      <div className="w-full h-[650px] bg-gray-900 rounded-lg overflow-hidden p-4 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-[650px] bg-gray-900 rounded-lg overflow-hidden p-4">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}