"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

interface Transaction {
  _id: string
  orderId: string
  username: string
  amount: number
  walletProvider?: string
  status: "pending" | "paid"
  createdAt: string
  type?: "deposit" | "withdraw" // Added type field for filtering
}

interface UserCredentials {
  username: string
  password: string
}

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit") // Added tab state
  const router = useRouter()

  // load user + fetch transactions
  useEffect(() => {
    const stored = localStorage.getItem("userCredentials")
    if (!stored) {
      router.push("/") // redirect if not logged in
      return
    }

    const credentials: UserCredentials = JSON.parse(stored)
    setUsername(credentials.username)

    fetchTransactions(credentials.username)
  }, [router])

  const fetchTransactions = async (username: string) => {
    try {
      setLoading(true)
      // hit proxy API route
      const res = await fetch(`/api/auth/history?username=${encodeURIComponent(username)}`)

      if (!res.ok) {
        console.error("History fetch failed: HTTP", res.status, res.statusText)
        return
      }

      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text()
        console.error("History fetch failed: Non-JSON response:", text)
        return
      }

      const data = await res.json()
      if (data.success) {
        setTransactions(data.transactions || [])
        if (data.transactions.length > 0) {
          const latest = new Date(data.transactions[0].createdAt)
          setSelectedDate(latest.toISOString().split("T")[0])
        }
      } else {
        console.error("History fetch failed:", data.message)
      }
    } catch (err) {
      console.error("Error fetching history:", err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = transactions.filter((t) => {
    const matchesDate = t.createdAt.startsWith(selectedDate)
    // For now, assume all transactions are deposits since we don't have withdraw history yet
    // In a real app, you'd have a type field to distinguish
    const matchesType = activeTab === "deposit" // Placeholder logic
    return matchesDate && matchesType
  })

  const total = filtered.reduce((sum, t) => sum + (t.amount || 0), 0)

  const formatCurrency = (amount: number) => `₹${amount}`

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-linear-65 from-burgundy-800 to-burgundy-960 to-burgundy-900 text-white">
      {/* Header */}
      <div className="px-4 py-3 bg-black/70 border-b border-yellow-500/20 flex items-center">
        <ChevronLeft className="w-4 h-4 text-yellow-400 cursor-pointer" onClick={handleBack} />
        <span className="ml-2 text-lg font-bold">Transaction History</span>
      </div>

      <div className="px-4 py-4 bg-black/70 border-b border-yellow-500/20">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("deposit")}
            className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all ${
              activeTab === "deposit"
                ? "bg-yellow-400 text-black"
                : "bg-black/50 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/10"
            }`}
          >
            Deposit History
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all ${
              activeTab === "withdraw"
                ? "bg-yellow-400 text-black"
                : "bg-black/50 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/10"
            }`}
          >
            Withdraw History
          </button>
        </div>
      </div>

      {/* Date filter + total */}
      <div className="px-4 py-3 bg-black/70 border-b border-yellow-500/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-yellow-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-black text-yellow-400 border border-yellow-500/40 rounded px-2 py-1 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <span className="text-yellow-400 font-medium text-sm">Total: {formatCurrency(total)}</span>
        </div>
      </div>

      {/* Transactions */}
      <div>
        {loading ? (
          <div className="px-4 py-12 text-center text-yellow-400/70">Loading...</div>
        ) : filtered.length > 0 ? (
          filtered.map((t, i) => {
            const date = new Date(t.createdAt)
            const formattedDate = date.toISOString().split("T")[0]
            const formattedTime = date.toTimeString().split(" ")[0]

            return (
              <div key={t._id}>
                <div className="px-4 py-3 hover:bg-black/50 transition-all">
                  <div className="flex items-center justify-between">
                    {/* Left */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
                        <span>{formattedDate}</span>
                        <span>{formattedTime}</span>
                      </div>
                      <div className="text-xs text-yellow-500/80 font-mono mb-1">{t.orderId}</div>
                      <div className="text-xs text-gray-400">
                        {activeTab === "deposit" ? "Deposit" : "Withdraw"} - Online Payment
                      </div>
                    </div>

                    {/* Right */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400 mb-1">
                        {activeTab === "deposit" ? "+" : "-"}
                        {formatCurrency(t.amount)}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          t.status === "pending" ? "text-orange-400" : "text-green-400"
                        }`}
                      >
                        {t.status === "pending" ? "Pending" : "Success"}
                      </div>
                    </div>
                  </div>
                </div>
                {i < filtered.length - 1 && <div className="border-b border-yellow-500/30"></div>}
              </div>
            )
          })
        ) : (
          <div className="px-4 py-12 text-center text-yellow-400/60">No {activeTab} transactions found</div>
        )}
      </div>
    </div>
  )
}
