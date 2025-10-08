"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { ShineWrapper } from "@/components/ui/shineEffect" 

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
  6: "/vip/badge-4.png",
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
    <ShineWrapper
      className={cn(
        "relative w-full overflow-hidden rounded-lg p-4 text-white shadow-xl",
        className
      )}
      bgColor="transparent" // keep transparent so background image shows
    >
      {/* Background Image */}
      <Image
        src={bgByLevel[level] || "/placeholder.svg"}
        alt=""
        fill
        priority
        className="object-cover opacity-90 pointer-events-none select-none"
        sizes="(max-width: 480px) 100vw, 480px"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 z-0" aria-hidden="true" />

      {/* Foreground Content */}
      <div className="relative z-10 flex items-center gap-3">
        {/* VIP Badge */}
        <div className="shrink-0">
          <Image
            src={badgeByLevel[level] || "/placeholder.svg"}
            alt={`VIP ${level} badge`}
            width={52}
            height={52}
            className="drop-shadow-lg"
          />
           <span className="text-lg pl-1 font-semibold text-yellow-400">VIP {level}</span>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline pl-12 gap-2 mb-1">
         
            <span className="text-sm pl-8 text-right font-medium text-white">{levelNames[level]}</span>
          </div>

          {/* Progress */}
          <div className="text-xs ml-9 text-white/90 mb-1 flex justify-between">
            <span className="">Deposit 300 to next level</span>
            <span className="font-semibold">{clamped}%</span>
          </div>
          <div className="h-2 w-44 ml-4 overflow-hidden rounded-full bg-white/20 border border-white/10">
            <div
              className="h-2  rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300 ease-out"
              style={{ width: `${clamped}%` }}
            />
          </div>
        </div>
      </div>
    </ShineWrapper>
  )
}

