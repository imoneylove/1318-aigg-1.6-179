import React, { useState } from 'react';
import { Anchor, CarTaxiFront, Compass, Flame, LifeBuoy, PackageOpen, Wind } from 'lucide-react';
import { SLIDES } from '../../data/presentationContent';
import { IllustrationStage, type BanterLine } from '../IllustrationStage';

const SLIDE_2_BANTER: BanterLine[] = [
  {
    characterId: 'muse',
    speakerName: '旗袍偵探',
    line: '買 5 檔 ETF 以為睡很香？這就像同時跟五個戴面具的人交往，情人節拆開才發現五個全姓「台」名「積電」！',
  },
  {
    characterId: 'analyst',
    speakerName: '算帳主廚',
    line: '春江水暖鴨先知！散戶當天還在撿便宜，投信先砍 179.63 億——因為算準明天會湧現贖回潮，不先搭車就要留在船艙洗碗。',
  },
  {
    characterId: 'frenchie',
    speakerName: '法鬥小白',
    line: '赤壁大火時，曹操（台積電）照樣走華容道當霸主；真正被抬出場的是開槓桿又被鎖死的士兵，本汪船邊已掛好救生艇！',
  },
];

const MASKED_DATES = [
  {
    id: 'passive_tech',
    maskName: '科技型 ETF (0052)',
    tsmcWeight: '含積量 ~68.9%',
    note: '名為科技分散，實質近七成壓在同一艘旗艦上；正 2 槓桿曝險更逼近兩倍。',
  },
  {
    id: 'passive_cap',
    maskName: '市值型 (0050 / 006208)',
    tsmcWeight: '含積量 ~60%',
    note: '大盤權重已逾 40%（曾達 44.3%），國民市值 ETF 雙雙逼近六成全押單一權值。',
  },
  {
    id: 'active_etf',
    maskName: '主動式 ETF／基金',
    tsmcWeight: '單一上限 10% ➔ 25%',
    note: '金管會放寬「台積電條款」後，連主動式都換上文青木盒鎖進同一條大鐵鍊。',
  },
] as const;

const QUEUE_STAGES = [
  {
    step: 1,
    title: '① 散戶排隊存錢',
    detail: '過去兩年最熱賣的密碼只有「AI（造夢）+ ETF（收錢）」，大家買了 5 檔不同名字的木盒，睡得超安穩。',
  },
  {
    step: 2,
    title: '② 全鎖在同一艘旗艦',
    detail: '錢湧進來機構就得買，市值型、科技型、主動式全部被鐵索鎖在台積電與權值 AI 身上，順風時萬船齊發。',
  },
  {
    step: 3,
    title: '③ 預期贖回搶先賣',
    detail: '外資逆風提款優先砍流動性最好的權值股；投信「春江水暖鴨先知」預見未來 1–3 天大規模贖回潮，先賣變現保命。',
  },
  {
    step: 4,
    title: '④ 179.63 億創紀錄',
    detail: '投信終結連 24 買、單日狂砍 179.63 億創台股史上最大賣超；留在鐵索連環船裡沒掛救生艇的，只好洗碗抬出場。',
  },
];

export const SlideDishwashing: React.FC = () => {
  const slide = SLIDES[2];
  const [subTab, setSubTab] = useState<'masks' | 'chibi' | 'queue'>('masks');
  const [masksRemoved, setMasksRemoved] = useState<boolean>(true);
  const [chibiWind, setChibiWind] = useState<'tailwind' | 'fire'>('fire');
  const [activeStage, setActiveStage] = useState<number>(3);

  const currentStage =
    QUEUE_STAGES.find((s) => s.step === activeStage) ?? QUEUE_STAGES[2];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
      <div className="lg:col-span-5">
        <IllustrationStage
          imageSrc={slide.imageSrc}
          imageAlt={slide.imageAlt}
          figureCaption={slide.figureCaption}
          banterLines={SLIDE_2_BANTER}
        />
      </div>

      <div className="lg:col-span-7 flex flex-col justify-between gap-3.5">
        <div>
          <p className="text-xs tracking-widest text-stone-500 font-medium">
            {slide.chapterCode}
          </p>
          <h2 className="font-editorial text-xl sm:text-2xl lg:text-[26px] font-bold text-stone-900 leading-snug mt-1 text-balance">
            {slide.title}
          </h2>

          {/* MOST PROMINENT SPOTLIGHT: Record 179.63B + 春江水暖鴨先知 */}
          <div className="mt-2.5 rounded-lg bg-[#FEF2F2] border-2 border-[#B4432C] p-3.5 space-y-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-1.5 border-b border-[#FCA5A5]">
              <div>
                <span className="text-xs font-bold text-[#991B1B] block">
                  11/16 投信終結連 24 買 · 單日賣超（台股史上最大紀錄）
                </span>
                <span className="font-mono-tabular text-2xl font-bold text-[#991B1B]">
                  179.63 億元
                </span>
              </div>
              <span className="text-xs font-bold text-[#B4432C] inline-flex items-center gap-1">
                <Compass className="w-4 h-4 shrink-0" aria-hidden="true" />
                重點推導：春江水暖鴨先知
              </span>
            </div>

            <div className="space-y-0.5 text-xs text-stone-800 leading-relaxed">
              <p>
                <strong className="text-[#991B1B]">為何散戶還在買，投信先砍？</strong>
                散戶反應慢一拍，經理人算準 1–3 天後必湧贖回潮；趁還有買盤先變現築堤，免得明天殺在跌停板。
              </p>
            </div>
          </div>

          {/* Segmented Sub-Tab Switcher */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex flex-wrap items-center gap-1 p-0.5 bg-[#EFEAE0] rounded-md">
              <button
                type="button"
                onClick={() => setSubTab('masks')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  subTab === 'masks'
                    ? 'bg-stone-900 text-[#FBF9F5]'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <PackageOpen className="w-3.5 h-3.5" aria-hidden="true" />
                摘下面具全姓台積電
              </button>
              <button
                type="button"
                onClick={() => setSubTab('chibi')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  subTab === 'chibi'
                    ? 'bg-stone-900 text-[#FBF9F5]'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                赤壁火燒連環船
              </button>
              <button
                type="button"
                onClick={() => setSubTab('queue')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  subTab === 'queue'
                    ? 'bg-stone-900 text-[#FBF9F5]'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <CarTaxiFront className="w-3.5 h-3.5" aria-hidden="true" />
                179 億等計程車
              </button>
            </div>

            {subTab === 'masks' && (
              <button
                type="button"
                onClick={() => setMasksRemoved((v) => !v)}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-[#B4432C] text-[#FBF9F5] hover:bg-[#933420] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {masksRemoved ? '戴回面具（睡很香）' : '情人節摘下面具！'}
              </button>
            )}
          </div>

          {/* Sub-Tab 1: Five Masked Dates = All Named TSMC */}
          {subTab === 'masks' && (
            <div className="mt-2.5 rounded-lg border border-stone-300/90 bg-[#FBF9F5] p-3.5 space-y-2.5">
              {!masksRemoved ? (
                <div className="p-3 rounded-md bg-[#ECFDF3] border border-[#86EFAC] text-xs sm:text-sm text-stone-800 leading-relaxed">
                  <p className="font-bold text-[#15803D]">
                    「我買了五檔不一樣的 ETF 跟主動式基金，這樣夠分散、晚上睡超香吧？」
                  </p>
                  <p className="mt-1 text-xs text-stone-700">
                    看起來有市值型、科技型、半導體型又配主動式，好像同時與五位神秘對象交往⋯⋯點擊右上角<strong>「情人節摘下面具！」</strong>看真相。
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {MASKED_DATES.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-md bg-[#FEF2F2] border border-[#FCA5A5]"
                      >
                        <span className="font-bold text-stone-900 block">
                          {item.maskName}
                        </span>
                        <span className="font-mono-tabular font-bold text-[#991B1B] block mt-0.5">
                          {item.tsmcWeight}
                        </span>
                        <p className="text-stone-700 mt-1 leading-snug">
                          {item.note}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#991B1B] font-semibold bg-[#F4F0E8] border border-stone-200 rounded px-3 py-2 leading-snug">
                    鬼故事揭曉：摘下面具才發現五位全部姓「台」名「積電」！買 5 檔 ETF 不是分散風險，只是買了 5 張「鐵索連環船」的船票。
                  </p>
                </>
              )}
            </div>
          )}

          {/* Sub-Tab 2: Chibi Iron-Chained Fleet */}
          {subTab === 'chibi' && (
            <div className="mt-2.5 rounded-lg border border-stone-300/90 bg-[#FBF9F5] p-3.5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-stone-900">
                  建安十三年赤壁典故：戰船用大鐵索鎖死會發生什麼事？
                </span>
                <div className="inline-flex items-center gap-1 p-0.5 bg-[#EFEAE0] rounded-md">
                  <button
                    type="button"
                    onClick={() => setChibiWind('tailwind')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                      chibiWind === 'tailwind'
                        ? 'bg-[#15803D] text-[#FBF9F5]'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    <Wind className="w-3 h-3" aria-hidden="true" />
                    順風萬船齊發
                  </button>
                  <button
                    type="button"
                    onClick={() => setChibiWind('fire')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                      chibiWind === 'fire'
                        ? 'bg-[#991B1B] text-[#FBF9F5]'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    <Flame className="w-3 h-3" aria-hidden="true" />
                    東南風火燒連環船
                  </button>
                </div>
              </div>

              {chibiWind === 'tailwind' ? (
                <div className="p-3 rounded-md bg-[#ECFDF3] border border-[#86EFAC] text-xs text-stone-800 leading-relaxed">
                  <p className="font-bold text-[#15803D]">
                    順風時：鐵索讓怕暈船的士兵走得超穩，萬船齊發！
                  </p>
                  <p className="mt-1">
                    大盤與 ETF 都抱著同一艘旗艦（占大盤權重逾 40%）衝鋒，每個人都覺得買 ETF 穩如泰山、絕不會輸——但所有戰船已被同一條大鐵鍊首尾鎖死。
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-md bg-[#F4F0E8] border border-stone-300">
                    <span className="font-bold text-stone-900 inline-flex items-center gap-1">
                      <Anchor className="w-3.5 h-3.5 text-[#1E4D5C]" aria-hidden="true" />
                      曹操（台積電）會倒嗎？絕對不會！
                    </span>
                    <p className="text-stone-700 mt-1 leading-snug">
                      外資逆風優先砍權值股，但台積電技術與現金滿手，回檔兩三成照常發薪水，拍拍屁股走華容道繼續當霸主。
                    </p>
                  </div>
                  <div className="p-2.5 rounded-md bg-[#FEF2F2] border border-[#FCA5A5]">
                    <span className="font-bold text-[#991B1B] inline-flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                      真正掛掉的是被鎖死的士兵！
                    </span>
                    <p className="text-stone-700 mt-1 leading-snug">
                      高檔全倉押 ETF、甚至質押／融資開槓桿的人，因鐵索鎖死無法掉頭，最後在船艙被斷頭抬出場。
                    </p>
                  </div>
                </div>
              )}

              <p className="text-xs text-[#1E4D5C] font-semibold bg-[#F0F7F9] border border-[#A5CBD6] rounded px-3 py-2 inline-flex items-center gap-1.5 w-full">
                <LifeBuoy className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>
                  救生艇心法：大船鎖在一起時看起來最穩、但也最沒退路；順風享受船速時，永遠要在船邊掛好「低相關資產與現金緩衝」。
                </span>
              </p>
            </div>
          )}

          {/* Sub-Tab 3: 4-Stage Institutional Taxi Queue */}
          {subTab === 'queue' && (
            <div className="mt-2.5 rounded-lg border border-stone-300/90 bg-[#FBF9F5] p-3.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUEUE_STAGES.map((stage) => {
                  const active = stage.step === activeStage;
                  return (
                    <button
                      key={stage.step}
                      type="button"
                      onClick={() => setActiveStage(stage.step)}
                      className={`px-2.5 py-2 rounded-md border text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#B4432C] text-[#FBF9F5] border-[#B4432C]'
                          : 'bg-[#F4F0E8] text-stone-800 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <span className="block text-xs font-semibold truncate">
                        {stage.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-2.5 rounded-md bg-[#EFEAE0] border border-stone-300/70 p-3 text-xs sm:text-sm text-stone-800 leading-relaxed">
                {currentStage.detail}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
