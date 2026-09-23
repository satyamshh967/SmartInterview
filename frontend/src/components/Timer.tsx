import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, Pause, Play } from 'lucide-react';

interface TimerProps {
  initialMinutes: number;
  onTimeExpired?: () => void;
  onSecondsUpdated?: (secondsElapsed: number) => void;
  isRunning?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  initialMinutes,
  onTimeExpired,
  onSecondsUpdated,
  isRunning = true
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [paused, setPaused] = useState(!isRunning);
  const totalSeconds = initialMinutes * 60;

  useEffect(() => {
    setSecondsRemaining(initialMinutes * 60);
  }, [initialMinutes]);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onTimeExpired) onTimeExpired();
          return 0;
        }
        const updated = prev - 1;
        if (onSecondsUpdated) {
          onSecondsUpdated(totalSeconds - updated);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, onTimeExpired, onSecondsUpdated, totalSeconds]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = Math.max(0, Math.min(100, (secondsRemaining / totalSeconds) * 100));

  // Determine state colors
  const isCritical = secondsRemaining < 120; // < 2 min
  const isWarning = secondsRemaining < 300 && !isCritical; // < 5 min

  let colorClasses = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  let barColor = 'bg-emerald-500';

  if (isCritical) {
    colorClasses = 'text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse';
    barColor = 'bg-rose-500';
  } else if (isWarning) {
    colorClasses = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    barColor = 'bg-amber-500';
  }

  return (
    <div className="flex items-center gap-3 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/5 shadow-inner">
      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-xs font-mono font-semibold tracking-wider ${colorClasses}`}>
        {isCritical ? (
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
        ) : (
          <Clock className="w-3.5 h-3.5" />
        )}
        <span>{formattedTime}</span>
      </div>

      {/* Sleek mini progress bar */}
      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
        <div
          className={`h-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Pause/Resume button */}
      <button
        onClick={() => setPaused(!paused)}
        title={paused ? 'Resume Timer' : 'Pause Timer'}
        className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
      >
        {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
      </button>
    </div>
  );
};
