"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface BetRecord {
  game: string;
  bet: number;
  status: string;
  amount: number;
  time: string;
}

const BetRecords = () => {
  const [betRecords, setBetRecords] = useState<BetRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      setLoading(true);
      try {
        // Get stored credentials
        const userCredentials = localStorage.getItem("userCredentials");
        if (!userCredentials) {
          console.error("No user credentials found in localStorage");
          setBetRecords([]);
          return;
        }

        const credentials = JSON.parse(userCredentials);
        const { username, password } = credentials;

        // Fetch bet data with credentials
        const response = await fetch(
          `https://game.zyronetworks.shop/getUserBets?username=${encodeURIComponent(
            username
          )}&password=${encodeURIComponent(password)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch bet records");
          setBetRecords([]);
          return;
        }

        const data = await response.json();
        setBetRecords(data);
      } catch (error) {
        console.error("Error fetching bet records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, []);

  return (
    <div className="min-h-screen bg-[#450b00]">
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

      {/* Loading / Empty / Records */}
      {loading ? (
        <div className="text-white text-center py-10">Loading bets...</div>
      ) : betRecords.length === 0 ? (
        <div className="text-white text-center py-10">No bet records found.</div>
      ) : (
        <div className="pb-4">
          {betRecords.map((record, index) => {
            const winLoss =
              record.status === "win"
                ? record.amount - record.bet
                : -record.bet;

            return (
              <div key={index} className="py-3 px-3">
                <div className="space-y-1">
                  {/* First Row */}
                  <div className="flex justify-between text-white/90 items-start">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{record.game}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-medium">
                        {new Date(record.time).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="flex justify-between pb-4 border-yellow-400 border-b items-start">
                    <div className="flex flex-col">
                      <span className="text-sm text-white/90 font-medium">
                        Bet: ₹ {record.bet}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span
                        className={`text-sm font-medium ${
                          winLoss > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        ₹ {winLoss.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BetRecords;
