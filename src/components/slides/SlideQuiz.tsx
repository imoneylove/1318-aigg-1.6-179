import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, FileText } from 'lucide-react';
import {
  CHARACTER_CAST,
  DISCLAIMER_TEXT,
  QUIZ_QUESTIONS,
  SLIDES,
  type CharacterId,
} from '../../data/presentationContent';
import { scoreSurvivalQuiz } from '../../utils/presentationLogic';
import { IllustrationStage, type BanterLine } from '../IllustrationStage';

const SLIDE_5_BANTER: BanterLine[] = [
  {
    characterId: 'analyst',
    speakerName: '算帳主廚',
    line: '三題答完就知道你遇到市場大風大浪時，是先把計算機拿出來，還是先去廚房搶海綿。',
  },
  {
    characterId: 'muse',
    speakerName: '旗袍偵探',
    line: '寫完測驗別忘了按右上角的「PDF 講義下載」，把全彩人物插畫跟重點心法帶回家配咖啡！',
  },
  {
    characterId: 'frenchie',
    speakerName: '法鬥小白',
    line: '投資這場長跑，最後贏的往往不是跑最快的人，而是沒在餐廳洗碗的那位喔！',
  },
];

export const SlideQuiz: React.FC = () => {
  const slide = SLIDES[6];
  const [answers, setAnswers] = useState<Record<string, CharacterId>>({});
  const [lastReaction, setLastReaction] = useState<string>('');

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === QUIZ_QUESTIONS.length;
  const outcome = isComplete ? scoreSurvivalQuiz(answers) : null;
  const matchedCharacter = outcome
    ? CHARACTER_CAST.find((c) => c.id === outcome.winner) ?? CHARACTER_CAST[0]
    : null;

  const handleSelectOption = (
    questionId: string,
    persona: CharacterId,
    reaction: string
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: persona }));
    setLastReaction(reaction);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
      <div className="lg:col-span-5">
        <IllustrationStage
          imageSrc={
            matchedCharacter ? matchedCharacter.portraitIllustration : slide.imageSrc
          }
          imageAlt={matchedCharacter ? matchedCharacter.name : slide.imageAlt}
          figureCaption={
            matchedCharacter
              ? `測驗結果：${matchedCharacter.name} — 「${matchedCharacter.tagline}」`
              : slide.figureCaption
          }
          banterLines={SLIDE_5_BANTER}
        />
      </div>

      <div className="lg:col-span-7 flex flex-col justify-between gap-3.5">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs tracking-widest text-stone-500 font-medium">
              {slide.chapterCode} · 進度 {answeredCount} / {QUIZ_QUESTIONS.length}
            </p>
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setLastReaction('');
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#1E4D5C] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                重新測驗
              </button>
            )}
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 leading-snug mt-1 text-balance">
            {slide.title}
          </h2>

          {!isComplete ? (
            <div className="mt-3 space-y-2.5">
              {QUIZ_QUESTIONS.map((q) => {
                const chosen = answers[q.id];
                return (
                  <fieldset
                    key={q.id}
                    className="rounded-lg border border-stone-200 bg-[#FBF9F5] p-3"
                  >
                    <legend className="text-xs sm:text-sm font-bold text-stone-900 px-1">
                      {q.prompt}
                    </legend>
                    <div className="mt-2 grid grid-cols-1 gap-1.5">
                      {q.options.map((opt) => {
                        const selected = chosen === opt.persona;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleSelectOption(q.id, opt.persona, opt.reaction)
                            }
                            className={`text-left px-3 py-2 rounded-md border text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                              selected
                                ? 'bg-stone-900 text-[#FBF9F5] border-stone-900 font-medium'
                                : 'bg-[#F4F0E8] text-stone-800 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {selected && (
                              <CheckCircle2
                                className="w-4 h-4 shrink-0 text-[#E5A98D]"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}

              {lastReaction && (
                <p className="text-xs font-medium text-[#1E4D5C] bg-[#EFEAE0] border border-stone-300/70 rounded-md px-3.5 py-2.5">
                  現場吐槽：{lastReaction}
                </p>
              )}
            </div>
          ) : (
            outcome &&
            matchedCharacter && (
              <div className="mt-4 rounded-lg border border-stone-300 bg-[#F2EDE4] p-5 space-y-3">
                <p className="text-xs font-semibold tracking-wider text-[#B4432C]">
                  你的派對散場人格揭曉
                </p>
                <h3 className="font-editorial text-2xl font-bold text-stone-900">
                  {outcome.title}
                </h3>
                <p className="text-sm text-stone-800 leading-relaxed">
                  {outcome.summary}
                </p>

                <div className="pt-3 border-t border-stone-300/80 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-[#FBF9F5]">
                    <span className="text-stone-500 block">算帳主廚</span>
                    <span className="font-mono-tabular font-bold text-stone-900">
                      {outcome.counts.analyst} 票
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#FBF9F5]">
                    <span className="text-stone-500 block">旗袍偵探</span>
                    <span className="font-mono-tabular font-bold text-stone-900">
                      {outcome.counts.muse} 票
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#FBF9F5]">
                    <span className="text-stone-500 block">法鬥小白</span>
                    <span className="font-mono-tabular font-bold text-stone-900">
                      {outcome.counts.frenchie} 票
                    </span>
                  </div>
                </div>

                <p className="inline-flex items-center gap-1.5 text-xs text-[#1E4D5C] pt-1">
                  <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  喜歡這集算帳筆記嗎？歡迎鎖定 YouTube「i級投資客日記」，並點擊右上角下載全彩 PDF 講義！
                </p>
              </div>
            )
          )}
        </div>

        {/* Full Verbatim Disclaimer */}
        <aside className="rounded-md bg-[#F4F0E8] border border-stone-300/80 p-3.5 text-xs text-stone-600 leading-relaxed">
          <p className="font-bold text-stone-800 mb-1">免責聲明</p>
          <p>{DISCLAIMER_TEXT}</p>
        </aside>
      </div>
    </div>
  );
};
