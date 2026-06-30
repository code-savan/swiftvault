"use client"

import { useState } from "react"
import { useSignIn, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const signInSignal = useSignIn()
  const { setActive } = useClerk()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [passwordText, setPasswordText] = useState("")
  const [step, setStep] = useState<"email" | "reset" | "done">("email")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const signIn = signInSignal.signIn
  const isLoaded = signInSignal.fetchStatus !== "fetching"

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    if (!signIn) return
    setError("")
    setLoading(true)
    try {
      const { error: createErr } = await signIn.create({ identifier: email })
      if (createErr) {
        setError(createErr.message || "Failed to start password reset")
        return
      }
      const { error: sendErr } = await signIn.resetPasswordEmailCode.sendCode()
      if (sendErr) {
        setError(sendErr.message || "Failed to send reset code")
        return
      }
      setStep("reset")
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Failed to send reset code")
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (!signIn) return
    setError("")
    setLoading(true)
    try {
      const { error: verifyErr } = await signIn.resetPasswordEmailCode.verifyCode({ code })
      if (verifyErr) {
        setError(verifyErr.message || "Invalid code")
        return
      }
      const { error: submitErr } = await signIn.resetPasswordEmailCode.submitPassword({ password: passwordText })
      if (submitErr) {
        setError(submitErr.message || "Failed to reset password")
        return
      }
      if (signIn.status !== "complete") {
        setError("Password reset did not complete. Please try again.")
        return
      }
      await setActive({ session: signIn.createdSessionId! })
      setStep("done")
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-[var(--color-text-muted)]" />
      </div>
    )
  }

  if (step === "done") {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-[var(--color-accent)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">Password reset successful</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <div>
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>

      {/* Two-tone heading */}
      <h1 className="text-[22px] font-bold text-[var(--color-text-primary)] leading-tight mb-1">
        Reset{" "}
        <span className="text-[var(--color-accent)]">your password</span>
      </h1>

      <p className="text-sm text-[var(--color-text-secondary)] mb-7">
        {step === "email"
          ? "Enter your email and we'll send you a reset code."
          : "Enter the code from your email and choose a new password."}
      </p>

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label className="text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5 block">
              Email address
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <Button type="submit" className="w-full h-11 text-sm" disabled={loading || !signIn}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send reset code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5 block">
              Reset code
            </label>
            <Input
              placeholder="Code from your email"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5 block">
              New password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={passwordText}
                onChange={(e) => setPasswordText(e.target.value)}
                required
                minLength={8}
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-11 text-sm" disabled={loading || !signIn}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset password"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-sm text-center text-[var(--color-text-secondary)]">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
