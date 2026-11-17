import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SLIDES } from './data/presentationContent';
import {
  clampSlideIndex,
  getSlideThemePalette,
  type SliderZone,
} from './utils/presentationLogic';
import { TopNavBar } from './components/TopNavBar';
import { SlideThemeContext } from './components/IllustrationStage';
import { CharacterCastModal } from './components/CharacterCastModal';
import { A4HandoutModal } from './components/A4HandoutModal';
import { SlideCover } from './components/slides/SlideCover';
import { SlideCapex } from './components/slides/SlideCapex';
import { SlideDishwashing } from './components/slides/SlideDishwashing';
import { SlideThermometer } from './components/slides/SlideThermometer';
import { SlideCreditCrunch } from './components/slides/SlideCreditCrunch';
import { SlideColdStove } from './components/slides/SlideColdStove';
import { SlideQuiz } from './components/slides/SlideQuiz';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return 1;
    }
    return 0;
  });
  const [ambientZone, setAmbientZone] = useState<SliderZone | 'neutral'>('neutral');
  const [isCastOpen, setIsCastOpen] = useState<boolean>(false);
  const [isHandoutOpen, setIsHandoutOpen] = useState<boolean>(false);

  const totalSlides = SLIDES.length;

  const goToSlide = useCallback(
    (index: number) => {
      const next = clampSlideIndex(index, totalSlides);
      if (next === 2 || next === 6) {
        setAmbientZone('neutral');
      }
      setCurrentSlide(next);
    },
    [totalSlides]
  );

  const handlePrev = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const handleNext = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isCastOpen || isHandoutOpen) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handlePrev, isCastOpen, isHandoutOpen]);

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return (
          <SlideCover
            onStartDeck={() => goToSlide(1)}
            onJumpToSlide={goToSlide}
            onOpenCast={() => setIsCastOpen(true)}
            onZoneChange={setAmbientZone}
          />
        );
      case 1:
        return <SlideCapex onZoneChange={setAmbientZone} />;
      case 2:
        return <SlideDishwashing />;
      case 3:
        return <SlideThermometer onZoneChange={setAmbientZone} />;
      case 4:
        return <SlideCreditCrunch onZoneChange={setAmbientZone} />;
      case 5:
        return <SlideColdStove onZoneChange={setAmbientZone} />;
      case 6:
        return <SlideQuiz />;
      default:
        return (
          <SlideCover
            onStartDeck={() => goToSlide(1)}
            onJumpToSlide={goToSlide}
            onOpenCast={() => setIsCastOpen(true)}
            onZoneChange={setAmbientZone}
          />
        );
    }
  };

  const themePalette = getSlideThemePalette(currentSlide, ambientZone);

  return (
    <SlideThemeContext.Provider value={themePalette}>
      <div
        className="min-h-screen flex flex-col text-stone-900 transition-all duration-500"
        style={{ background: themePalette.backdropGradient }}
        data-slide-index={currentSlide}
        data-ambient-zone={ambientZone}
      >
        <TopNavBar
          slides={SLIDES}
          currentSlide={currentSlide}
          accentGradient={themePalette.accentGradient}
          onSelectSlide={goToSlide}
          onOpenCast={() => setIsCastOpen(true)}
          onOpenHandout={() => setIsHandoutOpen(true)}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col justify-center no-print">
          <section
            key={currentSlide}
            className="animate-slide-enter"
            aria-label={SLIDES[currentSlide]?.title}
          >
            {renderSlide()}
          </section>
        </main>

      {/* Bottom Slide Deck Controller */}
      <footer className="border-t border-stone-200 bg-[#F4F0E8]/90 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md border border-stone-300 bg-[#FBF9F5] text-stone-800 hover:bg-stone-900 hover:text-[#FBF9F5] disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>上一幕</span>
          </button>

          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="hidden md:inline text-xs font-semibold text-stone-700 whitespace-nowrap">
              YouTube｜i級投資客日記
            </span>
            <span className="hidden md:inline text-stone-300" aria-hidden="true">
              ·
            </span>
            <span className="text-xs font-mono-tabular text-stone-600 whitespace-nowrap">
              第 {currentSlide + 1} / {totalSlides} 幕
            </span>
            <span className="hidden sm:inline text-stone-300" aria-hidden="true">
              ·
            </span>
            <span className="hidden sm:inline text-xs text-stone-600 truncate max-w-xs">
              {SLIDES[currentSlide]?.shortNavLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentSlide === totalSlides - 1}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md bg-stone-900 text-[#FBF9F5] hover:bg-[#B4432C] disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>下一幕</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </footer>

      <CharacterCastModal
        isOpen={isCastOpen}
        onClose={() => setIsCastOpen(false)}
      />

      <A4HandoutModal
        isOpen={isHandoutOpen}
        onClose={() => setIsHandoutOpen(false)}
      />
      </div>
    </SlideThemeContext.Provider>
  );
}
