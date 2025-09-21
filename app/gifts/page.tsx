"use client"

import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import BottomNavigation from "@/components/bottom-navigation"

export default function GiftsPage() {
  const [giftCode, setGiftCode] = useState("")

  // Mock history data
  const historyData = [
    {
      id: 1,
      dateTime: "12-5-2025 12:12",
      amount: 200,
    },
    {
      id: 2,
      dateTime: "13-5-2025 09:30",
      amount: 150,
    },
    {
      id: 3,
      dateTime: "14-5-2025 18:45",
      amount: 300,
    },
  ]

  const handleRedeem = () => {
    if (giftCode.trim()) {
      // Handle gift code redemption logic here
      console.log("Redeeming gift code:", giftCode)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-950">
      {/* Header */}
      <div className="bg-red-950 px-5 py-4 flex items-center justify-between border-b border-red-800">
        <div className="w-6"></div>
        <h1 className="text-lg font-semibold text-white">Gift</h1>
        <X className="w-6 h-6 text-white cursor-pointer" />
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-red-900 to-red-950 min-h-screen">
        {/* Welcome Section */}
        <div className="px-6 pt-8 pb-6 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-3xl">🎁</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              <h2 className="text-xl font-medium text-white mb-2">Hi</h2>
              <p className="text-gray-300">We have a gift for you</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-xl">🪙</span>
            </div>
          </div>
        </div>

        {/* Gift Code Form */}
        <div className="px-6 pb-8">
          <h3 className="text-base font-medium text-white mb-6">Please enter the gift code below</h3>

          <div className="space-y-6">
            <Input
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
              placeholder="Please enter gift code"
              className="w-full h-12 bg-yellow-700/50 border-2 border-yellow-500 rounded-xl px-4 text-white placeholder:text-yellow-200 focus:border-yellow-400 focus:ring-0"
            />

            {/* Redeem Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleRedeem}
                className="bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold py-3 px-12 rounded-full text-base hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg border border-yellow-400 relative overflow-hidden"
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 rounded-full"></div>
                <div className="absolute top-1 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
                <span className="relative z-10 tracking-wide">Redeem</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="px-6 mb-6">
          <hr className="border-t-2 border-dotted border-yellow-500" />
        </div>

        {/* History Section */}
        <div className="px-6 pb-24">
          <h2 className="text-lg font-semibold text-white text-center mb-4">History</h2>

          <div className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-600/30">
            {historyData.map((item, index) => (
              <div key={item.id}>
                <div className="flex justify-between items-center py-3">
                  <span className="text-white text-sm">{item.dateTime}</span>
                  <span className="text-green-400 font-semibold text-sm">+{item.amount}</span>
                </div>
                {index < historyData.length - 1 && <hr className="border-t-2 border-dotted border-yellow-500/50" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
