const dotGrid = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

const blobClip = "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)";

const businesses = [
  {
    name: "Restaurants & Cafés",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 21H9m6 0v-3.375c0-.621-.503-1.125-1.125-1.125H10.125A1.125 1.125 0 009 17.625V21m6 0h3M9 21H6m9-9H9m3-3v9" />
      </svg>
    ),
    blurb: "Digital menu boards that boost sales, reduce printing costs, and keep your menu fresh in real time.",
  },
  {
    name: "Retail Stores",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
    blurb: "Engage shoppers with promotions, product highlights, and dynamic in-store messaging.",
  },
  {
    name: "Corporate Offices",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    blurb: "Improve internal communication with dashboards, announcements, and employee updates.",
  },
  {
    name: "Gyms & Fitness Centers",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    blurb: "Display class schedules, motivational content, and membership promotions.",
  },
  {
    name: "Schools & Universities",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    blurb: "Share campus alerts, event schedules, and student information across multiple screens.",
  },
  {
    name: "Hotels & Hospitality",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    blurb: "Welcome guests, display amenities, and promote on-site services with elegant digital displays.",
  },
];

export default function Locations() {
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

      <div className="relative mx-auto max-w-6xl px-6 sm:px-12 lg:px-20 py-32">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">Industries</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
            Businesses we
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
              support
            </span>
          </h1>
          <p className="mt-5 text-gray-400 leading-relaxed">
            Digital signage enhances communication across a wide range of industries. Here are the most common sectors using dynamic displays to improve engagement and deliver impactful messaging.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((biz) => (
            <div
              key={biz.name}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500/15 transition-all duration-300">
                {biz.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{biz.name}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{biz.blurb}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-400 mb-6">Don't see your industry? We work with businesses of all kinds.</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-all duration-200"
            style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
          >
            Get in touch
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

      </div>
    </div>
  );
}
