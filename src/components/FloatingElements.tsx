"use client";

import { motion } from "framer-motion";
import { CreditCard, DollarSign, TrendingUp, Shield } from "lucide-react";
import { useEffect, useState } from "react";

const icons = [CreditCard, DollarSign, TrendingUp, Shield];

export function FloatingElements() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (dimensions.width === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            opacity: [0, 0.3, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        >
          <Icon className="w-6 h-6 text-blue-500/30" />
        </motion.div>
      ))}
    </div>
  );
}
