import { AuthDashboardPreview } from "./AuthDashboardPreview"
import { Shield, Globe, CreditCard } from "lucide-react"

const features = [
  {
    icon: Shield,
    label: "OTP Verification",
    desc: "Instant codes for 150+ services",
  },
  {
    icon: Globe,
    label: "Global Access",
    desc: "US numbers, eSIMs, AI tools",
  },
  {
    icon: CreditCard,
    label: "Naira Payments",
    desc: "No international card needed",
  },
]

export function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex w-3/5 flex-col justify-between p-12 relative overflow-hidden bg-[#0D1117] h-screen">
      {/* Grid — light green, circular fade */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 65%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 65%, transparent 100%)",
        }}
      />

      {/* Dashboard preview — absolute, middle-right */}
      <div className="absolute top-1/2 right-[8%] -translate-y-1/2 z-0">
        <AuthDashboardPreview />
      </div>

      {/* Headline copy */}
      <div className="relative z-10 pt-4">
        <h2 className="text-[40px] font-bold leading-[1.1] tracking-tight text-white mb-1">
          Global services.
        </h2>
        <h2 className="text-[40px] font-bold leading-[1.1] tracking-tight text-[#16A34A] mb-4">
          Paid in Naira.
        </h2>
        <p className="text-sm text-white/60 max-w-sm leading-relaxed mb-8">
          OTP verification, AI models, virtual cards, and US numbers — all from one Naira wallet.
        </p>

        {/* Feature bullets */}
        <div className="space-y-4">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#16A34A]/10 flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-white/[0.04]">
                  <Icon className="w-4 h-4 text-[#4ADE80]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.label}</p>
                  <p className="text-xs text-white/50">{f.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Spacer */}
      <div />
    </div>
  )
}
