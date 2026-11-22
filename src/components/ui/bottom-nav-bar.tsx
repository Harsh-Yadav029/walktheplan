"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  LineChart,
  CreditCard,
  MessageCircle,
  Trophy,
  User,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
}

export const defaultNavItems: NavItem[] = [
  { label: "Home", icon: Home },
  { label: "Portfolio", icon: LineChart },
  { label: "Transactions", icon: CreditCard },
  { label: "Messages", icon: MessageCircle },
  { label: "Rewards", icon: Trophy },
  { label: "Profile", icon: User },
];

const MOBILE_LABEL_WIDTH = 72;

export type BottomNavBarProps = {
  className?: string;
  defaultIndex?: number;
  stickyBottom?: boolean;
  items?: NavItem[];
  activeIndex?: number;
  onItemChange?: (index: number, item: NavItem) => void;
  expandOnHover?: boolean;
};

export function BottomNavBar({
  className,
  defaultIndex = 0,
  stickyBottom = false,
  items = defaultNavItems,
  activeIndex: controlledIndex,
  onItemChange,
  expandOnHover = true,
}: BottomNavBarProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const handleSelect = (idx: number, item: NavItem) => {
    if (controlledIndex === undefined) {
      setInternalIndex(idx);
    }
    if (onItemChange) {
      onItemChange(idx, item);
    }
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <motion.nav
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      role="navigation"
      aria-label="Bottom Navigation"
      className={cn(
        "bg-[#181A1B]/95 dark:bg-[#181A1B]/95 border border-white/10 dark:border-white/10 backdrop-blur-xl rounded-full flex items-center p-1.5 sm:p-2 shadow-2xl space-x-1 min-w-[320px] max-w-[95vw] h-[52px]",
        stickyBottom && "fixed inset-x-0 bottom-4 mx-auto z-40 w-fit",
        className
      )}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeIndex === idx;
        const isExpanded = isActive || (expandOnHover && hoveredIndex === idx);

        return (
          <motion.button
            key={`${item.label}-${idx}`}
            whileTap={{ scale: 0.96 }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "flex items-center gap-0 px-3 py-1.5 sm:py-2 rounded-full transition-colors duration-200 relative h-9 sm:h-10 min-w-[42px] sm:min-w-[44px] cursor-pointer",
              isActive
                ? "bg-[#EED77A]/15 text-[#EED77A] gap-2 font-medium"
                : isExpanded
                ? "bg-white/10 text-white gap-2"
                : "bg-transparent text-[#F2EDE5]/70 hover:text-white hover:bg-white/5",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-[#EED77A]"
            )}
            onClick={() => handleSelect(idx, item)}
            aria-label={item.label}
            type="button"
          >
            <Icon
              size={20}
              strokeWidth={2}
              aria-hidden
              className={cn(
                "transition-colors duration-200 shrink-0",
                isActive ? "text-[#EED77A]" : "text-[#F2EDE5]/70"
              )}
            />

            <motion.div
              initial={false}
              animate={{
                width: isExpanded ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                opacity: isExpanded ? 1 : 0,
                marginLeft: isExpanded ? "6px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.19 },
                marginLeft: { duration: 0.19 },
              }}
              className={cn("overflow-hidden flex items-center max-w-[72px]")}
            >
              <span
                className={cn(
                  "font-medium text-xs whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis leading-tight",
                  isActive ? "text-[#EED77A]" : "text-[#F2EDE5]"
                )}
                title={item.label}
              >
                {item.label}
              </span>
            </motion.div>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

export default BottomNavBar;
