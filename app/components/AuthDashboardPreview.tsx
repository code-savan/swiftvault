"use client"

import { ArrowUpRight, ArrowDownRight, Zap, Phone, Wallet, MessageSquare, Brain, Sparkles } from "lucide-react"

const recentActivity = [
  { label: "OTP Purchase", amount: "-₦250", dir: "down" as const },
  { label: "Wallet Top Up", amount: "+₦5,000", dir: "up" as const },
  { label: "Echo Rental", amount: "-₦1,500", dir: "down" as const },
]

const mobileActivity = [
  { label: "OTP Purchase", amount: "-₦250", dir: "down" as const },
  { label: "Wallet Top Up", amount: "+₦5,000", dir: "up" as const },
]

const services = [
  { name: "WhatsApp", number: "+234***7890", tag: "Active" },
  { name: "Google", number: "+1***4567", tag: "Active" },
  { name: "Telegram", number: "+44***8901", tag: "Pending" },
]

function DesktopCard() {
  return (
    <div className="w-[380px] rounded-2xl border border-white/[0.08] bg-[#0D1117] p-5 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#16A34A] flex items-center justify-center shadow-lg shadow-green-500/10">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">SwiftVault</p>
            <p className="text-[10px] text-white/40">Dashboard</p>
          </div>
        </div>
        <span className="px-2 py-1 rounded-full bg-[#16A34A]/15 text-[10px] font-semibold text-[#4ADE80]">
          Live
        </span>
      </div>

      <div className="rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4 mb-4 ring-1 ring-white/[0.06]">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/40 mb-1">Wallet Balance</p>
        <p className="text-3xl font-black tracking-tight text-white">₦124,420</p>
        <div className="flex gap-2 mt-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16A34A] text-white text-xs font-semibold cursor-default">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Fund
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.07] text-white/60 text-xs font-semibold cursor-default">
            <Wallet className="w-3.5 h-3.5" />
            Send
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.07] text-white/60 text-xs font-semibold cursor-default">
            <Phone className="w-3.5 h-3.5" />
            OTP
          </div>
        </div>
      </div>

      <p className="text-[11px] font-medium text-white/40 mb-2.5 uppercase tracking-[0.1em]">Recent Activity</p>
      <div className="space-y-1">
        {recentActivity.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
            <div className="flex items-center gap-2">
              {item.dir === "up" ? (
                <div className="w-5 h-5 rounded bg-[#16A34A]/10 flex items-center justify-center">
                  <ArrowUpRight className="w-3 h-3 text-[#4ADE80]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded bg-rose-500/10 flex items-center justify-center">
                  <ArrowDownRight className="w-3 h-3 text-rose-400" />
                </div>
              )}
              <span className="text-xs font-medium text-white/60">{item.label}</span>
            </div>
            <span className={`text-xs font-bold ${item.dir === "up" ? "text-[#4ADE80]" : "text-rose-400"}`}>
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TabletCard() {
  return (
    <div className="w-[270px] rounded-2xl border border-white/[0.08] bg-[#0D1117] p-4 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-white">Active Numbers</p>
        <span className="px-1.5 py-0.5 rounded bg-[#16A34A]/15 text-[9px] font-semibold text-[#4ADE80]">
          3 active
        </span>
      </div>
      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.name} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white/[0.06] flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-white/50" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">{s.name}</p>
                <p className="text-[9px] text-white/40">{s.number}</p>
              </div>
            </div>
            <span className={`text-[9px] font-medium ${s.tag === "Active" ? "text-[#4ADE80]" : "text-yellow-400"}`}>
              {s.tag}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <p className="text-[10px] text-white/40">Total spent</p>
        <p className="text-xs font-bold text-white">₦4,250</p>
      </div>
    </div>
  )
}

function PhoneCard() {
  return (
    <div className="w-[165px] rounded-3xl border border-white/[0.10] bg-[#0D1117] p-3.5 shadow-2xl shadow-black/50 relative overflow-hidden">
      <div className="flex items-center justify-center w-10 h-4 mx-auto mb-3 bg-white/[0.06] rounded-full">
        <div className="w-5 h-1.5 rounded-full bg-white/20" />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded bg-[#16A34A] flex items-center justify-center">
          <Zap className="w-2.5 h-2.5 text-white" />
        </div>
        <span className="text-[10px] font-bold text-white">SwiftVault</span>
      </div>
      <p className="text-[9px] text-white/40 mb-0.5">Balance</p>
      <p className="text-base font-black text-white mb-3">₦124,420</p>
      <div className="px-3 py-1.5 rounded-lg bg-[#16A34A] text-white text-[10px] font-semibold text-center mb-3 shadow-lg shadow-green-500/10">
        Fund Wallet
      </div>
      <div className="space-y-1">
        {mobileActivity.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-0.5">
            <span className="text-[9px] text-white/50">{item.label}</span>
            <span className={`text-[9px] font-bold ${item.dir === "up" ? "text-[#4ADE80]" : "text-rose-400"}`}>
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniWidget() {
  return (
    <div className="w-[130px] rounded-xl border border-white/[0.08] bg-[#0D1117] p-3 shadow-xl shadow-black/40">
      <div className="flex items-center gap-1.5 mb-2">
        <Brain className="w-3 h-3 text-[#4ADE80]" />
        <span className="text-[8px] font-bold text-white/60 uppercase tracking-[0.1em]">AI Access</span>
      </div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] text-white/50">ChatGPT</span>
        <Sparkles className="w-2.5 h-2.5 text-[#4ADE80]" />
      </div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] text-white/50">Claude</span>
        <Sparkles className="w-2.5 h-2.5 text-[#4ADE80]" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-white/50">Midjourney</span>
        <div className="w-2 h-2 rounded-full bg-yellow-400/70" />
      </div>
    </div>
  )
}

export function AuthDashboardPreview() {
  return (
    <div className="relative w-[480px] h-[400px]">
      {/* Tablet — far left, behind */}
      <div
        className="absolute left-0 top-1/2 z-[-1] hidden xl:block"
        style={{ transform: "rotate(4deg) translateY(-55%)" }}
      >
        <TabletCard />
      </div>

      {/* Desktop — center, main card */}
      <div
        className="absolute left-1/2 top-1/2 z-0"
        style={{ transform: "translate(-50%, -52%)" }}
      >
        <DesktopCard />
      </div>

      {/* Phone — right side, in front */}
      <div
        className="absolute right-0 top-1/2 z-10 hidden xl:block"
        style={{ transform: "rotate(-8deg) translateY(-48%)" }}
      >
        <PhoneCard />
      </div>

      {/* Mini widget — bottom-left area */}
      <div
        className="absolute left-[8%] bottom-[5%] z-5 hidden xl:block"
        style={{ transform: "rotate(-3deg)" }}
      >
        <MiniWidget />
      </div>
    </div>
  )
}
