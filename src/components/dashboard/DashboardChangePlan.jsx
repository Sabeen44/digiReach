import { PLAN_LIST, PRICE_IDS } from "../../config/plans";

export default function DashboardChangePlan({
  profile,
  selectedPlan,
  setSelectedPlan,
  upgrading,
  portalLoading,
  handleUpgrade,
  handlePortal,
  totalLocations,
}) {
  const getPlanLocationsLabel = (planId) => {
    if (planId === PRICE_IDS.enterprise) return `All ${totalLocations} Locations`;
    return PLAN_LIST.find((p) => p.id === planId)?.locations ?? "";
  };

  return (
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
            <div className="text-gray-500 text-xs mt-0.5">{getPlanLocationsLabel(plan.id)}</div>
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
  );
}



