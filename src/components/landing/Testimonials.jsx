const testimonials = [
  {
    name: "Sarah M.",
    role: "Dentist",
    quote:
      "We placed an ad on the digital screen and got noticably more calls. The setup was painless.",
    stars: 5,
    avatarFrom: "from-pink-500/40",
    avatarTo: "to-rose-500/20",
  },
  {
    name: "Daniel R.",
    role: "Realtor",
    quote:
      "The local targeting is unlike anything digital can offer. People see our ad while they're already out shopping — the conversion rate has been excellent.",
    stars: 5,
    avatarFrom: "from-indigo-500/40",
    avatarTo: "to-violet-500/20",
  },
  {
    name: "Lena K.",
    role: "Small business owner",
    quote:
      "Incredibly simple to set up. I uploaded my creative, chose three locations nearby, and was live the same afternoon. Real results, no headaches.",
    stars: 5,
    avatarFrom: "from-violet-500/40",
    avatarTo: "to-indigo-500/20",
  },
];

const dotGrid = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

export default function Testimonials() {
  return (
    <section className="relative bg-gray-950 py-28 overflow-hidden">

      {/* Dot grid texture */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={dotGrid} />

      {/* Top divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Bottom-right glow */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 pointer-events-none rounded-full"
        style={{ width: 500, height: 400, background: "rgba(99,102,241,0.07)", filter: "blur(100px)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">

        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">Testimonials</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
            Trusted by hosts
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
              and advertisers alike.
            </span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group flex flex-col justify-between p-7 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(t.stars)].map((_, si) => (
                    <span key={si} className="text-indigo-400 text-sm">★</span>
                  ))}
                </div>
                {/* Quote */}
                <p className="text-gray-300 leading-relaxed text-sm">"{t.quote}"</p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/[0.08]">
                <div className={`w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${t.avatarFrom} ${t.avatarTo}`}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
