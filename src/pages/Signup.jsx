import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";


export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams(); 
  const plan = params.get("plan"); 
  const navigate = useNavigate();
  
  console.log("Selected plan:", plan);


  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return; setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {setError(error.message)
      return;
    };
  if (plan) { navigate(`/pricing?plan=${plan}`); } else { navigate("/pricing"); }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-white mb-6">Create your digiReach account</h2>

        {plan && (
  <div className="mb-4 rounded-md bg-gray-800 border border-gray-700 p-3">
    <p className="text-sm text-gray-300">
      You’re signing up for the{" "}
      <span className="font-semibold text-indigo-400">{plan}</span> plan.
    </p>
  </div>
)}


        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="w-full bg-gray-700 text-white p-3 rounded-md placeholder:text-gray-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="w-full bg-gray-700 text-white p-3 rounded-md placeholder:text-gray-400"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md font-semibold"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
