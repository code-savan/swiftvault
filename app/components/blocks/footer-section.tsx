"use client"

import { Github, Instagram, Mail, Shield, Twitter } from "lucide-react"

const links: Record<string, { label: string; href: string }[]> = {
  Services: [
    { label: "OTP Verification", href: "#services" },
    { label: "Echo Numbers", href: "#services" },
    { label: "AI Access Vault", href: "#services" },
    { label: "Virtual Dollar Cards", href: "#services" },
    { label: "Developer API", href: "#services" },
  ],
  Platform: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact", href: "mailto:support@swiftvault.com" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
}

const socials = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:support@swiftvault.com" },
]

export function FooterSection() {
  return (
    <footer className="border-t border-white/8 bg-[#07130f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1.85fr]">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b7ff6a] text-[#07130f]">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-lg font-black tracking-tight">SwiftVault</span>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/42">
              Nigeria&apos;s all-in-one digital vault for OTP verification, Echo Numbers, AI access, cards, creator tools, and developer APIs.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/42 transition hover:border-[#b7ff6a]/40 hover:text-[#b7ff6a]"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(links).map(([title, items]) => (
              <div key={title}>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-white/72">{title}</h4>
                <ul className="space-y-3">
                  {items.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-white/38 transition hover:text-[#b7ff6a]">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/8 pt-6 text-xs text-white/28 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} SwiftVault. All rights reserved.</p>
          <p>
            Powered by <span className="text-[#b7ff6a]">Paystack</span>
            <span className="mx-1.5">&amp;</span>
            <span className="text-[#b7ff6a]">Supabase</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
