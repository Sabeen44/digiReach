import { useState } from "react";
import { PLAN_LIST, PLAN_LOCATION_LIMITS } from "../../config/plans";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";

const PLAN_ORDER = PLAN_LIST.map((p) => p.priceId);

export default function DashboardChangePlan({
  profile,
  selectedPlan,
  setSelectedPlan,
  upgrading,
  portalLoading,
  handleUpgrade,
  handlePortal,
  totalLocations,
  onPlanChanged,
}) {
  const { session } = useAuth();
  const [confirm, setConfirm]           = useState(null);
  const [selectedLocIds, setSelectedLocIds] = useState([]); // location IDs user wants to keep
  const [loadingAds, setLoadingAds]     = useState(false);

  const getLocationsLabel = (priceId) => {
    const limit = PLAN_LOCATION_LIMITS[priceId];
    if (limit === Infinity) return `All ${totalLocations} locations`;
    return `${limit} location${limit !== 1 ? "s" : ""}`;
  };

  const handleSwitchClick = async () => {
    if (!selectedPlan || selectedPlan === profile?.plan_id) return;

    const currentIdx = PLAN_ORDER.indexOf(profile?.plan_id);
    const newIdx     = PLAN_ORDER.indexOf(selectedPlan);
    const isUpgrade  = newIdx > currentIdx;
    const newPlan    = PLAN_LIST.find((p) => p.priceId === selectedPlan);

    if (isUpgrade) {
      setConfirm({ type: "upgrade", newPlan });
    } else {
      setLoadingAds(true);

      // Fetch all active store locations + user's approved ads (for file info + pre-selection)
      const [{ data: allLocs }, { data: approvedAds }] = await Promise.all([
        supabase
          .from("store_locations")
          .select("*")
          .eq("active", true)
          .order("store_name", { ascending: true }),
        supabase
          .from("ads")
          .select("id, store_location_id, file_url, file_type")
          .eq("user_id", session.user.id)
          .eq("status", "approved"),
      ]);

      setLoadingAds(false);

      const newLimit   = PLAN_LOCATION_LIMITS[selectedPlan];
      const existingByLocId = Object.fromEntries(
        (approvedAds ?? []).map((a) => [a.store_location_id, a])
      );
      const existingLocIds = Object.keys(existingByLocId);
      // Pre-select the user's most recent locations (up to newLimit)
      const preSelected = existingLocIds.slice(-newLimit);

      setSelectedLocIds(preSelected);
      setConfirm({
        type: "downgrade",
        newPlan,
        newLimit,
        allLocations: allLocs ?? [],
        existingByLocId,              // locId → approved ad (for re-activation or file reuse)
        latestAd: (approvedAds ?? [])[0] ?? null,
      });
    }
  };

  const handleConfirm = async () => {
    if (confirm.type === "downgrade") {
      const { existingByLocId, latestAd } = confirm;
      const allApprovedIds = Object.values(existingByLocId).map((a) => a.id);

      // 1. Deactivate all currently approved ads
      if (allApprovedIds.length > 0) {
        await supabase.from("ads").update({ status: "inactive" }).in("id", allApprovedIds);
      }

      // 2. For each chosen location: re-activate existing ad OR insert new one
      for (const locId of selectedLocIds) {
        const existing = existingByLocId[locId];
        if (existing) {
          await supabase.from("ads").update({ status: "approved" }).eq("id", existing.id);
        } else if (latestAd) {
          await supabase.from("ads").insert({
            user_id: session.user.id,
            store_location_id: locId,
            file_url: latestAd.file_url,
            file_type: latestAd.file_type,
            status: "pending",
          });
        }
      }

      onPlanChanged();
    }

    setConfirm(null);
    handleUpgrade(selectedPlan);
  };

  return (
    <>
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 space-y-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Change Plan</h2>

        <div className="grid grid-cols-3 gap-3 text-sm">
          {PLAN_LIST.map((plan) => {
            const isCurrent  = profile?.plan_id === plan.priceId;
            const isSelected = selectedPlan === plan.priceId;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.priceId)}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                  isSelected
                    ? "border-indigo-500/60 bg-indigo-500/10"
                    : isCurrent
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]"
                }`}
              >
                <div className="font-semibold text-white">{plan.name}</div>
                <div className="text-gray-500 text-xs mt-0.5">{getLocationsLabel(plan.priceId)}</div>
                <div className="text-indigo-400 text-xs mt-1.5">
                  {plan.price}<span className="text-gray-600">/mo</span>
                </div>
                {isCurrent && <div className="text-green-400 text-xs mt-1">Current plan</div>}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!selectedPlan || upgrading || loadingAds || selectedPlan === profile?.plan_id}
            onClick={handleSwitchClick}
            className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:bg-white/[0.06] disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200"
            style={{ boxShadow: !selectedPlan || selectedPlan === profile?.plan_id ? "none" : "0 4px 20px rgba(99,102,241,0.3)" }}
          >
            {upgrading || loadingAds ? "Loading…" : "Switch Plan"}
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

      {/* Confirmation modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirm(null)} />

          <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-gray-950 p-6 shadow-2xl space-y-5">

            {/* Header */}
            <div className="flex items-start gap-4">
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                confirm.type === "upgrade"
                  ? "bg-indigo-500/10 border border-indigo-500/20"
                  : "bg-yellow-500/10 border border-yellow-500/20"
              }`}>
                {confirm.type === "upgrade" ? (
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {confirm.type === "upgrade" ? `Upgrade to ${confirm.newPlan.name}` : `Downgrade to ${confirm.newPlan.name}`}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Your new plan applies immediately. You'll receive a prorated credit or charge for the remainder of your billing cycle.
                </p>
              </div>
            </div>

            {/* Downgrade — pick from ALL available locations */}
            {confirm.type === "downgrade" && (
              <div className="space-y-3">
                <p className="text-xs font-medium text-yellow-400">
                  Choose up to {confirm.newLimit} location{confirm.newLimit !== 1 ? "s" : ""} for your {confirm.newPlan.name} plan.
                </p>

                {confirm.allLocations.length === 0 ? (
                  <p className="text-xs text-gray-500">No locations available.</p>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {confirm.allLocations.map((loc) => {
                      const checked  = selectedLocIds.includes(loc.id);
                      const disabled = !checked && selectedLocIds.length >= confirm.newLimit;
                      return (
                        <label
                          key={loc.id}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                            checked
                              ? "border-indigo-500/50 bg-indigo-500/10 cursor-pointer"
                              : disabled
                              ? "border-white/[0.04] bg-white/[0.01] opacity-40 cursor-not-allowed"
                              : "border-white/[0.08] hover:border-white/20 cursor-pointer"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() =>
                              setSelectedLocIds((prev) =>
                                prev.includes(loc.id)
                                  ? prev.filter((id) => id !== loc.id)
                                  : [...prev, loc.id]
                              )
                            }
                            className="accent-indigo-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-white">{loc.store_name}</p>
                            <p className="text-xs text-gray-500">{loc.city}</p>
                          </div>
                          {confirm.existingByLocId[loc.id] && (
                            <span className="text-xs text-green-400 shrink-0">Current</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}

                <p className="text-xs text-gray-600">{selectedLocIds.length} / {confirm.newLimit} selected</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleConfirm}
                disabled={upgrading}
                className="flex-1 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                {upgrading ? "Applying…" : "Confirm"}
              </button>
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
