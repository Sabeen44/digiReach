export default function DashboardLocations({
  locationCount,
  locationLimit,
  isEnterprise,
  totalLocations,
  navigate,
}) {
  const usagePct   = isEnterprise ? 0 : locationLimit > 0 ? Math.min((locationCount / locationLimit) * 100, 100) : 0;
  const usageColor = usagePct >= 100 ? "bg-red-500" : usagePct >= 80 ? "bg-yellow-500" : "bg-indigo-500";

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Locations</h2>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-indigo-400">{locationCount}</span>
          <span className="text-gray-500 text-sm ml-2">
            {isEnterprise ? `/ All ${totalLocations} locations` : `/ ${locationLimit} locations used`}
          </span>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          isEnterprise
            ? "bg-indigo-500/15 text-indigo-400"
            : usagePct >= 100
            ? "bg-red-500/15 text-red-400"
            : usagePct >= 80
            ? "bg-yellow-500/15 text-yellow-400"
            : "bg-green-500/15 text-green-400"
        }`}>
          {isEnterprise
            ? "All Locations"
            : locationLimit - locationCount > 0
            ? `${locationLimit - locationCount} remaining`
            : "Limit reached"}
        </span>
      </div>

      {!isEnterprise && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.06]">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${usageColor}`}
            style={{ width: `${usagePct}%` }}
          />
        </div>
      )}

      {usagePct >= 100 && !isEnterprise && (
        <p className="mt-3 text-sm text-yellow-400">
          You've reached your location limit.{" "}
          <button onClick={() => navigate("/pricing")} className="underline hover:text-yellow-300">
            Upgrade your plan →
          </button>
        </p>
      )}
    </div>
  );
}