import { Link } from "react-router-dom";

export default function UpgradeNudge({ show }) {
  if (!show) return null;

  return (
    <Link
      to="/pricing"
      className="fixed bottom-6 right-4 z-50 inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md px-5 py-3 text-sm font-semibold text-indigo-300 shadow-lg shadow-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-400/50 transition-all duration-200"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
      </span>
      Choose a plan to get started →
    </Link>
  );
}