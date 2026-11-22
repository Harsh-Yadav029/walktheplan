"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type Card = {
  id: number;
  content: React.ReactNode | string;
  className: string;
  thumbnail: string;
  title?: string;
  category?: string;
  location?: string;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  const handleClick = (card: Card) => {
    setLastSelected(selected);
    setSelected(selected?.id === card.id ? null : card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 sm:gap-6 relative">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, "min-h-[300px] sm:min-h-[360px] md:min-h-[400px]")}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              card.className,
              "relative overflow-hidden cursor-pointer rounded-2xl group",
              selected?.id === card.id
                ? "rounded-2xl cursor-pointer absolute inset-0 h-4/5 md:h-3/4 w-full md:w-3/4 lg:w-2/3 m-auto z-50 flex justify-center items-center flex-wrap flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-white/20"
                : lastSelected?.id === card.id
                ? "z-40 bg-[#181A1B] rounded-2xl h-full w-full border border-white/10"
                : "bg-[#181A1B] rounded-2xl h-full w-full border border-white/10"
            )}
            layoutId={`card-${card.id}`}
          >
            {selected?.id === card.id ? (
              <SelectedCard selected={selected} />
            ) : (
              /* Ambient Card Overlay in Default Grid State */
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-6 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none">
                {card.category && (
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#EED77A] mb-1">
                    {card.category} {card.location ? `• ${card.location}` : ""}
                  </span>
                )}
                {card.title && (
                  <h4 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-[#F2EDE5] transition-colors leading-tight">
                    {card.title}
                  </h4>
                )}
                <span className="text-[11px] font-mono text-[#A5A7A4] mt-2 inline-flex items-center gap-1 group-hover:text-[#C47B52] transition-colors">
                  <span>Click to inspect details</span>
                  <span>→</span>
                </span>
              </div>
            )}
            <ImageComponent card={card} />
          </motion.div>
        </div>
      ))}

      {/* Dimmed backdrop when a card is expanded */}
      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          "absolute h-full w-full left-0 top-0 bg-black/80 rounded-3xl z-30 backdrop-blur-sm",
          selected?.id ? "pointer-events-auto" : "pointer-events-none"
        )}
        animate={{ opacity: selected?.id ? 0.75 : 0 }}
        initial={{ opacity: 0 }}
      />
    </div>
  );
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <motion.img
      layoutId={`image-${card.id}-image`}
      src={card.thumbnail}
      className={cn(
        "object-cover object-center absolute inset-0 h-full w-full transition duration-300 group-hover:scale-105 select-none"
      )}
      alt="Walk The Plan Studio Thumbnail"
    />
  );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-2xl shadow-2xl relative z-[60] overflow-hidden">
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 0.8,
        }}
        className="absolute inset-0 h-full w-full bg-gradient-to-t from-black via-black/70 to-black/30 z-10"
      />
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 50,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="relative p-6 sm:p-8 md:p-10 z-[70] max-h-full overflow-y-auto"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};

export default LayoutGrid;
