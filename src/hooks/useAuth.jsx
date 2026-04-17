import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession]               = useState(undefined);
  const [profile, setProfile]               = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const activeUserIdRef                     = useRef(null);

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("subscription_status, plan_id, stripe_customer_id")
      .eq("id", userId)
      .single();

    // Bail if the user logged out (or a different user logged in) while we were fetching
    if (activeUserIdRef.current !== userId || !data) return;

    const { count } = await supabase
      .from("ads")
      .select("store_location_id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "approved");

    if (activeUserIdRef.current !== userId) return;

    setProfile({ ...data, location_count: count ?? 0 });
  }, []);

  useEffect(() => {
    // Resolve session immediately — don't block on profile
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      activeUserIdRef.current = s?.user.id ?? null;
      setSession(s);
      setSessionLoading(false);
      if (s) fetchProfile(s.user.id);
    });

    // Subsequent auth changes (login / logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      activeUserIdRef.current = s?.user.id ?? null;
      setSession(s);
      if (!s) {
        setProfile(null);
      } else {
        fetchProfile(s.user.id);
      }
    });

    // Realtime profile updates (plan change, subscription status, etc.)
    const channel = supabase
      .channel("auth-profile")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          // Only refresh if it belongs to the current user
          supabase.auth.getSession().then(({ data }) => {
            if (data.session?.user.id === payload.new.id) {
              fetchProfile(payload.new.id);
            }
          });
        }
      )
      .subscribe();

    return () => {
      listener.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [fetchProfile]);

  const hasSubscription = profile?.subscription_status === "active";

  const refreshProfile = useCallback(() => {
    if (activeUserIdRef.current) return fetchProfile(activeUserIdRef.current);
  }, [fetchProfile]);

  return (
    <AuthContext.Provider value={{ session, sessionLoading, profile, hasSubscription, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
