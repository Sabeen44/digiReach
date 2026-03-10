import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import { PLAN_LABELS, PLAN_LOCATION_LIMITS, PLAN_LIST } from "../config/plans";

export default function Dashboard() {
  const navigate = useNavigate();
  const { session, sessionLoading } = useAuth();
  const { profile, loading, upgrading, portalLoading, handleUpgrade, handlePortal } = useDashboard(session);
  const [selectedPlan, setSelectedPlan] = useState("");

  // ── Loading states ────────────────────────────────────────────────────────
  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-950 p-10 text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-semibold">Please log in to view your dashboard</h1>
        <button
          onClick={() => navigate("/login")}
          className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ── Derived state ─────────────────────────────────────────────────────────
  const isActive      = profile?.subscription_status === "active";
  const planLabel     = PLAN_LABELS[profile?.plan_id] ?? "—";
  const locationCount = profile?.location_count ?? 0;
  const locationLimit = PLAN_LOCATION_LIMITS[profile?.plan_id] ?? 0;
  const usagePct      = locationLimit > 0 ? Math.min((locationCount / locationLimit) * 100, 100) : 0;
  const usageColor    = usagePct >= 100 ? "bg-red-500" : usagePct >= 80 ? "bg-yellow-500" : "bg-indigo-500";

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>

        {/* Account */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Account</h2>
          <p className="mt-2 text-lg font-medium text-white">{session.user.email}</p>
          <p className="mt-1 text-sm text-gray-500">User ID: {session.user.id}</p>
        </div>

        {/* Subscription */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Subscription</h2>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              isActive ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"
            }`}>
              {isActive ? "Active" : "Inactive"}
            </span>
            <span className="text-white font-medium">
              {isActive ? `${planLabel} Plan` : "No active plan"}
            </span>
          </div>
          {!isActive && (
            <p className="mt-3 text-sm text-gray-500">
              You don't have an active subscription.{" "}
              <button onClick={() => navigate("/pricing")} className="text-indigo-400 hover:underline">
                Choose a plan →
              </button>
            </p>
          )}
        </div>

        {/* Usage */}
        {isActive && (
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Locations</h2>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold text-indigo-400">{locationCount}</span>
                <span className="text-gray-500 text-sm ml-2">/ {locationLimit} locations used</span>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                usagePct >= 100
                  ? "bg-red-500/15 text-red-400"
                  : usagePct >= 80
                  ? "bg-yellow-500/15 text-yellow-400"
                  : "bg-green-500/15 text-green-400"
              }`}>
                {locationLimit - locationCount > 0 ? `${locationLimit - locationCount} remaining` : "Limit reached"}
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.06]">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${usageColor}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
            {usagePct >= 100 && (
              <p className="mt-3 text-sm text-yellow-400">
                You've reached your location limit.{" "}
                <button onClick={() => navigate("/pricing")} className="underline hover:text-yellow-300">
                  Upgrade your plan →
                </button>
              </p>
            )}
          </div>
        )}

        {/* Change Plan */}
        {isActive && (
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Change Plan</h2>

            <div className="grid grid-cols-3 gap-3 text-sm">
              {PLAN_LIST.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                    selectedPlan === plan.id
                      ? "border-indigo-500/60 bg-indigo-500/10"
                      : profile?.plan_id === plan.id
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="font-semibold text-white">{plan.label}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{plan.locations}</div>
                  <div className="text-indigo-400 text-xs mt-1.5">{plan.price}</div>
                  {profile?.plan_id === plan.id && (
                    <div className="text-green-400 text-xs mt-1">Current plan</div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                disabled={!selectedPlan || upgrading || selectedPlan === profile?.plan_id}
                onClick={() => handleUpgrade(selectedPlan)}
                className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:bg-white/[0.06] disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                style={{ boxShadow: !selectedPlan || selectedPlan === profile?.plan_id ? "none" : "0 4px 20px rgba(99,102,241,0.3)" }}
              >
                {upgrading ? "Redirecting…" : "Switch Plan"}
              </button>

              <button
                onClick={handlePortal}
                disabled={portalLoading || !profile?.stripe_customer_id}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                {portalLoading ? "Loading…" : "Manage Billing"}
              </button>
            </div>
          </div>
        )}

        {/* Billing only — inactive but has Stripe customer */}
        {!isActive && profile?.stripe_customer_id && (
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Billing</h2>
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-40 transition-all duration-200"
            >
              {portalLoading ? "Loading…" : "Manage Billing"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}