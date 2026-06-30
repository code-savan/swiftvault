"use client"

import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { ArrowRight, Zap, ShieldCheck, Globe2, Timer, WalletCards, Copy, Smartphone } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const messages = [
  { type: "incoming" as const, text: "WhatsApp code: 847291" },
  { type: "outgoing" as const, text: "Copied to vault" },
  { type: "incoming" as const, text: "Wallet funded: +₦45,000" },
  { type: "incoming" as const, text: "Google code: G-123456" },
]

const stats = [
  { value: "10K+", label: "active users" },
  { value: "150+", label: "countries" },
  { value: "50K+", label: "OTPs delivered" },
  { value: "₦50M+", label: "processed" },
]

const services = [
  { name: "OTP verification", price: "₦1,200", live: true },
  { name: "Echo numbers", price: "₦1,500/mo", live: true },
  { name: "AI Access Vault", price: "₦15,000/mo", live: false },
  { name: "Virtual dollar cards", price: "FX + fees", live: false },
]

export function HeroSection() {
  const [visible, setVisible] = useState(1)

  useEffect(() => {
    const t = setInterval(() => setVisible(p => (p >= messages.length ? 1 : p + 1)), 1500)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#0a1a12] text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-[#4ADE80]/8 blur-[120px]" />
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[100px]" />
        <div className="absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-emerald-400/4 blur-[100px]" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-20 mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8"
      >
        <div className="flex h-14 items-center justify-between rounded-2xl border border-white/8 bg-white/[0.06] px-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4ADE80] shadow-lg shadow-[#4ADE80]/20">
              <Zap className="h-4 w-4 text-[#0a1a12]" />
            </div>
            <span className="text-sm font-bold tracking-tight">SwiftVault</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {["Services", "Features", "Pricing", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="rounded-full px-4 py-1.5 text-sm text-white/50 transition hover:bg-white/8 hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="rounded-xl px-3.5 text-sm text-white/55 hover:bg-white/8 hover:text-white">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-xl bg-white px-4 text-sm font-semibold text-[#0a1a12] shadow-lg shadow-black/20 hover:bg-white/90">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr]">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-[#4ADE80]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
              Nigerian wallet, global reach
            </div>

            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              One wallet for
              <br />
              <span className="text-[#4ADE80]">global digital</span>
              <br />
              access.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/50 sm:text-lg">
              Buy OTPs, hold virtual numbers, fund AI tools, and spend with virtual cards — all from one Naira wallet. No dollar card needed.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register">
                <Button className="group h-12 rounded-xl bg-[#4ADE80] px-6 text-[15px] font-bold text-[#0a1a12] shadow-xl shadow-[#4ADE80]/20 hover:bg-[#5aec90]">
                  Open your vault
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#services">
                <Button className="h-12 rounded-xl border border-white/12 bg-white/[0.07] px-6 text-[15px] font-semibold text-white shadow-xl shadow-black/10 hover:bg-white/12">
                  Explore services
                </Button>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-5">
              {[
                { icon: ShieldCheck, label: "Paystack secured" },
                { icon: Globe2, label: "150+ countries" },
                { icon: Timer, label: "Codes in seconds" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-white/55">
                  <Icon className="h-4 w-4 text-[#4ADE80]" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column — App preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative"
          >
            <div className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-2 shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <div className="overflow-hidden rounded-[1.35rem] bg-[#f8faf8] text-[#0a1a12]">
                {/* Card header */}
                <div className="flex items-center justify-between border-b border-black/4 bg-white px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a1a12]">
                      <Zap className="h-4 w-4 text-[#4ADE80]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">SwiftVault</p>
                      <p className="text-[10px] text-black/40">Dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live
                  </div>
                </div>

                {/* Card body */}
                <div className="grid gap-3 p-4 sm:grid-cols-[1fr_0.8fr]">
                  {/* Wallet section */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#0a1a12] to-[#0f2418] p-5 text-white shadow-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4ADE80]/70">Balance</p>
                        <p className="mt-2 text-3xl font-bold tracking-tight">₦284,500</p>
                        <p className="mt-1 text-xs text-white/40">Available across all services</p>
                      </div>
                      <WalletCards className="h-5 w-5 text-[#4ADE80]/60" />
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {["Fund", "Spend", "Refer"].map((action) => (
                        <div key={action} className="rounded-xl border border-white/8 bg-white/6 px-3 py-2 text-center text-[11px] font-semibold text-white/70">
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* OTP section */}
                  <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold">OTP session</p>
                      <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-600">Active</span>
                    </div>
                    <div className="mt-4 rounded-xl bg-[#f3f6f2] p-3">
                      <p className="text-[10px] text-black/40">Google verification</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <code className="text-lg font-black tracking-wide text-[#0a1a12]">G-123456</code>
                        <Copy className="h-3.5 w-3.5 text-black/35" />
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] text-black/45">Received 4 seconds ago</div>
                  </div>

                  {/* Services list */}
                  <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:col-span-2">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-bold">Services</p>
                      <span className="text-[11px] font-semibold text-emerald-600">Paid in Naira</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {services.map((s) => (
                        <div key={s.name} className="flex items-center justify-between rounded-xl bg-[#f3f6f2] px-3.5 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className={`h-2 w-2 rounded-full ${s.live ? "bg-emerald-400" : "bg-amber-300"}`} />
                            <span className="text-xs font-medium">{s.name}</span>
                          </div>
                          <span className="text-[11px] font-bold text-black/50">{s.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="absolute -bottom-6 -right-4 hidden w-[170px] rounded-[1.75rem] border border-white/10 bg-[#0a1a12] p-1.5 shadow-2xl shadow-black/40 sm:block">
              <div className="overflow-hidden rounded-[1.4rem]">
                <div className="flex items-center justify-between px-4 py-2.5 text-[10px] text-white/40">
                  <span>9:41</span>
                  <span>76%</span>
                </div>
                <div className="border-y border-white/6 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4ADE80]">
                      <Zap className="h-2.5 w-2.5 text-[#0a1a12]" />
                    </div>
                    <p className="text-[10px] font-semibold text-white">Vault Inbox</p>
                  </div>
                </div>
                <div className="flex h-[220px] flex-col gap-2 p-3">
                  {messages.slice(0, visible).map((message, index) => (
                    <motion.div
                      key={`${message.text}-${index}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className={`flex ${message.type === "outgoing" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-3 py-1.5 text-[10px] leading-relaxed ${
                          message.type === "outgoing"
                            ? "bg-[#4ADE80] text-[#0a1a12]"
                            : "bg-white/8 text-white/70"
                        }`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative z-10 border-t border-white/6 bg-white/[0.03] backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{value}</span>
              <span className="text-xs text-white/40">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
