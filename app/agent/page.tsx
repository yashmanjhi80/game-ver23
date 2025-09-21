"use client"

import { useState } from "react"
import BottomNavigation from "@/components/bottom-navigation"
import TabNavigation from "@/components/tab-navigation"
import AgentContent from "@/components/agent-content"

export default function AgentPage() {
  const [activeTab, setActiveTab] = useState<string>("details")

  return (
    <div className="min-h-screen bg-linear-65 from-burgundy-800 to-burgundy-960 text-white pb-20">
      <main className="max-w-md mx-auto">
        <div className="px-4 py-4 bg-black/70 border-b border-yellow-500/20">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="space-y-0">
          <AgentContent activeTab={activeTab} />
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
