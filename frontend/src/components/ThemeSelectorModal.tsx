import React from 'react';
import { X, Sun, Moon, Palette, Check, Monitor, Sliders } from 'lucide-react';

export type ThemeMode = 'light' | 'contrast' | 'dark';
export type AccentColor = 'blue' | 'teal' | 'emerald' | 'cyan' | 'amber' | 'slate';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: ThemeMode;
  onSelectMode: (mode: ThemeMode) => void;
  currentAccent: AccentColor;
  onSelectAccent: (accent: AccentColor) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  currentAccent,
  onSelectAccent
}) => {
  if (!isOpen) return null;

  const themes: { id: ThemeMode; label: string; desc: string; icon: any }[] = [
    {
      id: 'light',
      label: 'Clean All-White',
      desc: 'Crisp white canvas with soft borders and slate typography.',
      icon: Sun
    },
    {
      id: 'contrast',
      label: 'Contrast Minimal',
      desc: 'Subtle gray background with dark navigation rail.',
      icon: Monitor
    },
    {
      id: 'dark',
      label: 'Obsidian Midnight',
      desc: 'Deep dark background with high-contrast cards.',
      icon: Moon
    }
  ];

  const accents: { id: AccentColor; label: string; hex: string; bgClass: string }[] = [
    { id: 'blue', label: 'Linear Blue', hex: '#2563EB', bgClass: 'bg-[#2563EB]' },
    { id: 'teal', label: 'Precision Teal', hex: '#0D9488', bgClass: 'bg-[#0D9488]' },
    { id: 'emerald', label: 'Terminal Emerald', hex: '#059669', bgClass: 'bg-[#059669]' },
    { id: 'cyan', label: 'Nordic Steel Cyan', hex: '#0891B2', bgClass: 'bg-[#0891B2]' },
    { id: 'amber', label: 'Industrial Amber', hex: '#D97706', bgClass: 'bg-[#D97706]' },
    { id: 'slate', label: 'Carbon Slate', hex: '#475569', bgClass: 'bg-[#475569]' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0E131F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6 transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Appearance & Accent System
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Configure interface theme and active brand accent in real time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Theme Mode */}
        <div className="space-y-2.5">
          <label className="text-[11px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
            Canvas Background
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {themes.map((t) => {
              const Icon = t.icon;
              const isSelected = currentMode === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => onSelectMode(t.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/60 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {t.label}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-1">
                      {t.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Professional Accent Palette */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <label className="text-[11px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
              Active Brand Accent
            </label>
            <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-semibold">
              Live Applied
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {accents.map((a) => {
              const isSelected = currentAccent === a.id;

              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onSelectAccent(a.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 transition-all text-left ${
                    isSelected
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/60 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span 
                      className={`w-3.5 h-3.5 rounded-full ${a.bgClass} flex-shrink-0 shadow-sm`} 
                    />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                      {a.label}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Done / Apply Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.99]"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
