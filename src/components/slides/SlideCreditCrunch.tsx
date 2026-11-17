import React, { useEffect, useState } from 'react';
import { Building, Landmark, Scissors, ShieldAlert } from 'lucide-react';
import { SLIDES } from '../../data/presentationContent';
import {
  computeCreditCrunchZone,
  evaluateMarginCallStage,
  getZoneVisualStyle,
  type MarginCallStage,
  type SliderZone,
} from '../../utils/presentationLogic';
import { IllustrationStage, type BanterLine } from '../IllustrationStage';

interface SlideCreditCrunchProps {
  onZoneChange?: (zone: SliderZone) => void;
}

const SLIDE_CREDIT_BANTER: BanterLine[] = [
  {
    characterId: 'analyst',
    speakerName: '算帳主廚',
    line: '這波最狠的不是跌多少，而是「二次追繳」不再給你兩天湊錢——隔天早盤開門券商就直接幫你按賣出！',
  },
  {
    characterId: 'muse',
    speakerName: '旗袍偵探',
    line: '以前認購可轉債隔天躺著數漲停，現在連「立誠一」轉換市值 93 元、又有 100 元賣回權保底，居然還摔到 84 元，你說大家有多缺現金！',
  },
  {
    characterId: 'frenchie',
    speakerName: '法鬥小白',
    line: '銀行 12 月額度見底通知大戶沒錢借、房貸有得借就不敢問利率——那些四代五代層層質押的槓桿可要緊繃囉汪！',
  },
];

const MARGIN_STAGES: { id: MarginCallStage; shortLabel: string; ratioText: string }[] = [
  { id: 'safe_166', shortLabel: '① 正常買進水位', ratioText: '166.7%' },
  { id: 'first_call_130', shortLabel: '② 初次跌破追繳線', ratioText: '< 130%（有 T+2）' },
  { id: 'second_call_forced', shortLabel: '③ 二次破底斷頭', ratioText: '< 130%（零寬限）' },
];

const CB_CASES = [
  { name: '昔日範例｜宜特 / 聯電 CB', theory: '理論 92 元', price: '110–128 元', note: '認購隔日幾乎穩賺漲停', broken: false },
  { name: '大聯大四（破百第一槍）', theory: '百元面額基準', price: '90 ➔ 87–88 元', note: '一上市摔破百元開出破發潮', broken: true },
  { name: '華邦電四 / 建新三', theory: '百元面額基準', price: '95 元 / 96 元', note: '新掛牌集體跌破 100 元票面', broken: true },
  { name: '立誠一 (65971 · 周萬順家族)', theory: '轉換 93＋賣回 100', price: '84–85 元', note: '連一詮已發到七的老手都照樣破發', broken: true },
] as const;

export const SlideCreditCrunch: React.FC<SlideCreditCrunchProps> = ({ onZoneChange }) => {
  const slide = SLIDES[4];
  const [subTab, setSubTab] = useState<'margin' | 'cb' | 'bank'>('margin');
  const [marginStage, setMarginStage] = useState<MarginCallStage>('second_call_forced');
  const [cbCompareMode, setCbCompareMode] = useState<'crunch' | 'past'>('crunch');

  const activeZone = computeCreditCrunchZone(subTab, marginStage, cbCompareMode);
  const style = getZoneVisualStyle(activeZone);
  const marginEval = evaluateMarginCallStage(marginStage);

  useEffect(() => {
    onZoneChange?.(activeZone);
  }, [activeZone, onZoneChange]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
      <div className="lg:col-span-5">
        <IllustrationStage
          imageSrc={slide.imageSrc}
          imageAlt={slide.imageAlt}
          figureCaption={slide.figureCaption}
          banterLines={SLIDE_CREDIT_BANTER}
        />
      </div>

      <div className="lg:col-span-7 flex flex-col justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest text-stone-500 font-medium">
            {slide.chapterCode}
          </p>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 leading-snug mt-1 text-balance">
            {slide.title}
          </h2>

          <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">
            {slide.subtitle}
          </p>

          {/* Segmented Tabs for 3 Credit Crunch Topics */}
          <div className="mt-4 inline-flex flex-wrap items-center gap-1 p-0.5 bg-[#EFEAE0] rounded-md">
            <button
              type="button"
              onClick={() => setSubTab('margin')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subTab === 'margin'
                  ? 'bg-stone-900 text-[#FBF9F5]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" aria-hidden="true" />
              早盤二次斷頭
            </button>
            <button
              type="button"
              onClick={() => setSubTab('cb')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subTab === 'cb'
                  ? 'bg-stone-900 text-[#FBF9F5]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building className="w-3.5 h-3.5" aria-hidden="true" />
              可轉債破百崩跌
            </button>
            <button
              type="button"
              onClick={() => setSubTab('bank')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subTab === 'bank'
                  ? 'bg-stone-900 text-[#FBF9F5]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" aria-hidden="true" />
              銀行三大斷鏈
            </button>
          </div>

          {/* Tab 1: Real Taiwan 130% Margin Maintenance Rule + Morning Forced Liquidation */}
          {subTab === 'margin' && (
            <div className="mt-3.5 space-y-3">
              {/* Real Institutional Standard Selector (166.7% -> 130% Statutory Rule) */}
              <div className={`rounded-lg border p-3.5 transition-colors duration-300 ${style.bgClass} ${style.borderClass}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900">
                    <ShieldAlert className={`w-4 h-4 ${style.textClass}`} aria-hidden="true" />
                    <span>台股法定融資維持率標準（點選階段推演）</span>
                  </div>
                  <span className={`text-xs font-bold font-mono-tabular ${style.textClass}`}>
                    {marginEval.ruleBadge}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {MARGIN_STAGES.map((item) => {
                    const active = marginStage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMarginStage(item.id)}
                        className={`text-left px-3 py-2 rounded-md border transition-colors cursor-pointer ${
                          active
                            ? 'bg-stone-900 text-[#FBF9F5] border-stone-900'
                            : 'bg-[#FBF9F5] text-stone-800 border-stone-300 hover:border-stone-500'
                        }`}
                      >
                        <span className="block text-[11px] font-semibold opacity-85">
                          {item.shortLabel}
                        </span>
                        <span className="block text-xs font-bold font-mono-tabular mt-0.5">
                          {item.ratioText}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-stone-800 mt-2.5 leading-relaxed">
                  <span className={`font-bold ${style.textClass}`}>{marginEval.headline}：</span>
                  {marginEval.detail}
                </p>
              </div>

              {/* Daily Morning Sequence */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-md bg-[#FBF9F5] border border-stone-300/90">
                  <span className="font-bold text-[#991B1B] block">① 09:00 開盤直接砍</span>
                  <span className="text-stone-700 mt-1 block leading-snug">
                    國巨、華新科等破底觸發二次追繳，無兩天寬限，開盤直接斷頭。
                  </span>
                </div>
                <div className="p-3 rounded-md bg-[#FBF9F5] border border-stone-300/90">
                  <span className="font-bold text-[#B45309] block">② 護盤與怕寄信</span>
                  <span className="text-stone-700 mt-1 block leading-snug">
                    護盤基金拉抬，加上怕追繳令寄回家被發現的自我了結賣壓。
                  </span>
                </div>
                <div className="p-3 rounded-md bg-[#FBF9F5] border border-stone-300/90">
                  <span className="font-bold text-[#991B1B] block">③ 盤中再砍一輪</span>
                  <span className="text-stone-700 mt-1 block leading-snug">
                    盤中接到追繳電話的投資人跟著砍，形成固定早盤急殺劇本。
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: CB Below Par (100 NTD Contractual Benchmark) */}
          {subTab === 'cb' && (
            <div className="mt-3.5 space-y-3">
              <div className={`rounded-lg border p-3.5 transition-colors duration-300 ${style.bgClass} ${style.borderClass}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className={`text-xs font-bold ${style.textClass}`}>
                      可轉債合約基準：票面 100 元 ╳ 到期賣回保底
                    </span>
                    <p className="text-xs text-stone-800 mt-0.5 leading-relaxed">
                      {cbCompareMode === 'crunch'
                        ? '當市場極度缺現金，連「轉換市值 93 元＋賣回權 100 元」的新發 CB 都殺到 84–85 元。'
                        : '過去市場資金充沛時，理論價值 92 元的新發 CB 掛牌價動輒 110–128 元，認購隔日穩賺漲停。'}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 p-0.5 bg-[#EFEAE0] rounded-md shrink-0">
                    <button
                      type="button"
                      onClick={() => setCbCompareMode('crunch')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                        cbCompareMode === 'crunch'
                          ? 'bg-[#991B1B] text-[#FBF9F5]'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      近期破百潮(紅)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCbCompareMode('past')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                        cbCompareMode === 'past'
                          ? 'bg-[#15803D] text-[#FBF9F5]'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      對照昔日榮景(綠)
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {CB_CASES.map((item) => {
                  const highlighted =
                    (cbCompareMode === 'past' && !item.broken) ||
                    (cbCompareMode === 'crunch' && item.broken);
                  return (
                    <div
                      key={item.name}
                      className={`p-3 rounded-md border transition-opacity ${
                        item.broken
                          ? 'bg-[#FEF2F2] border-[#FCA5A5]'
                          : 'bg-[#ECFDF3] border-[#86EFAC]'
                      } ${highlighted ? 'opacity-100 ring-1 ring-stone-900/15' : 'opacity-65'}`}
                    >
                      <div className="flex items-center justify-between gap-2 font-bold">
                        <span className="text-stone-900 truncate">{item.name}</span>
                        <span className={`font-mono-tabular shrink-0 ${item.broken ? 'text-[#991B1B]' : 'text-[#15803D]'}`}>
                          {item.price}
                        </span>
                      </div>
                      <p className="text-stone-700 mt-1 leading-snug">
                        {item.theory} · {item.note}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Bank Year-End Credit Freeze */}
          {subTab === 'bank' && (
            <div className="mt-3.5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3.5 rounded-lg bg-[#FBF9F5] border border-[#FCA5A5]">
                  <span className="font-bold text-[#991B1B] block text-sm">1. 12 月放款見底</span>
                  <p className="text-stone-700 mt-1.5 leading-relaxed">
                    銀行年底放款額度告罄，罕見主動通知大戶「年底已無錢可借」，大資金調度全面卡關。
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#FBF9F5] border border-[#FCA5A5]">
                  <span className="font-bold text-[#991B1B] block text-sm">2. 不限用途抽銀根</span>
                  <p className="text-stone-700 mt-1.5 leading-relaxed">
                    部分機構對到期的「不限用途款項借貸」直接抽銀根，不再給借新還舊，逼出被動賣壓。
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#FBF9F5] border border-[#FCA5A5]">
                  <span className="font-bold text-[#991B1B] block text-sm">3. 多代質押斷鏈</span>
                  <p className="text-stone-700 mt-1.5 leading-relaxed">
                    拒放 20 年低利房貸（「有得借就不敢問利率」），過去「四代／五代同堂」層層質押買房套利者年底面臨斷鏈。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs leading-relaxed p-3 rounded-md bg-[#F2EDE4] border border-stone-200 text-stone-900">
          <span className="font-bold text-[#991B1B]">白話保命總結：</span>
          {subTab === 'margin' && '遇追繳令務必直接減碼，切勿硬補錢！第二次跌破 130% 沒有兩天寬限期。'}
          {subTab === 'cb' && '連 100 元賣回權保底的立誠一都能殺到 84–85 元，代表市場正在不計代價變現換現金。'}
          {subTab === 'bank' && '年底銀行額度見底又抽不限用途銀根，高槓桿層層質押千萬別在這個節骨眼硬撐。'}
        </p>
      </div>
    </div>
  );
};
