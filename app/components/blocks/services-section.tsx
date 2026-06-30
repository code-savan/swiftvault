"use client"

import { ArrowRight, Brain, Code, CreditCard, MapPin, MessageSquare, Palette, Phone, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const services = [
  {
    icon: Phone,
    title: "OTP Verification",
    desc: "Instant disposable numbers for WhatsApp, Google, Telegram, Amazon and more, with Naira pricing per request.",
    status: "Live",
    accent: "from-emerald-500 to-lime-400",
    className: "lg:col-span-2 lg:row-span-2",
    metric: "150+ countries",
  },
  {
    icon: MessageSquare,
    title: "Echo Numbers",
    desc: "Persistent US and UK phone numbers with SMS forwarding for accounts that need continuity.",
    status: "Live",
    accent: "from-cyan-500 to-sky-400",
    metric: "Monthly rental",
  },
  {
    icon: Brain,
    title: "AI Access Vault",
    desc: "ChatGPT, Claude, Midjourney and Gemini access bundled into one Naira subscription.",
    status: "Coming Soon",
    accent: "from-violet-500 to-fuchsia-400",
    metric: "Pro bundle",
  },
  {
    icon: CreditCard,
    title: "Virtual Dollar Cards",
    desc: "Fund in Naira and spend globally on SaaS, streaming, software, and subscriptions.",
    status: "Coming Soon",
    accent: "from-amber-500 to-orange-400",
    metric: "FX bridge",
  },
  {
    icon: MapPin,
    title: "Digital Residency",
    desc: "US/UK numbers, addresses, and access rails for geo-restricted services.",
    status: "Coming Soon",
    accent: "from-blue-500 to-cyan-400",
    metric: "Identity kit",
  },
  {
    icon: Palette,
    title: "Creator Toolkit",
    desc: "Canva, CapCut, AI captions, stock assets and publishing tools for Nigerian creators.",
    status: "Coming Soon",
    accent: "from-rose-500 to-pink-400",
    metric: "Creator stack",
  },
  {
    icon: Code,
    title: "Developer API Marketplace",
    desc: "Buy AI, SMS, payment, and data API credits in Naira with usage-based billing.",
    status: "Coming Soon",
    accent: "from-slate-700 to-slate-500",
    metric: "API credits",
  },
]

function ServiceCard({ service, index }: { service: typeof services[number]; index: number }) {
  const comingSoon = service.status === "Coming Soon"
  const Icon = service.icon

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`group relative overflow-hidden rounded-[1.25rem] border border-black/[0.06] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-black/10 hover:shadow-2xl hover:shadow-black/[0.07] ${service.className ?? ""}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${service.accent}`} />
      <div className="flex h-full flex-col justify-between gap-8">
        <div>
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${service.accent} text-white shadow-lg shadow-black/10`}>
              <Icon className="h-5 w-5" />
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                comingSoon ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {service.status}
            </span>
          </div>

          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{service.metric}</p>
          <h3 className="text-lg font-bold tracking-tight text-slate-950">{service.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">{service.desc}</p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs font-semibold text-slate-500">{comingSoon ? "Waitlist opening soon" : "Available now"}</span>
          <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900" />
        </div>
      </div>
    </motion.article>
  )
}

export function ServicesSection() {
  return (
    <section id="services" className="overflow-hidden bg-[#f7f8f4] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">The vault suite</p>
            <h2 className="max-w-xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              One wallet that unlocks the internet Nigerians actually use.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-[1.5rem] border border-black/[0.06] bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#07130f] text-[#b7ff6a]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm leading-7 text-slate-600">
                  SwiftVault starts with OTP and Echo Numbers, then expands into AI, cards, residency, creator tools, and developer APIs. The connective tissue is simple: fund once in Naira, spend everywhere.
                </p>
                <Link href="/register" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-950">
                  Create a vault
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid auto-rows-[minmax(230px,auto)] gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
