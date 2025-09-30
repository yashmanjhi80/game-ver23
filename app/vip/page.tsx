"use client"


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Crown, Calendar, TrendingUp, Clock, Zap, X } from "lucide-react";
import { useState } from "react";
import firstDepositPromo from "./assets/b-1.png";
import vipCashbackPromo from "./assets/b-2.png";
import dailyRewardsPromo from "./assets/b-3.png";

const PromoVipPage = () => {
  const [activeTab, setActiveTab] = useState("promo");
  // Promo data
  const promoCards = [
    {
      id: 1,
      title: "First Deposit",
      image: firstDepositPromo,
      url: "https://example.com/first-deposit"
    },
    {
      id: 2,
      title: "VIP Cashback",
      image: vipCashbackPromo,
      url: "https://example.com/vip-cashback"
    },
    {
      id: 3,
      title: "Daily Rewards",
      image: dailyRewardsPromo,
      url: "https://example.com/daily-rewards"
    }
  ];

  // VIP levels data with formatted amounts
  const formatAmount = (amount: string) => {
    const numericAmount = parseInt(amount.replace('₹', '').replace(',', ''));
    if (numericAmount >= 1000) {
      return `₹${(numericAmount / 1000).toFixed(0)}k`;
    }
    return amount;
  };

  const vipLevels = [
    { level: "VIP 1", deposit: "₹300", weekly: "0", monthly: "0", upgrade: "0", withdrawals: "2" },
    { level: "VIP 2", deposit: formatAmount("2000"), weekly: "30", monthly: "50", upgrade: "115", withdrawals: "3" },
    { level: "VIP 3", deposit: formatAmount("₹10000"), weekly: "30", monthly: "150", upgrade: "101", withdrawals: "3" },
    { level: "VIP 4", deposit: formatAmount("₹30000"), weekly: "50", monthly: "250", upgrade: "201", withdrawals: "3" },
    { level: "VIP 5", deposit: formatAmount("₹80000"), weekly: "80", monthly: "400", upgrade: "501", withdrawals: "3" },
    { level: "VIP 6", deposit: formatAmount("₹150000"), weekly: "110", monthly: "550", upgrade: "701", withdrawals: "4" },
    { level: "VIP 7", deposit: formatAmount("₹250000"), weekly: "140", monthly: "700", upgrade: "1001", withdrawals: "4" },
    { level: "VIP 8", deposit: formatAmount("₹450000"), weekly: "190", monthly: "950", upgrade: "2001", withdrawals: "4" },
    { level: "VIP 9", deposit: formatAmount("₹750000"), weekly: "240", monthly: "1200", upgrade: "3001", withdrawals: "5" },
    { level: "VIP 10", deposit: formatAmount("₹1150000"), weekly: "290", monthly: "1450", upgrade: "4001", withdrawals: "5" },
    { level: "VIP 11", deposit: formatAmount("₹1650000"), weekly: "370", monthly: "1850", upgrade: "5001", withdrawals: "5" },
    { level: "VIP 12", deposit: formatAmount("₹2350000"), weekly: "450", monthly: "2250", upgrade: "7001", withdrawals: "6" },
    { level: "VIP 13", deposit: formatAmount("₹3250000"), weekly: "530", monthly: "2650", upgrade: "9001", withdrawals: "6" },
    { level: "VIP 14", deposit: formatAmount("₹4350000"), weekly: "650", monthly: "3250", upgrade: "11001", withdrawals: "6" },
    { level: "VIP 15", deposit: formatAmount("₹5650000"), weekly: "770", monthly: "3850", upgrade: "13001", withdrawals: "7" },
    { level: "VIP 16", deposit: formatAmount("₹7150000"), weekly: "890", monthly: "4450", upgrade: "15001", withdrawals: "7" },
    { level: "VIP 17", deposit: formatAmount("₹8950000"), weekly: "1070", monthly: "5350", upgrade: "18001", withdrawals: "8" },
    { level: "VIP 18", deposit: formatAmount("₹11050000"), weekly: "1350", monthly: "6750", upgrade: "21001", withdrawals: "8" },
    { level: "VIP 19", deposit: formatAmount("₹13450000"), weekly: "1530", monthly: "7650", upgrade: "24001", withdrawals: "9" },
    { level: "VIP 20", deposit: formatAmount("₹16150000"), weekly: "1780", monthly: "8900", upgrade: "27001", withdrawals: "9" }
  ];

  const handlePromoClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#450b00]" style={{ background: 'var()' }}>
      {/* Header */}
      <div className="bg-[#2b0d0d] px-5 py-3 flex items-center justify-between  ">
        <div className="w-2"></div>
        <h1 className=" text-white text-center flex justify-center items-center ">
          {activeTab === "promo" ? "Promo" : "VIP"}
        </h1>
        <div className="flex items-center gap-2">
       
        <a href="/wallet">
  <X className="w-5 h-4 text-primary-foreground text-white" />
</a>

        </div>
      </div>

      <div className="p-2">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-[#2b0d0d]">
          <Button 
            variant={activeTab === "promo" ? "default" : "outline"}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl transition-all text-black font-bold bg-gradient-to-b from-yellow-300 via-golden to-yellow-600 border border-yellow-400 shadow-lg relative overflow-hidden ${
      activeTab === "promo"
        ? "hover:from-yellow-400 hover:via-golden hover:to-yellow-700 border-b-2 border-yellow-300"
        : "hover:from-yellow-400 hover:via-golden hover:to-yellow-700 text-black"
    }`}
            onClick={() => setActiveTab("promo")}
          >
            Promo
          </Button>
          <Button 
            variant={activeTab === "vip" ? "default" : "outline"}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl transition-all text-black font-bold bg-gradient-to-b from-yellow-300 via-golden to-yellow-600 border border-yellow-400 shadow-lg relative overflow-hidden ${
      activeTab === "vip"
        ? "hover:from-yellow-400 hover:via-golden hover:to-yellow-700 border-b-2 border-yellow-300"
        : "hover:from-yellow-400 hover:via-golden hover:to-yellow-700 text-black"
    }`}
            onClick={() => setActiveTab("vip")}
          >
            VIP
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "promo" ? (
          /* Promo Section */
          <div className="space-y-6">
            <div className="space-y-4">
              {promoCards.map((promo) => (
                <Card 
                  key={promo.id}
                  className="h-40 cursor-pointer transition-all duration-300 hover:scale-105 bg-transparent border-0 overflow-hidden"
                  style={{ boxShadow: 'var(--shadow-game)' }}
                  onClick={() => handlePromoClick(promo.url)}
                >
                  <div className="relative h-40 w-full">
                    <img 
                     
                      alt={promo.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent rounded-lg" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-lg">{promo.title}</h3>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* VIP Section */
          <div className="space-y-6">            
            {/* Bonus Cards - 2 Grid Layout Rectangular */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mb-6">
              {/* Upgrade Bonus */}
              <Card className="p-4 bg-game-card border-game-burgundy h-24">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-yellow-400/20 border-yellow-400 border-y-2">
                      <TrendingUp className="w-2 h-2 text-game-gold" />
                    </div>
                    <div>
                      <p  className="text-white  text-xs ">Upgrade</p>
                      <p className="text-game-gold text-xs font-bold">₹0</p>
                    </div>
                  </div>
                  <Button  className="px-2 py-2 text-[10px] leading-none w-auto h-auto min-w-0 min-h-0 opacity-100">
                          Claim
                        </Button>
                </div>
              </Card>

              {/* Weekly Bonus */}
              <Card className="p-4 bg-game-card border-game-burgundy h-24">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full  bg-yellow-400/20 border-yellow-400 border-y-2 ">
                      <Calendar className="w-2 h-2 text-game-gold" />
                    </div>
                    <div>
                      <h3 className="text-white text-xs ">Weekly</h3>
                      <p className="text-game-gold text-xs font-bold">₹0 </p>
                    </div>
                  </div>
                  <Button  className="px-2 py-2 text-[10px] leading-none w-auto h-auto min-w-0 min-h-0 opacity-100">
                          Claim
                        </Button>
                </div>
              </Card>

              {/* Monthly Bonus */}
              <Card className="p-4 bg-game-card border-game-burgundy h-24">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full  bg-yellow-400/20 border-yellow-400 border-y-2">
                      <Clock className="w-2 h-2 text-game-gold " />
                    </div>
                    <div>
                      <h3 className="text-white text-xs ">Monthly </h3>
                      <p className="text-game-gold text-xs font-bold">₹0 </p>
                    </div>
                  </div>
                 <Button className="px-2 py-2 text-[10px] leading-none w-auto h-auto min-w-0 min-h-0 opacity-100">
                          Claim
                        </Button>

                </div>
              </Card>

              {/* VIP Progress */}
              <Card className="p-4 bg-game-card border-game-burgundy h-24">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full  bg-yellow-400/20 border-yellow-400 border-y-2">
                      <Crown className="w-2 h-2 text-game-gold" />
                    </div>
                    <div>
                      <h3 className="text-white text-xs">Current</h3>
                      <p className="text-game-gold text-lg font-bold">VIP 1</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-game-gold-light">Next: VIP 2</p>
                    <p className="text-xs text-white">₹2k needed</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* VIP Levels Table - Full Width */}
            <div className="w-full -mx-4">
              <h3 className="text-game-gold text-lg font-semibold mb-4 px-4">
                Total deposit to upgrade Vip  level
              </h3>
              
              <div className="w-full ml-4 bg-game-card border-y ">
                <table className=" w-full text-xs">
                  <thead>
                    <tr className="border-b border-game-burgundy bg-game-burgundy/30">
                      <th className="text-left p-1 text-game-gold font-medium">Level</th>
                      <th className="text-left p-1 text-game-gold font-medium">Deposit</th>
                      <th className="text-left p-1 text-game-gold font-medium">Weekly</th>
                      <th className="text-left p-1 text-game-gold font-medium">Monthly</th>
                      <th className="text-left p-1 text-game-gold font-medium">Upgrade</th>
                      <th className="text-left p-1 text-game-gold font-medium">Withdrawal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vipLevels.map((level, index) => (
                      <tr key={index} className="border-b border-game-burgundy/30 hover:bg-game-burgundy/20">
                        <td className="p-2 text-white font-medium">{level.level}</td>
                        <td className="p-2 text-yellow-500  font-semibold">{level.deposit}</td>
                        <td className="p-2 text-white">{level.weekly}</td>
                        <td className="p-2 text-white">{level.monthly}</td>
                        <td className="p-2 text-white">{level.upgrade}</td>
                        <td className="p-2 text-white">{level.withdrawals}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 px-4 text-xs text-white space-y-1">
                <p>• Level-Up Bonus - Recharge to reach a new VIP level and get the bonus.</p>
                <p>• Weekly Bonus - Last week's recharge ≥ 10x weekly bonus. Claim from Monday.</p>
                <p>• Monthly Bonus - Last month's recharge ≥ 10x monthly bonus. Claim from 1st.</p>
                <p>• All rewards need 10x wagering before withdrawal.</p>
              </div>
             

    </div>
          </div>
          
        )}
      </div>
      
    </div>

    
  );
};

export default PromoVipPage;