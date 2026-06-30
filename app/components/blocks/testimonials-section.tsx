"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Quote, Star } from "lucide-react"

const testimonials = [
  {
    name: "Adebayo O.",
    role: "Digital Entrepreneur",
    content: "The OTP flow is fast, predictable, and priced in a way I can explain to my team. I do not have to think about dollar cards anymore.",
    initials: "AO",
  },
  {
    name: "Chioma E.",
    role: "Social Media Manager",
    content: "Keeping client accounts alive with Echo Numbers is the kind of practical tool Nigerian operators have needed for years.",
    initials: "CE",
  },
  {
    name: "Folake D.",
    role: "Freelance Developer",
    content: "One wallet for codes, AI access, and API credits would save me hours every week. This feels built for how we actually work.",
    initials: "FD",
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-[#f7f8f4] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Customer proof</p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Designed for the people already fighting access barriers.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500">
            Entrepreneurs, creators, developers, and remote workers need tools that respect local payment reality without lowering product quality.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.42, delay: index * 0.07 }}
              className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <Quote className="h-6 w-6 text-emerald-600" />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm leading-7 text-slate-600">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#07130f] text-xs font-bold text-[#b7ff6a]">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-slate-950">{testimonial.name}</p>
                  <p className="text-xs text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
