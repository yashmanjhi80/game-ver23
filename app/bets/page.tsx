import { X } from "lucide-react";

interface BetRecord {
  betNumber: string;
  time: string;
  betAmount: number;
  winLoss: number;
}

const sampleBetRecords: BetRecord[] = [
  { betNumber: "29142640", time: "2025-09-18 15:15:42", betAmount: 50, winLoss: 80 },
  { betNumber: "29142622", time: "2025-09-18 15:15:41", betAmount: 50, winLoss: -30 },
  { betNumber: "29142634", time: "2025-09-18 15:15:41", betAmount: 50, winLoss: -50 },
  { betNumber: "29142605", time: "2025-09-18 15:15:40", betAmount: 50, winLoss: 10 },
  { betNumber: "29142589", time: "2025-09-18 15:15:39", betAmount: 50, winLoss: 110 },
  { betNumber: "29142581", time: "2025-09-18 15:15:38", betAmount: 50, winLoss: 20 },
  { betNumber: "29142567", time: "2025-09-18 15:15:37", betAmount: 50, winLoss: -30 },
  { betNumber: "29142555", time: "2025-09-18 15:15:36", betAmount: 50, winLoss: 75 },
  { betNumber: "29142543", time: "2025-09-18 15:15:35", betAmount: 50, winLoss: -25 },
  { betNumber: "29142531", time: "2025-09-18 15:15:34", betAmount: 50, winLoss: 45 },
];

const BetRecords = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-semibold text-center flex-1">Bet Records</h1>
        <button className="p-1">
          <X className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Subtitle */}
      <div className="p-4 text-center">
        <p className="text-accent font-medium">Showing Up to 100 Bet Records</p>
      </div>

      {/* Records List */}
      <div className="pb-4">
        {sampleBetRecords.map((record, index) => (
          <div key={index}>
            <div className="bg-card py-3 px-4">
              <div className="space-y-2">
                {/* First Row */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Bet Number:</span>
                    <span className="text-sm text-foreground font-medium">{record.betNumber}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-muted-foreground">Time:</span>
                    <span className="text-sm text-foreground font-medium">{record.time}</span>
                  </div>
                </div>
                
                {/* Second Row */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Bet Amount:</span>
                    <span className="text-sm text-foreground font-medium">₹ {record.betAmount}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-muted-foreground">Win/Loss:</span>
                    <span 
                      className={`text-sm font-medium ${
                        record.winLoss > 0 
                          ? 'text-success' 
                          : 'text-loss'
                      }`}
                    >
                      ₹ {record.winLoss > 0 ? record.winLoss : record.winLoss}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Dotted line separator */}
            {index < sampleBetRecords.length - 1 && (
              <div className="border-b border-dotted border-border opacity-60"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BetRecords;
