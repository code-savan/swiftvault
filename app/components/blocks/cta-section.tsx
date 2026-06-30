"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#07130f] py-24 text-white sm:py-28">
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#b7ff6a]">Get started today</p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Open the vault Nigerians should have had years ago.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/58">
            Fund in Naira, buy your first OTP number, and keep the same wallet ready for Echo Numbers, AI access, cards, and everything SwiftVult unlocks next.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <button className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#b7ff6a] px-6 text-sm font-black text-[#07130f] shadow-2xl shadow-[#b7ff6a]/20 transition hover:bg-[#d6ff9d] sm:w-auto">
                Create your free vault
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            </Link>
            <a href="#pricing">
              <button className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/14 bg-white/[0.06] px-6 text-sm font-bold text-white transition hover:bg-white/10 sm:w-auto">
                View pricing
              </button>
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-white/46">
            {["Free plan", "No international card", "Pay in Naira"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#b7ff6a]" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
