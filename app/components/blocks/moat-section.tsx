"use client"

import { motion } from "framer-motion"
import { HeartHandshake, Layers, LineChart, Shield, Wallet } from "lucide-react"

const moats = [
  {
    icon: Shield,
    title: "Naira-native pricing",
    desc: "Users fund with bank transfer, USSD, or card. SwiftVault removes the dollar-card blocker from global digital services.",
  },
  {
    icon: Wallet,
    title: "Wallet lock-in",
    desc: "Balance, transaction history, Echo Numbers, referrals, and subscriptions create a single home for repeat access.",
  },
  {
    icon: Layers,
    title: "Bundle effect",
    desc: "OTP, AI, cards, residency, creator tools, and APIs are stronger together than as disconnected purchases.",
  },
  {
    icon: HeartHandshake,
    title: "Local support",
    desc: "Nigerian payment rails, local support habits, and messaging that understands the user’s actual constraint.",
  },
  {
    icon: LineChart,
    title: "Data advantage",
    desc: "Wallet activity reveals category demand, renewal behavior, price sensitivity, and next-product timing.",
  },
]

export function MoatSection() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Why SwiftVault wins</p>
            <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Built around the pain competitors keep treating as an edge case.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500">
              The advantage is not just more services. It is a local, wallet-first operating model that makes global access feel normal for Nigerian users.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {moats.map((moat, index) => {
              const Icon = moat.icon

              return (
                <motion.article
                  key={moat.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-950/[0.06] sm:grid-cols-[auto_1fr]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#07130f] text-[#b7ff6a]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-950">{moat.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500">{moat.desc}</p>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
