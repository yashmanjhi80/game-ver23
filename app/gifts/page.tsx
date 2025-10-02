import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";

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
  ];

  return (
    <div className="min-h-screen bg-red-100 ">
      {/* Header */}
      <div className="bg-[#2b0d0d] px-5 py-3 flex items-center justify-between">
        <div className="w-2"></div>
        <h1 className="text-white text-center flex justify-center items-center">
          Bets
        </h1>
        <div className="flex items-center gap-2">
          <a href="/profile">
            <X className="w-5 h-4 text-white" />
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#450b00] px-0">
        {/* Welcome Section */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/gift-icon.png"
              alt="gift"
              width={160}
              height={100}
              className="object-contain"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium text-white mb-1">Hi</h2>
              <p className="text-sm text-gray-300">We have a gift for you</p>
            </div>
            <Image
              src="/images/coin-icon.png"
              alt="coin"
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Gift Code Form */}
      <div className="bg-[#450b00] px-6 pb-5">
        <h3 className="text-sm font-medium text-white mb-6">
          Please enter the gift code below
        </h3>

        <div className="space-y-4">
          <Input
            placeholder="Please enter gift code"
            className="w-full h-12 bg-yellow-700 bg-opacity-50 border-yellow-300 border-2 rounded-xl px-6 text-sm text-white placeholder:text-gray-300"
          />

          {/* Redeem Button */}
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
        </div>
      </div>

      {/* History Header */}
      <div className="bg-[#450b00] px-6 pt-8">
        <h2 className="text-white text-lg font-medium mb-">History</h2>
      </div>

      {/* History Records */}
      <div className="bg-[#450b00] w-full pb-12">
        {historyData.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center px-6 py-4 text-sm text-white border-b border-yellow-400"
          >
            <span>{item.dateTime}</span>
            <span className="text-green-400 font-semibold">+{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftRedeemPage;
