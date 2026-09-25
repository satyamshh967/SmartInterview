import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    localStorage.removeItem('app-theme-mode');
    localStorage.removeItem('app-accent-color');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#090D16] p-6 text-slate-900 dark:text-white font-sans">
          <div className="max-w-md w-full bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h2 className="text-lg font-bold">Something went wrong</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The application encountered an unexpected runtime error.
            </p>

            {this.state.error && (
              <pre className="p-3 bg-slate-100 dark:bg-black/40 rounded-xl text-left text-[11px] font-mono text-rose-600 dark:text-rose-400 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </pre>
            )}

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset & Reload App</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
