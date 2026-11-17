import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CHARACTER_CAST } from '../data/presentationContent';

interface CharacterCastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterCastModal: React.FC<CharacterCastModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cast-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FBF9F5] border border-stone-300 rounded-xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-wider text-[#B4432C] font-medium">
              YouTube「i級投資客日記」主演陣容 · 編輯部手繪角色
            </p>
            <h2
              id="cast-modal-title"
              className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 mt-0.5"
            >
              人物圖鑑：算帳舞台上的三位主角
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="關閉人物圖鑑"
            className="p-2 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHARACTER_CAST.map((char) => (
            <article
              key={char.id}
              className="flex flex-col bg-[#F4F0E8] border border-stone-200 rounded-lg overflow-hidden"
            >
              <div className="aspect-[4/3] bg-stone-200 overflow-hidden">
                <img
                  src={char.portraitIllustration}
                  alt={char.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <p className="text-xs text-[#1E4D5C] font-medium">
                    {char.role}
                  </p>
                  <h3 className="font-editorial text-lg font-bold text-stone-900 mt-1">
                    {char.name}
                  </h3>
                  <p className="text-sm font-medium text-[#B4432C] mt-1.5">
                    「{char.tagline}」
                  </p>
                  <p className="text-sm text-stone-700 leading-relaxed mt-2">
                    {char.personality}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200 text-xs text-stone-600">
                  <span className="font-semibold text-stone-800">代表道具：</span>
                  {char.signatureProps}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
