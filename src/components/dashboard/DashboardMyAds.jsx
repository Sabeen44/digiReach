import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function DashboardMyAds({ userId, navigate }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      const { data } = await supabase
        .from("ads")
        .select("*, store_locations(store_name, city)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (data) setAds(data);
      setLoading(false);
    };
    fetchAds();
  }, [userId]);

  const handleDelete = async (ad) => {
    const filePath = ad.file_url.split("/object/public/ads/")[1];
    await supabase.storage.from("ads").remove([filePath]);
    await supabase.from("ads").delete().eq("id", ad.id);
    setAds((prev) => prev.filter((a) => a.id !== ad.id));
  };

  const statusStyles = {
    pending:  "bg-yellow-500/15 text-yellow-400",
    approved: "bg-green-500/15 text-green-400",
    rejected: "bg-red-500/15 text-red-400",
  };

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">My Ads</h2>
        <button
          onClick={() => navigate("/upload-ad")}
          className="rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-400 transition-all duration-200"
          style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
        >
          + Upload New Ad
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading ads…</p>}

      {!loading && ads.length === 0 && (
        <p className="text-sm text-gray-500">No ads uploaded yet.</p>
      )}

      {!loading && ads.length > 0 && (
        <div className="space-y-3">
          {ads.map((ad) => (
            <div key={ad.id} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              {ad.file_type?.startsWith("video") ? (
                <video src={ad.file_url} className="w-24 h-16 object-cover rounded-lg shrink-0" />
              ) : (
                <img src={ad.file_url} alt="Ad" className="w-24 h-16 object-cover rounded-lg shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {ad.store_locations?.store_name} — {ad.store_locations?.city}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(ad.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 ${statusStyles[ad.status]}`}>
                {ad.status}
              </span>
              <button
                onClick={() => handleDelete(ad)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}