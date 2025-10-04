"use client";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

const faqs = [
  {
    question: "💸 How do I withdraw my winnings?",
    answer:
      "Go to Profile > Wallet > Withdraw, choose your method (UPI, bank, crypto), enter the amount, and confirm. Most withdrawals are processed within 1–24 hours. Make sure your account is verified and meets the minimum withdrawal threshold.",
  },
  {
    question: "💰 What deposit methods are supported?",
    answer:
      "We accept UPI, Paytm, Google Pay, bank transfers, crypto (USDT, BTC), and agent-assisted deposits. Deposits are usually instant. If delayed, contact support with your transaction ID.",
  },
  {
    question: "🧑‍💼 Who is my assigned agent & what do they do?",
    answer:
      "Your agent helps with fast deposits/withdrawals, bonus activation, and account issues. Go to Help > My Agent to view their contact info and working hours. Never share your password or OTP.",
  },
  {
    question: "🎁 How do I claim my bonus?",
    answer:
      "Bonuses include Welcome Bonus, Referral Bonus, and Cashback Bonus. Go to Promotions > Available Bonuses and tap Claim Now. Some bonuses require wagering before withdrawal—check the terms.",
  },
  {
    question: "🔐 What if I forgot my password or can't log in?",
    answer:
      "Tap Forgot Password on the login screen, enter your registered mobile/email, and follow OTP verification. If issues persist, contact Live Chat Support or your agent.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-burgundy-800 via-burgundy-960 to-black text-white pb-10">
      {/* Header */}
      <div className="bg-[#2b0d0d] px-5 py-3 flex items-center justify-between">
        <div className="w-2"></div>
        <h1 className="text-white text-center flex-1 text-lg font-semibold">
          Help & Support
        </h1>
        <Link href="/profile">
          <X className="w-5 h-5 text-white" />
        </Link>
      </div>

      {/* Live Chat */}
      <div className="bg-gradient-to-r from-yellow-500/30 to-red-500 rounded-lg m-3 px-4 py-3 flex items-center gap-3">
        <Image
          src="/assets/customer-service.png"
          alt="Telegram"
          width={32}
          height={32}
          className="rounded-full border-yellow-400 border-[1px]"
          onClick={() =>
          window.open(
            "https://tawk.to/chat/6866187edeea8b190aa3570d/1iv7cvc8b",
            "_blank"
            )}
        />
        <h2 className="text-white text-lg font-medium">Live Chat Support</h2>
      </div>

      {/* Telegram Chat */}
      <div className="bg-gradient-to-r from-yellow-500/30 to-red-500 rounded-lg m-3 px-4 py-3 flex items-center gap-3">
        <Image
          src="/assets/telegram-icon.png"
          alt="Telegram"
          width={32}
          height={32}
          className="rounded-full border-yellow-400 border-[1px]"
          onClick={() =>
          window.open(
            "https://tawk.to/chat/6866187edeea8b190aa3570d/1iv7cvc8b",
            "_blank"
            )}
        />
        <h2 className="text-white text-lg font-medium">Telegram Support</h2>
      </div>

      {/* FAQs */}
      <div className="px-4 mt-6 space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-[#2b0d0d] rounded-md p-4 border border-burgundy-700"
          >
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="w-full text-left text-white font-semibold flex justify-between items-center"
            >
              <span>{faq.question}</span>
              <span>{openIndex === index ? "<" : ">"}</span>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-sm text-gray-300">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

