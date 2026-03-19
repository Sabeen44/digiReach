import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4242";

export function useDashboard(session) {
  const [profile, setProfile]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [upgrading, setUpgrading]       = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // Fetch profile + subscribe to realtime updates
  useEffect(() => {
    console.log("useEffect running, session:", session);
    if (!session) return;

    const userId = session.user.id;

   async function fetchProfile() {
  const { data, error } = await supabase
    .from("profiles")
    .select("subscription_status, plan_id, stripe_customer_id")  // remove location_count here
    .eq("id", userId)
    .single();
     console.log("fetchProfile data:", data);   // ← add
  console.log("fetchProfile error:", error); // ← add

  if (!error && data) {
  const { count } = await supabase
    .from("ads")
    .select("store_location_id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "approved");

  const profileData = { ...data, location_count: count ?? 0 };
  console.log("profile loaded:", profileData); // ← add this
  console.log("profileData:", profileData);                              // ← add
  console.log("stripe_customer_id in profileData:", profileData.stripe_customer_id); // ← add
  setProfile(profileData);
}
setLoading(false);
}

    fetchProfile();

    const channel = supabase
      .channel(`profile-${userId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${userId}` },
        (payload) => setProfile(payload.new)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session]);

 const handleUpgrade = async (selectedPlan) => {
  console.log("handleUpgrade called");
  console.log("profile at time of upgrade:", profile); // ← add
  console.log("selectedPlan:", selectedPlan);
  console.log("stripe_customer_id:", profile?.stripe_customer_id);

  console.log("handleUpgrade called");                              // ← add
  console.log("selectedPlan:", selectedPlan);                       // ← add
  console.log("stripe_customer_id:", profile?.stripe_customer_id);

  if (!selectedPlan || !profile?.stripe_customer_id){

    console.log("returning early — missing selectedPlan or customerId")
    return;
  }
  

  setUpgrading(true);
  try {
    const res = await fetch(`${apiBase}/upgrade-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newPriceId: selectedPlan,
        customerId: profile.stripe_customer_id,
      }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else if (data.success) {
      window.location.href = "/dashboard";
    }
  } catch (err) {
    console.error("Upgrade error:", err);
  } finally {
    setUpgrading(false);
  }
};

  const handlePortal = async () => {
    if (!profile?.stripe_customer_id) return;
    setPortalLoading(true);
    try {
      const res = await fetch(`${apiBase}/create-portal-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: profile.stripe_customer_id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Portal error:", err);
    } finally {
      setPortalLoading(false);
    }
  };

  return { profile, loading, upgrading, portalLoading, handleUpgrade, handlePortal };
}