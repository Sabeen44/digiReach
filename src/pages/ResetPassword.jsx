import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const dotGrid = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

const blobClip = "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)";

export default function ResetPassword() {
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [validSession, setValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase exchanges the token from the URL hash and establishes a session
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setValidSession(true);
    });
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) { setError(error.message); return; }
    setSuccess(true);
    setTimeout(() => navigate("/login"), 2500);
  };

  return (
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center px-6">

      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={dotGrid} />

      <div aria-hidden="true" className="absolute pointer-events-none" style={{ top: "-12rem", left: "-6rem", filter: "blur(80px)" }}>
        <div className="bg-gradient-to-tr from-violet-600 to-indigo-400" style={{ width: "50rem", aspectRatio: "1155/678", opacity: 0.15, clipPath: blobClip }} />
      </div>

      <div aria-hidden="true" className="absolute pointer-events-none" style={{ bottom: "-8rem", right: 0, filter: "blur(80px)" }}>
        <div className="bg-gradient-to-tl from-pink-500 to-violet-500" style={{ width: "40rem", aspectRatio: "1155/678", opacity: 0.1, clipPath: blobClip }} />
      </div>

      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 shadow-2xl">

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-4">
            <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">Password reset</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Set a new{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
              password
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">Choose a strong password for your account.</p>
        </div>

        {success ? (
          <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-4">
            <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-400">Password updated</p>
              <p className="text-xs text-green-400/70 mt-0.5">Redirecting you to login…</p>
            </div>
          </div>
        ) : !validSession ? (
          <div className="flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-4">
            <svg className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-yellow-400">Invalid or expired link</p>
              <p className="text-xs text-yellow-400/70 mt-0.5">Please request a new password reset link.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">New password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                required
                onChange={(e) => setConfirm(e.target.value)}
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
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Updating…</>
              ) : "Update password"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
