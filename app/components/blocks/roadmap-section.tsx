"use client"

import { motion } from "framer-motion"
import { Code, CreditCard, Palette, Rocket, Shield, Zap } from "lucide-react"

const phases = [
  {
    icon: Shield,
    period: "Month 1-2",
    title: "Production foundation",
    items: ["Real wallet operations", "Security audit", "Multi-provider SMS fallback", "Settings and transaction history"],
  },
  {
    icon: Zap,
    period: "Month 2-4",
    title: "AI Vault launch",
    items: ["AI access bundle", "SwiftVult Pro", "Referral visibility", "SEO service pages"],
  },
  {
    icon: CreditCard,
    period: "Month 4-6",
    title: "Cards and residency",
    items: ["Virtual dollar cards", "US/UK identity bundle", "Dynamic OTP pricing", "Loyalty tiers"],
  },
  {
    icon: Palette,
    period: "Month 6-10",
    title: "Creator and developer suite",
    items: ["Creator toolkit", "API marketplace", "PWA and mobile app", "WhatsApp notifications"],
  },
  {
    icon: Rocket,
    period: "Month 10-12",
    title: "Scale and fundraise",
    items: ["Role-based admin", "Analytics", "Compliance docs", "Investor materials"],
  },
]

export function RoadmapSection() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">The roadmap</p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            From OTP MVP to digital access ecosystem.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500">
            Each phase compounds the wallet: more services, better retention, richer data, and stronger reasons to keep SwiftVult open.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 lg:grid-cols-5">
          {phases.map((phase, index) => {
            const Icon = phase.icon

            return (
              <motion.article
                key={phase.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.42, delay: index * 0.06 }}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#f7f8f4] p-5"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07130f] text-[#b7ff6a]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black text-slate-300">0{index + 1}</span>
                </div>
                <p className="mb-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-700 shadow-sm">{phase.period}</p>
                <h3 className="text-base font-bold text-slate-950">{phase.title}</h3>
                <ul className="mt-4 space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                      <Code className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
