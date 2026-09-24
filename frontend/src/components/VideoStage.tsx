import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Video, 
  Code2, 
  Sparkles,
  Camera,
  RefreshCw
} from 'lucide-react';
import { CandidateItem } from './CandidateListCard';

interface VideoStageProps {
  candidate: CandidateItem;
  questionNumber?: number;
  questionTitle?: string;
  transcript?: string;
  onOpenCodeEditor: () => void;
}

export const VideoStage: React.FC<VideoStageProps> = ({
  candidate,
  questionNumber = 2,
  questionTitle = "Two Sum: Explain optimal O(n) hash map strategy & complexity",
  transcript = "I'm an extremely ambitious engineer. In this problem, my approach uses a hash map to achieve O(n) linear time complexity and avoids the O(n^2) brute-force nested loop.",
  onOpenCodeEditor
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(60);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);
  const [useWebcam, setUseWebcam] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Time tracker
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentTime((prev) => (prev >= 300 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Handle webcam toggle
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useWebcam && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          setUseWebcam(false);
        });
    }

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [useWebcam]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = (currentTime / 300) * 100;

  return (
    <div className="relative w-full h-[380px] lg:h-[440px] bg-slate-900 rounded-3xl overflow-hidden shadow-card border border-slate-200/80 dark:border-white/5 select-none group">
      {/* Background Video / Visualizer / Avatar */}
      {useWebcam ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        <div className="relative w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&auto=format&fit=crop&q=80"
            alt="Candidate Interview Stream"
            className="w-full h-full object-cover object-top filter brightness-[0.92]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>
      )}

      {/* Top Overlay Pill 1: Candidate Identity (Left) */}
      <div className="absolute top-5 left-5 z-10 flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-white">
        <img
          src={candidate.avatar}
          alt={candidate.name}
          className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
        />
        <div className="leading-tight">
          <h4 className="text-xs font-bold">{candidate.name}</h4>
          <span className="text-[10px] text-slate-300 font-medium">Talent</span>
        </div>
      </div>

      {/* Top Overlay Pill 2: Active Question (Right) */}
      <div className="absolute top-5 right-5 z-10 max-w-sm bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-white shadow-lg">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-[11px] font-semibold text-orange-300">Question {questionNumber}</span>
        </div>
        <p className="text-xs font-medium text-slate-100 leading-snug line-clamp-2">
          {questionTitle}
        </p>
      </div>

      {/* Center Action Overlay: Open Code Sandbox */}
      <div className="absolute top-20 right-5 z-10">
        <button
          onClick={onOpenCodeEditor}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold shadow-lg shadow-teal-500/25 transition-transform hover:scale-105 active:scale-95"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Launch Code Sandbox</span>
        </button>
      </div>

      {/* Subtitle Banner at Bottom */}
      <div className="absolute bottom-16 left-6 right-6 z-10 flex justify-center">
        <div className="max-w-2xl bg-black/60 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/10 text-center">
          <p className="text-xs sm:text-sm font-medium text-slate-100 tracking-wide leading-relaxed">
            "{transcript}"
          </p>
        </div>
      </div>

      {/* Video Control Bar at Bottom */}
      <div className="absolute bottom-0 inset-x-0 z-10 px-6 py-3.5 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          <span className="text-xs font-mono font-medium text-slate-300">
            {formatTime(currentTime)} / 05:00
          </span>
        </div>

        {/* Progress Seeker Bar */}
        <div className="flex-1 mx-2 sm:mx-6 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative">
          <div
            className="h-full bg-teal-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Right Tools: Volume, Camera Toggle, Fullscreen */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setUseWebcam(!useWebcam)}
            title={useWebcam ? "Switch to Preset Video" : "Switch to Live Webcam"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              useWebcam ? 'bg-teal-500 text-white' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Camera className="w-4 h-4" />
          </button>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-300 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setIsMuted(false);
              }}
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>

          <button
            onClick={onOpenCodeEditor}
            title="Open Editor"
            className="text-slate-300 hover:text-white"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
