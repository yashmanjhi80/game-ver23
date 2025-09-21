"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Crown, Wallet, Users, UserCircle } from "lucide-react"

const navigationItems = [
  { href: "/home", icon: Home, label: "Home", activeColor: "text-yellow-400" },
  { href: "/vip", icon: Crown, label: "VIP", activeColor: "text-yellow-400" },
  { href: "/wallet", icon: Wallet, label: "Wallet", activeColor: "text-yellow-400" },
  { href: "/agent", icon: Users, label: "Agent", activeColor: "text-yellow-400" },
  { href: "/profile", icon: UserCircle, label: "Profile", activeColor: "text-yellow-400" },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#2b0d0d] border-t border-red-900 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navigationItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isCenter = index === 2 // Wallet is center

          return (
            <Link
              key={`${item.href}-${index}`}
              href={item.href}
              className="flex flex-col items-center justify-center relative"
            >
              {/* Wallet always highlighted */}
              {isCenter ? (
                <div className="relative flex flex-col items-center -mt-6">
                  <div className="w-14 h-14 rounded-full bg-[#3a0f0f] flex items-center justify-center shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-[#5a1b1b] flex items-center justify-center">
                      <Icon
                        size={28}
                        className={isActive ? item.activeColor : "text-rose-200/80"}
                      />
                    </div>
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      isActive ? item.activeColor : "text-rose-200/80"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ) : (
                <>
                  <Icon
                    size={22}
                    className={isActive ? item.activeColor : "text-rose-200/70"}
                  />
                  <span
                    className={`text-xs mt-1 ${
                      isActive ? item.activeColor : "text-rose-200/70"
                    }`}
                  >
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
