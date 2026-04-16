import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function DashboardMyLocations({ userId, locationLimit }) {
  const [ads, setAds] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: adsData } = await supabase
        .from("ads")
        .select("*, store_locations(store_name, city)")
        .eq("user_id", userId)
        .neq("status", "inactive")
        .order("created_at", { ascending: false });

      if (adsData) setAds(adsData);

      const { data: locsData } = await supabase
        .from("store_locations")
        .select("*")
        .eq("active", true)
        .order("store_name", { ascending: true });

      if (locsData) setAvailableLocations(locsData);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleAddLocation = async (locationId) => {
    setAdding(true);
    try {
      const latestAd = ads[0];
      if (!latestAd) return;

      const { error } = await supabase.from("ads").insert({
        user_id: userId,
        store_location_id: locationId,
        file_url: latestAd.file_url,
        file_type: latestAd.file_type,
      });

      if (!error) {
        const { data } = await supabase
          .from("ads")
          .select("*, store_locations(store_name, city)")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (data) setAds(data);
        setShowPicker(false);
      }
    } finally {
      setAdding(false);
    }
  };

  const statusStyles = {
    pending:  "bg-yellow-500/15 text-yellow-400",
    approved: "bg-green-500/15 text-green-400",
    rejected: "bg-red-500/15 text-red-400",
  };

  // ── Derived — must come after state, before return ────────────────────────
  const uniqueAds = ads.filter(
    (ad, index, self) =>
      index === self.findIndex((a) => a.store_location_id === ad.store_location_id)
  );

  const usedLocationIds = uniqueAds.map((ad) => ad.store_location_id);

  const remainingLocations = availableLocations.filter(
    (loc) => !usedLocationIds.includes(loc.id)
  );

  const hasRemainingLocations = uniqueAds.length < locationLimit;

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">My Locations</h2>
        {hasRemainingLocations && remainingLocations.length > 0 && (
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-400 transition-all duration-200"
            style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
          >
            + Add Location
          </button>
        )}
      </div>

      {/* Location picker */}
      {showPicker && (
        <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
            Select a location to add
          </p>
          {remainingLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleAddLocation(loc.id)}
              disabled={adding}
              className="w-full flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all text-left"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{loc.store_name}</p>
                <p className="text-xs text-gray-500">{loc.city}</p>
              </div>
              <span className="text-xs text-indigo-400">Add →</span>
            </button>
          ))}
          <button
            onClick={() => setShowPicker(false)}
            className="w-full text-xs text-gray-600 hover:text-gray-400 pt-1 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {loading && <p className="text-sm text-gray-500">Loading…</p>}

      {!loading && uniqueAds.length === 0 && (
        <p className="text-sm text-gray-500">No locations yet.</p>
      )}

      {!loading && uniqueAds.length > 0 && (
        <div className="space-y-3">
          {uniqueAds.map((ad) => (
            <div key={ad.id} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {ad.store_locations?.store_name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {ad.store_locations?.city}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 ${statusStyles[ad.status]}`}>
                {ad.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}