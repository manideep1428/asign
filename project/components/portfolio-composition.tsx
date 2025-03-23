import { InfoIcon } from "lucide-react"
import { SectorAllocation } from "./sector-allocation"
import { OverlapAnalysis } from "./overlap-analysis"

export function PortfolioComposition() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-medium mb-4">Sector Allocation</h2>
        <SectorAllocation />
      </div>

      <div>
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-medium">Overlap Analysis</h2>
          <InfoIcon className="h-4 w-4 ml-2 text-gray-500" />
        </div>

        <div className="text-sm text-gray-400 mb-4">
          <p>Comparing : Motilal Large Cap Fund and Nippon Large Cap Fund</p>
          <div className="flex items-center mt-2">
            <span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span>
            <p>X Stocks Overlap across these funds.</p>
          </div>
          <div className="flex items-center mt-1">
            <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
            <p>Y% Average Overlap in holdings.</p>
          </div>
        </div>

        <OverlapAnalysis />
      </div>
    </div>
  )
}

