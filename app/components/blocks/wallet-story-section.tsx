"use client"

import { ArrowRight, BarChart3, LockKeyhole, Repeat, TrendingUp, Wallet } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const pillars = [
  {
    icon: Wallet,
    title: "Fund once",
    desc: "Top up your Naira wallet via Paystack, then spend across OTP, Echo Numbers, AI tools, cards, residency, creator products, and APIs.",
    stat: "1 balance",
    statLabel: "for every service",
  },
  {
    icon: Repeat,
    title: "Discover more",
    desc: "Users who arrive for OTP naturally see AI, cards, and creator tools at the exact moment they already have wallet balance.",
    stat: "50%",
    statLabel: "repeat purchase target",
  },
  {
    icon: LockKeyhole,
    title: "Stay longer",
    desc: "A pre-funded wallet creates useful continuity. Balance, numbers, referrals, and subscriptions all live in one place.",
    stat: "7%",
    statLabel: "target churn",
  },
  {
    icon: BarChart3,
    title: "Build smarter",
    desc: "Wallet spending patterns across categories reveal what users value, how they buy, and where SwiftVult should expand next.",
    stat: "70%",
    statLabel: "recurring revenue target",
  },
]

const flow = ["OTP", "Echo", "AI", "Cards", "Residency", "Creators", "APIs"]

export function WalletStorySection() {
  return (
    <section className="overflow-hidden bg-[#07130f] py-24 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#b7ff6a]">The wallet is the platform</p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Every service gets stronger when it runs through one Naira balance.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/58">
              SwiftVult is not a list of disconnected services. It is a wallet-led access layer: users fund once, discover what they need next, and build a durable digital life around the vault.
            </p>
            <Link href="/register" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#b7ff6a] px-5 py-3 text-sm font-bold text-[#07130f] transition hover:bg-[#d6ff9d]">
              Fund your free vault
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur"
          >
            <div className="rounded-[1.4rem] border border-white/10 bg-[#0b1b15] p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/36">Vault balance</p>
                  <p className="mt-2 text-4xl font-bold tracking-tight">₦124,420.50</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-[#07130f]">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-bold">+₦4,500</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">latest top-up</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-7">
                {flow.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="rounded-xl border border-white/8 bg-white/[0.05] px-3 py-3 text-center text-xs font-semibold text-white/70"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon

                return (
                  <motion.article
                    key={pillar.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.42, delay: index * 0.06 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.055] p-5"
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b7ff6a] text-[#07130f]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{pillar.stat}</p>
                        <p className="text-[11px] text-white/36">{pillar.statLabel}</p>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white">{pillar.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-white/50">{pillar.desc}</p>
                  </motion.article>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
