import React, { useEffect, useState } from 'react';
import { Thermometer, Gauge, RotateCcw, Candy, ShieldAlert, TrendingDown } from 'lucide-react';
import { SLIDES } from '../../data/presentationContent';
import {
  computeDefenseLineVerdict,
  computeThermometerStatus,
  getZoneVisualStyle,
  magnitudeToMonthlyDrop,
  type SliderZone,
} from '../../utils/presentationLogic';
import { IllustrationStage, type BanterLine } from '../IllustrationStage';
import { InteractiveSlider } from '../InteractiveSlider';

interface SlideThermometerProps {
  onZoneChange?: (zone: SliderZone) => void;
}

const SLIDE_3_BANTER: BanterLine[] = [
  {
    characterId: 'muse',
    speakerName: '旗袍偵探',
    line: '台股以前急殺都能創高，真的不是我們多勇，全靠美國 S&P 500 老大哥沒破線！現在右肩畫得讓人手心冒汗，就怕他一腳踩空！',
  },
  {
    characterId: 'analyst',
    speakerName: '算帳主廚',
    line: '11 月跌 -11.32% 收到超速罰單、Put/Call 僅 54.08%；最後守門員就看「台股金融類指數」，一旦跌破前低，最後一棒可就熄火囉！',
  },
  {
    characterId: 'frenchie',
    speakerName: '法鬥小白',
    line: '靠近「年線」踩彈簧會掉一顆反彈糖果，但美股右肩跟金融前低沒守穩前，吃了糖記得乖乖寫功課汪！',
  },
];

export const SlideThermometer: React.FC<SlideThermometerProps> = ({ onZoneChange }) => {
  const slide = SLIDES[3];
  const [subTab, setSubTab] = useState<'thermometers' | 'defense'>('thermometers');
  const [dropMagnitude, setDropMagnitude] = useState<number>(11.32);
  const [putCallRatio, setPutCallRatio] = useState<number>(54.08);
  const [springBounces, setSpringBounces] = useState<number>(0);
  const [sp500Broken, setSp500Broken] = useState<boolean>(false);
  const [financeBroken, setFinanceBroken] = useState<boolean>(false);

  const monthlyDrop = magnitudeToMonthlyDrop(dropMagnitude);
  const status = computeThermometerStatus(monthlyDrop, putCallRatio);
  const defense = computeDefenseLineVerdict(sp500Broken, financeBroken);

  const overallZone: SliderZone =
    status.dropZone === 'danger' ||
    status.putCallZone === 'danger' ||
    sp500Broken ||
    financeBroken
      ? 'danger'
      : status.dropZone === 'warning' || status.putCallZone === 'warning'
        ? 'warning'
        : 'normal';

  useEffect(() => {
    onZoneChange?.(overallZone);
  }, [overallZone, onZoneChange]);

  const dropStyle = getZoneVisualStyle(status.dropZone);
  const pcrStyle = getZoneVisualStyle(status.putCallZone);
  const defenseStyle = getZoneVisualStyle(
    sp500Broken || financeBroken ? 'danger' : overallZone === 'normal' ? 'normal' : 'warning'
  );

  const feverFillPct = Math.min(100, Math.max(4, (dropMagnitude / 15) * 100));
  const pcrClamped = Math.min(110, Math.max(40, status.putCallRatio));
  const needleDeg = -90 + ((pcrClamped - 40) / 70) * 180;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
      <div className="lg:col-span-5">
        <IllustrationStage
          imageSrc={slide.imageSrc}
          imageAlt={slide.imageAlt}
          figureCaption={slide.figureCaption}
          banterLines={SLIDE_3_BANTER}
        />
      </div>

      <div className="lg:col-span-7 flex flex-col justify-between gap-3.5">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs tracking-widest text-stone-500 font-medium">
              {slide.chapterCode}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDropMagnitude(3.2);
                  setPutCallRatio(92);
                  setSp500Broken(false);
                  setFinanceBroken(false);
                }}
                className="text-xs font-semibold text-[#15803D] hover:underline cursor-pointer whitespace-nowrap"
              >
                看正常綠燈示範
              </button>
              <button
                type="button"
                onClick={() => {
                  setDropMagnitude(11.32);
                  setPutCallRatio(54.08);
                  setSp500Broken(false);
                  setFinanceBroken(false);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#991B1B] hover:underline cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                恢復 11/17 現況紅燈
              </button>
            </div>
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 leading-snug mt-1 text-balance">
            {slide.title}
          </h2>

          {/* Segmented Tabs: Double Thermometer vs Two Long-Bearish Defense Lines */}
          <div className="mt-3 inline-flex items-center gap-1 p-0.5 bg-[#EFEAE0] rounded-md">
            <button
              type="button"
              onClick={() => setSubTab('thermometers')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subTab === 'thermometers'
                  ? 'bg-stone-900 text-[#FBF9F5]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" aria-hidden="true" />
              雙體溫計測速 (-11.32% × 54.08%)
            </button>
            <button
              type="button"
              onClick={() => setSubTab('defense')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subTab === 'defense'
                  ? 'bg-stone-900 text-[#FBF9F5]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
              全面長空兩道防線 (S&amp;P 500 × 金融股)
            </button>
          </div>

          {subTab === 'thermometers' ? (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Thermometer A: Left = 0% safe green -> Right = -15% severe drop red */}
              <div className={`rounded-lg border p-3.5 flex flex-col justify-between gap-2.5 transition-colors duration-300 ${dropStyle.bgClass} ${dropStyle.borderClass}`}>
                <InteractiveSlider
                  id="monthly-drop-slider"
                  label={
                    <>
                      <Thermometer className={`w-4 h-4 ${dropStyle.textClass}`} aria-hidden="true" />
                      <span>體溫計 A · 月線單月跌幅</span>
                    </>
                  }
                  value={dropMagnitude}
                  min={0}
                  max={15}
                  step={0.05}
                  displayValue={status.monthlyDropPct === 0 ? '0%' : `${status.monthlyDropPct}%`}
                  zone={status.dropZone}
                  onChange={setDropMagnitude}
                  leftHint="0% (正常綠)"
                  midHint="-8%~-9.9% (發燒)"
                  rightHint="-15% (紅燈高風險)"
                  zoneSummary={status.dropZone === 'danger' ? '異常急殺(紅)' : status.dropZone === 'warning' ? '發燒(黃)' : '正常(綠)'}
                />

                <div className="flex items-center gap-2" aria-hidden="true">
                  <div className="flex items-center flex-1">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 border-2 border-[#FBF9F5] shadow-xs -mr-1.5 z-10 transition-colors duration-200"
                      style={{ backgroundColor: dropStyle.hex }}
                    />
                    <div className="flex-1 h-2.5 rounded-r-full bg-[#E5DFD3] overflow-hidden border border-stone-300/60">
                      <div
                        className="h-full rounded-r-full transition-[width,background-color] duration-200"
                        style={{ width: `${feverFillPct}%`, backgroundColor: dropStyle.hex }}
                      />
                    </div>
                  </div>
                  <span className={`text-[11px] font-mono-tabular font-bold shrink-0 ${dropStyle.textClass}`}>
                    急殺熱度 {Math.round((dropMagnitude / 15) * 100)}°
                  </span>
                </div>

                <div className="p-2.5 rounded-md bg-[#FBF9F5] border border-stone-200 space-y-2">
                  <p className={`text-xs font-bold ${dropStyle.textClass}`}>
                    {status.feverLabel}
                  </p>
                  <p className="text-xs text-stone-700 leading-snug">
                    {status.feverAdvice}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSpringBounces((c) => c + 1)}
                    className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-stone-900 text-[#FBF9F5] hover:bg-[#B4432C] transition-transform duration-150 cursor-pointer whitespace-nowrap ${
                      springBounces % 2 === 1 ? '-translate-y-0.5' : 'translate-y-0'
                    }`}
                  >
                    <Candy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>踩一下年線彈簧{springBounces > 0 ? ` (${springBounces})` : ''}</span>
                  </button>
                  {springBounces > 0 && (
                    <p className="text-[11px] font-semibold text-[#991B1B]">
                      反彈糖果先收下，功課別忘寫！
                    </p>
                  )}
                </div>
              </div>

              {/* Thermometer B */}
              <div className={`rounded-lg border p-3.5 flex flex-col justify-between gap-2.5 transition-colors duration-300 ${pcrStyle.bgClass} ${pcrStyle.borderClass}`}>
                <InteractiveSlider
                  id="pcr-slider"
                  label={
                    <>
                      <Gauge className={`w-4 h-4 ${pcrStyle.textClass}`} aria-hidden="true" />
                      <span>體溫計 B · Put/Call 指數</span>
                    </>
                  }
                  value={putCallRatio}
                  min={40}
                  max={110}
                  step={0.1}
                  displayValue={`${status.putCallRatio}%`}
                  zone={status.putCallZone}
                  onChange={setPutCallRatio}
                  leftHint="<70% 深紅"
                  midHint="70–84% 黃"
                  rightHint="85%+ 正常綠"
                  zoneSummary={status.putCallZone === 'normal' ? '正常偏多(綠)' : status.putCallZone === 'warning' ? '觀望(黃)' : '異常保守(紅)'}
                />

                <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#FBF9F5] border border-stone-200">
                  <svg
                    viewBox="0 0 120 72"
                    className="w-20 h-12 shrink-0 overflow-visible"
                    aria-hidden="true"
                  >
                    <path d="M 14 62 A 46 46 0 0 1 50 17" fill="none" stroke="#991B1B" strokeWidth="9" strokeLinecap="round" opacity="0.88" />
                    <path d="M 55 16 A 46 46 0 0 1 77 19" fill="none" stroke="#B45309" strokeWidth="9" strokeLinecap="round" opacity="0.88" />
                    <path d="M 82 21 A 46 46 0 0 1 106 62" fill="none" stroke="#15803D" strokeWidth="9" strokeLinecap="round" opacity="0.92" />
                    <g transform={`translate(60, 62) rotate(${needleDeg})`}>
                      <line x1="0" y1="0" x2="0" y2="-40" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="0" cy="0" r="4.5" fill={pcrStyle.hex} stroke="#FBF9F5" strokeWidth="1.5" />
                    </g>
                  </svg>
                  <div className="min-w-0 text-xs space-y-1">
                    <p className={`font-bold leading-snug ${pcrStyle.textClass}`}>
                      {status.putCallLabel}
                    </p>
                    <p className="font-mono-tabular text-stone-600">
                      {status.putCallRatio >= 85
                        ? '已進入 85%+ 健康區'
                        : `距正常綠燈尚差 ${(85 - status.putCallRatio).toFixed(2)}%`}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-stone-700 p-2 rounded bg-[#FBF9F5] border border-stone-200 leading-snug">
                  85%–100%+ 才算正常穩盤；低於 70% 代表大戶寧願抱現金也不願多看一眼。
                </p>
              </div>
            </div>
          ) : (
            <div className={`mt-3 rounded-lg border p-4 space-y-3 transition-colors duration-300 ${defenseStyle.bgClass} ${defenseStyle.borderClass}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${defenseStyle.textClass}`}>
                  <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
                  點選測試兩道關鍵防線：「萬一破線會怎樣？」
                </span>
                <span className="text-[11px] font-medium text-stone-600">
                  吳淡如白話提醒
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSp500Broken((v) => !v)}
                  className={`p-3 rounded-md border text-left transition-colors cursor-pointer ${
                    sp500Broken
                      ? 'bg-[#991B1B] text-[#FBF9F5] border-[#991B1B]'
                      : 'bg-[#FBF9F5] text-stone-900 border-stone-300 hover:border-[#B4432C]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 text-xs font-bold">
                    <span>① 美國 S&amp;P 500（總長空關鍵）</span>
                    <TrendingDown className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </div>
                  <p className={`text-xs mt-1 leading-snug ${sp500Broken ? 'text-red-100' : 'text-stone-600'}`}>
                    {sp500Broken
                      ? '右肩跌破上升趨勢線 ➔ 全球與台股全面長空確立！'
                      : '正在做「頭肩頂右肩」（點我模擬跌破趨勢線）'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFinanceBroken((v) => !v)}
                  className={`p-3 rounded-md border text-left transition-colors cursor-pointer ${
                    financeBroken
                      ? 'bg-[#991B1B] text-[#FBF9F5] border-[#991B1B]'
                      : 'bg-[#FBF9F5] text-stone-900 border-stone-300 hover:border-[#B4432C]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 text-xs font-bold">
                    <span>② 台股金融類指數（最後一棒）</span>
                    <TrendingDown className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </div>
                  <p className={`text-xs mt-1 leading-snug ${financeBroken ? 'text-red-100' : 'text-stone-600'}`}>
                    {financeBroken
                      ? '金融大哥跌破前低 ➔ 最後一棒熄火、全面轉空！'
                      : '台股最後撐盤守門員（點我模擬跌破前低）'}
                  </p>
                </button>
              </div>

              <div className="p-3 rounded bg-[#FBF9F5] border border-stone-200 text-xs sm:text-[13px] text-stone-800 leading-relaxed space-y-1.5">
                <p>
                  <strong className="text-stone-900">老大哥撐腰說穿了：</strong>
                  {defense.sp500Note}
                </p>
                <p>
                  <strong className="text-stone-900">最後一棒守門員：</strong>
                  {defense.financeNote}
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs leading-relaxed p-3 rounded-md bg-[#F2EDE4] border border-stone-200 text-stone-900">
          <span className={`font-bold ${defenseStyle.textClass}`}>白話總結：</span>
          {sp500Broken || financeBroken ? defense.summary : status.overallDiagnosis}
        </p>
      </div>
    </div>
  );
};
