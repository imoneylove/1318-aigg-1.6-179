import React from 'react';
import { Coffee, FileDown } from 'lucide-react';
import type { SlideMeta } from '../data/presentationContent';

interface TopNavBarProps {
  slides: SlideMeta[];
  currentSlide: number;
  accentGradient?: string;
  onSelectSlide: (index: number) => void;
  onOpenCast: () => void;
  onOpenHandout: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  slides,
  currentSlide,
  accentGradient,
  onSelectSlide,
  onOpenCast,
  onOpenHandout,
}) => {
  const progressPct = ((currentSlide + 1) / slides.length) * 100;

  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5] border-b border-stone-200/90 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 lg:gap-8">
        {/* Zone 1: Custom Brand Emblem + Story-aligned Title */}
        <button
          type="button"
          onClick={() => onSelectSlide(0)}
          className="inline-flex items-center gap-2.5 text-stone-900 hover:text-[#B4432C] transition-colors whitespace-nowrap shrink-0 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E4D5C] cursor-pointer"
        >
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-stone-900 text-[#FBF9F5]"
          >
            <Coffee className="w-4 h-4" />
          </span>
          <span className="font-editorial text-base sm:text-lg font-bold tracking-tight">
            i級投資客日記 · 咖啡與算盤
          </span>
        </button>

        {/* Zone 2: Concise single-line chapter navigation + Cast link */}
        <nav
          aria-label="簡報章節導覽"
          className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs xl:text-sm font-medium"
        >
          {slides.map((slide, idx) => {
            const active = idx === currentSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => onSelectSlide(idx)}
                aria-current={active ? 'step' : undefined}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E4D5C] ${
                  active
                    ? 'text-stone-900 font-semibold'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <span>{slide.shortNavLabel}</span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#B4432C]"
                  />
                )}
              </button>
            );
          })}

          <span className="text-stone-300" aria-hidden="true">
            |
          </span>

          <button
            type="button"
            onClick={onOpenCast}
            className="py-1 text-stone-600 hover:text-[#B4432C] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E4D5C]"
          >
            人物圖鑑
          </button>
        </nav>

        {/* Zone 3: Top-right Primary Action -> Colorful PDF Handout */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenHandout}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#FBF9F5] bg-[#B4432C] hover:bg-[#933420] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B4432C]"
          >
            <FileDown className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>PDF 講義下載</span>
          </button>
        </div>
      </div>

      {/* Thin horizontal slide progress indicator */}
      <div
        className="h-0.5 w-full bg-stone-200/70"
        role="progressbar"
        aria-valuenow={currentSlide + 1}
        aria-valuemin={1}
        aria-valuemax={slides.length}
        aria-label="簡報進度"
      >
        <div
          className="h-full transition-[width] duration-300 ease-out"
          style={{
            width: `${progressPct}%`,
            background: accentGradient ?? '#B4432C',
          }}
        />
      </div>
    </header>
  );
};
