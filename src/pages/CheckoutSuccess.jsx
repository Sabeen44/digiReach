import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let interval;
    let attempts = 0;

    const startPolling = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/");

      interval = setInterval(async () => {
        attempts++;

        const { data } = await supabase
          .from("profiles")
          .select("subscription_status")
          .eq("id", user.id)
          .single();

        if (data?.subscription_status === "active") {
          clearInterval(interval);
          setStatus("success");
        } else if (attempts > 10) {
          clearInterval(interval);
          setStatus("delayed");
        }
      }, 1500);
    };

    startPolling();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center px-6 overflow-hidden">

      {/* Gradient top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 z-50" />

      {/* Background glow blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-md w-full text-center space-y-8">

        {/* Checking */}
        {status === "checking" && (
          <>
            <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Confirming your plan…</h1>
              <p className="mt-2 text-sm text-gray-400">This usually takes just a few seconds.</p>
            </div>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-xs font-medium text-indigo-500 tracking-wide uppercase">Payment Confirmed</span>
            </div>

            {/* Text */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                You're{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500">
                  all set!
                </span>{" "}
                🎉
              </h1>
              <p className="mt-3 text-gray-400 text-sm">
                Your subscription is confirmed. Ready to upload your first ad?
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button
                onClick={() => navigate("/onboarding")}
                className="w-full rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 transition-all duration-200"
                style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
              >
                Upload Your First Ad →
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:border-indigo-200 transition-all duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}

        {/* Delayed */}
        {status === "delayed" && (
          <>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center mx-auto shadow-lg shadow-yellow-100">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-100 bg-yellow-50 px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <span className="text-xs font-medium text-yellow-600 tracking-wide uppercase">Still Processing</span>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Almost there…</h1>
              <p className="mt-3 text-gray-400 text-sm">
                Your payment is being confirmed. You can go ahead and upload your ad or check back shortly.
              </p>
            </div>

            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button
                onClick={() => navigate("/onboarding")}
                className="w-full rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 transition-all duration-200"
                style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
              >
                Upload Your First Ad →
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:border-indigo-200 transition-all duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}