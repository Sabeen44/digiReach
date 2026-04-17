import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4242";

export function useDashboard() {
  const navigate = useNavigate();
  const { profile, sessionLoading, session, refreshProfile } = useAuth();
  const [upgrading, setUpgrading]         = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const handleUpgrade = async (selectedPlan, onSuccess) => {
    if (!selectedPlan || !profile?.stripe_customer_id) return;
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
        data.url.startsWith("http") ? (window.location.href = data.url) : navigate(data.url);
      } else if (data.success) {
        await refreshProfile();
        onSuccess?.();
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

  const loading = sessionLoading || (!!session && profile === null);

  return { profile, loading, upgrading, portalLoading, handleUpgrade, handlePortal };
}
