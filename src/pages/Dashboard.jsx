import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import { PLAN_LOCATION_LIMITS, PRICE_IDS } from "../config/plans";
import { supabase } from "../lib/supabaseClient";
import DashboardAccount from "../components/dashboard/DashboardAccount";
import DashboardSubscription from "../components/dashboard/DashboardSubscription";
import DashboardChangePlan from "../components/dashboard/DashboardChangePlan";
import DashboardMyLocations from "../components/dashboard/DashboardMyLocations";


const dotGrid = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

const blobClip = "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)";

export default function Dashboard() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile, loading, upgrading, portalLoading, handleUpgrade, handlePortal } = useDashboard();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [totalLocations, setTotalLocations] = useState(0);
  const [hasAds, setHasAds] = useState(true); // optimistic — hide banner until we know
  const [locationsKey, setLocationsKey] = useState(0);

  useEffect(() => {
    const fetchTotalLocations = async () => {
      const { count } = await supabase
        .from("store_locations")
        .select("*", { count: "exact", head: true })
        .eq("active", true);
      setTotalLocations(count ?? 0);
    };
    fetchTotalLocations();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    const checkAds = async () => {
      const { count } = await supabase
        .from("ads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id);
      setHasAds((count ?? 0) > 0);
    };
    checkAds();
  }, [session?.user?.id]);

if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-950 flex items-center justify-center">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={dotGrid} />
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isActive      = profile?.subscription_status === "active";
  const locationCount = profile?.location_count ?? 0;
  const locationLimit = PLAN_LOCATION_LIMITS[profile?.plan_id] ?? 0;
  const isEnterprise  = profile?.plan_id === PRICE_IDS.enterprise;

  return (
    <div className="relative min-h-screen bg-gray-950 px-6 py-32 text-white">

      {/* Dot grid */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={dotGrid} />

      {/* Top-left blob */}
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ top: "-12rem", left: "-6rem", filter: "blur(80px)" }}>
        <div className="bg-gradient-to-tr from-violet-600 to-indigo-400" style={{ width: "50rem", aspectRatio: "1155/678", opacity: 0.12, clipPath: blobClip }} />
      </div>

      {/* Bottom-right blob */}
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ bottom: "-8rem", right: 0, filter: "blur(80px)" }}>
        <div className="bg-gradient-to-tl from-pink-500 to-violet-500" style={{ width: "40rem", aspectRatio: "1155/678", opacity: 0.08, clipPath: blobClip }} />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-8">

        {/* Page header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 mb-4">
            <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">Account</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
              Dashboard
            </span>
          </h1>
        </div>

{/* Setup nudge — shown when subscribed but no ads uploaded yet */}
        {isActive && !hasAds && (
          <div className="relative rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.06] p-6 flex flex-col sm:flex-row sm:items-center gap-5 overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(99,102,241,0.12), transparent 70%)" }}
            />
            <div className="relative shrink-0 w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="relative flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Finish setting up your account</p>
              <p className="mt-0.5 text-xs text-gray-400">
                You're subscribed but haven't uploaded your first ad yet. Choose your screen locations and go live.
              </p>
            </div>
            <button
              onClick={() => navigate("/upload-ad")}
              className="relative shrink-0 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-all duration-200"
              style={{ boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}
            >
              Upload your first ad →
            </button>
          </div>
        )}

        <DashboardAccount session={session} />

        <DashboardSubscription
          profile={profile}
          isActive={isActive}
          navigate={navigate}
        />


      {isActive && (
  <DashboardMyLocations
    key={locationsKey}
    userId={session.user.id}
    locationLimit={locationLimit}
  />
)}

        {isActive && (
          <DashboardChangePlan
            profile={profile}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            upgrading={upgrading}
            portalLoading={portalLoading}
            handleUpgrade={handleUpgrade}
            handlePortal={handlePortal}
            totalLocations={totalLocations}
            onPlanChanged={() => setLocationsKey((k) => k + 1)}
          />
        )}

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