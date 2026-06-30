"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Minus, Plus } from "lucide-react"

const faqs = [
  {
    q: "What is SwiftVault?",
    a: "SwiftVault is an all-in-one digital access wallet for Nigerians. Fund in Naira, then use that balance for OTP verification, Echo Numbers, AI access, cards, and future vault services.",
  },
  {
    q: "Do I need an international card?",
    a: "No. That is the blocker SwiftVault removes. Payments run through local Naira funding, with services billed from your vault balance.",
  },
  {
    q: "How do I fund my wallet?",
    a: "Open Wallet in your dashboard, choose Fund Wallet, then pay through Paystack using card, transfer, or USSD. Your balance updates after payment confirmation.",
  },
  {
    q: "What is an Echo Number?",
    a: "An Echo Number is a persistent US or UK number you can keep for longer-running accounts. It is different from a disposable OTP number.",
  },
  {
    q: "Is SwiftVault safe?",
    a: "The app uses Clerk for auth, Supabase/Postgres for data, and Paystack for payments. Sensitive operations should stay server-side as the product moves toward production.",
  },
  {
    q: "Can I get a refund?",
    a: "Refunds can apply to unused balances or eligible failed services. Support can review account-specific cases and process approved refunds according to policy.",
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-white py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">FAQ</p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            The practical details before you open a vault.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500">
            Clear answers on funding, numbers, safety, and what makes SwiftVault different from one-off OTP sellers.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: index * 0.03 }}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpen(open === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
              >
                <span className="text-sm font-bold text-slate-950">{faq.q}</span>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${open === index ? "bg-[#07130f] text-[#b7ff6a]" : "bg-slate-100 text-slate-500"}`}>
                  {open === index ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-slate-100 px-5 py-5 text-sm leading-7 text-slate-500">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
