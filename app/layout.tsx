import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ViewportSetter from "@/components/viewport-setter"
import ConditionalHeader from "@/components/conditional-header"

export const metadata: Metadata = {
  title: "AURA7 - Game Login",
  description: "Enter the adventure in AURA7",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <ViewportSetter />
      </head>
      <body className="font-sans">
        <ConditionalHeader />
        {children}
      </body>
    </html>
  )
}
