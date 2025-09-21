"use client"

import { useEffect, useMemo, useState } from "react"
import { AvatarImage } from "@/components/ui/avatar"

const AVATARS = [
  "/avatars/avator.png",
  "/avatars/avator1.png",
  "/avatars/avator2.png",
  "/avatars/avator3.png",
  "/avatars/avator4.png",
  "/avatars/avator5.png",
]

function hashToIndex(input: string, mod: number) {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0
  }
  return Math.abs(h) % mod
}

export function useRandomAvatar(username?: string) {
  const storageKey = "v0.randomAvatarIndex.v1"
  const [index, setIndex] = useState<number | null>(null)

  // If username exists, deterministically pick an index from it
  const seededIndex = useMemo(() => {
    if (username && username.trim().length > 0) return hashToIndex(username.trim().toLowerCase(), AVATARS.length)
    return null
  }, [username])

  useEffect(() => {
    if (seededIndex !== null) {
      setIndex(seededIndex)
      return
    }
    // Fallback: persist a random choice per device
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null
    if (saved !== null) {
      const n = Number.parseInt(saved, 10)
      if (!Number.isNaN(n)) {
        setIndex(Math.max(0, Math.min(AVATARS.length - 1, n)))
        return
      }
    }
    const rnd = Math.floor(Math.random() * AVATARS.length)
    setIndex(rnd)
    try {
      window.localStorage.setItem(storageKey, String(rnd))
    } catch {}
  }, [seededIndex])

  const src = index === null ? "/random-avatar-loading.png" : AVATARS[index]
  const cycle = () => {
    const next = ((index ?? 0) + 1) % AVATARS.length
    setIndex(next)
    try {
      window.localStorage.setItem(storageKey, String(next))
    } catch {}
  }
  return [src, cycle] as const
}

// Component for plain <img> / Next Image replacement in tight spots
export function RandomAvatarImg({
  username,
  size = 40,
  className,
  alt = "User avatar",
}: {
  username?: string
  size?: number
  className?: string
  alt?: string
}) {
  const [src] = useRandomAvatar(username)
  return <img src={src || "/placeholder.svg"} alt={alt} width={size} height={size} className={className} />
}

// Component to drop-in inside shadcn <Avatar>
export function RandomAvatarForAvatar({
  username,
  alt = "Profile Avatar",
  className,
}: {
  username?: string
  alt?: string
  className?: string
}) {
  const [src] = useRandomAvatar(username)
  return <AvatarImage src={src || "/placeholder.svg"} alt={alt} className={className} />
}
