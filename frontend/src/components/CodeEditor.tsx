import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Send, 
  RotateCcw, 
  Type, 
  Code2, 
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';

interface CodeEditorProps {
  initialCode: string;
  language: string;
  onLanguageChange: (lang: string) => void;
  onRunSample: (code: string, language: string) => void;
  onSubmitFull: (code: string, language: string) => void;
  onReset: () => void;
  isEvaluating: boolean;
  statusBadge?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  language,
  onLanguageChange,
  onRunSample,
  onSubmitFull,
  onReset,
  isEvaluating,
  statusBadge
}) => {
  const [code, setCode] = useState(initialCode);
  const [fontSize, setFontSize] = useState<number>(14);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  // Sync line numbers scrolling with textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full bg-[#0D121F] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/80 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-white/5 text-xs text-slate-300">
            <Code2 className="w-3.5 h-3.5 text-teal-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="python" className="bg-slate-900 text-slate-200">Python 3</option>
              <option value="javascript" className="bg-slate-900 text-slate-200">JavaScript (Node)</option>
              <option value="cpp" className="bg-slate-900 text-slate-200">C++ (GCC 16)</option>
              <option value="c" className="bg-slate-900 text-slate-200">C (GCC)</option>
            </select>
          </div>

          {/* Font Size Adjuster */}
          <div className="flex items-center gap-1 bg-slate-800/40 px-2 py-0.5 rounded-lg border border-white/5 text-[11px] text-slate-400">
            <Type className="w-3 h-3 text-slate-400" />
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 1))}
              className="hover:text-white px-1 font-bold"
              title="Decrease Font Size"
            >
              -
            </button>
            <span className="font-mono text-slate-300">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(18, fontSize + 1))}
              className="hover:text-white px-1 font-bold"
              title="Increase Font Size"
            >
              +
            </button>
          </div>

          {statusBadge && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20">
              <Sparkles className="w-3 h-3 text-teal-400" />
              {statusBadge}
            </span>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg border border-transparent hover:border-white/5 transition-all"
            title="Reset to starter template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={() => onRunSample(code, language)}
            disabled={isEvaluating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 rounded-lg border border-white/10 transition-all disabled:opacity-50"
          >
            {isEvaluating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
            )}
            <span>Run Tests</span>
          </button>

          <button
            onClick={() => onSubmitFull(code, language)}
            disabled={isEvaluating}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-lg shadow-sm shadow-teal-500/30 transition-all disabled:opacity-50"
          >
            {isEvaluating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Submit Solution</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="relative flex-1 flex overflow-hidden font-mono bg-[#0A0E17]">
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="select-none py-3 px-3 text-right text-slate-600 bg-[#090D16]/50 border-r border-white/5 font-mono overflow-hidden"
          style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.5}px` }}
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          className="flex-1 w-full h-full p-3 bg-transparent text-slate-100 resize-none focus:outline-none overflow-auto font-mono leading-relaxed"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: `${fontSize * 1.5}px`,
            tabSize: 4
          }}
          placeholder="// Write your solution here..."
        />
      </div>

      {/* Editor Status Footer */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#090D16] border-t border-white/5 text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          <span>Lines: {lines.length}</span>
          <span>Chars: {code.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-slate-400">Sandboxed via C++ Engine (:8082)</span>
        </div>
      </div>
    </div>
  );
};
