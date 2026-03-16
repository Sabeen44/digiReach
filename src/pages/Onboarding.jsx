import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import UploadAdForm from "./UploadAd";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/");

      const { data } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .single();

      if (data?.subscription_status === "active") {
        setSubscribed(true);
      }

      setLoading(false);
    };

    checkSubscription();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!subscribed) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Subscription Pending</h1>
        <p>Please wait while we confirm your subscription.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-bold">Welcome! Let’s set up your first ad.</h1>

      <UploadAdForm />

      <button
        onClick={() => navigate("/dashboard")}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
