import React from "react";
import { AlertOctagon, RefreshCcw, Home, ShieldAlert } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to your reporting service (Sentry, LogRocket, etc.)
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          {/* G.tech Themed Error Card */}
          <div className="max-w-md w-full">
            <div className="bg-white rounded-3xl shadow-2xl shadow-red-200/50 border border-slate-100 overflow-hidden text-center">
              
              {/* Header Accent */}
              <div className="bg-gradient-to-br from-red-600 to-red-500 py-10 flex justify-center relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-red-900/10 rounded-full translate-x-1/2 translate-y-1/2" />
                
                <div className="relative bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/30 shadow-xl">
                  <AlertOctagon className="text-white" size={48} />
                </div>
              </div>

              {/* Body */}
              <div className="p-8 sm:p-10 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-center items-center gap-2 text-red-600 mb-1">
                    <ShieldAlert size={16} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">System Exception</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Unexpected Interruption
                  </h1>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    The G.tech monitoring system encountered a runtime error. 
                    The session has been secured and logged for technical review.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={this.handleReload}
                    className="w-full py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2"
                  >
                    <RefreshCcw size={18} />
                    Recover Session
                  </button>
                  
                  <button
                    onClick={() => window.location.href = "/"}
                    className="w-full py-3.5 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 active:scale-95 transition-all border border-slate-200 flex items-center justify-center gap-2"
                  >
                    <Home size={18} />
                    Return to Dashboard
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                G.tech Security Layer • Automated Fail-Safe Active
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;