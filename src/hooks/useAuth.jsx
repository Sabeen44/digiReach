

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Load session + listen for changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSessionLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch subscription status
  useEffect(() => {
    if (!session) return;

    async function fetchSubscriptionStatus() {
      const { data } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", session.user.id)
        .single();

      setHasSubscription(data?.subscription_status === "active");
    }

    fetchSubscriptionStatus();
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, sessionLoading, hasSubscription }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
