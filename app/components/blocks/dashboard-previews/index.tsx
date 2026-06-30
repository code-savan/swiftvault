"use client"

import { motion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, Brain, Check, Copy, MessageSquare, Phone, Wallet, Zap } from "lucide-react"
import type { ReactNode } from "react"
import { useState } from "react"

function PreviewShell({
  title,
  kicker,
  tone,
  children,
}: {
  title: string
  kicker: string
  tone: string
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-w-0 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-950">{title}</p>
          <p className="text-[11px] text-slate-400">{kicker}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${tone}`}>Live</span>
      </div>
      {children}
    </motion.div>
  )
}

export function WalletPreview() {
  return (
    <PreviewShell title="Wallet" kicker="Naira balance" tone="bg-emerald-50 text-emerald-700">
      <div className="rounded-xl bg-[#07130f] p-4 text-white">
        <div className="flex items-start justify-between">
          <Wallet className="h-5 w-5 text-[#b7ff6a]" />
          <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-white/65">Active</span>
        </div>
        <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-white/40">Balance</p>
        <p className="mt-1 text-2xl font-black tracking-tight">₦124,420</p>
      </div>
      <div className="mt-3 space-y-2">
        {[
          { label: "OTP Purchase", amount: "-₦250", dir: "down" as const },
          { label: "Wallet Top Up", amount: "+₦5,000", dir: "up" as const },
          { label: "Echo Rental", amount: "-₦1,500", dir: "down" as const },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              {item.dir === "up" ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" /> : <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />}
              <span className="truncate text-xs font-medium text-slate-600">{item.label}</span>
            </div>
            <span className={`shrink-0 text-xs font-bold ${item.dir === "up" ? "text-emerald-600" : "text-rose-500"}`}>{item.amount}</span>
          </div>
        ))}
      </div>
    </PreviewShell>
  )
}

export function OTPPreview() {
  const [copied, setCopied] = useState<string | null>(null)
  const codes = [
    { service: "WhatsApp", number: "+234***7890", code: "847291" },
    { service: "Google", number: "+1***4567", code: "G-123456" },
    { service: "Telegram", number: "+44***8901", code: "T-89012" },
  ]

  return (
    <PreviewShell title="OTP Verification" kicker="Instant codes" tone="bg-cyan-50 text-cyan-700">
      <div className="space-y-2">
        {codes.map((item) => (
          <div key={item.service} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                <Phone className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-900">{item.service}</p>
                <p className="text-[10px] text-slate-400">{item.number}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setCopied(item.code)
                navigator.clipboard?.writeText(item.code)
              }}
              className="flex shrink-0 items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-black text-[#07130f] shadow-sm"
            >
              {item.code}
              {copied === item.code ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-400" />}
            </button>
          </div>
        ))}
      </div>
    </PreviewShell>
  )
}

export function EchoNumbersPreview() {
  return (
    <PreviewShell title="Echo Numbers" kicker="Persistent lines" tone="bg-emerald-50 text-emerald-700">
      <div className="space-y-2">
        {[
          { number: "+1 (555) 123-4567", country: "United States", expires: "Jul 15" },
          { number: "+44 20 7946 0958", country: "United Kingdom", expires: "Aug 1" },
        ].map((item) => (
          <div key={item.number} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="truncate font-mono text-xs font-bold text-slate-900">{item.number}</p>
            <p className="mt-1 text-[10px] text-slate-400">{item.country} · renews {item.expires}</p>
          </div>
        ))}
      </div>
    </PreviewShell>
  )
}

export function AIAccessPreview() {
  return (
    <PreviewShell title="AI Access Vault" kicker="Coming next" tone="bg-violet-50 text-violet-700">
      <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-950">Unified AI bundle</p>
            <p className="text-[11px] text-slate-500">Billed in Naira</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {["ChatGPT", "Claude", "Midjourney", "Gemini"].map((name) => (
            <div key={name} className="rounded-lg bg-white px-2 py-2 text-center text-[11px] font-bold text-slate-600">
              {name}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
        <Zap className="h-3.5 w-3.5 text-violet-600" />
        Waitlist opens after OTP launch
      </div>
    </PreviewShell>
  )
}
