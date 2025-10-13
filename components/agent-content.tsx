"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DollarSign, CircleCheckBig,UserPlus, Copy, QrCode, Users, UserCheck, HelpCircle } from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

interface AgentContentProps {
  activeTab: string
}

type Creds = { username: string; password: string }

type UserData = {
  totalReferrals?: number
  referrals?: { referredUsername: string; date: string; _id: string }[]
  referralCode?: string
}

function readCredentialsFromLocalStorage(): Creds | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("userCredentials")
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed?.username && parsed?.password) {
      return { username: parsed.username, password: parsed.password }
    }
  } catch {
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        const parsed = JSON.parse(match[0])
        if (parsed?.username && parsed?.password) {
          return { username: parsed.username, password: parsed.password }
        }
      } catch {
        // ignore
      }
    }
  }
  return null
}

function readUserDataFromLocalStorage(): UserData | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("userData")
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveUserDataToLocalStorage(data: UserData) {
  if (typeof window === "undefined") return
  localStorage.setItem("userData", JSON.stringify(data))
}

const AgentContent = ({ activeTab }: AgentContentProps) => {
  const [creds, setCreds] = useState<Creds | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [copied, setCopied] = useState(false)
  const [agentInfo, setAgentInfo] = useState({
  newSubordinatesToday: 0,
  totalSubordinates: 0,
  invitationReward: 0,
  totalCommissions: 0,
  todaysTeamRecharge: 0,
  yesterdaysCommission: 0,
  unclaimedCommission: 0,
});


  // Load credentials and cached userData on mount
  useEffect(() => {
    setCreds(readCredentialsFromLocalStorage())
    const cachedData = readUserDataFromLocalStorage()
    if (cachedData) setUserData(cachedData)
  }, [])

  useEffect(() => {
    if (activeTab === "details" && creds) {
      if (!isLoading) {
        handleFetchDetails()
        handleFetchAgentInfo();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, creds])

  async function handleFetchDetails() {
    try {
      setIsLoading(true)
      setApiError(null)

      const auth = creds ?? readCredentialsFromLocalStorage()
      if (!auth?.username || !auth?.password) {
        throw new Error("Credentials not found in localStorage (key: userCredentials)")
      }

      const res = await fetch("https://game.zyronetworks.shop/get-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: auth.username, password: auth.password }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Request failed (${res.status}): ${text || "Unknown error"}`)
      }

      const json: { success: boolean; user?: UserData } = await res.json()

      if (!json.success || !json.user) throw new Error("Invalid API response")

      setUserData(json.user)
      saveUserDataToLocalStorage(json.user) // ✅ Save to localStorage
    } catch (err: any) {
      setApiError(err?.message || "Failed to fetch details")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleFetchAgentInfo() {
  try {
    if (!creds) return;
    const res = await fetch("https://game.zyronetworks.shop/agent-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: creds.username,
        password: creds.password,
      }),
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    if (data.success && data.agentInfo) {
      setAgentInfo(data.agentInfo);
    } else {
      console.error("Invalid agent info response:", data);
    }
  } catch (err) {
    console.error("Failed to fetch agent info:", err);
  }
}


  const totalRegisteredUsers = userData?.totalReferrals ?? 0
  const todaysRegistrations = useMemo(() => {
    const list = userData?.referrals ?? []
    const today = new Date().toDateString()
    return list.reduce((acc, r) => acc + (new Date(r.date).toDateString() === today ? 1 : 0), 0)
  }, [userData])

  

  const invitationLink = useMemo(() => {
    if (!userData?.referralCode) return ""
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    return `${origin}?refer=${encodeURIComponent(userData.referralCode)}`
  }, [userData])

  const handleCopyInvitation = async () => {
    if (!invitationLink) return;
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Show success icon for 3 seconds
    } catch (e) {
      console.error("Failed to copy invitation link:", e);
    }
  };



  const renderDetailsContent = () => (
    <>
      <div className="p-3 bg-[#2b0d0d] rounded-md border border-dashed border-[#5a2020] mb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs">
            <div className="text-white/70">
              {creds?.username ? (
                <>
                  Hello <span className="text-white font-semibold">{creds.username}</span>
                </>
              ) : (
                <span className="text-red-300">No credentials found in localStorage</span>
              )}
            </div>
            {apiError ? <div className="text-red-400 mt-1">{apiError}</div> : null}
            {!apiError && userData ? <div className="text-green-400 mt-1">Refreshed</div> : null}
          </div>
          <Button
            onClick={handleFetchDetails}
            disabled={!creds || isLoading}
            className="bg-gradient-to-b from-yellow-300 via-golden to-yellow-600 text-black  px-2 py-1 rounded-lg border border-yellow-400 hover:from-yellow-400 hover:via-golden hover:to-yellow-700 disabled:opacity-60"
          >
            {isLoading ? "Fetching..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="p-4 bg-[#2b0d0d] rounded-md">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-yellow-400" />
          <h3 className="text-base font-semibold text-white">Withdrawable commission</h3>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-[#3a1010] rounded-full px-4 py-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-black font-bold">
              ₹
            </span>
            <span className="text-yellow-400 font-bold text-lg">0</span>
          </div>

          <div className="flex justify-center relative">
            <Button
              className="bg-gradient-to-b from-yellow-300 via-golden to-yellow-600 text-black  py-1 px-6 rounded-lg text-base hover:from-yellow-400 hover:via-golden hover:to-yellow-700 transition-all duration-300 shadow-lg border border-yellow-400 relative overflow-hidden"
              size="lg"
              data-testid="button-withdraw"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 rounded-full"></div>
              <div className="absolute top-1 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
              <span className="relative z-10 tracking-wide">Claim</span>
            </Button>
          </div>
        </div>

        <p className="text-white/70 text-sm">An independent withdrawal system that everyone can participate in</p>
      </div>

      <hr className="border-t border-dotted border-[#ffe925] opacity-100 my-1" />

      <div className="p-4 bg-[#2b0d0d] rounded-md border border-dashed border-[#5a2020]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-400" />
            <h3 className="text-base font-semibold text-white">Invite friends to get</h3>
          </div>
          <QrCode className="w-6 h-6 text-white/70" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-yellow-400 text-sm font-bold">₹ 50/People</div>
            <div className="text-white/70 text-xs">Invitation Reward</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 text-sm font-bold">Up to 15%</div>
            <div className="text-white/70 text-xs">Commission Reward</div>
          </div>
        </div>

        <p className="text-white/70 text-xs mb-4">
          For each friend you invite, you will receive ₹ 50, plus a 15% commission on their recharge amount. Commissions
          are settled daily
        </p>

        <div className="mb-4">
          <label className="text-xs text-white/70 mb-1 block">Invitation Link</label>
          <div className="flex items-center border border-yellow-400 rounded-md overflow-hidden">
            <Input
              value={invitationLink}
              readOnly
              placeholder="Generating..."
              className="flex-1 bg-[#2b0d0d] px-2 py-1 text-sm text-white/80 border-none outline-none"
            />
            <Button
            
              onClick={handleCopyInvitation}
              disabled={!invitationLink}
              title={copied ? "Copied!" : "Copy link"}
              className="bg-green-500/80 w-6 h-7 p-0 border-white border-1 rounded-sm mr-1 hover:bg-green-500/90 transition-colors"
            >
              {copied ? (
                <CircleCheckBig className="w-4 h-5 text-yellow-400" />
              ) : (
                <Copy className="w-4 h-5 text-yellow-400" />
              )}
            </Button>


          </div>
          <div className="text-[11px] text-white/60 mt-1">
            {userData?.referralCode ? (
              <>
                Your code: <span className="text-yellow-300 font-semibold">{userData.referralCode}</span>
              </>
            ) : (
              <>Fetching referral code…</>
            )}
          </div>
        </div>

        <div className="text-center">
            <p className="text-xs text-white/70 mb-2">Share to social Media</p>
            <div className="flex justify-center gap-3">
              {/* Telegram */}
              <Button
                size="sm"
                onClick={() =>
                  window.open(
                    `https://t.me/share/url?url=${encodeURIComponent(invitationLink)}&text=Join%20me%20using%20this%20link`,
                    "_blank"
                  )
                }
                className="rounded-lg w-12 h-12 p-0 bg-black/50 border border-gray-500"
              >
                <Image
                  src="/assets/telegram-icon.png"
                  alt="Telegram"
                  width={44}
                  height={44}
                  className="rounded"
                />
              </Button>

              {/* WhatsApp */}
              <Button
                size="sm"
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(invitationLink)}`,
                    "_blank"
                  )
                }
                className="rounded-lg w-12 h-12 p-0 bg-black/50 border border-gray-500"
              >
                <Image
                  src="/images/whatsapp-icon.png"
                  alt="WhatsApp"
                  width={44}
                  height={44}
                  className="rounded"
                />
              </Button>

              {/* Native Share API */}
              <Button
                size="sm"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Join me!",
                      text: "Check out this invitation link:",
                      url: invitationLink,
                    });
                  } else {
                    alert("Sharing is not supported on this device.");
                  }
                }}
                className="rounded-lg w-12 h-12 p-0 bg-black/50 border border-gray-500"
              >
                <Image
                  src="/images/share-icon.png"
                  alt="Share Link"
                  width={44}
                  height={44}
                  className="rounded"
                />
              </Button>
            </div>
          </div>
      </div>

      <hr className="border-t border-dotted border-[#ffe925] opacity-100 my-1" />

      <div className="p-4 bg-[#2b0d0d] rounded-md border border-dashed border-[#5a2020]">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-orange-400" />
          <h3 className="text-base font-semibold text-white">Invitation Details (Successful Registrations)</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-white/70 text-xs mb-1">Today's Registrations</div>
            <div className="text-yellow-400 text-lg font-bold">{todaysRegistrations} People</div>
          </div>
          <div className="text-center">
            <div className="text-white/70 text-xs mb-1">Total Registered Users</div>
            <div className="text-yellow-400 text-lg font-bold">{totalRegisteredUsers} People</div>
          </div>
        </div>

        <p className="text-white/70 text-xs">
          The above number represents the number of people who successfully registered in the game through the inviter.
          To successfully bind subordinates, the invited person must also recharge in the game.
        </p>
      </div>

      <div className="p-4 bg-[#2b0d0d] rounded-md">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Subordinate Details (Successful Binding)</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-white/70 text-sm mb-1">New Subordinates Today</div>
            <div className="text-yellow-400 text-xl font-bold">{agentInfo.newSubordinatesToday} People</div>
          </div>
          <div className="text-center">
            <div className="text-white/70 text-sm mb-1">Total Subordinates</div>
            <div className="text-yellow-400 text-xl font-bold">{agentInfo.totalSubordinates} People</div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/20">
        

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-white/70 text-sm mb-1">Invitation Reward</div>
              <div className="text-yellow-400 text-lg font-bold">₹ {agentInfo.invitationReward}</div>
            </div>
            <div className="text-center">
              <div className="text-white/70 text-sm mb-1">Total Commissions</div>
              <div className="text-yellow-400 text-lg font-bold">₹ {agentInfo.totalCommissions}</div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/20 opacity-50" />

      <div className="bg-[#2b0d0d] p-4 rounded-md">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">How to earn invitation rewards + commission?</h3>
        </div>

        <div className="space-y-4">
          {[
            {
              number: "1",
              title: "Share with your friends",
              description: "Share the download link or QR code with your friends",
            },
            {
              number: "2",
              title: "Friends Download and Register",
              description: "Invite friends to register for the app and become members",
            },
            {
              number: "3",
              title: "Friends Recharge and Place bets",
              description: "Unlock invitation rewards + enjoy agent commissions",
            },
     
          ].map((step) => (
            <div key={step.number} className="flex gap-4 p-3 bg-white/10 rounded-lg border border-white/20">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                  {step.number}
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1 text-sm">
                  {step.title.split(" ").map((word, index) => (
                    <span key={index}>
                      {word === "Download"  || word === "Friends" || word === "Valid" || word === "Register" || word === "Recharge" || word === "bets" ? (
                        <span className="text-yellow-400">{word}</span>
                      ) : (
                        word
                      )}
                      {index < step.title.split(" ").length - 1 ? " " : ""}
                    </span>
                  ))}
                </h4>
                <p className="text-white/70 text-xs">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  const renderCommissionContent = () => (
    <>
     
      

      <div className="bg-[#2b0d0d] rounded-xl p-6 relative w-full">
        <h3 className="pb-2 text-base font-bold flex justify-center  text-green-500">Invite friends to get
        
        </h3> <p className="mb-8 flex justify-center font-semibold text-[12px] text-yellow-400"> Real-time commission calculation, updated every 15 min.
 </p>
       
        <div className="grid grid-cols-2 text-center gap-4 mb-6">
          <div>
            <div className="text-white mb-3 text-sm">Today's Commisssion</div>
            <div className="text-[#ffe925] text-sm mb-8 font-bold">₹ {agentInfo.totalCommissions}</div>
            <div className="mt-3 text-white mb-3 text-sm">Yesterday's Commission</div>
            <div className="text-[#ffe925] text-sm mb-8 font-bold">₹ {agentInfo.yesterdaysCommission}</div>
          </div>
          <div>
            <div className="text-white mb-3 text-sm">Today's Team Recharge</div>
            <div className="text-[#ffe925] text-sm mb-8 font-bold">₹ {agentInfo.todaysTeamRecharge}</div>
            <div className="mt-3 text-white mb-3 text-sm">Unclaimed Commission</div>
            <div className="text-[#ffe925] text-sm mb-8 font-bold">₹ {agentInfo.unclaimedCommission}</div>
          </div>
        </div>
        <div className="flex justify-center relative">
          <Button
            className="bg-gradient-to-b from-yellow-300 via-golden to-yellow-600 text-black  py-1 px-6 rounded-lg text-base hover:from-yellow-400 hover:via-golden hover:to-yellow-700 transition-all duration-300 shadow-lg border border-yellow-400 relative overflow-hidden"
            size="lg"
            data-testid="button-withdraw"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 rounded-full"></div>
            <div className="absolute top-1 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
            <span className="relative z-10 tracking-wide">Claim</span>
          </Button>
        </div>
      </div>

      <div className="max-w-xl mx-auto bg-[#2b0d0d] rounded-xl p-6 relative">
        <div className="text-white text-lg flex items-center mb-3">
          <svg className="w-5 h-5 mr-2 text-[#7ec4ff]" fill="none" />
          Commission  Rules
        </div>
        <div className="flex justify-center items-center mb-8">
          {/* Avatar icons go here */}
          {/* Connector lines (use absolute or border classes) */}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-white">Invitation Reward</div>
            <div className="text-[#ffe925]">50</div>
            <div className="text-white mt-3">Recharge</div>
            <div className="text-[#ffe925]">300-2000</div>
            <div className="text-white mt-3">Commission</div>
            <div className="text-[#ffe925]">2000*0.05</div>
            <div className="text-[#ffe925]">(Actual:100)</div>
          </div>
          <div>
            <div className="text-white">Invitation Reward</div>
            <div className="text-[#ffe925]">50</div>
            <div className="text-white mt-3">Recharge</div>
            <div className="text-[#ffe925]">2001-15000</div>
            <div className="text-white mt-3">Commission</div>
            <div className="text-[#ffe925]">15000*0.07</div>
            <div className="text-[#ffe925]">(Actual:1050)</div>
          </div>
          <div>
            <div className="text-white">Invitation Reward</div>
            <div className="text-[#ffe925]">50</div>
            <div className="text-white mt-3">Recharge</div>
            <div className="text-[#ffe925]">15001+</div>
            <div className="text-white mt-3">Commission</div>
            <div className="text-[#ffe925]">15000*0.09</div>
            <div className="text-[#ffe925]">(Actual:1350)</div>
          </div>
        </div>
        <hr className="absolute bottom-0 left-0 w-full border-t-2 border-dotted border-[#ffe925] rounded-b-xl" />
      </div>
    </>
  )

  const renderRulesContent = () => (
    <div className="max-w-2xl mx-auto bg-[#421a1b] rounded-xl p-6 text-white font-sans space-y-10 shadow-lg px-2.5">
      <div>
        <h1 className="font-bold text-xl mb-2 text-center">Agent Reward Program</h1>
        <p className="mb-2">
          Dear Agent Partner, thank you for joining our family! Below are the reward rules you can enjoy as an agent,
          simple and clear, allowing you to earn profits effortlessly!
        </p>
        <h2 className="font-semibold mb-1">Dual Income for Agents</h2>
        <span>As our agent, you will enjoy two main sources of income:</span>
      </div>

      <div>
        <h2 className="font-semibold mb-1">1. Paid User Rewards</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border border-[#c6b9a7] mb-3">
            <thead className="bg-[#573138]">
              <tr>
                <th className="border border-[#c6b9a7] px-3 py-2">Item</th>
                <th className="border border-[#c6b9a7] px-3 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-[#c6b9a7] px-3 py-2">Reward Amount</td>
                <td className="border border-[#c6b9a7] px-3 py-2 text-[#ffe925]">₹50 for each valid user</td>
              </tr>
              <tr>
                <td className="border border-[#c6b9a7] px-3 py-2">Reward Limit</td>
                <td className="border border-[#c6b9a7] px-3 py-2">Maximum 20 valid users</td>
              </tr>
              <tr>
                <td className="border border-[#c6b9a7] px-3 py-2">Valid User Definition</td>
                <td className="border border-[#c6b9a7] px-3 py-2">
                  User is considered valid when recharge reaches ₹300
                </td>
              </tr>
              <tr>
                <td className="border border-[#c6b9a7] px-3 py-2">Settlement Method</td>
                <td className="border border-[#c6b9a7] px-3 py-2">Automatically calculated and distributed</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-1">
          When a new user you invite recharges ₹500, you will receive a ₹50 reward. You can receive rewards for up to 20
          users!
        </p>
      </div>

      <div>
        <h2 className="font-semibold mb-1">2. Subordinate Recharge Rewards</h2>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-sm text-center border border-[#c6b9a7]">
            <thead className="bg-[#573138]">
              <tr>
                <th className="border border-[#c6b9a7] px-1.7 py-1">Subordinate's Total Recharge Amount</th>
                <th className="border border-[#c6b9a7] px-1.7 py-1">Your Reward Percentage</th>
                <th className="border border-[#c6b9a7] px-1.7 py-1">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-[#c6b9a7] px-3 py-2">₹300–₹2,000</td>
                <td className="border border-[#c6b9a7] px-3 py-2 text-[#ffe925]">5%</td>
                <td className="border border-[#c6b9a7] px-3 py-2">Subordinate recharges ₹2,000, you receive ₹100</td>
              </tr>
              <tr>
                <td className="border border-[#c6b9a7] px-3 py-2">₹2,001–₹15,000</td>
                <td className="border border-[#c6b9a7] px-3 py-2 text-[#ffe925]">7%</td>
                <td className="border border-[#c6b9a7] px-3 py-2">Subordinate recharges ₹15,000, you receive ₹1050</td>
              </tr>
              <tr>
                <td className="border border-[#c6b9a7] px-3 py-2">₹15,001 and above</td>
                <td className="border border-[#c6b9a7] px-3 py-2 text-[#ffe925]">9%</td>
                <td className="border border-[#c6b9a7] px-3 py-2">Subordinate recharges ₹15,001, you receive ₹1350</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-sm mb-3">
          The more your subordinate users recharge, the higher percentage of rewards you receive! Rewards are settled
          daily, and the system will automatically calculate and distribute them to your agent account balance.
        </div>
        <div>
          <span className="font-semibold text-base">Reward Distribution Instructions</span>
          <ul className="list-disc ml-6 mt-2 space-y-1 text-sm">
            <li>All rewards will be automatically calculated and distributed to your agent account balance</li>
            <li>Paid user rewards will be distributed within 24 hours after the user meets the conditions</li>
            <li>Subordinate recharge rewards are settled once daily, credited the next day</li>
            <li>Agent account balance can be withdrawn at any time, with no minimum withdrawal amount restriction</li>
          </ul>
        </div>
        <div className="text-xs mt-2 font-medium text-center">*Aura7 reserves all rights of final interpretation*</div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "details":
        return renderDetailsContent()
      case "commission":
        return renderCommissionContent()
      case "rules":
        return renderRulesContent()
      default:
        return renderDetailsContent()
    }
  }

  return <Card className="card-gradient mx-0 rounded-none border-x-0">{renderContent()}</Card>
}

export default AgentContent
