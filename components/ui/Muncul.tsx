"use client";

import { MotionConfig, motion } from "motion/react";

/**
 * Fade + slide-up halus saat elemen masuk layar.
 * reducedMotion="user": gerakan geser otomatis mati bila pengguna mengaktifkan
 * "kurangi gerakan"; hanya fade yang tersisa. Nilai awal sama di server & klien,
 * sehingga tidak terjadi hydration mismatch.
 */
export function Muncul({
  children,
  className,
  jeda = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Jeda dalam detik, untuk efek bertahap pada daftar. */
  jeda?: number;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: jeda }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
