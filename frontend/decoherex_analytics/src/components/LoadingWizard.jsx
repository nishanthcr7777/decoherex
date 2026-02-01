import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LOAD_DURATION_MS = 2400;
const PROGRESS_INTERVAL_MS = 30;

// Target position to match header logo (px) - sync with Header.jsx
const HEADER_LOGO_LEFT = 24;
const HEADER_LOGO_TOP = 22;

const logoStyle = {
  fontFamily: "Inter, system-ui, sans-serif",
  textShadow: "0 0 60px rgba(6, 182, 212, 0.15)",
  fontSize: "clamp(3rem, 10vw, 6rem)",
};

const LoadingWizard = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const step = (100 / LOAD_DURATION_MS) * PROGRESS_INTERVAL_MS;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + step, 100);
        if (next >= 100) {
          clearInterval(interval);
          setIsExiting(true);
        }
        return next;
      });
    }, PROGRESS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* When exiting: logo flies from center to top-left (header position) */}
      {isExiting && (
        <motion.h1
          className="z-[10001] font-bold tracking-tight text-foreground"
          style={{
            ...logoStyle,
            position: "fixed",
            left: HEADER_LOGO_LEFT,
            top: HEADER_LOGO_TOP,
          }}
          initial={{
            left: "50vw",
            top: "50vh",
            x: "-50%",
            y: "-50%",
            scale: 1,
          }}
          animate={{
            left: HEADER_LOGO_LEFT,
            top: HEADER_LOGO_TOP,
            x: 0,
            y: 0,
            scale: 0.2,
          }}
          transition={{
            duration: 0.65,
            ease: [0.33, 1, 0.68, 1],
          }}
          onAnimationComplete={onComplete}
        >
          DecohereX
        </motion.h1>
      )}

      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        initial={false}
        animate={{
          opacity: isExiting ? 0 : 1,
        }}
        transition={{
          duration: isExiting ? 0.2 : 0.55,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{ pointerEvents: isExiting ? "none" : "auto" }}
      >
        {/* Subtle background gradient */}
        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-accent/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        <div className="relative z-10 flex flex-col items-center gap-12 px-6">
          {/* Big DecohereX (hidden when exiting - flying copy is shown instead) */}
          {!isExiting && (
            <motion.h1
              className="font-sans font-bold tracking-tight text-foreground"
              style={logoStyle}
              initial={{ opacity: 0, scale: 0.92, letterSpacing: "0.2em" }}
              animate={{
                opacity: 1,
                scale: 1,
                letterSpacing: "0.02em",
              }}
              transition={{
                duration: 0.7,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              DecohereX
            </motion.h1>
          )}

          <motion.p
            className="text-center text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Quantum analytics
          </motion.p>

          <motion.div
            className="w-full max-w-xs overflow-hidden rounded-full bg-muted/80 sm:max-w-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            style={{ height: "6px" }}
          >
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15, ease: "linear" }}
              style={{
                boxShadow: "0 0 12px rgba(6, 182, 212, 0.5)",
              }}
            />
          </motion.div>

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
