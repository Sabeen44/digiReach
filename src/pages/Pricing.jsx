import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PLAN_LIST } from "../config/plans";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4242";

const dotGrid = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

export default function Pricing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();

  const params = new URLSearchParams(location.search);
  const preselectedPlan = params.get("plan");

  useEffect(() => {
    if (session && preselectedPlan) {
      createCheckout(preselectedPlan);
    }
  }, [session, preselectedPlan]);

  const handleSelectPlan = (planId) => {
    if (!session) {
      navigate(`/signup?plan=${planId}`);
      return;
    }
    createCheckout(planId);
  };

  const createCheckout = async (planId) => {
    const plan = PLAN_LIST.find((p) => p.id === planId);
    if (!plan) return;

    try {
      const res = await fetch(`${apiBase}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId, userId: session.user.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className="relative bg-gray-950 min-h-screen overflow-hidden">

      {/* Dot grid */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={dotGrid} />

      {/* Top-left blob */}
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ top: "-16rem", left: "-8rem", filter: "blur(80px)" }}>
        <div
          className="bg-gradient-to-tr from-violet-600 to-indigo-400"
          style={{ width: "60rem", aspectRatio: "1155/678", opacity: 0.15, clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
        />
      </div>

      {/* Bottom-right blob */}
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ bottom: "-10rem", right: 0, filter: "blur(80px)" }}>
        <div
          className="bg-gradient-to-tl from-pink-500 to-violet-500"
          style={{ width: "50rem", aspectRatio: "1155/678", opacity: 0.1, clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 sm:px-12 lg:px-20 py-32">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">Simple pricing</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
            Plans that grow
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
              with your business
            </span>
          </h1>
          <p className="mt-5 text-lg text-gray-400 leading-relaxed">
            Monthly plans. Per-location pricing. Cancel anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLAN_LIST.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
                tier.featured
                  ? "bg-white/[0.06] border border-indigo-500/50"
                  : "bg-white/[0.02] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
              style={tier.featured ? { boxShadow: "0 0 60px rgba(99,102,241,0.15)" } : {}}
            >

              {/* Featured glow */}
              {tier.featured && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15), transparent 70%)" }}
                />
              )}

              {/* Most popular badge */}
              {tier.featured && (
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 w-fit mb-5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-400" />
                  </span>
                  <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">Most popular</span>
                </div>
              )}

              {/* Plan name & description */}
              <div className="relative">
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="relative mt-6">
                <span className="text-5xl font-bold text-white">{tier.price}</span>
                <span className="text-sm text-gray-500 ml-2">{tier.per}</span>
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-white/[0.06]" />

              {/* Features */}
              <ul className="relative space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                      tier.featured ? "bg-indigo-500/20" : "bg-white/[0.06]"
                    }`}>
                      <svg className="w-2.5 h-2.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <button
                onClick={() => handleSelectPlan(tier.id)}
                className={`relative mt-8 w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200 ${
                  tier.featured
                    ? "bg-indigo-500 text-white hover:bg-indigo-400"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20"
                }`}
                style={tier.featured ? { boxShadow: "0 4px 20px rgba(99,102,241,0.35)" } : {}}
              >
                Choose {tier.name}
              </button>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-sm text-gray-600">
          No contracts. Cancel anytime.
        </p>

      </div>
    </div>
  );
}