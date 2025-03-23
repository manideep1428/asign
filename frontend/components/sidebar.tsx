import Link from "next/link"
import { Home, Briefcase, BarChart2, PenToolIcon as Tool, FileText } from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-48 bg-black border-r border-gray-800 p-4 flex flex-col">
      <div className="mt-8 space-y-2">
        <div className="bg-gray-800 rounded p-3">
          <div className="text-sm font-medium">PHA</div>
        </div>
        <div className="px-3 py-2 text-sm text-gray-400">Fund Analysis</div>
        <div className="px-3 py-2 text-sm text-gray-400">Holdings</div>
        <div className="px-3 py-2 text-sm text-gray-400">Transactions</div>
      </div>
    </div>
  )
}

