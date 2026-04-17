import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import LiveMap from "../components/landing/LiveMap";

const dotGrid = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

const blobClip = "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)";

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data } = await supabase
        .from("store_locations")
        .select("id, store_name, city")
        .eq("active", true)
        .order("city", { ascending: true });
      setLocations(data ?? []);
      setLoading(false);
    };
    fetchLocations();
  }, []);

  // Group by city
  const byCity = locations.reduce((acc, loc) => {
    if (!acc[loc.city]) acc[loc.city] = [];
    acc[loc.city].push(loc);
    return acc;
  }, {});

  const cities    = Object.keys(byCity).sort();
  const totalScreens = locations.length;

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden">

      {/* Dot grid */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={dotGrid} />

      {/* Top-left blob */}
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ top: "-12rem", left: "-6rem", filter: "blur(80px)" }}>
        <div className="bg-gradient-to-tr from-violet-600 to-indigo-400" style={{ width: "50rem", aspectRatio: "1155/678", opacity: 0.15, clipPath: blobClip }} />
      </div>

      {/* Bottom-right blob */}
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ bottom: "-8rem", right: 0, filter: "blur(80px)" }}>
        <div className="bg-gradient-to-tl from-pink-500 to-violet-500" style={{ width: "40rem", aspectRatio: "1155/678", opacity: 0.1, clipPath: blobClip }} />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 sm:px-12 lg:px-20 py-32 space-y-20">

        {/* Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
            </span>
            <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">Live network</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
            Our screen
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
              locations
            </span>
          </h1>

          <p className="mt-5 text-gray-400 leading-relaxed max-w-lg">
            Screens installed inside real local businesses — cafés, grocery stores, restaurants, and more. Your ad displayed where your audience already spends time.
          </p>

          {/* Stats */}
          {!loading && (
            <div className="mt-8 flex flex-wrap gap-6">
              <div>
                <p className="text-2xl font-bold text-white">{totalScreens}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Active locations</p>
              </div>
              <div className="w-px bg-white/10 self-stretch" />
              <div>
                <p className="text-2xl font-bold text-white">{cities.length}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Cities</p>
              </div>
              <div className="w-px bg-white/10 self-stretch" />
              <div>
                <p className="text-2xl font-bold text-white">Greater Seattle</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Coverage area</p>
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="w-full">
          <LiveMap />
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Location list */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-8">All locations</h2>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && (
            <div className="space-y-10">
              {cities.map((city) => (
                <div key={city}>
                  {/* City heading */}
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-white">{city}</span>
                    <span className="text-xs text-gray-600">{byCity[city].length} {byCity[city].length === 1 ? "location" : "locations"}</span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>

                  {/* Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {byCity[city].map((loc) => (
                      <div
                        key={loc.id}
                        className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-200 group"
                      >
                        <div className="shrink-0 w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/15 transition-colors">
                          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{loc.store_name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                            </span>
                            <p className="text-xs text-gray-500">Active</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-400 mb-6">Want your ad on these screens?</p>
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-all duration-200"
            style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
          >
            View plans
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

      </div>
    </div>
  );
}
