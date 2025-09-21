"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Crown, Coins, Gift, CreditCard, Gamepad2, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import BottomNavigation from "@/components/bottom-navigation"
import Image from "next/image"

type TabType = "bonus" | "benefits" | "rebate"

interface VipTask {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  progress: number
  target: number
  completed: boolean
  subtasks?: { name: string; completed: boolean }[]
}

interface VipBenefit {
  title: string
  description: string
  amount: string
  icon: React.ComponentType<any>
  progress?: number
  target?: number
}

export default function VipPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("bonus")

  // Mock user data - in real app this would come from user context/API
  const currentVipLevel = 2
  const username = "Player74835887"

  const vipTasks: VipTask[] = [
    {
      id: "recharge",
      title: "Recharge More Than 200",
      description: "Complete recharge to unlock VIP benefits",
      icon: CreditCard,
      progress: 0,
      target: 200,
      completed: false,
    },
    {
      id: "recharge-withdraw",
      title: "Complete One Recharge + One Withdrawal",
      description: "Complete both actions to advance",
      icon: Coins,
      progress: 0,
      target: 2,
      completed: false,
      subtasks: [
        { name: "Recharge", completed: false },
        { name: "Withdraw", completed: false },
      ],
    },
    {
      id: "agent-income",
      title: "Agent Income Reaches More Than 10",
      description: "Earn through agent referrals",
      icon: Users,
      progress: 0,
      target: 10,
      completed: false,
    },
  ]

  const vipBenefits: VipBenefit[] = [
    {
      title: "Upgrade Bonus",
      description: "Level up rewards",
      amount: "₹375",
      icon: Gift,
    },
    {
      title: "This Week's Recharge Rebate",
      description: "Minimum Recharge: 0/50",
      amount: "₹2",
      icon: CreditCard,
      progress: 0,
      target: 50,
    },
    {
      title: "Withdrawal Benefits",
      description: "Maximum withdrawal limit",
      amount: "₹10000",
      icon: Coins,
    },
    {
      title: "Game Bet Rebate",
      description: "Rebate on different games",
      amount: "Up to 0.25%",
      icon: Gamepad2,
    },
  ]

  const gameRebates = [
    { name: "Slot", rate: "0.22%" },
    { name: "Card Games", rate: "0.25%" },
    { name: "Live casino", rate: "0.22%" },
    { name: "Sports", rate: "0.22%" },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "bonus":
        return (
          <div className="space-y-6">
            {/* Hero VIP Card */}
            <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Image src="/vip/badge-1.png" alt="VIP0 Badge" width={80} height={80} className="drop-shadow-lg" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">VIP 0</h3>
                    <p className="text-sm text-gray-300">Become a VIP to Receive the Following Rewards:</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Coins className="w-6 h-6 text-yellow-400" />
                  </div>
                  <p className="text-xs text-gray-300">VIP Bonus</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CreditCard className="w-6 h-6 text-yellow-400" />
                  </div>
                  <p className="text-xs text-gray-300">Withdrawal Benefits</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Gift className="w-6 h-6 text-yellow-400" />
                  </div>
                  <p className="text-xs text-gray-300">Bet Rebate</p>
                </div>
              </div>
            </div>

            {/* Deposit Button */}
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-full text-lg">
              Deposit Now
            </Button>

            {/* VIP Levels */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Become a VIP to Enjoy More Benefits!</h3>
              <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((level) => (
                  <div key={level} className="text-center">
                    <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 rounded-xl p-4 border border-red-700/30">
                      <Image
                        src={`/vip/badge-${level === 0 ? 1 : level + 1}.png`}
                        alt={`VIP${level} Badge`}
                        width={60}
                        height={60}
                        className="mx-auto mb-2"
                      />
                      <p className="text-sm font-semibold text-white">VIP{level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Complete Any of the Following Tasks to Become a VIP</h3>
              <div className="space-y-3">
                {vipTasks.map((task) => {
                  const IconComponent = task.icon
                  return (
                    <div
                      key={task.id}
                      className="bg-gradient-to-r from-red-900/40 to-red-800/20 rounded-xl p-4 border border-red-700/30"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <IconComponent className="w-6 h-6 text-yellow-400" />
                        <h4 className="font-semibold text-white flex-1">{task.title}</h4>
                      </div>

                      {task.subtasks ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-3">
                            {task.subtasks.map((subtask, index) => (
                              <div key={index} className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                                <span className="text-sm text-gray-300">{subtask.name}</span>
                                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                                  <X className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{task.id === "recharge" ? "Recharge:" : "Progress:"}</span>
                            <span className="text-gray-300">
                              {task.progress}/{task.target}
                            </span>
                          </div>
                          <div className="w-full bg-red-900/50 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(task.progress / task.target) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case "benefits":
        return (
          <div className="space-y-6">
            {/* Current VIP Benefits */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Current VIP Enjoys the Following Benefits</h3>
              <div className="space-y-3">
                {vipBenefits.map((benefit, index) => {
                  const IconComponent = benefit.icon
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-red-900/40 to-red-800/20 rounded-xl p-4 border border-red-700/30"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <IconComponent className="w-6 h-6 text-yellow-400" />
                        <h4 className="font-semibold text-white">{benefit.title}</h4>
                      </div>

                      {benefit.progress !== undefined ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{benefit.description}</span>
                          </div>
                          <div className="w-full bg-red-900/50 rounded-full h-2 mb-2">
                            <div
                              className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full"
                              style={{ width: `${(benefit.progress! / benefit.target!) * 100}%` }}
                            />
                          </div>
                          <p className="text-lg font-bold text-yellow-400">{benefit.amount}</p>
                        </div>
                      ) : benefit.title === "Game Bet Rebate" ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300 mb-3">{benefit.description}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {gameRebates.map((game, gameIndex) => (
                              <div key={gameIndex} className="flex justify-between text-sm">
                                <span className="text-yellow-400">{game.name}:</span>
                                <span className="text-yellow-400">{game.rate}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-lg font-bold text-yellow-400">{benefit.amount}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case "rebate":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">VIP Rebate System</h3>
              <p className="text-gray-300 mb-6">Earn rebates on all your gaming activities</p>
            </div>

            {/* Rebate Cards */}
            <div className="space-y-4">
              {gameRebates.map((game, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-red-900/40 to-red-800/20 rounded-xl p-4 border border-red-700/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Gamepad2 className="w-6 h-6 text-yellow-400" />
                      <span className="font-semibold text-white">{game.name}</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-400">{game.rate}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-900/40 to-purple-800/20 rounded-xl p-4 border border-blue-700/30">
              <h4 className="font-semibold text-white mb-2">How Rebates Work</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Rebates are calculated on your total betting amount</li>
                <li>• Higher VIP levels unlock better rebate rates</li>
                <li>• Rebates are credited weekly to your account</li>
                <li>• No minimum betting requirement</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-red-950">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-red-800/50">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Crown className="w-6 h-6 text-yellow-400" />
          <span>VIP Center</span>
        </h1>
        <div className="w-10" />
      </div>

      {/* Tabs */}
      <div className="flex bg-gradient-to-r from-gray-800/50 to-gray-700/30 mx-4 mt-4 rounded-xl p-1 border border-gray-600/30">
        {[
          { key: "bonus" as TabType, label: "Bonus" },
          { key: "benefits" as TabType, label: "Benefits" },
          { key: "rebate" as TabType, label: "Rebate" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 pb-24">{renderTabContent()}</div>

      <BottomNavigation />
    </div>
  )
}
