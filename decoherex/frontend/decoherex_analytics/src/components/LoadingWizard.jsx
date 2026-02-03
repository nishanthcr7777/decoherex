import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LOAD_DURATION_MS = 2400;

const logoStyle = {
  fontFamily: "Inter, system-ui, sans-serif",
  textShadow: "0 0 60px rgba(6, 182, 212, 0.15)",
  fontSize: "clamp(3rem, 10vw, 6rem)",
};

const LoadingWizard = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsExiting(true), LOAD_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-app-gradient"
        initial={false}
        animate={{
          opacity: isExiting ? 0 : 1,
        }}
        transition={{
          duration: isExiting ? 0.5 : 0.55,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{ pointerEvents: isExiting ? "none" : "auto" }}
        onAnimationComplete={() => isExiting && onComplete?.()}
      >
        {/* Dark radial vignette overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0.7) 100%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-12 px-6">
          {/* Big DecohereX — letter-by-letter fade-in + slight upward motion */}
          {!isExiting && (
            <motion.h1
              className="font-sans font-bold tracking-tight text-foreground flex justify-center"
              style={logoStyle}
              aria-label="DecohereX"
            >
              {"DecohereX".split("").map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                    delay: i * 0.055,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          )}

          <motion.div
            className="flex gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-accent"
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default LoadingWizard;
