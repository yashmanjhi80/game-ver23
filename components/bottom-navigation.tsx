"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

const navigationItems = [
  {
    href: "/home",
    normalIcon: "/images/navbar/home-normal.png",
    activeIcon: "/images/navbar/home-active.png",
    label: "Home",
    activeColor: "text-yellow-400",
  },
  {
    href: "/vip",
    normalIcon: "/images/navbar/vip-normal.png",
    activeIcon: "/images/navbar/vip-active.png",
    label: "VIP",
    activeColor: "text-yellow-400",
  },
  {
    href: "/wallet",
    normalIcon: "/images/navbar/wallet-normal.png",
    activeIcon: "/images/navbar/wallet-normal.png", // Using normal icon for wallet as no active version provided
    label: "Wallet",
    activeColor: "text-yellow-400",
  },
  {
    href: "/agent",
    normalIcon: "/images/navbar/agent-normal.png",
    activeIcon: "/images/navbar/agent-active.png",
    label: "Agent",
    activeColor: "text-yellow-400",
  },
  {
    href: "/profile",
    normalIcon: "/images/navbar/profile-normal.png",
    activeIcon: "/images/navbar/profile-active.png",
    label: "Profile",
    activeColor: "text-yellow-400",
  },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#2b0d0d] border-t border-red-900 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navigationItems.map((item, index) => {
          const isActive = pathname === item.href
          const isCenter = index === 2 // Wallet is center

          return (
            <Link
              key={`${item.href}-${index}`}
              href={item.href}
              className="flex flex-col items-center justify-center relative"
            >
              {isCenter ? (
                <div className="relative flex flex-col items-center -mt-6">
                  <div className="rounded-full bg-[#3a0f0f] flex items-center justify-center shadow-lg bg-[rgba(40,11,11,1)] size-12">
                    <div className="w-10 h-10 rounded-full bg-[#5a1b1b] flex items-center justify-center p-0">
                      <Image
                        src={isActive ? item.activeIcon : item.normalIcon}
                        alt={item.label}
                        width={28}
                        height={28}
                        className="object-contain leading-5"
                      />
                    </div>
                  </div>
                  <span className={`text-xs mt-1 ${isActive ? item.activeColor : "text-rose-200/80"}`}>
                    {item.label}
                  </span>
                </div>
              ) : (
                <>
                  <Image
                    src={isActive ? item.activeIcon : item.normalIcon}
                    alt={item.label}
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                  <span className={`text-xs mt-1 ${isActive ? item.activeColor : "text-rose-200/70"}`}>
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
