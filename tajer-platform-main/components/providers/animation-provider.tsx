'use client';

import { motion } from 'framer-motion';

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
        opacity: {
          duration: 0.4
        },
        y: {
          duration: 0.6,
          ease: [0.34, 1.56, 0.64, 1] // elastic out
        }
      }}
    >
      {children}
    </motion.div>
  );
};