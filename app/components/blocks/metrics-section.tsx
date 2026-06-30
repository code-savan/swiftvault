"use client"

import { motion } from "framer-motion"
import { BarChart3, Repeat, Target, TrendingUp, Users, Wallet } from "lucide-react"

const metrics = [
  { icon: Wallet, value: "₦8.74B", label: "Year 1 upside target", sublabel: "across seven access products" },
  { icon: Users, value: "100K+", label: "registered users", sublabel: "target by month 12" },
  { icon: TrendingUp, value: "₦120M+", label: "monthly recurring revenue", sublabel: "projected at scale" },
  { icon: Repeat, value: "70%", label: "recurring revenue mix", sublabel: "subscriptions over transactions" },
  { icon: Target, value: "5+", label: "revenue streams live", sublabel: "diversified categories" },
  { icon: BarChart3, value: "50K+", label: "monthly active users", sublabel: "target engagement base" },
]

const revenueModels = [
  { name: "OTP Verification", arr: "₦50M", type: "Transactional", width: "18%", color: "bg-emerald-500" },
  { name: "AI Access Vault", arr: "₦240M", type: "Recurring", width: "54%", color: "bg-violet-500" },
  { name: "Virtual Dollar Cards", arr: "₦432M", type: "Recurring + FX", width: "88%", color: "bg-cyan-500" },
  { name: "Digital Residency", arr: "₦270M", type: "Recurring", width: "60%", color: "bg-blue-500" },
  { name: "Creator Toolkit", arr: "₦288M", type: "Recurring", width: "64%", color: "bg-rose-500" },
  { name: "Developer API", arr: "₦150M", type: "Transactional", width: "38%", color: "bg-slate-700" },
]

export function MetricsSection() {
  return (
    <section className="overflow-hidden bg-[#f7f8f4] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Numbers that matter</p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Ambitious, measurable, and tied to wallet behavior.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500">
            The landing page now frames SwiftVault as a business with real operating leverage: repeat use, wallet float, cross-sell, and recurring access products.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon

            return (
              <motion.article
                key={metric.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07130f] text-[#b7ff6a]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300">M12</span>
                </div>
                <p className="text-3xl font-black tracking-tight text-slate-950">{metric.value}</p>
                <p className="mt-2 text-sm font-bold text-slate-700">{metric.label}</p>
                <p className="mt-1 text-xs text-slate-400">{metric.sublabel}</p>
              </motion.article>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 rounded-[2rem] border border-black/[0.06] bg-white p-5 shadow-sm lg:p-7"
        >
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Revenue breakdown</p>
              <h3 className="text-2xl font-bold tracking-tight text-slate-950">Seven models, one vault balance</h3>
            </div>
            <div className="rounded-2xl bg-[#07130f] px-5 py-3 text-white">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Total target</p>
              <p className="text-xl font-black text-[#b7ff6a]">₦1.43B ARR</p>
            </div>
          </div>

          <div className="space-y-4">
            {revenueModels.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.32, delay: index * 0.04 }}
                className="grid gap-3 sm:grid-cols-[190px_1fr_120px]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{model.name}</p>
                  <p className="text-[11px] text-slate-400">{model.type}</p>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${model.color}`} style={{ width: model.width }} />
                  </div>
                </div>
                <p className="text-left text-sm font-black text-slate-950 sm:text-right">{model.arr}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
