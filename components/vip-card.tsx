"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type VipLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface VipCardProps {
  level: VipLevel
  username?: string
  progress?: number // 0-100 toward next level
  className?: string
}

const badgeByLevel: Record<VipLevel, string> = {
  0: "/vip/badge-1-.png",
  1: "/vip/badge-1.png",
  2: "/vip/badge-2.png",
  3: "/vip/badge-3.png",
  4: "/vip/badge-4.png",
  5: "/vip/badge-5.png",
  6: "/vip/badge-4.png", // fallback for level 6
}

const bgByLevel: Record<VipLevel, string> = {
  0: "/vip/bg-0-.png",
  1: "/vip/bg-0.png",
  2: "/vip/bg-1.png",
  3: "/vip/bg-3.png",
  4: "/vip/bg-0.png",
  5: "/vip/bg-2.png",
  6: "/vip/bg-3.png",
}

const levelNames: Record<VipLevel, string> = {
  0: "Newbie",
  1: "Bronze",
  2: "Silver",
  3: "Gold",
  4: "Platinum",
  5: "Diamond",
  6: "Master",
}

export default function VipCard({ level, username, progress = 0, className }: VipCardProps) {
  const clamped = Math.max(0, Math.min(100, progress))

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg",
        "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl",
        "p-4",
        className
      )}
      role="region"
      aria-label={`VIP ${level} card`}
    >
      {/* Shine Effect */}
      <div className="absolute inset-0 z-0 shine-effect pointer-events-none" />

      {/* Background */}
      <Image
        src={bgByLevel[level] || "/placeholder.svg"}
        alt=""
        fill
        priority
        className="object-cover opacity-90 pointer-events-none select-none"
        sizes="(max-width: 480px) 100vw, 480px"
      />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      {/* Foreground */}
      <div className="relative z-10 flex items-center gap-4">
        {/* VIP Badge */}
        <div className="shrink-0">
          <Image
            src={badgeByLevel[level] || "/placeholder.svg"}
            alt={`VIP ${level} badge`}
            width={64}
            height={64}
            className="drop-shadow-lg"
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-bold text-white">VIP {level}</span>
            <span className="text-sm font-medium text-yellow-300">{levelNames[level]}</span>
          </div>
          {username && (
            <div className="text-sm text-white/90 mb-2">
              Player: <span className="font-medium">{username}</span>
            </div>
          )}

          {/* Progress */}
          <div className="text-xs text-white/90 mb-1 flex justify-between">
            <span>Progress to next level</span>
            <span className="font-semibold">{clamped}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300 ease-out"
              style={{ width: `${clamped}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

