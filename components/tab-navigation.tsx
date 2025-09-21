"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, FileText } from "lucide-react"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const tabs = [
    { id: "details", label: "Details", icon: TrendingUp },
    { id: "commission", label: "Commission", icon: DollarSign },
    { id: "rules", label: "Rules", icon: FileText },
  ]

  return (
    <div className="p-0.5 w-full">
      <div className="flex gap-2 px-0.5 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <Button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
            flex items-center gap-0.5 rounded-md text-xs font-small transition-all
            ${
              isActive
                ? "bg-red-600 text-white shadow-sm px-5 py-1"
                : "bg-[#3a1010] text-white/70 hover:bg-[#4a1515] hover:text-white px-2 py-1"
            }
          `}
            >
              <Icon className={`w-1 h-1 ${isActive ? "text-white" : "text-white/70"}`} />
              <span>{tab.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default TabNavigation
