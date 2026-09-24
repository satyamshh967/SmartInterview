import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Radio, 
  Sparkles, 
  MessageSquareCode, 
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { NLPFeedback } from '../types';
import { getCommunicationFeedback } from '../services/api';

interface VideoRecorderProps {
  interviewId?: string;
  problemId?: string;
  code?: string;
  onTranscriptChange: (transcript: string) => void;
  onNlpEvaluated?: (feedback: NLPFeedback) => void;
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({
  interviewId,
  problemId,
  code,
  onTranscriptChange,
  onNlpEvaluated
}) => {
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [micActive, setMicActive] = useState<boolean>(true);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>(
    "I will solve this using a hash map to achieve O(n) linear time complexity and O(n) auxiliary space complexity. As I traverse the input elements, I compute the complement and check if it exists in the dictionary. If present, I immediately return the indices, effectively avoiding the O(n^2) brute force nested loop. An edge case to consider is negative integers and duplicate values."
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [nlpResult, setNlpResult] = useState<NLPFeedback | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize camera or fallback
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startMedia = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.log('Webcam/mic not available or permission denied; using simulation stream');
        setCameraActive(false);
      }
    };

    startMedia();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Live recording timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatRecTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleExplanationChange = (val: string) => {
    setExplanation(val);
    onTranscriptChange(val);
  };

  const handleAnalyzeTranscript = async () => {
    if (!explanation.trim()) return;
    setIsAnalyzing(true);
    try {
      const feedback = await getCommunicationFeedback({
        interviewId,
        transcript: explanation,
        problemId,
        code,
        timeTakenSeconds: recordingSeconds
      });
      setNlpResult(feedback);
      if (onNlpEvaluated) {
        onNlpEvaluated(feedback);
      }
    } catch (err) {
      console.error('Failed to analyze explanation:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#0D121F] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
      {/* Video & Interviewer Feed Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">Live Candidate Stream</span>
          <span className="font-mono text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
            REC {formatRecTime(recordingSeconds)}
          </span>
        </div>

        {/* Media Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMicActive(!micActive)}
            title={micActive ? 'Mute Mic' : 'Unmute Mic'}
            className={`p-1 rounded-md text-xs transition-colors ${
              micActive ? 'text-slate-300 hover:bg-slate-800' : 'text-rose-400 bg-rose-500/10'
            }`}
          >
            {micActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setCameraActive(!cameraActive)}
            title={cameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
            className={`p-1 rounded-md text-xs transition-colors ${
              cameraActive ? 'text-slate-300 hover:bg-slate-800' : 'text-rose-400 bg-rose-500/10'
            }`}
          >
            {cameraActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Video Viewport */}
      <div className="relative h-44 bg-[#080B12] flex items-center justify-center overflow-hidden border-b border-white/5">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-14 h-14 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mb-2">
              <span className="text-lg font-bold text-teal-400">AM</span>
            </div>
            <p className="text-xs font-medium text-slate-300">Candidate Audio Feed</p>
            {/* Audio Wave Visualizer */}
            <div className="flex items-center gap-1 mt-2.5 h-6">
              <span className="w-1 bg-teal-500 rounded-full animate-wave-1" />
              <span className="w-1 bg-teal-400 rounded-full animate-wave-2" />
              <span className="w-1 bg-emerald-400 rounded-full animate-wave-3" />
              <span className="w-1 bg-teal-400 rounded-full animate-wave-4" />
              <span className="w-1 bg-teal-500 rounded-full animate-wave-5" />
            </div>
          </div>
        )}

        {/* Floating Mini Overlay */}
        <div className="absolute bottom-2 left-2 bg-[#090D16]/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-slate-400 border border-white/5">
          {micActive ? 'Mic: Live (Speech-to-Text)' : 'Mic: Muted'}
        </div>
      </div>

      {/* Candidate Verbal Solution & Explanation Input */}
      <div className="p-3 bg-[#0D121F] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MessageSquareCode className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-xs font-semibold text-slate-300">Solution Reasoning & Explanation</span>
          </div>

          <button
            onClick={handleAnalyzeTranscript}
            disabled={isAnalyzing || !explanation.trim()}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 active:scale-95 rounded-lg border border-teal-500/30 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 text-teal-400" />
            )}
            <span>Analyze with NLP</span>
          </button>
        </div>

        <textarea
          value={explanation}
          onChange={(e) => handleExplanationChange(e.target.value)}
          rows={3}
          className="w-full p-2.5 bg-[#090D16] text-slate-200 text-xs rounded-xl border border-white/5 resize-none focus:outline-none focus:border-teal-500/40 leading-relaxed font-sans"
          placeholder="Articulate your thought process: approach, time/space complexity O(n), edge cases, and trade-offs..."
        />

        {/* NLP Immediate Feedback Pill Bar */}
        {nlpResult && (
          <div className="p-2.5 bg-teal-950/20 rounded-xl border border-teal-500/20 space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Communication Score:</span>
              <span className="font-bold text-teal-400">{nlpResult.overallScore}/100</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {nlpResult.complexityIdentified && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  Big-O Complexity Identified
                </span>
              )}
              {nlpResult.detectedKeywords.slice(0, 4).map((kw, i) => (
                <span key={i} className="text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/20 px-1.5 py-0.5 rounded">
                  {kw}
                </span>
              ))}
            </div>

            {nlpResult.strengths[0] && (
              <p className="text-[11px] text-slate-400 leading-tight">
                <span className="text-emerald-400 font-semibold">&bull; </span>
                {nlpResult.strengths[0]}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
