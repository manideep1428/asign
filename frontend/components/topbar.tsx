"use client"
import Link from 'next/link'
import { Bell, Search, Users, LogOut } from "lucide-react"
import React from 'react'
import { usePathname } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
export default function Topbar() {
  const pathName = usePathname();
  
  const handleToast = () => {
    toast({title: "Work in Progress by developer" ,
      description: "Please wait for the feature to be implemented",
      duration: 5000,
      variant: "destructive"
    })
  }

  return (
    <header className="border-b border-gray-800 bg-black py-4 relative z-10">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Image src="/logo.svg" alt="logo" width={24} height={24} />
          <nav className="flex items-center space-x-6  px-10">
            <Link href="/" className={`text-sm font-bold ${pathName === "/" ? "border-b-2 border-blue-500 -2" : "text-gray-400 hover:text-white"}`}>
              Home
            </Link>
            <Link href="/portfolio" className={`text-sm font-bold ${pathName === "/portfolio" ? "border-b-2 border-blue-500 " : "text-gray-400 hover:text-white"}`}>
              Portfolio
            </Link>
            <Link href="/mutual-funds" onClick={()=>handleToast()} className={`text-sm font-bold ${pathName === "/mutual-funds" ? "border-b-2 border-blue-500 " : "text-gray-400 hover:text-white"}`}>
              Mutual Funds
            </Link>
            <Link href="/tools" onClick={()=>handleToast()}  className={`text-sm font-bold ${pathName === "/tools" ? "border-b-2 border-blue-500 " : "text-gray-400 hover:text-white"}`}>
              Tools
            </Link>
            <Link href="/transactions" onClick={()=>handleToast()}  className={`text-sm font-bold ${pathName === "/transactions" ? "border-b-2 border-blue-500 " : "text-gray-400 hover:text-white"}`}>
              Transactions
            </Link>
          </nav>

        </div>
        <div className="flex items-center space-x-4 gap-4">
          <button className="text-gray-400 hover:text-white">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-white relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"> </span>
          </button>
          <button className="text-gray-400 hover:text-white">
            <Users className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}



export function ButtonBorder(){
  return (
    <span className="absolute -top-2 border-b-2 border-blue-500"></span>
  )
}