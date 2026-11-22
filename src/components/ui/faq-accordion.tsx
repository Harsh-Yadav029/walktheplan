"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function FaqAccordion({
  items,
  allowMultiple = false,
  className,
}: FaqAccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggle = (index: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto space-y-3.5", className)}>
      {items.map((item, index) => {
        const isOpen = openIndices.includes(index);
        return (
          <div
            key={item.id ?? index}
            className="rounded-2xl border border-white/10 bg-[#202223]/90 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-[#C47B52]/40 shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between text-left px-6 py-5 md:px-8 md:py-6 cursor-pointer select-none group"
              aria-expanded={isOpen}
            >
              <span className="text-[#F5F2EB] font-medium text-base md:text-lg pr-4 group-hover:text-white transition-colors">
                {item.question}
              </span>
              <span className="shrink-0 text-[#C47B52] transition-transform duration-300 ease-out flex items-center justify-center w-6 h-6">
                <Plus
                  className={cn(
                    "w-5 h-5 transition-transform duration-300 ease-out",
                    isOpen && "rotate-45 text-[#C47B52]"
                  )}
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 md:px-8 md:pb-7 pt-1 text-sm md:text-base text-[#E8E3D9]/75 leading-relaxed border-t border-white/5">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
