import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const dotGrid = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

const blobClip = "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)";

export default function Login() {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", userId)
        .single();

      navigate(profile?.subscription_status === "active" ? "/dashboard" : "/pricing");
    } else {
      navigate("/pricing");
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setResetSent(true);
  };

  return (
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center px-6">

      {/* Dot grid */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={dotGrid} />

      {/* Top-left blob */}
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ top: "-12rem", left: "-6rem", filter: "blur(80px)" }}>
        <div className="bg-gradient-to-tr from-violet-600 to-indigo-400" style={{ width: "50rem", aspectRatio: "1155/678", opacity: 0.15, clipPath: blobClip }} />
      </div>

      {/* Bottom-right blob */}
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ bottom: "-8rem", right: 0, filter: "blur(80px)" }}>
        <div className="bg-gradient-to-tl from-pink-500 to-violet-500" style={{ width: "40rem", aspectRatio: "1155/678", opacity: 0.1, clipPath: blobClip }} />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 shadow-2xl">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-4">
            <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">
              {forgotMode ? "Password reset" : "Welcome back"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {forgotMode ? "Reset your " : "Log in to "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
              {forgotMode ? "password" : "digiReach"}
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {forgotMode
              ? "Enter your email and we'll send you a reset link."
              : "Enter your credentials to access your account."}
          </p>
        </div>

        {/* Reset sent confirmation */}
        {resetSent ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-4">
              <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-green-400">Check your inbox</p>
                <p className="text-xs text-green-400/70 mt-0.5">A password reset link has been sent to {email}.</p>
              </div>
            </div>
            <button
              onClick={() => { setForgotMode(false); setResetSent(false); setError(""); }}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-200"
            >
              Back to login
            </button>
          </div>
        ) : forgotMode ? (
          /* ── Forgot password form ── */
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:outline-none transition-all duration-200"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
            >
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending…</>
              ) : "Send reset link"}
            </button>

            <button
              type="button"
              onClick={() => { setForgotMode(false); setError(""); }}
              className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors pt-1"
            >
              Back to login
            </button>
          </form>
        ) : (
          /* ── Login form ── */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:outline-none transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-400">Password</label>
                <button
                  type="button"
                  onClick={() => { setForgotMode(true); setError(""); }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:outline-none transition-all duration-200"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2"
              style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
            >
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Logging in…</>
              ) : (
                <>Log In <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></>
              )}
            </button>
          </form>
        )}

        {/* Divider + sign up — only on login mode */}
        {!forgotMode && !resetSent && (
          <>
            <div className="my-6 h-px bg-white/[0.06]" />
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">Don't have an account?</p>
              <Link
                to="/signup"
                className="w-full inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              >
                Create an account
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}