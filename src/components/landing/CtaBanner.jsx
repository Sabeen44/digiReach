import { Link } from "react-router-dom";

export default function CtaBanner() {
  return (
    <section className="relative bg-gray-950 py-6 px-6 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Inner CTA card */}
      <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden">

        {/* Indigo/violet gradient background — matches Hero blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-500" />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Radial highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />

        {/* Dot grid — matches Hero texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative px-10 py-16 sm:px-16 flex flex-col sm:flex-row items-center justify-between gap-8">

          {/* Text */}
          <div className="text-center sm:text-left">
            {/* Badge — matches Hero/HowItWorks badge style */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span className="text-xs font-medium text-white/80 tracking-wide uppercase">Ready to grow?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
              Your next customer<br />
              <span className="text-white/70">is already in the room.</span>
            </h2>

            <p className="mt-3 text-white/60 text-sm max-w-md leading-relaxed">
              Join hundreds of businesses reaching real, local audiences through digiReach screens.
            </p>
          </div>

          {/* Buttons — match Hero CTA pair */}
          <div className="flex flex-col gap-3 shrink-0">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-gray-950 hover:bg-white/90 transition-all duration-200 shadow-xl shadow-black/20"
            >
              View plans
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200"
            >
              Talk to us
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

