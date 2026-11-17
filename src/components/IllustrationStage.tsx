import React, { createContext, useContext, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import type { CharacterId } from '../data/presentationContent';
import type { SlideThemePalette } from '../utils/presentationLogic';

export const SlideThemeContext = createContext<SlideThemePalette>({
  themeLabel: '晨光咖啡暖金漸層',
  backdropGradient: 'linear-gradient(135deg, #FBF9F5 0%, #F5EBDD 52%, #EDE0CE 100%)',
  accentGradient: 'linear-gradient(90deg, #292524 0%, #B4432C 55%, #D97706 100%)',
  frameGradient: 'linear-gradient(135deg, #E7DAC6 0%, #F5EDE0 100%)',
});

export interface BanterLine {
  characterId: CharacterId;
  speakerName: string;
  line: string;
}

interface IllustrationStageProps {
  imageSrc: string;
  imageAlt: string;
  figureCaption: string;
  banterLines: BanterLine[];
}

export const IllustrationStage: React.FC<IllustrationStageProps> = ({
  imageSrc,
  imageAlt,
  figureCaption,
  banterLines,
}) => {
  const [imgError, setImgError] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<CharacterId>(
    banterLines[0]?.characterId ?? 'analyst'
  );
  const themePalette = useContext(SlideThemeContext);

  const currentBanter =
    banterLines.find((b) => b.characterId === activeSpeaker) ?? banterLines[0];

  return (
    <figure className="flex flex-col justify-between h-full">
      <div>
        <div
          className="p-1.5 rounded-xl border border-stone-300/70 transition-all duration-300 shadow-xs"
          style={{ background: themePalette.frameGradient }}
        >
          <div className="relative overflow-hidden rounded-lg border border-stone-300/80 bg-[#F3EFE6] aspect-[4/3]">
            {!imgError ? (
              <img
                src={imageSrc}
                alt={imageAlt}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-600 bg-gradient-to-br from-[#F3EFE6] to-[#E6DFD1]">
                <p className="font-editorial text-lg font-semibold text-stone-800">
                  編輯部角色插畫舞台
                </p>
                <p className="text-sm mt-2 max-w-sm text-stone-600">{imageAlt}</p>
              </div>
            )}
          </div>
        </div>

        <figcaption className="mt-2 text-xs font-editorial italic text-stone-600 leading-relaxed">
          {figureCaption}
        </figcaption>
      </div>

      {/* Playful interactive character commentary selector */}
      {banterLines.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-stone-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
              <MessageCircle className="w-3.5 h-3.5 text-[#B4432C]" aria-hidden="true" />
              點選角色聽現場 OS
            </span>
            <div className="inline-flex items-center gap-1 p-0.5 bg-[#EFEAE0] rounded-md">
              {banterLines.map((item) => {
                const isSelected = item.characterId === currentBanter?.characterId;
                return (
                  <button
                    key={item.characterId}
                    type="button"
                    onClick={() => setActiveSpeaker(item.characterId)}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E4D5C] ${
                      isSelected
                        ? 'bg-[#FBF9F5] text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {item.speakerName}
                  </button>
                );
              })}
            </div>
          </div>

          {currentBanter && (
            <div
              key={`${imageSrc}-${currentBanter.characterId}`}
              className="rounded-md bg-[#F2EDE4] border border-stone-200/90 px-3 py-2 text-xs sm:text-sm text-stone-800 leading-relaxed"
            >
              <span className="font-semibold text-stone-900">
                {currentBanter.speakerName}：
              </span>
              <span>「{currentBanter.line}」</span>
            </div>
          )}
        </div>
      )}
    </figure>
  );
};
