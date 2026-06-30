"use client"

import Link from "next/link"
import { Check, Minus, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "/month",
    description: "Start with a wallet and basic access.",
    features: ["Naira wallet", "Paystack funding", "Basic OTP verification", "Community support"],
    disabled: ["AI Vault", "Virtual cards", "Digital residency"],
  },
  {
    name: "Pay-as-you-go",
    price: "₦0",
    period: "+ usage",
    description: "Best for most users buying as needed.",
    popular: true,
    features: ["Everything in Free", "Pay per OTP", "Echo Numbers", "AI access when live", "Email support"],
    disabled: ["Bulk API", "Dedicated manager"],
  },
  {
    name: "Unlimited Pro",
    price: "₦15,000",
    period: "/month",
    description: "For power users and operators.",
    features: ["Unlimited OTP bundle", "10 Echo Numbers", "Full AI Vault", "1 virtual card", "Priority support"],
    disabled: [],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams, agencies, and API buyers.",
    features: ["Bulk rates", "Team management", "Custom integration", "SLA", "Dedicated manager"],
    disabled: [],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="bg-[#f7f8f4] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Pricing</p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Transparent Naira pricing for every stage.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
            Start free, pay only when you need access, then upgrade when SwiftVult becomes part of your daily workflow.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm ${
                plan.popular ? "border-[#07130f] shadow-2xl shadow-slate-950/[0.08]" : "border-black/[0.06]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-5 inline-flex items-center gap-1.5 rounded-full bg-[#b7ff6a] px-3 py-1 text-[11px] font-black text-[#07130f] shadow-lg">
                  <Sparkles className="h-3 w-3" />
                  Most popular
                </div>
              )}
              <div className="pb-5">
                <h3 className="text-lg font-black text-slate-950">{plan.name}</h3>
                <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">{plan.description}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tight text-slate-950">{plan.price}</span>
                  <span className="text-sm font-semibold text-slate-400">{plan.period}</span>
                </div>
              </div>

              <ul className="flex-1 space-y-3 border-t border-slate-100 pt-5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {feature}
                  </li>
                ))}
                {plan.disabled.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-400">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={index === 3 ? "mailto:support@swiftvult.com" : "/register"} className="mt-7">
                <button
                  className={`w-full rounded-xl px-4 py-3 text-sm font-bold transition ${
                    plan.popular ? "bg-[#07130f] text-white hover:bg-[#10261e]" : "bg-slate-100 text-slate-950 hover:bg-slate-200"
                  }`}
                >
                  {index === 0 ? "Get started free" : index === 3 ? "Contact sales" : "Choose plan"}
                </button>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
