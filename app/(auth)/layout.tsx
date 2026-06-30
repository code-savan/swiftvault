import { Zap } from "lucide-react"
import Link from "next/link"
import { AuthBrandPanel } from "@/app/components/AuthBrandPanel"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex bg-[var(--color-bg)]">
      {/* Left — Form Panel (40%) */}
      <div className="w-full lg:w-2/5 flex flex-col bg-[var(--color-surface)] h-screen relative overflow-hidden">
        {/* Grid — light green, circular fade */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: [
              "linear-gradient(rgba(22,163,74,0.04) 1px, transparent 1px)",
              "linear-gradient(90deg, rgba(22,163,74,0.04) 1px, transparent 1px)",
            ].join(", "),
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 65%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 65%, transparent 100%)",
          }}
        />

        {/* Brand logo top-left */}
        <div className="px-12 pt-10 pb-0 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">SwiftVault</span>
          </Link>
        </div>

        {/* Centered form content */}
        <div className="flex-1 flex items-center justify-center px-12 py-10 relative z-10">
          <div className="w-full max-w-md">
            <div id="clerk-captcha" />
            {children}

            {/* Social proof */}
            <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-3.5 h-3.5 text-[var(--color-accent)]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">
                  4.8/5 from 2,500+ reviews
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Trusted by <span className="font-medium text-[var(--color-text-secondary)]">50,000+</span> users across{" "}
                <span className="font-medium text-[var(--color-text-secondary)]">150+</span> countries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Brand Panel */}
      <AuthBrandPanel />
    </div>
  )
}
