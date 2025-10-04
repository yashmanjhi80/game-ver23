"use client";

import { Wallet, Flame, Gamepad2, Spade, Fish, Zap, Play } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NgameCardsData, gameCardsData, bannerData } from "@/data/games";
import BottomNavigation from "@/components/bottom-navigation";
import React from "react";
import bellIcon from "@/public/assets/bell.png";
import hotIcon from "@/public/assets/hot.png";
import pgIcon from "@/public/assets/pg.png";
import slotIcon from "@/public/assets/slot.png";
import cardIcon from "@/public/assets/cards.png";
import { useRouter } from "next/navigation";

interface UserCredentials {
  username: string;
  password: string;
  user?: {
    username: string;
    email: string;
  };
  loginTime: string;
}

interface GameLoadingState {
  isLoading: boolean;
  progress: number;
  gameName: string;
}

function GameImage({
  gCode,
  alt,
  prefer = "small",
}: {
  gCode: string;
  alt: string;
  prefer?: "small" | "large";
}) {
  // Only use the provided test server, en-US images. Try both small and large folders.
  const base = "https://test.zyronetworks.shop";
  const smalls = [
    `${base}/images/small/JL/en-US/${gCode}.png`,
    `${base}/small/JL/en-US/${gCode}.png`,
    `${base}/images/small/JL/en-us/${gCode}.png`,
  ];
  const larges = [
    `${base}/images/large/JL/en-US/${gCode}.png`,
    `${base}/large/JL/en-US/${gCode}.png`,
    `${base}/images/large/JL/en-us/${gCode}.png`,
  ];
  // Neutral fallback still constrained to en-US on the same host
  const neutrals = [
    `${base}/JL/en-US/${gCode}.png`,
    `${base}/JL/en-us/${gCode}.png`,
  ];
  const candidates = (
    prefer === "small" ? [...smalls, ...larges] : [...larges, ...smalls]
  ).concat(neutrals);

  const [idx, setIdx] = React.useState(0);
  const src = candidates[Math.min(idx, candidates.length - 1)];

  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      loading="eager"
      onError={() => setIdx((i) => (i + 1 < candidates.length ? i + 1 : i))}
      className="w-full h-full object-cover"
    />
  );
}

function JEImage({ gCode, alt }: { gCode: string; alt: string }) {
  // Build: https://test.zyronetworks.shop/294x400/JL_294x400_GameIDNNN_en-US.png
  const base = "https://test.zyronetworks.shop/294x400";
  const pad3 = (n: string) => {
    if (!n || n === undefined || n === null) return "000";
    return n.toString().padStart(3, "0");
  };
  const src = `${base}/JL_294x400_GameID${pad3(gCode)}_en-US.png`;

  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      loading="eager"
      className="w-full h-full object-cover"
    />
  );
}

function JEBannerImage({
  gCode,
  alt,
  fallbackSrc,
}: {
  gCode: string;
  alt: string;
  fallbackSrc?: string;
}) {
  // Build: https://test.zyronetworks.shop/590x193/JL_590x193_GameIDNNN_en-US.png
  const base = "https://test.zyronetworks.shop/590x193";
  const pad3 = (n: string) => {
    if (!n || n === undefined || n === null) return "000";
    return n.toString().padStart(3, "0");
  };
  const src = `${base}/JL_590x193_GameID${pad3(gCode)}_en-US.png`;

  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      loading="eager"
      className="w-full h-full object-cover"
      onError={(e) => {
        if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
          e.currentTarget.src = fallbackSrc;
        }
      }}
    />
  );
}

// Small utility to pick random items without mutating original
function pickRandom<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

export default function HomePage() {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [balance, setBalance] = useState<string>("Loading...");
  const [username, setUsername] = useState<string>("");
  const [userCredentials, setUserCredentials] =
    useState<UserCredentials | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [gameLoading, setGameLoading] = useState<GameLoadingState>({
    isLoading: false,
    progress: 0,
    gameName: "",
  });
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false);
  const [showInsufficientBalancePopup, setShowInsufficientBalancePopup] =
    useState(false);
  const [showDailyRewardsPopup, setShowDailyRewardsPopup] = useState(false);
  const [claimedRewards, setClaimedRewards] = useState<number[]>([]);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [categoryPages, setCategoryPages] = useState({
    SL: 0,
    FH: 0,
    CB: 0,
    OT: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const loadUserDataAndBalance = async () => {
      try {
        const storedCredentials = localStorage.getItem("userCredentials");
        if (storedCredentials) {
          const credentials: UserCredentials = JSON.parse(storedCredentials);
          setUsername(credentials.username);
          setUserCredentials(credentials);
          await fetchBalance(credentials.username, credentials.password);
        } else {
          setBalance("0");
          setIsLoadingBalance(false);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setBalance("Error");
        setIsLoadingBalance(false);
      }
    };

    loadUserDataAndBalance();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const refer = params.get("refer");
    if (refer) {
      try {
        localStorage.setItem("referralId", refer);
      } catch (e) {
        // ignore storage failures
      }
      router.replace(`/?register=1&refer=${encodeURIComponent(refer)}`);
    }
  }, [router]);

  // Banner auto-slide effect (only for vertical view)
  useEffect(() => {
    if (!isHorizontal) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % bannerData.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isHorizontal]);

  // Show welcome notification on first load
  useEffect(() => {
    const hasShownWelcome = localStorage.getItem("hasShownWelcome");
    if (userCredentials && !hasShownWelcome) {
      setShowWelcomeNotification(true);
      localStorage.setItem("hasShownWelcome", "true");

      const timer = setTimeout(() => {
        setShowWelcomeNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [userCredentials]);

  useEffect(() => {
    const checkDailyRewards = () => {
      const today = new Date().toDateString();
      const lastShown = localStorage.getItem("dailyRewardsLastShown");
      const todaysClaimed = JSON.parse(
        localStorage.getItem("todayClaimedRewards") || "[]",
      );

      if (lastShown !== today && userCredentials) {
        // Reset claimed rewards for new day
        localStorage.setItem("todayClaimedRewards", "[]");
        setClaimedRewards([]);
        setShowDailyRewardsPopup(true);
        localStorage.setItem("dailyRewardsLastShown", today);
      } else {
        setClaimedRewards(todaysClaimed);
      }
    };

    if (userCredentials) {
      checkDailyRewards();
    }
  }, [userCredentials]);

  const fetchBalance = async (username: string, password: string) => {
    try {
      setIsLoadingBalance(true);
      const response = await fetch(
        `/api/auth/balance?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      );
      const data = await response.json();

      if (data.success) {
        const balanceValue = data.balance || data.rawResponse || "0";
        setBalance(balanceValue.toString());
      } else {
        setBalance("Error");
        console.error("Balance fetch failed:", data.message);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("Error");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const refreshBalance = async () => {
    if (userCredentials) {
      await fetchBalance(userCredentials.username, userCredentials.password);
    }
  };

  const checkBalance = () => {
    const numericBalance = Number.parseFloat(balance);
    return !isNaN(numericBalance) && numericBalance >= 10;
  };

  const launchGame = async (
    gameCode: string,
    gameType: string,
    gameName: string,
    Pvcode: string,
  ) => {
    if (!userCredentials) {
      alert("Please login to play games");
      return;
    }

    if (!checkBalance()) {
      setShowInsufficientBalancePopup(true);
      return;
    }
    console.log(Pvcode);
    setGameLoading({
      isLoading: true,
      progress: 0,
      gameName: gameName,
    });

    const progressInterval = setInterval(() => {
      setGameLoading((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 15, 90),
      }));
    }, 200);

    try {
      const params = new URLSearchParams({
        username: userCredentials.username,
        password: userCredentials.password,
        type: gameType,
        provider_code: Pvcode,
        gameid: gameCode,
        lang: "en-US",
        html5: "1",
      });

      console.log(params.toString());

      const response = await fetch(
        `/api/auth/launch-game?${params.toString()}`,
      );
      const data = await response.json();

      clearInterval(progressInterval);
      setGameLoading((prev) => ({ ...prev, progress: 100 }));

      if (data.success && data.data) {
        if (data.data.gameUrl || data.data.url) {
          const gameUrl = data.data.gameUrl || data.data.url;
          setTimeout(() => {
            window.location.href = gameUrl;
          }, 500);
        } else if (data.data.rawResponse) {
          console.log("Game launch response:", data.data.rawResponse);
          setTimeout(() => {
            setGameLoading({ isLoading: false, progress: 0, gameName: "" });
            alert("Game launched! Check console for details.");
          }, 500);
        } else {
          console.log("Game launch successful:", data.data);
          setTimeout(() => {
            setGameLoading({ isLoading: false, progress: 0, gameName: "" });
            alert("Game launched successfully!");
          }, 500);
        }
      } else {
        console.error("Game launch failed:", data.message);
        setTimeout(() => {
          setGameLoading({ isLoading: false, progress: 0, gameName: "" });
          alert(`Failed to launch game: ${data.message}`);
        }, 500);
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error launching game:", error);
      setTimeout(() => {
        setGameLoading({ isLoading: false, progress: 0, gameName: "" });
        alert("Failed to launch game. Please try again.");
      }, 500);
    }
  };

  const claimReward = (day: number) => {
    const newClaimedRewards = [...claimedRewards, day];
    setClaimedRewards(newClaimedRewards);
    localStorage.setItem(
      "todayClaimedRewards",
      JSON.stringify(newClaimedRewards),
    );
  };

  const handleBannerClick = (banner: any) => {
    if (banner.name === "Daily Rewards" || banner.type === "PROMO") {
      setShowDailyRewardsPopup(true);
    }
  };

  const formatBalance = (balance: string) => {
    if (balance === "Loading..." || balance === "Error") return balance;
    try {
      const num = Number.parseFloat(balance);
      if (isNaN(num)) return balance;
      return num.toLocaleString();
    } catch {
      return balance;
    }
  };

  const getGameTypeLabel = (type: string) => {
    switch (type) {
      case "SL":
        return "Slots";
      case "FH":
        return "Fishing";
      case "CB":
        return "Cards";
      case "OT":
        return "Others";
      default:
        return "Game";
    }
  };

  const getGameTypeIcon = (type: string) => {
    switch (type) {
      case "SL":
        return <Gamepad2 size={16} />;
      case "FH":
        return <Fish size={16} />;
      case "CB":
        return <Spade size={16} />;
      case "OT":
        return <Zap size={16} />;
      default:
    }
  };

  const nextPage = (category: string) => {
    const categoryGames = filteredGames.filter(
      (game) => game.p_type === category,
    );
    const maxPages = Math.ceil(categoryGames.length / 9);
    setCategoryPages((prev) => ({
      ...prev,
      [category]: (prev[category] + 1) % maxPages,
    }));
  };

  const prevPage = (category: string) => {
    const categoryGames = filteredGames.filter(
      (game) => game.p_type === category,
    );
    const maxPages = Math.ceil(categoryGames.length / 9);
    setCategoryPages((prev) => ({
      ...prev,
      [category]: prev[category] > 0 ? prev[category] - 1 : maxPages - 1,
    }));
  };

  const getCategoryGames = (category: string) => {
    const categoryGames = filteredGames.filter(
      (game) => game.p_type === category,
    );
    const startIndex = categoryPages[category] * 9;
    return categoryGames.slice(startIndex, startIndex + 9);
  };

  const filteredGames = gameCardsData.filter((game) => {
    const matchesFilter =
      selectedFilter === "ALL" || game.p_type === selectedFilter;
    return matchesFilter;
  });
  const NfilteredGames = NgameCardsData.filter((game) => {
    const matchesFilter =
      selectedFilter === "ALL" || game.p_type === selectedFilter;
    return matchesFilter;
  });

  const handleGifClick = async () => {
    if (!userCredentials) {
      alert("Please login to play games");
      return;
    }
    launchGame("0", "LC", "Live Casino", "GE");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-burgundy-800 to-burgundy-960 text-white">

      {/* Floating Support Panel with Lucide Play Icon */}
      <div className="fixed right-0 bottom-1/5 z-50 flex items-center">
        {/* Arrow Toggle Button (separate from icon box) */}
        {!isSupportOpen && (
          <button
            onClick={() => setIsSupportOpen(true)}
            className="bg-black/70 text-yellow-400 py-3 rounded-l-md border-t-[1px] border-b-[1px] border-l-[1px] border-white shadow-md"
          >
            <Play size={16} className="rotate-180" />
          </button>
        )}

        {/* Icon Box (when open) */}
        {isSupportOpen && (
          <>
            {/* Arrow to close (separate from icon box) */}
            <button
              onClick={() => setIsSupportOpen(false)}
              className="bg-black/70 text-yellow-400 py-3 rounded-l-md border-t-[1px] border-b-[1px] border-l-[1px] border-white shadow-md"
            >
              <Play size={16}  />
            </button>

            {/* Icon container */}
            <div className="flex flex-col items-center gap-4 bg-black/60 border-t-1 border-b-1 border-l-1 border-white rounded-l-md px-2 py-2">
              <img
                src="/assets/telegram-icon.png"
                alt="Telegram"
                className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                onClick={() => window.open("https://t.me/", "_blank")}
              />

              <img
                src="/assets/customer-service.png"
                alt="Customer Service"
                className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                onClick={() =>
                  window.open(
                    "https://tawk.to/chat/6866187edeea8b190aa3570d/1iv7cvc8b",
                    "_blank"
                  )
                }
              />
            </div>
          </>
        )}
      </div>
      {/* Insufficient Balance Popup */}
      {showInsufficientBalancePopup && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-black via-gray-900 to-gray-900/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-yellow-500/30 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
                <Wallet size={32} className="text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">
                Insufficient Balance
              </h2>
              <p className="text-yellow-200 mb-4">
                You need at least ₹10 to play games
              </p>

              <div className="bg-black/50 rounded-lg p-4 mb-6 border border-yellow-500/20">
                <p className="text-gray-300 text-sm mb-1">Current Balance</p>
                <p className="text-3xl font-bold text-yellow-400">
                  ₹{formatBalance(balance)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowInsufficientBalancePopup(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors border border-gray-600"
                >
                  Cancel
                </button>
                <Link
                  href="/deposit"
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-all text-center border border-yellow-400/30"
                  onClick={() => setShowInsufficientBalancePopup(false)}
                >
                  Add Cash
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Window Loading Overlay */}
      {gameLoading.isLoading && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="mb-8">
              <div className="w-24 h-24 border-4 border-yellow-500/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2 text-yellow-400">
                Launching {gameLoading.gameName}
              </h2>
              <p className="text-gray-300">
                Please wait while we prepare your game...
              </p>
            </div>

            <div className="w-full bg-black/50 rounded-full h-3 mb-4 border border-yellow-500/20">
              <div
                className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${gameLoading.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">
              {Math.round(gameLoading.progress)}% Complete
            </p>
          </div>
        </div>
      )}

      {/* Header */}

      {/* Floating Welcome Notification */}
      {showWelcomeNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-500">
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-6 py-3 rounded-full shadow-lg backdrop-blur-sm border border-yellow-400/30">
            <p className="text-sm md:text-base font-bold">
              Welcome back, {username}! 🎮
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isHorizontal ? (
        /* Horizontal Layout */
        <div className="flex h-[calc(100vh-60px)]">
          {/* Vertical Banner */}

          {/* Left Sidebar */}
          <div className="w-16 bg-black/80 backdrop-blur-sm border-r border-yellow-500/20 flex flex-col items-center py-2 space-y-2">
            <button
              onClick={() => setSelectedFilter("ALL")}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors border ${
                selectedFilter === "ALL"
                  ? "bg-yellow-600 text-black border-yellow-400"
                  : "bg-black/60 text-yellow-400 hover:bg-black/80 border-yellow-500/30"
              }`}
            ></button>
            {[
              { key: "SL", label: "Slots", icon: "🎰" },
              { key: "FH", label: "Fishing", icon: "🐟" },
              { key: "CB", label: "Cards", icon: "🃏" },
              { key: "OT", label: "Others", icon: "🎮" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors border ${
                  selectedFilter === f.key
                    ? "bg-yellow-600 text-black border-yellow-400"
                    : "bg-black/60 text-yellow-400 hover:bg-black/80 border-yellow-500/30"
                }`}
              >
                {getGameTypeIcon(f.key)}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden p-2">
            {/* Games Section - 2 Rows */}
            {/* use JEImage in the small horizontal scroller for JE games */}
            <div className="h-full overflow-x-auto scrollbar-hide">
              <div
                className="grid grid-rows-2 grid-flow-col gap-2 h-full"
                style={{ width: "max-content" }}
              >
                {filteredGames.slice(0, 20).map((game) => (
                  <div
                    key={game.g_code}
                    className="relative cursor-pointer hover:scale-105 transition-all duration-300 group"
                    onClick={() =>
                      launchGame(
                        game.g_code,
                        game.p_type,
                        game.gameName,
                        game.Pcode,
                      )
                    }
                  >
                    <div className="relative w-28 h-36 bg-gradient-to-br from-black via-gray-900 to-black rounded-lg overflow-hidden shadow-lg border border-yellow-500/30">
                      <JEImage gCode={game.g_code} alt={game.gameName} />
                    </div>
                    <div className="mt-1 text-[11px] text-center text-yellow-200 line-clamp-1">
                      {game.gameName}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2">
                {pickRandom(filteredGames, 10).map((game) => (
                  <button
                    key={`je-banner-${game.g_code}`}
                    onClick={() =>
                      launchGame(
                        game.g_code,
                        game.p_type,
                        game.gameName,
                        game.Pcode,
                      )
                    }
                    className="relative flex-shrink-0 w-[295px] md:w-[360px] aspect-[590/193] rounded-lg overflow-hidden bg-black/70 border border-yellow-500/20 hover:border-yellow-400/40 transition-colors"
                    aria-label={`Play ${game.gameName}`}
                  >
                    <JEBannerImage
                      gCode={game.g_code}
                      alt={game.gameName}
                      fallbackSrc={game.imgFileName}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Vertical Layout - Redesigned with 3x3 Category Grids */
        <div className="max-w-6xl mx-auto p-2 md:p-6 space-y-6 md:space-y-6 pb-20 bg-gradient-to-br from-purple-900/20 via-red-900/20 to-black/20 backdrop-blur-sm">
          {/* Banner Slider */}
          <div className="relative w-full border border-yellow-400 h-40 md:h-60 lg:h-72 mb-4 mt-2 md:mb-8 overflow-hidden rounded-xl md:rounded-2xl ">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {bannerData.map((banner, index) => (
                <div
                  key={index}
                  className="relative w-full h-full flex-shrink-0 cursor-pointer"
                  onClick={() => handleBannerClick(banner)}
                >
                  <img
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  {/* Banner title overlay */}
                </div>
              ))}
            </div>

            {/* Banner Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {bannerData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentBanner === index ? "bg-yellow-400" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* vip status search , vip and wallet icon */}
            <div className="flex items-center space-x-6 bg-white/ p-4 rounded-lg shadow-md">
              <div className="bg-gradient-to-r from-red-500 to-orange-400/40 text-yellow-400 font-bold px-3 py-1 rounded-full text-sm">
                VIP2
              </div>
                <div className="flex flex-row gap-5 absolute right-4 ">

              <div className="flex flex-col items-center text-xs text-yellow-200">
                <img
                  src="/assets/search.png"
                  alt="Search"
                  className="w-5 h-5 mb-1"
                />
                <span>Search</span>
              </div>

              <a
                href="/vip"
                className="flex flex-col items-center text-xs text-yellow-200"
              >
                <img src="/assets/vip.png" alt="VIP" className="w-5 h-5 mb-1" />
                <span>VIP</span>
              </a>

              <a
                href="/wallet"
                className="flex flex-col items-center text-xs text-yellow-200"
              >
                <img
                  src="/assets/wallet.png"
                  alt="Wallet"
                  className="w-5 h-5 mb-1"
                />
                <span>Wallet</span>
              </a>

              </div>
              </div>


            {/* Category Filter Buttons */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 py-2">
              <button
                onClick={() => setSelectedFilter("ALL")}
                className={`flex items-center gap-2 text-shadow-regal-blue pl-1 pr-10 bg-[#450b00] shodow-r rounded-sm whitespace-nowrap transition-colors ${
                  selectedFilter === "ALL" ? " text-white " : " text-white/70 "
                }`}
              >
                <Image
                  src={hotIcon}
                  alt="Hot"
                  className=" w-6 h-6 bg-gradient-to-r  from-yellow-500/30 to-red-500 rounded-lg flex items-start "
                />
                Hot
              </button>

              {[
                { key: "SL", label: "Slots", img: "slot.png" },
                { key: "FH", label: "Live", img: "casino.png" },
                { key: "CB", label: "Cards", img: "cards.png" },
                { key: "OT", label: "Others", img: "bell.png" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`flex items-center gap-1 p-0 pl-1 pr-10 bg-[#450b00] rounded-sm whitespace-nowrap transition-colors ${
                    selectedFilter === filter.key
                      ? " text-white "
                      : " text-white "
                  }`}
                >
                  <img
                    src={`/assets/${filter.img}`}
                    alt={filter.label}
                    className="w-6 h-5  bg-gradient-to-r from-yellow-500/30 to-red-500 rounded-lg flex items-center justify-center"
                  />
                  {filter.label}
                </button>
              ))}
            </div>
            {/* Slots Games Category */}
            {filteredGames.filter((game) => game.p_type === "SL").length >
              0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-500/30 to-red-500 rounded-lg flex items-center justify-center ">
                      <Image src={hotIcon} alt="Logo 1" className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl text-yellow-300 drop-shadow-lg">
                      Slots{" "}
                    </h2>
                    <h2 className="text-xl md:text-2xl text-white drop-shadow-lg">
                      {" "}
                      Games
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-200 text-sm drop-shadow-md">
                      All{" "}
                      {
                        filteredGames.filter((game) => game.p_type === "SL")
                          .length
                      }
                    </span>
                    <button
                      onClick={() => prevPage("SL")}
                      className="w-8 h-8 bg-black/60 border border-yellow-500/30 rounded-sm flex items-center justify-center text-yellow-400 hover:bg-black/80 transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => nextPage("SL")}
                      className="w-8 h-8 bg-black/60 border border-yellow-500/30 rounded-sm flex items-center justify-center font-bold text-yellow-400 hover:bg-black/80 transition-colors"
                    >
                      ›
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {getCategoryGames("SL").map((game) => (
                    <div
                      key={`slots-grid-${game.g_code}`}
                      className="relative cursor-pointer hover:scale-105 transition-all duration-300 group"
                      onClick={() =>
                        launchGame(
                          game.g_code,
                          game.p_type,
                          game.gameName,
                          game.Pcode,
                        )
                      }
                    >
                      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-black via-gray-900 to-black rounded-xl overflow-hidden shadow-lg border border-yellow-500/30">
                        <JEImage gCode={game.g_code} alt={game.gameName} />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0">
                          <h3 className="text-yellow-300 font-bold text-xs text-center truncate opacity-0">
                            {game.gameName}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fishing Games Category */}
            {filteredGames.filter((game) => game.p_type === "FH").length >
              0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                      <img src="fish" alt="Logo 1" className="h-8 w-auto" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                      Fishing Games
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-200 text-sm drop-shadow-md">
                      All{" "}
                      {
                        filteredGames.filter((game) => game.p_type === "FH")
                          .length
                      }
                    </span>
                    <button
                      onClick={() => prevPage("FH")}
                      className="w-8 h-8 bg-black/60 border border-yellow-500/30 rounded-lg flex items-center justify-center text-yellow-400 hover:bg-black/80 transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => nextPage("FH")}
                      className="w-8 h-8 bg-black/60 border border-yellow-500/30 rounded-lg flex items-center justify-center text-yellow-400 hover:bg-black/80 transition-colors"
                    >
                      ›
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {getCategoryGames("FH").map((game) => (
                    <div
                      key={`fishing-grid-${game.g_code}`}
                      className="relative cursor-pointer hover:scale-105 transition-all duration-300 group"
                      onClick={() =>
                        launchGame(
                          game.g_code,
                          game.p_type,
                          game.gameName,
                          game.Pcode,
                        )
                      }
                    >
                      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-black via-gray-900 to-black rounded-xl overflow-hidden shadow-lg border border-yellow-500/30">
                        <JEImage gCode={game.g_code} alt={game.gameName} />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0">
                          <h3 className="text-yellow-300 font-bold text-xs text-center truncate">
                            {game.gameName}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card Games Category */}
            {filteredGames.filter((game) => game.p_type === "CB").length >
              0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Image src={cardIcon} alt="Logo 1" className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl text-yellow-400 drop-shadow-lg">
                      Cards{" "}
                    </h2>
                    <h2 className="text-xl md:text-2xl text-white drop-shadow-lg">
                      {" "}
                      Games
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-200 text-sm drop-shadow-md">
                      All{" "}
                      {
                        filteredGames.filter((game) => game.p_type === "CB")
                          .length
                      }
                    </span>
                    <button
                      onClick={() => prevPage("CB")}
                      className="w-8 h-8 bg-black/60 border border-yellow-500/30 rounded-lg flex items-center justify-center text-yellow-400 hover:bg-black/80 transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => nextPage("CB")}
                      className="w-8 h-8 bg-black/60 border border-yellow-500/30 rounded-lg flex items-center justify-center text-yellow-400 hover:bg-black/80 transition-colors"
                    >
                      ›
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {getCategoryGames("CB").map((game) => (
                    <div
                      key={`cards-grid-${game.g_code}`}
                      className="relative cursor-pointer hover:scale-105 transition-all duration-300 group"
                      onClick={() =>
                        launchGame(
                          game.g_code,
                          game.p_type,
                          game.gameName,
                          game.Pcode,
                        )
                      }
                    >
                      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-black via-gray-900 to-black rounded-xl overflow-hidden shadow-lg border border-yellow-500/30">
                        <JEImage gCode={game.g_code} alt={game.gameName} />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0">
                          <h3 className="text-yellow-300 font-bold text-xs text-center truncate opacity-0">
                            {game.gameName}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Games Category */}
            {filteredGames.filter((game) => game.p_type === "OT").length >
              0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-500/30 to-red-500 rounded-lg flex items-center justify-center">
                      <Image src={bellIcon} alt="Logo 1" className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl text-yellow-400 drop-shadow-lg">
                      Other{" "}
                    </h2>
                    <h2 className="text-xl md:text-2xl text-white drop-shadow-lg">
                      Games{" "}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-200 text-sm drop-shadow-md">
                      All{" "}
                      {
                        filteredGames.filter((game) => game.p_type === "OT")
                          .length
                      }
                    </span>
                    <button
                      onClick={() => prevPage("OT")}
                      className="w-8 h-8 bg-black/60 border border-yellow-500/30 rounded-sm flex items-center justify-center text-yellow-400 hover:bg-black/80 transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => nextPage("OT")}
                      className="w-8 h-8 bg-black/60 border border-yellow-500/30 rounded-sm flex items-center justify-center text-yellow-400 hover:bg-black/80 transition-colors"
                    >
                      ›
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {getCategoryGames("OT").map((game) => (
                    <div
                      key={`others-grid-${game.g_code}`}
                      className="relative cursor-pointer hover:scale-105 transition-all duration-300 group"
                      onClick={() =>
                        launchGame(
                          game.g_code,
                          game.p_type,
                          game.gameName,
                          game.Pcode,
                        )
                      }
                    >
                      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-black via-gray-900 to-black rounded-lg md:rounded-2xl overflow-hidden shadow-lg md:shadow-2xl border border-yellow-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative w-full h-full md:p-4 flex items-center justify-center p-0">
                          <JEImage
                            gCode={game.g_code}
                            alt={game.gameName}
                            prefer="small"
                          />
                        </div>

                        <div className="absolute top-1 md:top-2 right-1 md:right-2">
                          <span className="bg-black/70 backdrop-blur-sm text-yellow-300 text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full border border-yellow-500/30 opacity-0">
                            {getGameTypeLabel(game.p_type)}
                          </span>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 bg-gradient-to-t from-black/80 to-transparent opacity-0" />

                        <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2 right-1 md:right-2 text-center">
                          <h3 className="text-yellow-300 font-bold text-xs md:text-sm drop-shadow-lg truncate opacity-0">
                            {game.gameName}
                          </h3>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Games Section (fallback when search is active) */}
            {filteredGames.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">
                  No games found
                </h3>
                <p className="text-gray-300 drop-shadow-md">
                  Try adjusting your filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
