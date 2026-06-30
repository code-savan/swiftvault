"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D2818]">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(74,222,128,0.4) 0%, transparent 60%)",
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative mb-8"
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(74,222,128,0.4)",
              "0 0 0 20px rgba(74,222,128,0)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4ADE80]"
        >
          <Zap className="h-8 w-8 text-[#0D2818]" />
        </motion.div>
      </motion.div>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex items-center gap-1"
      >
        <span className="text-sm font-medium tracking-wide text-white/60">
          Loading your vault
        </span>
        <span className="flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="h-1 w-1 rounded-full bg-[#4ADE80]"
            />
          ))}
        </span>
      </motion.div>
    </div>
  )
}
