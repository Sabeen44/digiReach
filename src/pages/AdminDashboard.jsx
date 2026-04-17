import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import AdminAdCard from "../components/admin/AdminAdCard";
import { PLAN_LABELS } from "../config/plans";

const ADMIN_EMAIL = "admintest@example.com";

const STATUS_COLORS = {
  active:   "bg-green-50 text-green-600 border-green-100",
  inactive: "bg-yellow-50 text-yellow-600 border-yellow-100",
  canceled: "bg-red-50 text-red-500 border-red-100",
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [isAdmin,   setIsAdmin]   = useState(false);
  const [checking,  setChecking]  = useState(true);
  const [filter,    setFilter]    = useState("pending");
  const [loading,   setLoading]   = useState(true);

  const [ads,       setAds]       = useState([]);
  const [users,     setUsers]     = useState([]);
  const [locations, setLocations] = useState([]);

  const [stats,     setStats]     = useState({ pending: 0, subscribers: 0, approved: 0, locations: 0 });

  const [newLoc,    setNewLoc]    = useState({ store_name: "", city: "" });
  const [savingLoc, setSavingLoc] = useState(false);
  const [locError,  setLocError]  = useState("");

  // ── Auth check ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }
      if (user.email !== ADMIN_EMAIL) { navigate("/dashboard"); return; }
      setIsAdmin(true);
      setChecking(false);
    };
    checkAdmin();
  }, []);

  // ── Stats (always fresh) ────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    const [
      { count: pending },
      { count: subscribers },
      { count: approved },
      { count: locs },
    ] = await Promise.all([
      supabase.from("ads").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("subscription_status", "active"),
      supabase.from("ads").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("store_locations").select("*", { count: "exact", head: true }).eq("active", true),
    ]);
    setStats({
      pending:     pending     ?? 0,
      subscribers: subscribers ?? 0,
      approved:    approved    ?? 0,
      locations:   locs        ?? 0,
    });
  }, []);

  useEffect(() => {
    if (isAdmin) fetchStats();
  }, [isAdmin, fetchStats]);

  // ── Tab data ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      setLoading(true);

      if (filter === "users") {
        const { data } = await supabase
          .from("profiles")
          .select("id, subscription_status, plan_id, stripe_customer_id")
          .order("id", { ascending: false });
        setUsers(data ?? []);

      } else if (filter === "locations") {
        const { data } = await supabase
          .from("store_locations")
          .select("*")
          .order("city", { ascending: true });
        setLocations(data ?? []);

      } else {
        const { data } = await supabase
          .from("ads")
          .select("*, store_locations(store_name, city)")
          .eq("status", filter)
          .order("created_at", { ascending: false });

        if (data) {
          const seen   = new Set();
          const unique = data.filter((ad) => {
            const key = `${ad.user_id}__${ad.file_url}`;
            if (seen.has(key)) return false;
            seen.add(key);
            ad._locations = data
              .filter((a) => a.user_id === ad.user_id && a.file_url === ad.file_url)
              .map((a) => `${a.store_locations?.store_name}, ${a.store_locations?.city}`)
              .filter(Boolean);
            return true;
          });
          setAds(unique);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [filter, isAdmin]);

  // ── Ad actions ──────────────────────────────────────────────────────────────
  const handleApprove = async (ad) => {
    await supabase.from("ads").update({ status: "approved" })
      .eq("user_id", ad.user_id).eq("file_url", ad.file_url);
    setAds((prev) => prev.filter((a) => !(a.user_id === ad.user_id && a.file_url === ad.file_url)));
    fetchStats();
  };

  const handleReject = async (ad, reason = "") => {
    await supabase.from("ads").update({ status: "rejected", rejection_reason: reason })
      .eq("user_id", ad.user_id).eq("file_url", ad.file_url);
    setAds((prev) => prev.filter((a) => !(a.user_id === ad.user_id && a.file_url === ad.file_url)));
    fetchStats();
  };

  const handleDelete = async (ad) => {
    const filePath = ad.file_url.split("/object/public/ads/")[1];
    await supabase.storage.from("ads").remove([filePath]);
    await supabase.from("ads").delete().eq("user_id", ad.user_id).eq("file_url", ad.file_url);
    setAds((prev) => prev.filter((a) => !(a.user_id === ad.user_id && a.file_url === ad.file_url)));
    fetchStats();
  };

  // ── Location actions ─────────────────────────────────────────────────────────
  const handleToggleLocation = async (loc) => {
    await supabase.from("store_locations").update({ active: !loc.active }).eq("id", loc.id);
    setLocations((prev) => prev.map((l) => l.id === loc.id ? { ...l, active: !l.active } : l));
    fetchStats();
  };

  const handleAddLocation = async () => {
    if (!newLoc.store_name.trim() || !newLoc.city.trim()) {
      setLocError("Store name and city are required.");
      return;
    }
    setSavingLoc(true);
    setLocError("");
    const { data, error } = await supabase
      .from("store_locations")
      .insert({ store_name: newLoc.store_name.trim(), city: newLoc.city.trim(), active: true })
      .select()
      .single();
    setSavingLoc(false);
    if (error) { setLocError("Failed to add location."); return; }
    setLocations((prev) => [...prev, data].sort((a, b) => a.city.localeCompare(b.city)));
    setNewLoc({ store_name: "", city: "" });
    fetchStats();
  };

  const handleDeleteLocation = async (loc) => {
    await supabase.from("store_locations").delete().eq("id", loc.id);
    setLocations((prev) => prev.filter((l) => l.id !== loc.id));
    fetchStats();
  };

  // ── Copy helper ──────────────────────────────────────────────────────────────
  const copyId = (id) => navigator.clipboard.writeText(id);

  // ── Tabs ─────────────────────────────────────────────────────────────────────
  const tabs = [
    { key: "pending",   label: "Pending",   badge: stats.pending || null },
    { key: "approved",  label: "Approved",  badge: null },
    { key: "rejected",  label: "Rejected",  badge: null },
    { key: "users",     label: "Users",     badge: null },
    { key: "locations", label: "Locations", badge: null },
  ];

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-20">

      {/* Gradient top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 z-50" />

      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <div className="mb-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 mb-4">
            <span className="text-xs font-medium text-indigo-500 tracking-wide uppercase">Admin</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Admin{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500">
              Dashboard
            </span>
          </h1>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Pending review",    value: stats.pending,     color: "text-yellow-500", bg: "bg-yellow-50 border-yellow-100" },
            { label: "Active subscribers",value: stats.subscribers, color: "text-green-600",  bg: "bg-green-50 border-green-100"   },
            { label: "Ads running",       value: stats.approved,    color: "text-indigo-500", bg: "bg-indigo-50 border-indigo-100" },
            { label: "Active locations",  value: stats.locations,   color: "text-violet-500", bg: "bg-violet-50 border-violet-100" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-5 ${s.bg}`}>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                filter === tab.key
                  ? "bg-indigo-500 text-white"
                  : "bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-indigo-200"
              }`}
              style={{ boxShadow: filter === tab.key ? "0 4px 20px rgba(99,102,241,0.2)" : "none" }}
            >
              {tab.label}
              {tab.badge > 0 && (
                <span className={`ml-2 inline-flex items-center justify-center text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] ${
                  filter === tab.key ? "bg-white/20 text-white" : "bg-yellow-100 text-yellow-600"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">

          {loading && <p className="text-sm text-gray-400">Loading…</p>}

          {/* ── Ads ── */}
          {!loading && ["pending", "approved", "rejected"].includes(filter) && (
            ads.length === 0 ? (
              <p className="text-sm text-gray-400 capitalize">No {filter} ads.</p>
            ) : (
              <div className="space-y-4">
                {ads.map((ad) => (
                  <AdminAdCard
                    key={ad.id}
                    ad={ad}
                    filter={filter}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )
          )}

          {/* ── Users ── */}
          {!loading && filter === "users" && (
            users.length === 0 ? (
              <p className="text-sm text-gray-400">No users found.</p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 pb-2 border-b border-gray-100">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">User ID</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Plan</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Status</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Copy</span>
                </div>
                {users.map((user) => (
                  <div key={user.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-400 font-mono truncate">{user.id}</p>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg whitespace-nowrap">
                      {PLAN_LABELS[user.plan_id] ?? "—"}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize border whitespace-nowrap ${
                      STATUS_COLORS[user.subscription_status] ?? STATUS_COLORS.inactive
                    }`}>
                      {user.subscription_status ?? "inactive"}
                    </span>
                    <button
                      onClick={() => copyId(user.id)}
                      title="Copy user ID"
                      className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── Locations ── */}
          {!loading && filter === "locations" && (
            <div className="space-y-6">

              {/* Add new location */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Add location</p>
                <div className="flex gap-3 flex-wrap">
                  <input
                    type="text"
                    placeholder="Store name"
                    value={newLoc.store_name}
                    onChange={(e) => setNewLoc((p) => ({ ...p, store_name: e.target.value }))}
                    className="flex-1 min-w-[160px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newLoc.city}
                    onChange={(e) => setNewLoc((p) => ({ ...p, city: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && handleAddLocation()}
                    className="w-40 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100"
                  />
                  <button
                    onClick={handleAddLocation}
                    disabled={savingLoc}
                    className="rounded-xl bg-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-40 transition-all"
                    style={{ boxShadow: "0 4px 16px rgba(99,102,241,0.25)" }}
                  >
                    {savingLoc ? "Adding…" : "Add"}
                  </button>
                </div>
                {locError && <p className="text-xs text-red-400">{locError}</p>}
              </div>

              {/* Location list */}
              {locations.length === 0 ? (
                <p className="text-sm text-gray-400">No locations yet.</p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 pb-2 border-b border-gray-100">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Store</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">City</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Status</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Actions</span>
                  </div>
                  {locations.map((loc) => (
                    <div key={loc.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <p className="text-sm font-medium text-gray-700 truncate">{loc.store_name}</p>
                      <p className="text-xs text-gray-500 whitespace-nowrap">{loc.city}</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                        loc.active
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}>
                        {loc.active ? "Active" : "Inactive"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleLocation(loc)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                            loc.active
                              ? "bg-white border-gray-200 text-gray-400 hover:text-yellow-600 hover:border-yellow-200"
                              : "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {loc.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(loc)}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-red-400 hover:border-red-200 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
