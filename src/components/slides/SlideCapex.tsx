import React, { useEffect, useState } from 'react';
import { Zap, Banknote, Utensils, Scale } from 'lucide-react';
import { SLIDES } from '../../data/presentationContent';
import {
  computeCapexStress,
  getZoneVisualStyle,
  type SliderZone,
} from '../../utils/presentationLogic';
import { IllustrationStage, type BanterLine } from '../IllustrationStage';
import { InteractiveSlider } from '../InteractiveSlider';

interface SlideCapexProps {
  onZoneChange?: (zone: SliderZone) => void;
}

const SLIDE_1_BANTER: BanterLine[] = [
  {
    characterId: 'muse',
    speakerName: '旗袍偵探',
    line: '花幾億裝潢米其林三星餐廳，客人走進來卻只點一碗滷肉飯，難怪會計師眉頭鎖這麼緊！',
  },
  {
    characterId: 'analyst',
    speakerName: '算帳主廚',
    line: '2027 到 2030 年資本支出大砍 1.6 兆美元，就連 2028 年 HBM 記憶體需求也被砍掉 30%。',
  },
  {
    characterId: 'frenchie',
    speakerName: '法鬥小白',
    line: '122.8 GW 直接砍掉 42 座核電廠的電量剩 80.7 GW，地球電網真的喊救命了汪！',
  },
];

const THREE_REALITIES = [
  {
    id: 'profit',
    title: '1. 賺不回本',
    icon: Utensils,
    metaphor: '米其林裝潢，只賣滷肉飯',
    detail:
      '就像砸大錢開了一家裝潢奢華的米其林餐廳，客人進來卻只點一碗滷肉飯——終端營收遠追不上算力燒錢的速度。',
  },
  {
    id: 'credit',
    title: '2. 借不到錢',
    icon: Banknote,
    metaphor: '債主清醒，無巨頭背書免談',
    detail:
      '以前喊做 AI 銀行就排隊送錢；現在債主清醒了，沒有大型科技巨頭信用背書的算力計畫，融資直接免談。',
  },
  {
    id: 'grid',
    title: '3. 電網喊救命',
    icon: Zap,
    metaphor: '122.8 ➔ 80.7 GW (-34%)',
    detail:
      '1 GW 等於一座大型核電廠。原以為 2030 年要吃掉 122.8 GW，算完發現地球根本供不起，直接砍 34% 剩 80.7 GW，外加出口政策卡關。',
  },
] as const;

export const SlideCapex: React.FC<SlideCapexProps> = ({ onZoneChange }) => {
  const slide = SLIDES[1];
  const [subTab, setSubTab] = useState<'sliders' | 'realities'>('sliders');
  const [activeReality, setActiveReality] = useState<'profit' | 'credit' | 'grid'>('profit');
  const [capexCut, setCapexCut] = useState<number>(1.6);
  const [gridGw, setGridGw] = useState<number>(80.7);
  const [paradoxMode, setParadoxMode] = useState<'dream' | 'physics'>('physics');

  const stress = computeCapexStress(capexCut, gridGw);
  const combinedZone: SliderZone =
    stress.capexZone === 'danger' || stress.gridZone === 'danger'
      ? 'danger'
      : stress.capexZone === 'warning' || stress.gridZone === 'warning'
        ? 'warning'
        : 'normal';

  useEffect(() => {
    onZoneChange?.(combinedZone);
  }, [combinedZone, onZoneChange]);

  const verdictStyle = getZoneVisualStyle(combinedZone);
  const selectedReality =
    THREE_REALITIES.find((r) => r.id === activeReality) ?? THREE_REALITIES[0];

  const totalBlocks = 12;
  const activeBlocks = Math.max(
    1,
    Math.round((stress.remainingGridGw / 122.8) * totalBlocks)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
      <div className="lg:col-span-5">
        <IllustrationStage
          imageSrc={slide.imageSrc}
          imageAlt={slide.imageAlt}
          figureCaption={slide.figureCaption}
          banterLines={SLIDE_1_BANTER}
        />
      </div>

      <div className="lg:col-span-7 flex flex-col justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs tracking-widest text-stone-500 font-medium">
              {slide.chapterCode}
            </p>
            <div className="inline-flex items-center gap-1 p-0.5 bg-[#EFEAE0] rounded-md">
              <button
                type="button"
                onClick={() => setSubTab('sliders')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  subTab === 'sliders'
                    ? 'bg-stone-900 text-[#FBF9F5]'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                互動算帳拉桿
              </button>
              <button
                type="button"
                onClick={() => setSubTab('realities')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  subTab === 'realities'
                    ? 'bg-stone-900 text-[#FBF9F5]'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                三張現實帳單＋悖論
              </button>
            </div>
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 leading-snug mt-1 text-balance">
            {slide.title}
          </h2>
          <p className="text-sm text-stone-600 mt-1 leading-relaxed">
            SemiAnalysis 突然大轉彎，把 2027–2030 資本支出大砍{' '}
            <span className="font-semibold text-[#991B1B] font-mono-tabular">
              1.6 兆美元
            </span>
            ——這不是 AI 不厲害，而是夢想終於撞上電費單。
          </p>

          {subTab === 'sliders' ? (
            <div
              className={`mt-4 rounded-lg border p-4 space-y-3.5 transition-colors duration-300 ${verdictStyle.bgClass} ${verdictStyle.borderClass}`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-stone-900">
                  拖動拉桿：看資本支出與電網如何同時踩煞車
                </h3>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setCapexCut(0.1);
                      setGridGw(122.8);
                    }}
                    className="text-xs font-semibold text-[#15803D] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    看滿電綠燈
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCapexCut(1.6);
                      setGridGw(80.7);
                    }}
                    className="text-xs font-semibold text-[#991B1B] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    回到 11/16 現況
                  </button>
                </div>
              </div>

              <div className="rounded-md bg-[#FBF9F5]/95 border border-stone-200/90 p-3.5 space-y-3.5">
                <InteractiveSlider
                  id="capex-slider"
                  label="2027–2030 資本支出下修"
                  value={capexCut}
                  min={0}
                  max={1.6}
                  step={0.1}
                  displayValue={`-${stress.capexCutTrillions.toFixed(1)} 兆美元`}
                  zone={stress.capexZone}
                  onChange={setCapexCut}
                  leftHint="0 兆 (正常擴張)"
                  midHint="0.8 兆 (警戒)"
                  rightHint="1.6 兆 (大砍單紅線)"
                  zoneSummary={
                    stress.capexZone === 'normal'
                      ? '正常樂觀'
                      : stress.capexZone === 'warning'
                        ? '溫和下修'
                        : '劇烈砍單'
                  }
                />

                <InteractiveSlider
                  id="grid-slider"
                  label="2030 電網供電上限"
                  value={gridGw}
                  min={70}
                  max={122.8}
                  step={0.1}
                  displayValue={`${stress.remainingGridGw} GW`}
                  zone={stress.gridZone}
                  onChange={setGridGw}
                  leftHint="70 GW (嚴重缺電)"
                  midHint="92–110 GW (警戒)"
                  rightHint="122.8 GW (原定理想)"
                  zoneSummary={
                    stress.gridZone === 'normal'
                      ? '供電充裕'
                      : stress.gridZone === 'warning'
                        ? '電網吃緊'
                        : '電網喊救命'
                  }
                />

                <div className="pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-stone-700 inline-flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" style={{ color: verdictStyle.hex }} aria-hidden="true" />
                      電網供電燈號圖（每格 ≈ 10 GW）
                    </span>
                    <span className={`font-mono-tabular font-bold ${verdictStyle.textClass}`}>
                      供電 {activeBlocks}/{totalBlocks} 格
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-1.5" aria-hidden="true">
                    {Array.from({ length: totalBlocks }).map((_, idx) => {
                      const isLit = idx < activeBlocks;
                      return (
                        <div
                          key={idx}
                          className="h-3.5 rounded-sm transition-colors duration-200"
                          style={{
                            backgroundColor: isLit ? verdictStyle.hex : '#E5DFD3',
                            opacity: isLit ? 0.92 : 0.75,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded bg-[#FBF9F5] border border-stone-200/80">
                  <span className="block text-[11px] text-stone-500">少蓋核電廠</span>
                  <span className={`block text-base font-bold font-mono-tabular mt-0.5 ${verdictStyle.textClass}`}>
                    {stress.nuclearPlantsCut} 座
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#FBF9F5] border border-stone-200/80">
                  <span className="block text-[11px] text-stone-500">電力砍幅</span>
                  <span className={`block text-base font-bold font-mono-tabular mt-0.5 ${verdictStyle.textClass}`}>
                    -{stress.gridCutPct}%
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#FBF9F5] border border-stone-200/80">
                  <span className="block text-[11px] text-stone-500">2028 HBM 下修</span>
                  <span className={`block text-base font-bold font-mono-tabular mt-0.5 ${verdictStyle.textClass}`}>
                    -{stress.hbmDemandDropPct}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3.5">
              <div className="grid grid-cols-3 gap-2.5">
                {THREE_REALITIES.map((item) => {
                  const Icon = item.icon;
                  const active = item.id === activeReality;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveReality(item.id)}
                      className={`p-3 rounded-md border text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-stone-900 text-[#FBF9F5] border-stone-900'
                          : 'bg-[#F4F0E8] text-stone-800 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.title}</span>
                      </div>
                      <p
                        className={`text-[11px] mt-1 leading-snug ${
                          active ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        {item.metaphor}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-lg bg-[#F2EDE4] border border-stone-200 p-4 text-sm text-stone-800 leading-relaxed">
                <p className="font-bold text-stone-900 mb-1">{selectedReality.title}｜{selectedReality.metaphor}</p>
                <p>{selectedReality.detail}</p>
              </div>

              <div className="rounded-lg bg-[#EFEAE0] border border-stone-300/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900">
                    <Scale className="w-4 h-4 text-[#1E4D5C]" aria-hidden="true" />
                    耐人尋味的效率悖論：越聰明不是該越省電嗎？
                  </span>
                  <div className="inline-flex gap-1 bg-[#E4DDD0] p-0.5 rounded">
                    <button
                      type="button"
                      onClick={() => setParadoxMode('dream')}
                      className={`px-2.5 py-1 text-xs rounded cursor-pointer transition-colors ${
                        paradoxMode === 'dream'
                          ? 'bg-[#FBF9F5] font-semibold text-stone-900'
                          : 'text-stone-600'
                      }`}
                    >
                      理想劇本
                    </button>
                    <button
                      type="button"
                      onClick={() => setParadoxMode('physics')}
                      className={`px-2.5 py-1 text-xs rounded cursor-pointer transition-colors ${
                        paradoxMode === 'physics'
                          ? 'bg-[#FBF9F5] font-semibold text-stone-900'
                          : 'text-stone-600'
                      }`}
                    >
                      物理低頭
                    </button>
                  </div>
                </div>
                <p className="text-sm text-stone-700 mt-2 leading-relaxed">
                  {paradoxMode === 'dream'
                    ? '照理說 AI 效率神速進步，對硬體和記憶體應該「越用越省」才對，怎麼會變成越聰明越吃硬體、越費電？'
                    : '算盤打到最後，夢想還是得向物理低頭：2028 年 HBM 需求直接砍 30%，電網與成本天花板誰也繞不過去。'}
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs leading-relaxed p-3 rounded-md bg-[#F2EDE4] border border-stone-200 text-stone-900">
          <span className={`font-bold ${verdictStyle.textClass}`}>{stress.verdictTitle}：</span>
          {stress.verdictDetail}
        </p>
      </div>
    </div>
  );
};
