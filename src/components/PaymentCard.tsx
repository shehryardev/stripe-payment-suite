"use client";

import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";

interface PaymentCardProps {
  className?: string;
}

export function PaymentCard({ className = "" }: PaymentCardProps) {
  return (
    <motion.div
      className={`relative w-80 h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden ${className}`}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Card background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Card content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
        <div className="flex justify-between items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CreditCard className="w-8 h-8 text-blue-400" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-right"
          >
            <div className="text-sm opacity-70">VALID THRU</div>
            <div className="text-sm font-mono">12/28</div>
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-mono mb-4"
          >
            •••• •••• •••• 4242
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between items-end"
          >
            <div>
              <div className="text-sm opacity-70">CARD HOLDER</div>
              <div className="text-sm font-semibold">JOHN DOE</div>
            </div>
            <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
              <div className="w-8 h-5 bg-white/20 rounded-sm"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
