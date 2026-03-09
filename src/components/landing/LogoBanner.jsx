// import { useEffect, useRef } from "react";

  const logos = [
    { name: "Mayuri" },
    { name: "Shalimar" },
    { name: "Apna Bazaar" },
    { name: "Maurya" },
    { name: "Someplace" },
    { name: "Anotherplace" },
    { name: "place" },
    { name: "placebar" }, 
  ];



export default function LogoBanner() {
  return (
    <section className="relative bg-gray-950 py-14 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <p className="text-center text-md font-medium text-gray-600 tracking-[0.25em] uppercase mb-10">
        Hosting locations across your region
      </p>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div
          className="flex gap-12 w-max"
          style={{ animation: "marquee 28s linear infinite" }}
        >
          {[...logos, ...logos].map((logo, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/[0.08] bg-white/[0.02] hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300 cursor-default whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400/60 shrink-0" />
              <span className="text-lg font-medium text-gray-400 hover:text-white transition-colors">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
