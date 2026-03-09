// export default function Testimonials() {
//   const testimonials = [
//     {
//       name: "Sarah M.",
//       quote:
//         "Hosting a screen brought more foot traffic and gave our customers something engaging to look at.",
//     },
//     {
//       name: "Daniel R.",
//       quote:
//         "As an advertiser, the local visibility is unbeatable. Super easy to manage too.",
//     },
//     {
//       name: "Lena K.",
//       quote:
//         "The system just works. Simple setup, great support, and real results.",
//     },
//   ];

//   return (
//     <section className="bg-gray-900 relative isolate overflow-hidden px-6 py-24 lg:px-8">
//       <div className="mx-auto max-w-3xl text-center">
//         <h2 className="text-4xl font-semibold text-white">What people say</h2>
//         <p className="mt-4 text-gray-400 text-lg">
//           Real feedback from hosts and advertisers.
//         </p>
//       </div>

//       <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//         {testimonials.map((t) => (
//           <div
//             key={t.name}
//             className="rounded-xl bg-gray-800 p-8 ring-1 ring-white/10 shadow-lg"
//           >
//             <p className="text-gray-300 italic">“{t.quote}”</p>
//             <p className="mt-4 text-indigo-400 font-semibold">{t.name}</p>
//           </div>
//         ))}
//       </div>
//       <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl" > <div className="relative left-1/2 aspect-[1155/678] w-[72rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20" style={{ clipPath: "polygon(74% 44%, 100% 62%, 97% 27%, 85% 0%, 80% 2%, 72% 32%, 60% 62%, 52% 68%, 47% 58%, 45% 34%, 27% 77%, 0% 65%, 18% 100%, 28% 77%, 76% 98%, 74% 44%)", }} /> </div> <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"> {testimonials.map((t) => ( <div key={t.name} className="rounded-xl bg-gray-800/80 p-8 ring-1 ring-white/10 shadow-lg backdrop-blur-sm" > <p className="text-gray-300 italic">“{t.quote}”</p> <p className="mt-4 text-indigo-300 font-semibold">{t.name}</p> </div> ))} </div>
//     </section>
//   );
// }
// export default function Testimonials() {
//   const testimonials = [
//     {
//       name: "Sarah M.",
//       quote:
//         "Hosting a screen brought more foot traffic and gave our customers something engaging to look at.",
//     },
//     {
//       name: "Daniel R.",
//       quote:
//         "As an advertiser, the local visibility is unbeatable. Super easy to manage too.",
//     },
//     {
//       name: "Lena K.",
//       quote:
//         "The system just works. Simple setup, great support, and real results.",
//     },
//   ];

//   return (
//     <section className="bg-gray-900 relative isolate overflow-hidden px-6 py-24 lg:px-8">
//       <div
//         aria-hidden="true"
//         className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
//       >
//         <div
//           className="relative left-1/2 aspect-[1155/678] w-[72rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
//           style={{
//             clipPath:
//               "polygon(74% 44%, 100% 62%, 97% 27%, 85% 0%, 80% 2%, 72% 32%, 60% 62%, 52% 68%, 47% 58%, 45% 34%, 27% 77%, 0% 65%, 18% 100%, 28% 77%, 76% 98%, 74% 44%)",
//           }}
//         />
//       </div>

//       <div className="mx-auto max-w-3xl text-center">
//         <h2 className="text-4xl font-semibold text-white">What people say</h2>
//         <p className="mt-4 text-gray-400 text-lg">
//           Real feedback from hosts and advertisers.
//         </p>
//       </div>

//       <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//         {testimonials.map((t) => (
//           <div
//             key={t.name}
//             className="rounded-xl bg-gray-800 p-8 ring-1 ring-white/10 shadow-lg"
//           >
//             <p className="text-gray-300 italic">"{t.quote}"</p>
//             <p className="mt-4 text-indigo-400 font-semibold">{t.name}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

const testimonials = [
  {
    name: "Sarah M.",
    role: "Café owner, Denver",
    quote:
      "We added a screen in our waiting area and foot traffic went up noticeably within a month. The setup was painless and the passive income is a bonus.",
    stars: 5,
  },
  {
    name: "Daniel R.",
    role: "Marketing lead, local retailer",
    quote:
      "The local targeting is unlike anything digital can offer. People see our ad while they're already out shopping — the conversion rate has been excellent.",
    stars: 5,
  },
  {
    name: "Lena K.",
    role: "Small business owner",
    quote:
      "Incredibly simple to set up. I uploaded my creative, chose three locations nearby, and was live the same afternoon. Real results, no headaches.",
    stars: 5,
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
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

          {/* Rating badge */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 w-fit">
            <div>
              <p className="text-3xl font-bold text-white">4.9</p>
              <p className="text-xs text-gray-500 mt-0.5">Average rating</p>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-indigo-400 text-lg">★</span>
              ))}
            </div>
          </div>
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
                <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-indigo-500/30 to-violet-500/30">
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