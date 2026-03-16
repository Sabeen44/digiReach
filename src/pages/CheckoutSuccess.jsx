// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabaseClient";

// export default function CheckoutSuccess() {
//   const navigate = useNavigate();
//   const [status, setStatus] = useState("Checking subscription...");

//   useEffect(() => {
//     const checkSubscription = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return navigate("/");

//       let attempts = 0;

//       const interval = setInterval(async () => {
//         attempts++;

//         const { data,error } = await supabase
//           .from("profiles")
//           .select("subscription_status")
//           .eq("id", user.id)
//           .single();
//           console.log(`Attempt ${attempts}:`, data?.subscription_status, error); // ← add this

//         if (data?.subscription_status === "active") {
//           clearInterval(interval);
//           navigate("/onboarding");
//         }

//         if (attempts > 10) {
//           clearInterval(interval);
//           setStatus("Still processing your subscription...");
//         }
//       }, 1500);
//     };

//     checkSubscription();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-semibold">{status}</h1>
//       <p>This may take a few seconds.</p>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Checking subscription...");

  useEffect(() => {
    const checkSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/");

      const sessionId = searchParams.get("session_id");
      console.log("✅ session_id from URL:", sessionId); // ← confirm it's captured

      let attempts = 0;

      const interval = setInterval(async () => {
        attempts++;

        const { data, error } = await supabase
          .from("profiles")
          .select("subscription_status")
          .eq("id", user.id)
          .single();

        console.log(`Attempt ${attempts}:`, data?.subscription_status, error);

        if (data?.subscription_status === "active") {
          clearInterval(interval);
          navigate("/onboarding");
        }

        if (attempts > 10) {
          clearInterval(interval);
          setStatus("Still processing — please contact support.");
        }
      }, 1500);

      return () => clearInterval(interval);
    };

    checkSubscription();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">{status}</h1>
      <p>This may take a few seconds.</p>
    </div>
  );
}