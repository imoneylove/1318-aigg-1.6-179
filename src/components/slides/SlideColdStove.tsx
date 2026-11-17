import React, { useEffect, useState } from 'react';
import { Ship, Building2, Home, Hourglass, Flame, Snowflake, TrendingUp } from 'lucide-react';
import { SLIDES } from '../../data/presentationContent';
import {
  computeColdStoveSimulation,
  getZoneVisualStyle,
  type SliderZone,
} from '../../utils/presentationLogic';
import { IllustrationStage, type BanterLine } from '../IllustrationStage';
import { InteractiveSlider } from '../InteractiveSlider';

interface SlideColdStoveProps {
  onZoneChange?: (zone: SliderZone) => void;
}

const SLIDE_4_BANTER: BanterLine[] = [
  {
    characterId: 'frenchie',
    speakerName: '法鬥小白',
    line: '以前大家笑不動產過時，現在東京商辦租金年漲 20%，房東笑得比科技業還開心！',
  },
  {
    characterId: 'analyst',
    speakerName: '算帳主廚',
    line: '當一個產業連三五年沒人敢蓋新廠、新開工腰斬再腰斬，「被動去庫存」就會悄悄憋出十年大缺口。',
  },
  {
    characterId: 'muse',
    speakerName: '旗袍偵探',
    line: '人活著總要吃漢堡、穿衣服、睡在屋簷下，剛性需求的地板不可能變成零啦！',
  },
];

const CASE_TABS = [
  { id: 'tokyo' as const, label: '東京不動產重返榮耀', icon: Building2 },
  { id: 'china' as const, label: '中國開工與消費地板', icon: Home },
  { id: 'shipping' as const, label: '全球航運冷灶前例', icon: Ship },
];

export const SlideColdStove: React.FC<SlideColdStoveProps> = ({ onZoneChange }) => {
  const slide = SLIDES[5];
  const [caseId, setCaseId] = useState<'shipping' | 'tokyo' | 'china'>('tokyo');
  const [yearsElapsed, setYearsElapsed] = useState<number>(8);

  const sim = computeColdStoveSimulation(yearsElapsed, caseId);
  const cycleStyle = getZoneVisualStyle(sim.cycleZone);

  useEffect(() => {
    onZoneChange?.(sim.cycleZone);
  }, [sim.cycleZone, onZoneChange]);

  const StoveIcon =
    sim.cycleZone === 'cold' ? Snowflake : sim.cycleZone === 'warning' ? Flame : TrendingUp;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
      <div className="lg:col-span-5">
        <IllustrationStage
          imageSrc={slide.imageSrc}
          imageAlt={slide.imageAlt}
          figureCaption={slide.figureCaption}
          banterLines={SLIDE_4_BANTER}
        />
      </div>

      <div className="lg:col-span-7 flex flex-col justify-between gap-3.5">
        <div>
          <p className="text-xs tracking-widest text-stone-500 font-medium">
            {slide.chapterCode}
          </p>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 leading-snug mt-1 text-balance">
            {slide.title}
          </h2>

          {/* 3 Case Tabs */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {CASE_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = tab.id === caseId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCaseId(tab.id)}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-md border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#1E4D5C] text-[#FBF9F5] border-[#1E4D5C]'
                      : 'bg-[#F4F0E8] text-stone-800 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Case Evidence Card */}
          <div className="mt-3 rounded-lg bg-[#F2EDE4] border border-stone-300/80 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-bold text-stone-900">{sim.title}</h3>
              <span className="text-xs font-mono-tabular font-semibold text-[#B4432C]">
                {sim.headlineMetric}
              </span>
            </div>
            <p className="text-sm text-stone-700 mt-2 leading-relaxed">
              {sim.narrativeNote}
            </p>

            {caseId === 'tokyo' && (
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-300/70 text-center">
                <div className="p-2 rounded bg-[#FBF9F5]">
                  <span className="block text-[11px] text-stone-500">新建商辦租金</span>
                  <span className="block text-xs font-mono-tabular font-bold text-[#15803D] mt-0.5">
                    年漲 +20%
                  </span>
                </div>
                <div className="p-2 rounded bg-[#FBF9F5]">
                  <span className="block text-[11px] text-stone-500">核心 B 級商辦</span>
                  <span className="block text-xs font-mono-tabular font-bold text-[#15803D] mt-0.5">
                    年漲 +19.0%
                  </span>
                </div>
                <div className="p-2 rounded bg-[#FBF9F5]">
                  <span className="block text-[11px] text-stone-500">都心空室率</span>
                  <span className="block text-xs font-mono-tabular font-bold text-stone-900 mt-0.5">
                    低於 2%
                  </span>
                </div>
              </div>
            )}

            {caseId === 'china' && (
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-300/70 text-center">
                <div className="p-2 rounded bg-[#FBF9F5]">
                  <span className="block text-[11px] text-stone-500">1–10月固投 / 房投</span>
                  <span className="block text-xs font-mono-tabular font-bold text-[#991B1B] mt-0.5">
                    -8.1% / -21.6%
                  </span>
                </div>
                <div className="p-2 rounded bg-[#FBF9F5]">
                  <span className="block text-[11px] text-stone-500">2022➔2025 新開工</span>
                  <span className="block text-xs font-mono-tabular font-bold text-stone-900 mt-0.5">
                    8.81 ➔ 4.30 億㎡
                  </span>
                </div>
                <div className="p-2 rounded bg-[#FBF9F5]">
                  <span className="block text-[11px] text-stone-500">居民消費佔 GDP</span>
                  <span className="block text-xs font-mono-tabular font-bold text-[#1E4D5C] mt-0.5">
                    約 39%–40% 地板
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Color-Reactive Time Judge Simulator with Stove Heat Visual */}
          <div className={`mt-3 rounded-lg border p-4 transition-colors duration-300 ${cycleStyle.bgClass} ${cycleStyle.borderClass}`}>
            <InteractiveSlider
              id="time-horizon-slider"
              label={
                <>
                  <Hourglass className={`w-4 h-4 ${cycleStyle.textClass}`} aria-hidden="true" />
                  <span>時間裁判拉桿：沒人敢動工的第 {sim.yearsElapsed} 年</span>
                </>
              }
              value={yearsElapsed}
              min={1}
              max={10}
              step={1}
              displayValue={`供給缺口 ${sim.supplyGapPct}%`}
              zone={sim.cycleZone}
              onChange={setYearsElapsed}
              leftHint="第 1–3 年 (冷灶青)"
              midHint="第 4–6 年 (去庫存橘)"
              rightHint="第 7–10 年 (重返榮耀綠)"
              zoneSummary={
                sim.cycleZone === 'cold'
                  ? '冷灶潛伏期'
                  : sim.cycleZone === 'warning'
                    ? '去庫存醞釀'
                    : '重返榮耀爆發'
              }
            />

            {/* Visual Stove Heat Rings + Supply vs Demand Bars */}
            <div className="mt-3 p-3 rounded-md bg-[#FBF9F5] border border-stone-200 flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border transition-colors duration-200"
                style={{
                  backgroundColor: `${cycleStyle.hex}18`,
                  borderColor: `${cycleStyle.hex}55`,
                  color: cycleStyle.hex,
                }}
                aria-hidden="true"
              >
                <StoveIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-700">
                      人類剛性需求地板（吃漢堡、穿衣服、住房子）
                    </span>
                    <span className="font-mono-tabular font-bold text-[#15803D]">
                      {sim.rigidDemandIndex}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#15803D] transition-[width] duration-200"
                      style={{ width: `${Math.min(100, sim.rigidDemandIndex * 0.9)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-700">
                      有效產業供給（無新增開工＋舊產能折舊淘汰）
                    </span>
                    <span className="font-mono-tabular font-bold text-[#991B1B]">
                      {sim.activeSupplyIndex}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#991B1B] transition-[width] duration-200"
                      style={{ width: `${Math.min(100, sim.activeSupplyIndex * 0.9)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-800 mt-3 leading-relaxed">
              <span className={`font-bold ${cycleStyle.textClass}`}>{sim.stageLabel}：</span>
              與其在擁擠的舞台搶最後一塊蛋糕，不如留點清醒給沒人看好的不動產與冷角落——時間永遠是最有耐心的裁判。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
