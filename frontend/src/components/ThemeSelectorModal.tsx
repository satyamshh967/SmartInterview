import React from 'react';
import { X, Sun, Moon, Palette, Check, Sparkles, Monitor } from 'lucide-react';

export type ThemeMode = 'light' | 'contrast' | 'dark';
export type AccentColor = 'teal' | 'emerald' | 'cyan' | 'coral';

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

  const themes: { id: ThemeMode; label: string; desc: string; icon: any; previewClass: string }[] = [
    {
      id: 'light',
      label: 'Clean All-White (Light)',
      desc: 'Pure crisp white canvas, clean white sidebar, and soft gray borders.',
      icon: Sun,
      previewClass: 'bg-white border-slate-300'
    },
    {
      id: 'contrast',
      label: 'Contrast Minimal (Reference)',
      desc: 'Soft gray background (#F4F6F9) with dark rail sidebar and white cards.',
      icon: Monitor,
      previewClass: 'bg-slate-100 border-slate-300'
    },
    {
      id: 'dark',
      label: 'Obsidian Midnight (Dark)',
      desc: 'Deep dark canvas (#090D16) with dark cards (#111827) and neon accents.',
      icon: Moon,
      previewClass: 'bg-[#090D16] border-slate-700'
    }
  ];

  const accents: { id: AccentColor; label: string; colorClass: string; hex: string }[] = [
    { id: 'teal', label: 'Teal & Emerald', colorClass: 'bg-teal-500', hex: '#0D9488' },
    { id: 'emerald', label: 'Pure Emerald', colorClass: 'bg-emerald-500', hex: '#10B981' },
    { id: 'cyan', label: 'Cyan Ocean', colorClass: 'bg-cyan-500', hex: '#06B6D4' },
    { id: 'coral', label: 'Sunset Coral', colorClass: 'bg-orange-500', hex: '#F97316' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-6 transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 flex items-center justify-center">
              <Palette className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Theme & Display Options</h3>
              <p className="text-[11px] text-slate-400">Customize appearance & canvas styling</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Mode Picker */}
        <div className="space-y-2.5">
          <label className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
            Canvas & Background Theme
          </label>
          <div className="space-y-2">
            {themes.map((t) => {
              const Icon = t.icon;
              const isSelected = currentMode === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => onSelectMode(t.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-50/70 dark:bg-teal-500/10 border-teal-500 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-[#090D16] border-slate-200 dark:border-white/5 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {t.label}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        {t.desc}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Accent Color Picker */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
          <label className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
            Accent Brand Palette
          </label>
          <div className="grid grid-cols-2 gap-2">
            {accents.map((a) => {
              const isSelected = currentAccent === a.id;

              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onSelectAccent(a.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                    isSelected
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-white/5 shadow-sm'
                      : 'border-slate-200 dark:border-white/5 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${a.colorClass} shadow-sm flex items-center justify-center`}>
                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                  </span>
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {a.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Done Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-500/20 active:scale-95 transition-all"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
