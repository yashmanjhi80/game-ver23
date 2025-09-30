import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const GiftRedeemPage = () => {
  // Mock history data
  const historyData = [
    {
      id: 1,
      dateTime: "2024-01-15 14:30",
      amount: 250,
    },
    {
      id: 2,
      dateTime: "2024-01-14 09:15",
      amount: 150,
    },
    {
      id: 3,
      dateTime: "2024-01-13 16:45",
      amount: 500,
    },
  ]

  return (
    <div className="min-h-screen bg-red-100 bg-background">
      {/* Header */}

      {/* Main Content */}
      <div className=" bg-[#450b00] px-0">
        {/* Welcome Section */}
        <div className="px-6 pt-4 pb-3">
          <div className="flex justify-center mb-4">
            <Image src="/images/gift-icon.png" alt="gift" width={120} height={80} className="object-contain" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium text-white mb-1">Hi</h2>
              <p className="text-sm text-gray-300">We have a gift for you</p>
            </div>
            <Image src="/images/coin-icon.png" alt="coin" width={60} height={60} className="object-contain" />
          </div>
        </div>
      </div>

      {/* Gift Code Form */}
      <div className="bg-[#450b00] px-6 pb-5 ">
        <h3 className="text-sm font-medium text-white mb-6">Please enter the gift code below</h3>

        <div className="space-y-4">
          <Input
            placeholder="Please enter gift code"
            className="w-full h-12 bg-yellow-700 bg-opacity-50 border-yellow-300 border-2 rounded-xl px-6 text-sm text-white placeholder:text-gray-300"
          />
          {/* redeem Button */}
          <div className="flex justify-center relative">
            <Button
              className="bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 text-black font-bold py-4 px-12 rounded-full text-base hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg border border-yellow-400 relative overflow-hidden"
              size="lg"
              data-testid="button-withdraw"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 rounded-full"></div>
              <div className="absolute top-1 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
              <span className="relative z-10 tracking-wide">Redeem</span>
            </Button>
          </div>

          <hr className="border-t-2 border-dotted border-yellow-400 my-6" />

          <div>
            <h2 className="mb-4 text-center text-white text-lg font-medium">History</h2>

            <div className="max-w-md mx-auto p-4 border border-yellow-600 rounded-lg shadow-md bg-yellow-950 bg-opacity-50">
              <div className="space-y-3">
                <div className="py-2">
                  <div className="flex justify-between text-sm text-white">
                    <span>12-5-2025 12:12</span>
                    <span className="text-green-400 font-semibold">+200</span>
                  </div>
                  <hr className="border-t border-dotted border-yellow-400 mt-2" />
                </div>
                <div className="py-2">
                  <div className="flex justify-between text-sm text-white">
                    <span>13-5-2025 09:30</span>
                    <span className="text-green-400 font-semibold">+150</span>
                  </div>
                  <hr className="border-t border-dotted border-yellow-400 mt-2" />
                </div>
                <div className="py-2">
                  <div className="flex justify-between text-sm text-white">
                    <span>14-5-2025 18:45</span>
                    <span className="text-green-400 font-semibold">+300</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GiftRedeemPage
