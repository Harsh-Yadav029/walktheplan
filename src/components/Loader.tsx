import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SITE_CONFIG } from '../config';

interface LoaderProps {
  visible: boolean;
  progressPct: number;
}

/**
 * Minimal quiet-luxury preloader: thin hairline progress track + tabular percentage.
 * Dismisses smoothly once the first 30 sequential frames are decoded.
 */
export const Loader: React.FC<LoaderProps> = ({ visible, progressPct }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sequence-loader"
          role="status"
          aria-live="polite"
          aria-label={`Loading architectural sequence: ${progressPct}%`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07090C] px-8"
        >
          <div className="w-full max-w-xs space-y-6 text-center">
            <div className="space-y-2">
              <p className="font-serif-display text-2xl sm:text-3xl font-light tracking-tight text-[#F2EEE8]">
                {SITE_CONFIG.brand.name}
              </p>
              <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#C8A97E]/85">
                {SITE_CONFIG.brand.tagline}
              </p>
            </div>

            {/* Thin progress hairline */}
            <div className="relative h-px w-full overflow-hidden bg-white/12">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C8A97E] via-[#F2EEE8] to-[#3DA9FF]"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.max(4, progressPct)}%` }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#9BA3AF]">
              <span>Preparing sequence</span>
              <span className="font-mono-tech text-[#F2EEE8]">
                {String(progressPct).padStart(2, '0')}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
