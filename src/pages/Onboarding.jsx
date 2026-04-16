import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import UploadAdForm from "./UploadAd";

export default function Onboarding() {
  const navigate = useNavigate();
  const { sessionLoading, hasSubscription } = useAuth();

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // SubscribedRoute guards this page, but keep as a safety fallback
  if (!hasSubscription) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Subscription Pending</h1>
            <p className="mt-2 text-sm text-gray-400">
              We're confirming your payment. This usually takes just a moment — refresh in a few seconds.
            </p>
          </div>
          <button
            onClick={() => navigate("/pricing")}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-200"
          >
            Back to pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-bold">Welcome! Let's set up your first ad.</h1>

      <UploadAdForm />

      <button
        onClick={() => navigate("/dashboard")}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
