import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import AdminAdCard from "../components/admin/AdminAdCard";
import { PLAN_LABELS } from "../config/plans";

const ADMIN_EMAIL = "admintest@example.com";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

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

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      setLoading(true);
      if (filter === "users") {
        const { data } = await supabase
          .from("profiles")
          .select("id, subscription_status, plan_id, stripe_customer_id")
          .order("id", { ascending: false });
        if (data) setUsers(data);
      } else {
        const { data } = await supabase
          .from("ads")
          .select("*, store_locations(store_name, city)")
          .eq("status", filter)
          .order("created_at", { ascending: false });
        if (data) setAds(data);
      }
      setLoading(false);
    };
    fetchData();
  }, [filter, isAdmin]);

  const handleApprove = async (id) => {
    await supabase.from("ads").update({ status: "approved" }).eq("id", id);
    setAds((prev) => prev.filter((ad) => ad.id !== id));
  };

  const handleReject = async (id, reason = "") => {
    await supabase.from("ads").update({ status: "rejected", rejection_reason: reason }).eq("id", id);
    setAds((prev) => prev.filter((ad) => ad.id !== id));
  };

  const handleDelete = async (ad) => {
    const filePath = ad.file_url.split("/object/public/ads/")[1];
    await supabase.storage.from("ads").remove([filePath]);
    await supabase.from("ads").delete().eq("id", ad.id);
    setAds((prev) => prev.filter((a) => a.id !== ad.id));
  };

  const filters = ["pending", "approved", "rejected", "users"];

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
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 mb-4">
            <span className="text-xs font-medium text-indigo-500 tracking-wide uppercase">Admin</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Admin{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500">
              Dashboard
            </span>
          </h1>
          <p className="mt-3 text-gray-400 text-sm">Manage ads and view all users.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition-all duration-200 ${
                filter === f
                  ? "bg-indigo-500 text-white"
                  : "bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-indigo-200"
              }`}
              style={{ boxShadow: filter === f ? "0 4px 20px rgba(99,102,241,0.2)" : "none" }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Content card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">

          {loading && <p className="text-sm text-gray-400">Loading…</p>}

          {/* Ads list */}
          {!loading && filter !== "users" && (
            <>
              {ads.length === 0 ? (
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
              )}
            </>
          )}

          {/* Users list */}
          {!loading && filter === "users" && (
            <>
              {users.length === 0 ? (
                <p className="text-sm text-gray-400">No users found.</p>
              ) : (
                <div className="space-y-3">
                  {/* Table header */}
                  <div className="grid grid-cols-3 px-4 pb-2 border-b border-gray-100">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">User ID</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Plan</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Status</span>
                  </div>
                  {users.map((user) => (
                    <div key={user.id} className="grid grid-cols-3 items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <p className="text-xs text-gray-400 font-mono truncate pr-4">{user.id}</p>
                      <p className="text-sm text-gray-700 font-medium">
                        {PLAN_LABELS[user.plan_id] ?? "—"}
                      </p>
                      <span className={`justify-self-start text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        user.subscription_status === "active"
                          ? "bg-green-50 text-green-500 border border-green-100"
                          : "bg-yellow-50 text-yellow-500 border border-yellow-100"
                      }`}>
                        {user.subscription_status ?? "inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}