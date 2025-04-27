"use client"

import { useEffect, useState } from "react"
import { loadingMessages } from "@/lib/constants"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingMessage() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-white font-medium"
      >
        {loadingMessages[messageIndex]}
      </motion.p>
    </AnimatePresence>
  )
}
