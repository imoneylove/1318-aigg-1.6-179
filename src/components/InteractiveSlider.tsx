import React from 'react';
import { getZoneVisualStyle, type SliderZone } from '../utils/presentationLogic';

interface InteractiveSliderProps {
  id: string;
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  zone: SliderZone;
  onChange: (value: number) => void;
  leftHint: string;
  midHint?: string;
  rightHint: string;
  zoneSummary?: string;
}

export const InteractiveSlider: React.FC<InteractiveSliderProps> = ({
  id,
  label,
  value,
  min,
  max,
  step,
  displayValue,
  zone,
  onChange,
  leftHint,
  midHint,
  rightHint,
  zoneSummary,
}) => {
  const style = getZoneVisualStyle(zone);
  const pct = max === min ? 0 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <label
          htmlFor={id}
          className="text-xs sm:text-sm font-bold text-stone-900 inline-flex items-center gap-1.5"
        >
          {label}
        </label>
        <div className="inline-flex items-center gap-2 text-xs">
          <span
            aria-hidden="true"
            className="inline-block w-2.5 h-2.5 rounded-full transition-colors duration-200"
            style={{ backgroundColor: style.hex }}
          />
          <span className={`font-bold transition-colors duration-200 ${style.textClass}`}>
            {zoneSummary ?? style.statusTag}
          </span>
          <span className="text-stone-300" aria-hidden="true">
            ·
          </span>
          <span
            className={`font-mono-tabular text-sm sm:text-base font-bold transition-colors duration-200 ${style.textClass}`}
          >
            {displayValue}
          </span>
        </div>
      </div>

      <div className="relative flex items-center py-1">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="archival-slider w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
          style={
            {
              '--slider-hex': style.hex,
              accentColor: style.hex,
              background: `linear-gradient(to right, ${style.hex} 0%, ${style.hex} ${pct}%, #E2DBD0 ${pct}%, #E2DBD0 100%)`,
            } as React.CSSProperties
          }
        />
      </div>

      <div className="flex justify-between text-[11px] font-mono-tabular text-stone-600 mt-1 gap-2">
        <span>{leftHint}</span>
        {midHint && <span>{midHint}</span>}
        <span>{rightHint}</span>
      </div>
    </div>
  );
};
