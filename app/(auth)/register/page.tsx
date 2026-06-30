import { Suspense } from "react"
import { SignUp } from "@clerk/nextjs"
import ReferralCapture from "./ReferralCapture"

export default function RegisterPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>

      {/* Two-tone heading */}
      <h1 className="text-[22px] font-bold text-[var(--color-text-primary)] leading-tight mb-1">
        Create{" "}
        <span className="text-[var(--color-accent)]">your account</span>
      </h1>

      {/* Subheading */}
      <p className="text-sm text-[var(--color-text-secondary)] mb-7">
        Start with a Naira wallet and global access.
      </p>

      <SignUp
        routing="hash"
        signInUrl="/login"
        fallbackRedirectUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-transparent shadow-none border-0 p-0 w-full",
            header: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton:
              "w-full h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-all",
            socialButtonsBlockButtonText: "text-sm font-medium",
            dividerContainer: "my-5",
            dividerLine: "bg-[var(--color-border)]",
            dividerText: "text-xs text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2",
            formFieldLabel: "text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5",
            formFieldInput:
              "h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all",
            formButtonPrimary:
              "w-full h-11 rounded-lg bg-[var(--color-accent)] text-white text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-all",
            footerAction: "mt-5 text-sm text-[var(--color-text-secondary)]",
            footerActionText: "text-sm text-[var(--color-text-secondary)]",
            footerActionLink: "text-sm font-medium text-[var(--color-accent)] hover:underline",
            formFieldAction: "text-xs font-medium text-[var(--color-accent)] hover:underline",
            formHeaderTitle: "hidden",
            formHeaderSubtitle: "hidden",
          },
        }}
      />
    </>
  )
}
