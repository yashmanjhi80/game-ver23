"use client"

import { usePathname } from "next/navigation"
import GlobalHeader from "./global-header"

export default function ConditionalHeader() {
  const pathname = usePathname()

  if (pathname === "/" || pathname === "/forgot-password") {
    return null
  }

  return <GlobalHeader />
}
