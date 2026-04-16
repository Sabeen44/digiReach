import { useState } from "react";
import { Link } from "react-router-dom";

export default function UpgradeNudge({ show }) {
  const [dismissed, setDismissed] = useState(false);

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-4 z-50 inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md px-4 py-3 shadow-lg shadow-indigo-500/10">
      <Link
        to="/pricing"
        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200 transition-colors duration-200"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
        </span>
        Choose a plan to get started →
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="ml-1 rounded-lg p-1 text-indigo-400/60 hover:text-indigo-300 hover:bg-white/5 transition-all duration-150"
        aria-label="Dismiss"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
