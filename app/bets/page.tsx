import { X } from "lucide-react";

interface BetRecord {
  bettype: string;
  time: string;
  betAmount: number;
  winLoss: number;
}

const sampleBetRecords: BetRecord[] = [
  { bettype: "Jili", time: "2025-09-18 15:15:42", betAmount: 50, winLoss: 80 },
  { bettype: "PG", time: "2025-09-18 15:15:41", betAmount: 50, winLoss: -30 },
  { bettype: "Evo", time: "2025-09-18 15:15:41", betAmount: 50, winLoss: -50 },
   {bettype: "Cbi", time: "2025-09-18 15:15:40", betAmount: 50, winLoss: 10 },
  {bettype: "Turbo", time: "2025-09-18 15:15:39", betAmount: 50, winLoss: 110 },
   {bettype: "Jdb", time: "2025-09-18 15:15:38", betAmount: 50, winLoss: 20 },
  {bettype: "Evo", time: "2025-09-18 15:15:37", betAmount: 50, winLoss: -30 },
  {bettype: "PG", time: "2025-09-18 15:15:36", betAmount: 50, winLoss: 75 },
  {bettype: "Jili", time: "2025-09-18 15:15:35", betAmount: 50, winLoss: -25 },
  {bettype: "GAME", time: "2025-09-18 15:15:34", betAmount: 50, winLoss: 45 },
];

const BetRecords = () => {
  return (
    <div className="min-h-screen bg-[#450b00] ">
      {/* Header */}
      <div className="bg-[#2b0d0d] px-5 py-3 flex items-center justify-between  ">
        <div className="w-2"></div>
        <h1 className=" text-white text-center flex justify-center items-center ">
          Bets
        </h1>
        <div className="flex items-center gap-2">
          <a href="/profile">
            <X className="w-5 h-4 text-white"  />
          </a>
        </div>
      </div>


      {/* Records List */}
      <div className="pb-4 ">
        {sampleBetRecords.map((record, index) => (
          <div key={index}>
            <div className=" py-3 px-3">
              <div className="space-y-1">
                {/* First Row */}
                <div className="flex justify-between  text-white/90 items-start">
                  <div className="flex flex-col">
                   
                    <span className="text-sm  font-medium">{record.bettype}</span>
                  </div>
                  <div className="flex flex-col text-white/90 text-right">
                   
                    <span className="text-sm font-medium">{record.time}</span>
                  </div>
                </div>
                {/* Second Row */}
                <div className="flex justify-between pb-4 border-yellow-400 border-b items-start">
                  <div className="flex flex-col">
                    <span className="text-sm text-white/90 font-medium">₹ {record.betAmount}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span
                      className={`text-sm font-medium ${
                        record.winLoss > 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      ₹ {record.winLoss}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default BetRecords;
