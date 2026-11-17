import React, { useEffect } from 'react';
import { ArrowRight, Users } from 'lucide-react';
import {
  PRESENTATION_HEADLINE,
  SLIDES,
} from '../../data/presentationContent';
import type { SliderZone } from '../../utils/presentationLogic';
import { IllustrationStage, type BanterLine } from '../IllustrationStage';

interface SlideCoverProps {
  onStartDeck: () => void;
  onJumpToSlide: (index: number) => void;
  onOpenCast: () => void;
  onZoneChange?: (zone: SliderZone) => void;
}

const COVER_BANTER: BanterLine[] = [
  {
    characterId: 'analyst',
    speakerName: '算帳主廚',
    line: '香檳開到一半，會計師拿計算機來敲門——今天我們就把帳一次算清。',
  },
  {
    characterId: 'muse',
    speakerName: '旗袍偵探',
    line: 'AI 派對散場，倒是冷灶裡的不動產房租漲得比科技業還風光呢。',
  },
  {
    characterId: 'frenchie',
    speakerName: '法鬥小白',
    line: '汪！本汪先抱著黃籃子退到冷灶旁，今晚誰洗碗我可不管！',
  },
];

export const SlideCover: React.FC<SlideCoverProps> = ({
  onStartDeck,
  onJumpToSlide,
  onOpenCast,
  onZoneChange,
}) => {
  const slide = SLIDES[0];

  useEffect(() => {
    onZoneChange?.('normal');
  }, [onZoneChange]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
      <div className="lg:col-span-5">
        <IllustrationStage
          imageSrc={slide.imageSrc}
          imageAlt={slide.imageAlt}
          figureCaption={slide.figureCaption}
          banterLines={COVER_BANTER}
        />
      </div>

      <div className="lg:col-span-7 flex flex-col justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs tracking-widest text-[#B4432C] font-semibold">
              i級投資客日記 × {slide.chapterCode}
            </p>
            <button
              type="button"
              onClick={onOpenCast}
              className="lg:hidden inline-flex items-center gap-1 text-xs font-medium text-[#1E4D5C] hover:underline cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              人物圖鑑
            </button>
          </div>

          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 leading-tight mt-2 text-balance">
            {PRESENTATION_HEADLINE}
          </h1>

          <p className="mt-4 text-[15px] text-stone-700 leading-relaxed max-w-2xl first-letter:text-3xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:text-stone-900">
            人生最怕夢做到最香甜，會計師突然拿計算機來敲門。別盯著紅綠數字懷疑人生，用算帳的幽默一次看懂：AI 砍單、連環船 ETF、銀行抽銀根，以及冷灶不動產為何悄悄重返榮耀。
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-lg bg-[#F4F0E8] border border-stone-200">
              <span className="font-bold text-[#991B1B] block">① AI 夢醒算帳</span>
              <span className="text-stone-700 mt-1 block leading-snug">
                資本支出砍 1.6 兆、電網少 42 座核電廠，夢想向物理低頭。
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F4F0E8] border border-stone-200">
              <span className="font-bold text-[#B4432C] block">② 連環船與斷鏈</span>
              <span className="text-stone-700 mt-1 block leading-snug">
                ETF 全姓台積電、投信砍 179 億，美股右肩與二次追繳拉警報。
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F0F7F9] border border-[#A5CBD6]">
              <span className="font-bold text-[#1E4D5C] block">③ 冷灶重返榮耀</span>
              <span className="text-stone-700 mt-1 block leading-snug">
                東京商辦年漲兩成贏科技業，沒人擴廠的地方時間會還公道。
              </span>
            </div>
          </div>
        </div>

        {/* Chapter Quick Jump & Primary Start */}
        <div className="pt-4 border-t border-stone-200 flex flex-col gap-3.5">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {SLIDES.slice(1).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onJumpToSlide(item.id)}
                className="text-left p-2 rounded-md border border-stone-200 bg-[#FBF9F5] hover:border-stone-400 hover:bg-[#F4F0E8] transition-colors cursor-pointer"
              >
                <span className="block text-[11px] text-stone-500 font-mono-tabular">
                  0{item.id}
                </span>
                <span className="block text-xs font-semibold text-stone-900 mt-0.5 truncate">
                  {item.shortNavLabel}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-stone-500">
              支援鍵盤左右方向鍵切換 · 右上角可下載 3 頁全彩 PDF 講義
            </span>
            <button
              type="button"
              onClick={onStartDeck}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#FBF9F5] bg-[#B4432C] hover:bg-[#933420] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>翻開第一筆帳單</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
