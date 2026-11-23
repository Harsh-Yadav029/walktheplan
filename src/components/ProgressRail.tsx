import React from 'react';
import type { StoryChapter } from '../config';

interface ProgressRailProps {
  chapters: readonly StoryChapter[];
  activeChapterIndex: number;
  progress: number;
  onSelectChapter: (chapterIndex: number) => void;
}

/**
 * Left-edge vertical progress rail with 6 labelled chapter ticks
 * (PLAN, DESIGN, STRUCTURE, INTERIORS, EXPERIENCE, LIVE).
 * Highlights the active chapter in electric blue (#3DA9FF) and allows
 * direct keyboard/pointer chapter scrubbing.
 */
export const ProgressRail: React.FC<ProgressRailProps> = ({
  chapters,
  activeChapterIndex,
  progress,
  onSelectChapter,
}) => {
  return (
    <aside
      aria-label="Story chapters progress"
      className="pointer-events-auto hidden lg:flex fixed left-7 top-1/2 -translate-y-1/2 z-30 flex-col gap-5"
    >
      {/* Continuous hairline progress spine */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[5px] top-1.5 bottom-1.5 w-px bg-white/12"
      >
        <div
          className="w-full bg-gradient-to-b from-[#C8A97E] to-[#3DA9FF] transition-[height] duration-150 ease-out"
          style={{ height: `${Math.max(4, Math.min(100, progress * 100))}%` }}
        />
      </div>

      {chapters.map((chapter, idx) => {
        const isActive = idx === activeChapterIndex;
        const isPassed = idx < activeChapterIndex;
        return (
          <button
            key={chapter.id}
            type="button"
            onClick={() => onSelectChapter(idx)}
            data-cursor-interactive
            aria-current={isActive ? 'step' : undefined}
            aria-label={`Jump to chapter ${idx + 1}: ${chapter.railLabel}`}
            className="group relative flex items-center gap-3.5 py-0.5 text-left cursor-pointer focus-visible:outline-none"
          >
            {/* Tick dot */}
            <span
              aria-hidden="true"
              className={`relative z-10 block rounded-full transition-all duration-300 ${
                isActive
                  ? 'h-[11px] w-[11px] bg-[#3DA9FF] shadow-[0_0_12px_rgba(61,169,255,0.85)]'
                  : isPassed
                    ? 'h-[7px] w-[7px] ml-[2px] bg-[#C8A97E]/85'
                    : 'h-[7px] w-[7px] ml-[2px] bg-white/25 group-hover:bg-[#F2EEE8]/70'
              }`}
            />

            {/* Label */}
            <span
              className={`font-ui text-[10px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 ${
                isActive
                  ? 'text-[#3DA9FF]'
                  : 'text-[#F2EEE8]/45 group-hover:text-[#F2EEE8]/85'
              }`}
            >
              {chapter.railLabel}
            </span>
          </button>
        );
      })}
    </aside>
  );
};
