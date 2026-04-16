import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Spinner = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function ProtectedRoute({ children }) {
  const { session, sessionLoading } = useAuth();

  if (sessionLoading) return <Spinner />;
  if (!session) return <Navigate to="/login" replace />;

  return children;
}

export function SubscribedRoute({ children }) {
  const { session, sessionLoading, profile, hasSubscription } = useAuth();

  if (sessionLoading) return <Spinner />;
  if (!session) return <Navigate to="/login" replace />;
  // Wait for profile to load before checking subscription
  if (profile === null) return <Spinner />;
  if (!hasSubscription) return <Navigate to="/pricing" replace />;

  return children;
}
