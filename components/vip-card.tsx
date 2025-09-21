"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type VipLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface VipCardProps {
  level: VipLevel
  username?: string
  progress?: number // 0-100 toward next level
  className?: string
}

const badgeByLevel: Record<VipLevel, string> = {
  1: "/vip/badge-1.png",
  2: "/vip/badge-2.png",
  3: "/vip/badge-3.png",
  4: "/vip/badge-4.png",
  5: "/vip/badge-5.png",
  6: "/vip/badge-4.png", // Using badge-4 for level 6 since we only have 5 badges
}

const bgByLevel: Record<VipLevel, string> = {
  1: "/vip/bg-0.png", // bronze gradient
  2: "/vip/bg-1.png", // silver/gray gradient
  3: "/vip/bg-3.png", // gold gradient
  4: "/vip/bg-0.png", // bronze gradient
  5: "/vip/bg-2.png", // purple gradient
  6: "/vip/bg-3.png", // gold gradient
}

const levelNames: Record<VipLevel, string> = {
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
        "relative w-full overflow-hidden rounded-2xl",
        "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl",
        "p-5", // Increased padding for better spacing
        className,
      )}
      role="region"
      aria-label={`VIP ${level} card`}
    >
      {/* Background */}
      <Image
        src={bgByLevel[level] || "/placeholder.svg"}
        alt=""
        fill
        priority
        className="object-cover opacity-95 pointer-events-none select-none" // Increased opacity for better visibility
        sizes="(max-width: 480px) 100vw, 480px"
      />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      {/* Foreground */}
      <div className="relative z-10 flex items-center gap-4">
        <div className="shrink-0">
          <Image
            src={badgeByLevel[level] || "/placeholder.svg"}
            alt={`VIP ${level} badge`}
            width={80} // Increased badge size for better visibility
            height={80}
            className="drop-shadow-lg" // Enhanced shadow for better depth
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-bold text-white">VIP {level}</span>
            <span className="text-sm font-medium text-yellow-300">{levelNames[level]}</span>
          </div>
          {username && (
            <div className="text-sm text-white/90 mb-3">
              Player: <span className="font-medium">{username}</span>
            </div>
          )}

          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-white/90 mb-1">
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

          <div className="mt-4 flex items-center gap-4 text-xs text-white/80">

          </div>
        </div>
      </div>
    </div>
  )
}
