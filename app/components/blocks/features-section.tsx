"use client"

import { CheckCircle2, CreditCard, Globe, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { AIAccessPreview, EchoNumbersPreview, OTPPreview, WalletPreview } from "@/app/components/blocks/dashboard-previews"

const steps = [
  {
    icon: CreditCard,
    title: "Fund in Naira",
    desc: "Use card, bank transfer, or USSD through Paystack. Your vault balance updates instantly.",
  },
  {
    icon: Globe,
    title: "Choose your access",
    desc: "Pick OTP, Echo Numbers, AI, cards, residency, creator tools, or API credits from one marketplace.",
  },
  {
    icon: Zap,
    title: "Get it immediately",
    desc: "Codes, balances, messages, and receipts appear in your dashboard with clear transaction history.",
  },
]

const checks = ["No international card", "Transparent Naira pricing", "Unified wallet history"]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-8"
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">How it works</p>
            <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              A premium access flow, without premium friction.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500">
              The dashboard is designed for repeated use: fund, buy, copy, track, renew, and refer. Everything stays visible and auditable.
            </p>
            <div className="mt-7 grid gap-3">
              {checks.map((check) => (
                <div key={check} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {check}
                </div>
              ))}
            </div>
          </motion.div>

          <div>
            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon

                return (
                  <motion.article
                    key={step.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07130f] text-[#b7ff6a]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-black text-slate-200">0{index + 1}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-950">{step.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-slate-500">{step.desc}</p>
                  </motion.article>
                )
              })}
            </div>

            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-[#f7f8f4] p-3 shadow-sm">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <WalletPreview />
                <OTPPreview />
                <EchoNumbersPreview />
                <AIAccessPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
