import Carousel from "./Carousel";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-gray-950 overflow-hidden min-h-screen flex items-center">

      {/* DOT GRID TEXTURE */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* TOP BLOB */}
      <div
        aria-hidden="true"
        className="absolute -top-64 -left-32 blur-3xl pointer-events-none"
      >
        <div
          className="w-[60rem] aspect-[1155/678] bg-gradient-to-tr from-violet-600 to-indigo-400 opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      {/* BOTTOM RIGHT BLOB */}
      <div
        aria-hidden="true"
        className="absolute -bottom-40 right-0 blur-3xl pointer-events-none"
      >
        <div
          className="w-[50rem] aspect-[1155/678] bg-gradient-to-tl from-pink-500 to-violet-500 opacity-15"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative w-full mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-20 py-24 lg:py-36 lg:flex lg:items-center lg:justify-between gap-40">

        {/* LEFT TEXT */}
        <div className="flex-1 text-center lg:text-left">

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
            </span>
            <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">Trusted by 500+ businesses</span>
          </div>

          {/* HEADLINE */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08]">
            Digital Signage
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
              for Your Business
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-md mx-auto lg:mx-0 leading-relaxed">
            Place your advertisement on screens across local businesses and reach over{" "}
            <span className="text-white font-medium">2 million visitors</span> every month.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link
              to="/pricing"
              className="relative inline-flex items-center justify-center rounded-xl bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 hover:shadow-indigo-400/40 transition-all duration-200"
            >
              Get started
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              Learn more
            </Link>
          </div>

          {/* STATS ROW */}
          <div className="mt-14 flex flex-wrap justify-center lg:justify-start gap-x-10 gap-y-4">
            {[
              { value: "2M+", label: "Monthly visitors" },
              { value: "20+", label: "Active screens" },
              { value: "10+", label: "Cities" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center lg:text-left">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5 tracking-wide uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: CAROUSEL with glow */}
        <div className="mt-16 lg:mt-0 flex-shrink-0 relative">
          {/* Glow ring behind carousel */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -m-6 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-pink-500/20 blur-2xl pointer-events-none"
          />
          <div className="relative">
            <Carousel />
          </div>
        </div>

      </div>

      {/* BOTTOM DIVIDER FADE */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />

    </section>
  );
}


          
