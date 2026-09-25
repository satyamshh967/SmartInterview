import React from 'react';
import { RefreshCw, Maximize2 } from 'lucide-react';

interface MetricDonutCardProps {
  metrics?: {
    correctness: number;
    complexity: number;
    communication: number;
    speed: number;
  };
  onRefresh?: () => void;
  onExpand?: () => void;
}

export const MetricDonutCard: React.FC<MetricDonutCardProps> = ({
  metrics = {
    correctness: 80,
    complexity: 90,
    communication: 65,
    speed: 85
  },
  onRefresh,
  onExpand
}) => {
  const items = [
    { label: 'Code Correctness', val: metrics.correctness, color: 'text-teal-500' },
    { label: 'Complexity & Big-O', val: metrics.complexity, color: 'text-teal-500' },
    { label: 'Communication Flow', val: metrics.communication, color: 'text-orange-500' },
    { label: 'Speed & Pacing', val: metrics.speed, color: 'text-teal-500' }
  ];

  const renderDonut = (percent: number = 0, colorClass: string) => {
    const safePercent = Math.max(0, Math.min(100, percent || 0));
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (safePercent / 100) * circumference;

    return (
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-out`}
            fill="transparent"
          />
        </svg>
        <span className="absolute font-bold text-xs text-slate-800 dark:text-slate-100">
          {percent}%
        </span>
      </div>
    );
  };

  return (
    <div className="relative bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-white/5 shadow-soft flex flex-col justify-between transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          AI Evaluation Score Detail
        </h3>
      </div>

      {/* 2x2 Grid of Donut Dials */}
      <div className="grid grid-cols-2 gap-3.5 my-auto">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            {renderDonut(item.val, item.color)}
            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom corner tools */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
        <button
          onClick={onExpand}
          title="Inspect Details"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onRefresh}
          title="Recalculate AI Score"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
