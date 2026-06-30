import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "SwiftVault — Nigeria's Digital Vault | OTP, AI, Virtual Cards & More",
  description:
    "Nigeria's all-in-one digital vault. Access OTP verification, AI models (ChatGPT, Claude, Midjourney), virtual dollar cards, US residency, creator tools, and developer APIs — all billed in Naira. No international card needed.",
  keywords:
    "Nigeria digital vault, OTP verification Nigeria, AI access Nigeria, virtual dollar card Nigeria, digital residency, creator tools, Naira payments, virtual numbers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-lg text-sm transition-all",
              formFieldInput:
                "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] transition-all placeholder:text-[var(--color-text-muted)]",
              card: "bg-transparent shadow-none border-0",
              headerTitle: "text-[28px] font-bold text-[var(--color-text-primary)]",
              headerSubtitle: "text-sm text-[var(--color-text-secondary)]",
              socialButtonsBlockButton:
                "border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-all",
              dividerLine: "bg-[var(--color-border)]",
              dividerText: "text-[var(--color-text-muted)] bg-[var(--color-surface)]",
              formFieldLabel: "text-[var(--color-text-primary)] text-[13px] font-medium",
              footerActionLink: "text-[var(--color-accent)] font-medium hover:underline",
              formFieldAction: "text-[var(--color-accent)] text-xs font-medium hover:underline",
            },
          }}
        >
          {children}
        </ClerkProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
