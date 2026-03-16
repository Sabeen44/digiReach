import { PLAN_LABELS } from "../../config/plans";

export default function DashboardSubscription({ profile, isActive, navigate }) {
  const planLabel = PLAN_LABELS[profile?.plan_id] ?? "—";

  return (
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
  );
}