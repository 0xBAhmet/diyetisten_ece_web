"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on devices with a fine pointer (mouse/trackpad)
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsVisible(true);
    }

    const manageMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", manageMouseMove);

    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
        style={{ width: 32, height: 32 }}
      >
        <div className="rounded-full border-2 border-primary-400 absolute w-full h-full bg-transparent" />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center text-primary-400 mix-blend-difference"
        animate={{
          x: mousePosition.x - 10,
          y: mousePosition.y - 10,
        }}
        transition={{
          type: "tween",
          ease: "backOut",
          duration: 0.15,
        }}
        style={{ width: 20, height: 20 }}
      >
        <Leaf size={16} strokeWidth={2.5} />
      </motion.div>
    </>
  );
}
