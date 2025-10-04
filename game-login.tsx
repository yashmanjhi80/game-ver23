"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Eye,CheckCircle, EyeOff,LockKeyholeOpen,CircleUserRound, Volume2, VolumeX, ArrowLeft, HeartHandshake, Mails, } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { APP_CONFIG, getStorageKey, isFeatureEnabled } from "@/config/app"
import Image from "next/image"
export default function GameLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [referralId, setReferralId] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [isMusicMuted, setIsMusicMuted] = useState(true)
  const [isCreateAccount, setIsCreateAccount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const backgroundMusicRef = useRef<HTMLAudioElement>(null)
  const buttonClickSoundRef = useRef<HTMLAudioElement>(null)
// Add new state variables at the top
const [isEmailVerified, setIsEmailVerified] = useState(false)
const [verificationCodeSent, setVerificationCodeSent] = useState(false)
const [verificationCode, setVerificationCode] = useState("")
const [verifyEmailError, setVerifyEmailError] = useState("")
const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
  // Check if user is already logged in and redirect to home
  useEffect(() => {
    const checkExistingLogin = () => {
      const storedCredentials = localStorage.getItem(getStorageKey("USER_CREDENTIALS"))
      if (storedCredentials) {
        try {
          const credentials = JSON.parse(storedCredentials)
          if (credentials.username && credentials.password) {
            console.log("User already logged in, redirecting to home...")
            router.push("/home")
          }
        } catch (error) {
          console.error("Error parsing stored credentials:", error)
          localStorage.removeItem(getStorageKey("USER_CREDENTIALS"))
        }
      }
    }

    checkExistingLogin()
  }, [router])

  // Prefill referral and switch to Create Account if ?refer= or ?register=1 present
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const params = new URLSearchParams(window.location.search)
      const urlRefer = params.get("refer") || ""
      const storedRefer = localStorage.getItem("referralId") || ""
      const effectiveRefer = urlRefer || storedRefer

      if (effectiveRefer) {
        setReferralId(effectiveRefer)
        setIsCreateAccount(true)
      } else if (params.get("register") === "1") {
        setIsCreateAccount(true)
      }
    } catch {
      // ignore malformed search params
    }
  }, [])

  useEffect(() => {
    if (backgroundMusicRef.current && isFeatureEnabled("MUSIC_ENABLED")) {
      backgroundMusicRef.current.volume = APP_CONFIG.AUDIO.BACKGROUND_MUSIC_VOLUME
    }
  }, [])

  const toggleMusic = () => {
    if (backgroundMusicRef.current && isFeatureEnabled("MUSIC_ENABLED")) {
      if (isMusicMuted) {
        backgroundMusicRef.current.muted = false
        backgroundMusicRef.current.play().catch((e) => console.error("Music play prevented:", e))
      } else {
        backgroundMusicRef.current.pause()
        backgroundMusicRef.current.muted = true
      }
      setIsMusicMuted(!isMusicMuted)
      playButtonClickSound()
    }
  }

  const playButtonClickSound = async () => {
    if (buttonClickSoundRef.current) {
      buttonClickSoundRef.current.currentTime = 0
      try {
        await buttonClickSoundRef.current.play()
      } catch (e) {
        console.error("Sound play prevented:", e)
      }
    }
  }

  const makeApiRequest = async (endpoint: string, data: any) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.API.TIMEOUT)

    try {
      const response = await fetch(`/api/auth${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const responseData = await response.json()

      console.log(`${endpoint} API Response:`, responseData)

      // For registration, check if response status is 200 (success)
      if (endpoint === "/register") {
        if (response.status === 200) {
          return { success: true, ...responseData }
        } else {
          throw new Error(responseData.message || `Registration failed with status ${response.status}`)
        }
      }

      // For login, check if the response indicates success
      if (!responseData.success) {
        throw new Error(responseData.message || `Request failed with status ${response.status}`)
      }

      return responseData
    } catch (error: any) {
      clearTimeout(timeoutId)

      if (error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.")
      }

      // Pass the error message directly from the API route
      throw error
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await playButtonClickSound()

    setLoginError("")
    setIsLoading(true)

    try {
      const data = await makeApiRequest("/login", {
        username: username.toLowerCase().trim(),
        password,
      })

      console.log("Login successful!", data)

      // Store user credentials and data in localStorage
      const userCredentials = {
        username: username.toLowerCase().trim(),
        password, // Note: In production, consider using tokens instead
        user: data.user,
        loginTime: new Date().toISOString(),
      }

      localStorage.setItem(getStorageKey("USER_CREDENTIALS"), JSON.stringify(userCredentials))

      // Store user data if provided (for backward compatibility)
      if (data.user) {
        localStorage.setItem(getStorageKey("USER_DATA"), JSON.stringify(data.user))
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      router.push("/home")
    } catch (error: any) {
      console.error("Login error:", error)
      setLoginError(error.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to send verification code
const handleSendVerificationCode = async () => {
  if (!email) {
    setVerifyEmailError("Please enter your email first.")
    return
  }

  setIsVerifyingEmail(true)
  setVerifyEmailError("")

  try {
    const response = await fetch("https://game.zyronetworks.shop/send-verification-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    })
    

    const data = await response.json()
    if (response.ok) {setVerificationCodeSent(true);
      setVerificationMessage("Verification code sent! Please check your email.");
    } else {
      throw new Error(data.message || "Failed to send verification code.")
    }
  } catch (error: any) {
    console.error("Verification error:", error)
    setVerifyEmailError(error.message || "Failed to send verification code.")
  } finally {
    setIsVerifyingEmail(false)
  }
}
  const [verificationMessage, setVerificationMessage] = useState("");

  useEffect(() => {
    if (verificationMessage) {
      const timer = setTimeout(() => setVerificationMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [verificationMessage]);
// Modify handleRegister to include verification code
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault()
  await playButtonClickSound()

  setRegisterError("")
  setIsLoading(true)

  // Validation
  if (!username || !email || !password || !confirmPassword) {
    setRegisterError("All fields are required.")
    setIsLoading(false)
    return
  }

  if (password !== confirmPassword) {
    setRegisterError("Passwords do not match.")
    setIsLoading(false)
    return
  }

  if (!isEmailVerified) {
    setRegisterError("Please verify your email before creating an account.")
    setIsLoading(false)
    return
  }

  if (password.length < APP_CONFIG.VALIDATION.PASSWORD.MIN_LENGTH) {
    setRegisterError(`Password must be at least ${APP_CONFIG.VALIDATION.PASSWORD.MIN_LENGTH} characters long.`)
    setIsLoading(false)
    return
  }

  const trimmedUsername = username.toLowerCase().trim()
  if (
    trimmedUsername.length < APP_CONFIG.VALIDATION.USERNAME.MIN_LENGTH ||
    trimmedUsername.length > APP_CONFIG.VALIDATION.USERNAME.MAX_LENGTH
  ) {
    setRegisterError(
      `Username must be ${APP_CONFIG.VALIDATION.USERNAME.MIN_LENGTH}-${APP_CONFIG.VALIDATION.USERNAME.MAX_LENGTH} characters long.`,
    )
    setIsLoading(false)
    return
  }

  try {
    const data = await makeApiRequest("/register", {
      username: trimmedUsername,
      email: email.toLowerCase().trim(),
      password,
      referralId: referralId.trim() || undefined,
      code: verificationCode.trim(), // add the verification code here
    })

    console.log("Registration successful!", data)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Clear form fields
    setUsername("")
    setPassword("")
    setEmail("")
    setReferralId("")
    setConfirmPassword("")
    setVerificationCode("")
    setIsEmailVerified(false)
    setVerificationCodeSent(false)

    setIsCreateAccount(false)
    setUsername(trimmedUsername)
    alert("Account created successfully! Please login with your credentials.")
  } catch (error: any) {
    console.error("Registration error:", error)
    setRegisterError(error.message || "Registration failed. Please try again.")
  } finally {
    setIsLoading(false)
  }
}

  const switchToCreateAccount = async () => {
    await playButtonClickSound()
    setIsCreateAccount(true)
    setLoginError("")
    setRegisterError("")
    // Clear form fields when switching
    setUsername("")
    setPassword("")
    setEmail("")
    setReferralId("")
    setConfirmPassword("")
  }

  const switchToLogin = async () => {
    await playButtonClickSound()
    setIsCreateAccount(false)
    setLoginError("")
    setRegisterError("")
    // Clear form fields when switching
    setUsername("")
    setPassword("")
    setEmail("")
    setReferralId("")
    setConfirmPassword("")
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Music */}
      {isFeatureEnabled("MUSIC_ENABLED") && (
        <audio ref={backgroundMusicRef} src={APP_CONFIG.AUDIO.ASSETS.BACKGROUND_MUSIC} loop muted={isMusicMuted} />
      )}
      {/* Button Click Sound */}
      <audio ref={buttonClickSoundRef} src={APP_CONFIG.AUDIO.ASSETS.BUTTON_CLICK} />

      {/* customer service icon on login*/}
      <div className="fixed bottom-18 right-4 z-50  animate-bounce">
        <img
          src="/assets/customer-service.png"
          alt="Customer Service"
          className="w-12 h-12  bg-black rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
          onClick={() => window.open("https://tawk.to/chat/6866187edeea8b190aa3570d/1iv7cvc8b", "_blank")}
        />
      </div>

      {/*verification message */}
      {verificationMessage && (
        <div className="fixed top-4 right-12 z-50 pointer-events-none animate-slide-in-top">
          <div className="bg-black/40 border border-white rounded-xl p-2  backdrop-blur-sm flex items-center  animate-slide-out-right">
            <CheckCircle size={40} className="text-green-400 pr-5" />
            <p className="text-green-300 text-[12px]">{verificationMessage}</p>
          </div>
        </div>
      )}

      {/* Music Toggle Button */}
      {isFeatureEnabled("MUSIC_ENABLED") && (
        <button
          onClick={toggleMusic}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 border border-yellow-500/30 text-yellow-400 hover:bg-black/80 hover:border-yellow-400 transition-all duration-200"
          aria-label={isMusicMuted ? "Unmute music" : "Mute music"}
        >
          {isMusicMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      )}

      {/* Main Container - Horizontal Layout */}
      <div className="flex min-h-screen">
        {/* Left Side - Image (60% width on desktop) */}
        <div
          className="hidden lg:block lg:w-3/5 relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/background-image.jpeg')",
          }}
        >
          {/* Golden overlay for better text readability on image */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-yellow-900/20 to-black/80" />

          {/* Title overlay on image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
               <Image src="/images/telegram-icon.png" alt="Telegram" width={44} height={44} className="rounded-" />
              <p className="text-yellow-200 text-2xl drop-shadow-lg font-medium">
                Enter the Ultimate Gaming Experience
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form with Gradient Background (40% width on desktop) */}
        <div className="w-full lg:w-2/5 relative">
          {/* Gradient Background for Form Area */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

          {/* Mobile Background Image (only visible on mobile) */}
          <div
            className="absolute inset-0 lg:hidden bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/background-image.jpeg')",
            }}
          />
          <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-black/80 via-yellow-900/20 to-black/90" />

          {/* Form Content */}
          <div className="relative z-10 flex items-center justify-center min-h-screen p-4 lg:p-8">
            <div className="w-full max-w-md">
              {/* Mobile Title (Only visible on mobile) */}
              <div className="text-center h-10  p-0 flex items-center justify-center    mb-8 lg:hidden">
                
                 <Image src="/images/Domain.png" alt="logo" width={180} height={36} className="  " />
               
                
              </div>
              <p className="text-yellow-300  flex items-center justify-center text-sm drop-shadow-md font-medium">
                  Enter the Ultimate Gaming Experience
                </p>

              {/* Back Button for Create Account */}
              {isCreateAccount && (
                <button
                  onClick={switchToLogin}
                  className="flex items-center text-yellow-300 hover:text-yellow-200 transition-colors mb-4"
                  disabled={isLoading}
                >
                  <ArrowLeft size={20} />
                </button>
              )}

              {/* Login Form */}
              {!isCreateAccount ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-yellow-400 drop-shadow-lg">Login</h3>
                  </div>

                  {/* Username Field */}
                  <div className="relative">
                    <div className="relative w-full h-12 flex items-center px-6 bg-black/40 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
                      < CircleUserRound size={26} className="bg-red-400/ z-30 mr-4 text-yellow-400 " />
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        className="w-full bg-transparent text-white placeholder-yellow-300/70 text-lg font-medium outline-none"
                        required
                        disabled={isLoading}
                      
                      />
                        
                   
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <div className="relative w-full h-12 flex items-center px-6 bg-black/40 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
                      < LockKeyholeOpen size={26} className="bg-red-400/ z-30 mr-4 text-yellow-400 " />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-yellow-300/70 text-lg font-medium outline-none pr-10"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 text-yellow-300 hover:text-yellow-200 transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {loginError && <p className="text-red-400 text-center text-sm font-semibold">{loginError}</p>}

                  {/* Login Button */}
                  <div className="flex  justify-center   pt-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-b   from-yellow-300 via-golden to-yellow-600 text-black font-bold py-2 px-16 rounded-full text-base hover:from-yellow-400 hover:via-golden hover:to-yellow-700 transition-all duration-300 shadow-lg border border-yellow-400 relative overflow-hidden"
                      disabled={isLoading}
                    >
                      <span className="text-black text-xl font-bold drop-shadow-lg">
                        {isLoading ? "LOGGING IN..." : "ENTER GAME"}
                      </span>
                    </button>
                  </div>

                  {/* Additional Options */}
                  <div className="mt-8 text-center space-y-4">
                    <Link
                      href="/forgot-password"
                      className="text-yellow-300 hover:text-yellow-200 transition-colors underline disabled:opacity-50"
                    >
                      Forgot Password?
                    </Link>

                    <div className="flex items-center justify-center space-x-4">
                      <div className="h-px bg-yellow-400/30 flex-1"></div>
                      <span className="text-yellow-300 text-sm">OR</span>
                      <div className="h-px bg-yellow-400/30 flex-1"></div>
                    </div>

                    <button
                      type="button"
                      onClick={switchToCreateAccount}
                      className="bg-gradient-to-b from-yellow-300 via-golden to-yellow-600 text-black font-bold py-2 px-16 rounded-full text-base hover:from-yellow-400 hover:via-golden hover:to-yellow-700 transition-all duration-300 shadow-lg border border-yellow-400 relative overflow-hidden"
                      disabled={isLoading}
                    >
                      <span className="text-black  font-bold drop-shadow-lg">CREATE ACCOUNT</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Create Account Form */
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-yellow-400 drop-shadow-lg">Create Account</h2>
                  </div>

                  {/* Username Field */}
                  <div className="relative">
                    <div className="relative w-full h-12 flex items-center px-6 bg-black/40 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
                        < CircleUserRound size={26} className="bg-red-400/ z-30 mr-4 text-yellow-400 " />
                      <input
                        type="text"
                        placeholder={`Username (${APP_CONFIG.VALIDATION.USERNAME.MIN_LENGTH}-${APP_CONFIG.VALIDATION.USERNAME.MAX_LENGTH} lowercase chars)`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        className="w-full bg-transparent text-white placeholder-yellow-300/70 text-lg font-medium outline-none"
                        required
                        disabled={isLoading}
                        minLength={APP_CONFIG.VALIDATION.USERNAME.MIN_LENGTH}
                        maxLength={APP_CONFIG.VALIDATION.USERNAME.MAX_LENGTH}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="relative">
              
                    <div className="relative w-full h-12 flex items-center px-6 bg-black/40 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
                        < Mails size={26} className="bg-red-400/ z-30 mr-4 text-yellow-400 " />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-yellow-300/70 text-lg font-medium outline-none"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Referral ID Field */}
                  <div className="relative">
                    <div className="relative w-full h-12 flex items-center px-6 bg-black/40 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
                     < HeartHandshake size={26} className="bg-red-400/ z-30 mr-4 text-yellow-400 " />

                      <input
                        type="text"
                        placeholder="Referral ID (Optional)"
                        value={referralId}
                        onChange={(e) => setReferralId(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-yellow-300/70 text-lg font-medium outline-none"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <div className="relative w-full h-12 flex items-center px-6 bg-black/40 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
                     < LockKeyholeOpen size={26} className="bg-red-400/ z-30 mr-4 text-yellow-400 " />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={`Password (min ${APP_CONFIG.VALIDATION.PASSWORD.MIN_LENGTH} chars)`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-yellow-300/70 text-lg font-medium outline-none pr-10"
                        required
                        disabled={isLoading}
                        minLength={APP_CONFIG.VALIDATION.PASSWORD.MIN_LENGTH}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 text-yellow-300 hover:text-yellow-200 transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="relative">
                    <div className="relative w-full h-12 flex items-center px-6 bg-black/40 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
                     < LockKeyholeOpen size={26} className="bg-red-400/ z-30 mr-4 text-yellow-400 " />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-yellow-300/70 text-lg font-medium outline-none pr-10"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-6 text-yellow-300 hover:text-yellow-200 transition-colors"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {registerError && <p className="text-red-400 text-center text-sm font-semibold">{registerError}</p>}

                  {/* Create Account Button */}
                  <div className="pt-4 flex flex-col items-center space-y-4">
  {!verificationCodeSent ? (
    <button
      type="button"
      onClick={handleSendVerificationCode}
      className="bg-gradient-to-b from-yellow-300 via-golden to-yellow-600 text-black font-bold py-2 px-16 rounded-full text-base hover:from-yellow-400 hover:via-golden hover:to-yellow-700 transition-all duration-300 shadow-lg border border-yellow-400 relative overflow-hidden"
      disabled={isVerifyingEmail || isLoading}
    >
      <span className="text-black text-xl font-bold drop-shadow-lg">
        {isVerifyingEmail ? "SENDING..." : "VERIFY EMAIL"}
      </span>
    </button>
  ) : (
    <>
      <input
        type="text"
        placeholder="Enter Verification Code"
        value={verificationCode}
        onChange={(e) => {
          setVerificationCode(e.target.value)
          setIsEmailVerified(e.target.value.trim().length > 0)
        }}
        className="w-full max-w-xs font-bold text-white text-lg px-4 py-2 rounded-lg border border-yellow-400"
      />
      <button
        type="submit"
        className="bg-gradient-to-b from-yellow-300 via-golden to-yellow-600 text-black font-bold py-2 px-16 rounded-full text-base hover:from-yellow-400 hover:via-golden hover:to-yellow-700 transition-all duration-300 shadow-lg border border-yellow-400 relative overflow-hidden disabled:opacity-50"
        disabled={isLoading || !verificationCode.trim()}
      >
        <span className="text-black text-xl font-bold drop-shadow-lg">
          {isLoading ? "CREATING..." : "CREATE ACCOUNT"}
        </span>
      </button>
    </>
  )}
  {verifyEmailError && <p className="text-red-400 text-center text-sm font-semibold">{verifyEmailError}</p>}
</div>
                </form>
              )}

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-yellow-300/70 text-sm">© 2026 AURA7. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
