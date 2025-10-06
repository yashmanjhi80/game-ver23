"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { FileText, ShoppingCart, X, CreditCard,BadgeIndianRupee, Plus, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CashIcon from './asssets/cash-back.png'
import BottomNavigation from "@/components/bottom-navigation"

interface UserCredentials {
  username: string
  password: string
  user?: {
    username: string
    email: string
  }
  loginTime: string
}




const WalletPage = () => {
  const [activeTab, setActiveTab] = useState<"recharge" | "withdraw">("recharge")
  const [selectedAmount, setSelectedAmount] = useState<number>(200)
  const [selectedMethod, setSelectedMethod] = useState<string>("Fpay")
  const [isBindBankOpen, setIsBindBankOpen] = useState(false)
  // ✅ New states for functionality
  const [username, setUsername] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState("")
  

  const amounts = [200, 300, 500, 800, 1000, 1500, 2000, 5000, 10000, 20000, 30000, 50000]
  const withdrawalAmounts = [100, 400, 600, 800, 1000, 2000, 5000, 10000]
  const [usdtAmount, setUsdtAmount] = useState<number>(10)
  const [usdtRate, setUsdtRate] = useState<number>(98.64)

  const paymentMethods = ["Fpay", "LGpay", "USDT"]

  
  const MIN_DEPOSIT = 100
  const MAX_DEPOSIT = 50000

    useEffect(() => {
    // Load user credentials from localStorage
    const storedCredentials = localStorage.getItem("userCredentials")
    if (storedCredentials) {
      const credentials: UserCredentials = JSON.parse(storedCredentials)
      setUsername(credentials.username)
    }
  }, [])

  // Generate unique Order ID
  const generateOrderId = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    return `ORD${timestamp}${random}`
  }

//message animation
  const showMessage = (type: "error" | "success", message: string) => {
    if (type === "error") {
      setPaymentError(message);
      setTimeout(() => setPaymentError(""), 4000);
    } else {
      setPaymentSuccess(message);
      setTimeout(() => setPaymentSuccess(""), 4000);
    }
  };

  //recharge processs
  const handleRecharge = async () => {
    if (!selectedAmount || selectedAmount < MIN_DEPOSIT) {
      showMessage("error", `Minimum deposit amount is ₹${MIN_DEPOSIT}`);
      return;
    }

    if (selectedAmount > MAX_DEPOSIT) {
      showMessage("error", `Maximum deposit amount is ₹${MAX_DEPOSIT}`);
      return;
    }

    if (!username) {
      showMessage("error", "Please login to continue");
      return;
    }

    setIsProcessing(true);
    setPaymentError("");
    setPaymentSuccess("");

    try {
      const orderId = generateOrderId();
      const storedCredentials = localStorage.getItem("userCredentials");

      if (!storedCredentials) {
        showMessage("error", "Please login to continue");
        return;
      }

      const credentials: UserCredentials = JSON.parse(storedCredentials);

      const response = await fetch("/api/auth/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount: selectedAmount,
          method: selectedMethod,
          username: credentials.username,
          password: credentials.password,
          ip: "0.0.0.0",
          remark: `Deposit for user ${credentials.username} via ${selectedMethod}`,
        }),
      });

      const paymentData = await response.json();

      if (paymentData.status === 1 && paymentData.data?.pay_url) {
        showMessage("success", "Redirecting to payment gateway...");
        window.open(paymentData.data.pay_url, "_blank", "noopener,noreferrer");

        setTimeout(() => {
          showMessage("success", "Complete the payment in the new window.");
        }, 1000);
      } else {
        showMessage("error", paymentData.msg || "Failed to create payment");
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      showMessage("error", "Failed to create payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle withdraw
  const handleWithdraw = () => {
    if (!username) {
      setPaymentError("Please login to withdraw")
      return
    }
    if (!selectedAmount || selectedAmount < 100) {
      setPaymentError("Minimum withdrawal is ₹100")
      return
    }

    setPaymentSuccess(`Withdrawal request of ₹${selectedAmount} submitted successfully!`)
  }

  const banks = [
    "Abhyudaya Cooperative Bank",
    "Allahabad Bank",
    "Andhra Pradesh Grameena Vikas Bank",
    "Andhra Pragathi Grameena Bank",
    "Andhra Pradesh State Cooperative Bank",
    "Andhra Pragathi Cooperative Bank",
    "AU Small Finance Bank",
    "Airtel Payments Bank",
    "Axis Bank",
    "Bandhan Bank",
    "Bank of Baroda",
    "Bank of India",
    "Bank of Maharashtra",
    "Baroda Gujarat Gramin Bank",
    "Baroda Rajasthan Kshetriya Gramin Bank",
    "Baroda UP Bank",
    "Canara Bank",
    "Capital Small Finance Bank",
    "Catholic Syrian Bank (CSB Bank)",
    "Central Bank of India",
    "Chhattisgarh Rajya Gramin Bank",
    "City Union Bank",
    "Corporation Bank",
    "DCB Bank",
    "Dena Bank",
    "Dhanlaxmi Bank",
    "ESAF Small Finance Bank",
    "Equitas Small Finance Bank",
    "Federal Bank",
    "Fincare Small Finance Bank",
    "Fino Payments Bank",
    "HDFC Bank",
    "ICICI Bank",
    "IDBI Bank",
    "IDFC FIRST Bank",
    "Indian Bank",
    "Indian Overseas Bank",
    "India Post Payments Bank",
    "IndusInd Bank",
    "Jammu & Kashmir Bank",
    "Jana Small Finance Bank",
    "Jharkhand Rajya Gramin Bank",
    "Jio Payments Bank",
    "Karnataka Bank",
    "Karnataka Gramin Bank",
    "Karnataka Vikas Grameena Bank",
    "Karur Vysya Bank",
    "Kerala Gramin Bank",
    "Kotak Mahindra Bank",
    "Lakshmi Vilas Bank",
    "Madhya Pradesh Gramin Bank",
    "Maharashtra Gramin Bank",
    "Manipur Rural Bank",
    "Meghalaya Rural Bank",
    "Mizoram Rural Bank",
    "Nagaland Rural Bank",
    "North East Small Finance Bank",
    "Nutan Nagarik Sahakari Bank",
    "Odisha Gramya Bank",
    "Paschim Banga Gramin Bank",
    "Paytm Payments Bank",
    "Prathama UP Gramin Bank",
    "Punjab & Sind Bank",
    "Punjab Gramin Bank",
    "Punjab National Bank",
    "Rajasthan Marudhara Gramin Bank",
    "RBL Bank",
    "Sarva UP Gramin Bank",
    "Saptagiri Gramin Bank",
    "Shivalik Small Finance Bank",
    "South Indian Bank",
    "State Bank of India",
    "Suryoday Small Finance Bank",
    "Syndicate Bank",
    "Tamil Nadu Grama Bank",
    "Tamilnad Mercantile Bank",
    "Tripura Gramin Bank",
    "UCO Bank",
    "Union Bank of India",
    "United Bank of India",
    "Unity Small Finance Bank",
    "Ujjivan Small Finance Bank",
    "Utkal Grameen Bank",
    "Varanasi Kshetriya Gramin Bank",
    "Vidharbha Konkan Gramin Bank",
    "Yes Bank",
  ]

   const [cashbackSelected, setCashbackSelected] = useState<"apply" | "later">("later"); 

  const BankBindingForm = () => (
    <Dialog open={isBindBankOpen} onOpenChange={setIsBindBankOpen}>
      <DialogContent className="bg-[#2b0d0d] bg-opacity-95 backdrop-blur-sm rounded-xl border border-yellow-500/30 w-80 max-w-md mx-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-white">Bind Bank Card</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Select>
              <SelectTrigger className="bg-black/60 border-yellow-500/30 text-white h-10">
                <SelectValue placeholder="Please Select a Bank" />
              </SelectTrigger>
              <SelectContent className="w-60 bg-[#2b0d0d] border-yellow-500/30">
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank} className="text-white">
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Enter Your Name"
              className="bg-black/60 border-yellow-500/30 text-white placeholder:text-gray-400 h-10"
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Enter Account Number"
              className="bg-black/60 border-yellow-500/30 text-white placeholder:text-gray-400 h-10"
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Enter IFSC Code"
              className="bg-black/60 border-yellow-500/30 text-white placeholder:text-gray-400 h-10"
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Please Enter Email"
              className="bg-black/60 border-yellow-500/30 text-white placeholder:text-gray-400 h-10"
            />
          </div>
          <div className="text-center text-yellow-400 text-sm py-4">
            Please fill in the withdrawal bank information correctly, otherwise you will be responsible for the
            withdrawal loss!
          </div>
          {/* Confirm Button */}
          <div className="flex justify-center relative">
            <Button
              className="bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 text-black font-bold py-4 px-16 rounded-full text-base hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg border border-yellow-400 relative overflow-hidden"
              size="lg"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 rounded-full"></div>
              <div className="absolute top-1 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
              <span className="relative z-10 tracking-wide">Confirm</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="min-h-screen bg-[#2b0d0d] pb-20 text-burgundy-800">
      {/* Header */}
       {/* ✅ Payment status messages */}
      {paymentError && (
        <div className="bg-black/40 border border-red-500 rounded-xl p-2 backdrop-blur-sm flex items-center space-x-3">
          <AlertCircle size={20} className="text-red-400" />
          <p className="text-red-300 text-[12px] ">{paymentError}</p>
        </div>
      )}
      {paymentSuccess && (
        <div className="bg-black/40 border border-white rounded-xl mx-2 p-2 backdrop-blur-sm flex items-center space-x-3">
          <CheckCircle size={20} className="text-green-400" />
          <p className="text-green-300 text-[12px] ">{paymentSuccess}</p>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-[#2b0d0d] px-5 py-3 flex items-center justify-between  ">
        <div className="w-2"></div>
        <h1 className=" text-white text-center flex justify-center pl-8 items-center ">
          Wallet
        </h1>
        <div className="flex items-center gap-2">
        
          <a href="/transaction">
            <FileText className="w-5 h-4 text-white"  />
          </a>
          <a href="/profile">
            <X className="w-5 h-4 text-white"  />
          </a>

       
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex bg-[#2b0d0d] m-2 rounded-lg gap-2 my-0 mb-[23px]">
        <button
          onClick={() => setActiveTab("recharge")}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl transition-all text-black font-bold bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 border border-yellow-400 shadow-lg relative overflow-hidden hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-700"
        >
          <ShoppingCart className="w-4 h-4" />
          Recharge
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 rounded-full pointer-events-none"></div>
          <div className="absolute top-1 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full pointer-events-none"></div>
        </button>

        <button
          onClick={() => setActiveTab("withdraw")}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl transition-all text-black font-bold bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 border border-yellow-400 shadow-lg relative overflow-hidden hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-700"
        >
          <CreditCard className="w-4 h-4" />
          Withdraw
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 rounded-full pointer-events-none"></div>
          <div className="absolute top-1 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full pointer-events-none"></div>
        </button>
      </div>

      <div className="px-4 space-y-6">
        {activeTab === "recharge" ? (
          <>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">Recharge Method</h3>
                <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400">
                  {selectedMethod}
                </Badge>
              </div>
              {/* 🔁 Recharge Method Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((method) => {
                  const isActive = selectedMethod === method
                  return (
                    <Button
                      key={method}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMethod(method)}
                      className={`rounded-lg h-9 relative px-2 bg-black/60 border-yellow-500/30 text-white hover:bg-black/80 ${
                        isActive ? "border-2 border-yellow-400 bg-yellow-300/20" : ""
                      }`}
                    >
                      {method}
                      {isActive && (
                        <span className="absolute bottom-0 right-0 rounded-sm flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path
                              d="M5 11L9 15L15 7"
                              stroke="#FFD700"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                        </span>
                      )}
                    </Button>
                  )
                })}

                {/* 🔁 USDT Recharge UI — Side-by-Side Labels + Full Width */}
                {selectedMethod === "USDT" && (
                  <div className="  w-82  mx-2 my-10 mb-5">
                    {/* Labels Row */}
                    <div className="flex justify-between items-center px-2">
                      <h3 className="text-sm font-medium text-gray-400">Enter Amount ($)</h3>
                      <h3 className="text-sm font-medium text-yellow-400">
                        Exchange Rate: <span className="font-bold">$1 = ₹{usdtRate}</span>
                      </h3>
                    </div>

                    {/* Input + Rate Value */}
                    <div className="flex flex-col sm:flex-row gap-4 ">
                      <Input
                        type="number"
                        value={usdtAmount}
                        onChange={(e) => setUsdtAmount(Number(e.target.value))}
                        placeholder="e.g. 10"
                        className="flex-1 bg-black/60 border-yellow-500/30 text-white placeholder:text-gray-400 h-10"
                      />
                    
                    </div>

                    {/* INR Conversion Preview */}
                    <Card className="  my-5   border border-[#f0c46c] shadow-sm bg-gradient-to-r from-[#3d040b] to-[#381c1f] w-full">
                      <div className="flex rounded-tr-xl rounded-tl-xl    items-center justify-between bg-gradient-to-b from-[#ffe36d] to-[#ffc947] px-4 py-2">
                        <div className="text-[14px] font-medium text-[#000000]">Recharge Amount</div>
                        <div className="text-[14px] font-medium text-[#000000]">INR Equivalent</div>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-[#641c06] to-[#300509] px-6 py-3">
                        <div className="text-[18px] font-semibold text-[#ffe36d] drop-shadow-sm">$ {usdtAmount}</div>
                        <div className="text-[26px] font-bold text-[#ffe36d] ">=</div>
                        <div className="text-[18px] font-semibold text-[#ffe36d] drop-shadow-sm">₹{(usdtAmount * usdtRate).toFixed(2)}</div>
                      </div>
                    </Card>
                  </div>
                )}




              </div>
            </div>

           

            {/* 🔁 Amount Selection — Hidden for USDT */}
            {selectedMethod !== "USDT" && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">Deposit Amount</h3>
                <div className="grid grid-cols-4 gap-2">
                  {amounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedAmount(amount)}
                      className={`h-12 ${
                        selectedAmount === amount
                          ? "bg-yellow-500 border-yellow-400 text-black hover:bg-yellow-600"
                          : "bg-black/60 border-yellow-500/30 text-white hover:bg-black/80"
                      }`}
                    >
                      ₹ {amount.toLocaleString("en-IN")}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Recharge Cashback</h3>
    
        {/* 🔁 Cashback Selection */}
        <div className="grid grid-cols-2 gap-3">
          {/* Apply Cashback Card */}
          <Card
            className={`bg-black/30 border-yellow-400/40 border-1 ${
              cashbackSelected === "apply" ? "border-yellow-500 bg-yellow-500/60" : ""
            }`}
            onClick={() => setCashbackSelected("apply")}
          >
            <div className="grid grid-cols-2 px-3 text-white items-center text-center">
              <span className="grid grid-cols-2 gap-6 items-center justify-center text-sm">
                <Image src={CashIcon} alt="Share" className="m-3 ml-7 h-5 w-5" />
              </span>
              <span className="mr-7">Apply</span>
            </div>
          </Card>

          {/* Later Card */}
          <Card
            className={`bg-black/30 border-yellow-400/40 border-1 ${
              cashbackSelected === "later" ? "border-yellow-500 bg-yellow-500/60" : ""
            }`}
            onClick={() => setCashbackSelected("later")}
          >
            <div className="flex items-center text-white justify-center mt-3">Later</div>
          </Card>
        </div>

        {/* 🔁 Cashback Summary — Dynamic for USDT and INR */}
        {cashbackSelected === "apply" && (
          <Card className="rounded-lg overflow-hidden border border-[#f0c46c] shadow-sm bg-gradient-to-r from-[#3d040b] to-[#381c1f] mt-4">
            <div className="flex items-center justify-between bg-gradient-to-b from-[#ffe36d] to-[#ffc947] px-4 py-2">
              <div className="text-[14px] font-medium text-[#000000]">Recharge Amount</div>
              <div className="text-[14px] font-medium text-[#000000]">Cashback Bonus</div>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-[#641c06] to-[#300509] px-6 py-3">
              <div className="text-[17px] font-semibold text-[#ffe36d] drop-shadow-sm">
                {selectedMethod === "USDT" ? `$ ${usdtAmount}` : `₹${selectedAmount}`}
              </div>
              <div className="text-[26px] font-bold text-[#ffe36d] mx-2">+</div>
              <div className="text-[17px] font-semibold text-[#ffe36d] drop-shadow-sm">
                {selectedMethod === "USDT"
                  ? `$ ${(usdtAmount * 0.1).toFixed(2)}`
                  : `₹${Math.floor(selectedAmount * 0.1)}`}
              </div>
            </div>
          </Card>
        )}
         </div>



            {/* 🔁 Recharge Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleRecharge}
                disabled={isProcessing}
                className="bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 text-black font-bold px-16 py-4 rounded-full relative overflow-hidden shadow-lg border border-yellow-400 hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-700 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 rounded-full"></div>
                <div className="absolute top-1 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
                <span className="relative z-10 tracking-wide">
                  {isProcessing
                    ? "Processing..."
                    : selectedMethod === "USDT"
                    ? `Recharge $${usdtAmount}`
                    : `Recharge ₹${selectedAmount}`}
                </span>
              </Button>
            </div>
          </>
        ) : (
          
          <>
          
           {/* Withdrawal Information */}

{/* Bonus Cards - 2 Grid Layout Rectangular */}
<div className="grid grid-cols-2 md:grid-cols-2 gap-2 mb-6">
  {/* Cash Balance */}
  <Card className="p-4 h-24 bg-gradient-to-r from-blue-700/60 to-blue-500/60 border-none">
    <div className="flex items-center justify-between h-full">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-white/ ">
          <CreditCard className="w-8 h-8 text-black/30" />
        </div>
        <div>
          <p className="text-white text-[10px]">Cash balance</p>
          <p className="text-yellow-400/90 text-xs font-bold">₹0</p>
        </div>
      </div>
    </div>
  </Card>

  {/* Withdrawable Balance */}
  <Card className="p-4 h-24 bg-gradient-to-r from-green-700/60 to-green-500/60 border-none">
    <div className="flex items-center justify-between h-full">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-white/ ">
          <BadgeIndianRupee className="w-8 h-8 text-black/30" />
        </div>
        <div>
          <h3 className="text-white text-[10px]">Withdrawable</h3>
          <p className="text-yellow-400/90 text-xs font-bold">₹0</p>
        </div>
      </div>
    </div>
  </Card>
</div>

            {/* Bind Bank Card Section */}
            <Card
              className="p-4 bg-[#450b00] border-2 border-dashed border-yellow-500/50 hover:border-yellow-400/70 transition-colors cursor-pointer"
              onClick={() => setIsBindBankOpen(true)}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="text-yellow-400 font-medium underline text-sm">Bind Bank Card</span>
              </div>
            </Card>

            {/* Withdrawal Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400">Withdrawal Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Maximum Withdrawable Amount:</span>
                  <span className="text-white">₹ 0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Currently Selected Amount:</span>
                  <span className="text-white">₹ 100</span>
                </div>
                <div className="text-white text-center py-2">
                  The Current Withdrawal Amount Exceeds the Maximum Withdrawable Amount
                </div>
              </div>
            </div>

            {/* Withdrawal Amount Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Withdrawal Amount</h3>
              <div className="grid grid-cols-4 gap-2">
                {withdrawalAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedAmount(amount)}
                    className={`h-10 ${
                      selectedAmount === amount
                        ? "bg-yellow-500 border-yellow-400 text-black hover:bg-yellow-600"
                        : "bg-black/60 border-yellow-500/30 text-white hover:bg-black/80"
                    }`}
                  >
                    ₹ {amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Withdraw Button */}
            <div className="flex justify-center relative">
              <Button
                className="bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 text-black font-bold py-4 px-12 rounded-full text-base hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg border border-yellow-400 relative overflow-hidden"
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 rounded-full"></div>
                <div className="absolute top-1 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
                <span className="relative z-10 tracking-wide">Withdraw</span>
              </Button>
            </div>

            {/* VIP Info */}
            <div className="text-center text-yellow-400 text-sm">Withdrawal money after becoming a VIP player</div>
          </>
        )}
      </div>

      <BankBindingForm />
      <BottomNavigation />
    </div>
  )
}

export default WalletPage
