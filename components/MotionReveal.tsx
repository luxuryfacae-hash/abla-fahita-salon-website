"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function MotionReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
