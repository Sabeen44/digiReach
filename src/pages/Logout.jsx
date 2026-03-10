import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150"
    >
      Log out
    </button>
  );
}