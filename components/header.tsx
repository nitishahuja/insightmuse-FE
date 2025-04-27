"use client";

import { BookOpen, Beaker, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="py-6 relative z-10">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <BookOpen className="h-8 w-8 text-[#EC4899]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <Beaker className="h-4 w-4 text-[#8B5CF6]" />
            </motion.div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#EC4899] to-[#8B5CF6]">
              TL;DR Science
            </h1>
            <p className="text-xs text-[#94A3B8]">
              Research Papers for the Restless
            </p>
          </div>
        </motion.div>

        <motion.div
          className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Sparkles className="h-4 w-4 text-[#EC4899]" />
          <p className="text-sm font-medium text-white">
            Making Science Digestible Since 2025
          </p>
        </motion.div>
      </div>
    </header>
  );
}
