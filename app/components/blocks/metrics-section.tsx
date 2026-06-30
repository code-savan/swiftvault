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
            The landing page now frames SwiftVult as a business with real operating leverage: repeat use, wallet float, cross-sell, and recurring access products.
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


      </div>
    </section>
  )
}
