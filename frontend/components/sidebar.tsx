'use client'

import { Home, Briefcase, BarChart2, PenToolIcon as Tool, FileText } from "lucide-react"
import { toast } from "sonner"


const handleToast = () => {
  toast("Work in progress")
}

export function Sidebar() {
  return (
    <div className="w-48 bg-black border-r border-gray-800 p-4 flex flex-col">
      <div className="mt-8 space-y-2">
        <div className="bg-gray-800 rounded p-3">
          <div className="text-sm font-medium hover:text-white cursor-pointer">PHA</div>
        </div>
        <div onClick={()=>handleToast} className="px-3 py-2 text-sm text-gray-400 hover:text-white cursor-pointer">Fund Analysis</div>
        <div  onClick={()=>handleToast} className="px-3 py-2 text-sm text-gray-400 hover:text-white cursor-pointer">Holdings</div>
        <div onClick={()=>handleToast} className="px-3 py-2 text-sm text-gray-400 hover:text-white cursor-pointer">Transactions</div>
      </div>
    </div>
  )
}

