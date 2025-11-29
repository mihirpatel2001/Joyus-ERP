import React from 'react';

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
  label?: string;
}

export const Slider: React.FC<SliderProps> = ({ 
  value, 
  min = 1, 
  max = 3, 
  step = 0.1, 
  onChange, 
  className = '',
  label
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>}
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      />
    </div>
  );
};