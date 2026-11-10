import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  error: Error | null;
}

class SanctuaryErrorBoundary extends React.Component<
  {children: React.ReactNode},
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {error: null};

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {error};
  }

  render() {
    if (this.state.error) {
      return (
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-[#0b1612] text-emerald-50 p-6 text-center">
          <h1 className="font-display text-3xl text-amber-200 mb-2">Verdant Resonance</h1>
          <p className="text-sm text-emerald-200/80 max-w-md mb-5">
            The conservatory viewport encountered an unexpected graphics interruption and can be
            restored immediately.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-lg bg-amber-400 text-emerald-950 font-medium text-sm hover:bg-amber-300 transition-colors cursor-pointer"
          >
            Restore Conservatory
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <SanctuaryErrorBoundary>
    <App />
  </SanctuaryErrorBoundary>,
);
