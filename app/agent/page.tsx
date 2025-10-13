"use client"

import { useState } from "react"
import BottomNavigation from "@/components/bottom-navigation"
import TabNavigation from "@/components/tab-navigation"
import AgentContent from "@/components/agent-content"
import { Toaster } from "react-hot-toast"

export default function AgentPage() {
  const [activeTab, setActiveTab] = useState<string>("details")

  return (
    <div className="min-h-screen bg-linear-65 from-burgundy-800 to-burgundy-960 text-white pb-20">
      <Toaster position="top-center" toastOptions={{
        success: {
          style: {
            background: 'rgba(34, 197, 94, 0.6)',
            color: 'white',
          },
        },
        error: {
          style: {
            background: 'rgba(239, 68, 68, 0.6)',
            color: 'white',
          },
        },
      }} />
      <main className="max-w-md mx-auto">
        <div className=" bg-red-900/40">
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
