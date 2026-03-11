// import { Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabaseClient";

// export default function ProtectedRoute({ children }) {
//   const [session, setSession] = useState(undefined); // undefined = still loading

//   // Log session changes
//   useEffect(() => {
//     console.log("SESSION:", session);
//   }, [session]);

//   // Load session + listen for changes
//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => {
//       setSession(data.session);
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => setSession(session)
//     );

//     return () => listener.subscription.unsubscribe();
//   }, []);

//   // Still loading
//   if (session === undefined) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   // Not logged in → redirect to login
//   if (!session) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { session, sessionLoading } = useAuth();

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
