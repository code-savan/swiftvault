"use client"

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

export default function SSOCallbackPage() {
  return (
    <div className="text-center py-12">
      <div className="w-11 h-11 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center mx-auto mb-4">
        <Loader2 className="w-5 h-5 animate-spin text-[var(--color-accent)]" />
      </div>
      <p className="text-sm text-[var(--color-text-secondary)]">Completing authentication...</p>
      <AuthenticateWithRedirectCallback />
    </div>
  )
}
