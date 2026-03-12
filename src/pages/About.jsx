import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";

const dotGrid = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

const blobClip = "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)";

const benefits = [
  "Create and send updates to any screen from any computer at any time.",
  "Full control over what you display — images, videos, tickers, news, weather, websites, slideshows, YouTube, social feeds, and more.",
  "Eliminate printing costs for static signage.",
  "Dynamic content grabs attention far more effectively than static posters.",
  "Low cost to get started — all you need is a TV, media player, and signage software.",
];

const steps = [
  {
    number: "01",
    title: "A Plan",
    body: "Before purchasing anything, outline your goals, screen locations, and the type of software you'll use.",
  },
  {
    number: "02",
    title: "Digital Signage Software (CMS)",
    body: "This is what you use to create and manage your content. Cloud-based CMS lets you update screens remotely; on-premise requires local access but doesn't rely on the internet.",
  },
  {
    number: "03",
    title: "Digital Signage Hardware",
    body: "You'll need a display, mounting bracket, and a digital signage player.",
  },
  {
    number: "04",
    title: "Content",
    body: "Content is king — slideshows, videos, weather, tickers, news feeds, and more. Many companies offer templates or design services to get you started.",
  },
];

export default function About() {
  const [open, setOpen] = useState(false);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 mb-6">
              <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">About</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
              Digital signage,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
                reimagined
              </span>
            </h1>

            <p className="mt-6 text-gray-400 leading-relaxed">
              Digital signage refers to the use of electronic displays to communicate
              visual information dynamically. Unlike traditional signage made from
              tin, wood, or paper, digital signage allows content to be updated,
              scheduled, and adapted in real time.
            </p>

            <p className="mt-4 text-gray-400 leading-relaxed">
              With digital signage, you can communicate more effectively with your
              target audience — whether employees, customers, or visitors — using
              dynamic, eye-catching content.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <button
                onClick={() => setOpen(true)}
                className="rounded-xl bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-all duration-200"
                style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
              >
                Learn more
              </button>
              <a
                href="/contact"
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              >
                Get in touch
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581091012184-5c8af7a4c3f9?q=80&w=1200"
                alt="Digital signage display"
                className="object-cover w-full h-full"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 blur-3xl"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="my-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "10k+", label: "Screens managed" },
            { value: "98%", label: "Uptime guaranteed" },
            { value: "3 plans", label: "Flexible pricing" },
            { value: "24h", label: "Support response" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-center">
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center p-6">
          <DialogPanel className="max-w-3xl w-full rounded-2xl border border-white/[0.08] bg-gray-950 p-8 shadow-2xl overflow-y-auto max-h-[85vh]" style={dotGrid}>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-6">
              <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">Key benefits</span>
            </div>

            <h3 className="text-3xl font-bold text-white leading-tight">
              Why digital signage
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
                works
              </span>
            </h3>

            <p className="mt-4 text-gray-400 leading-relaxed">
              Simply put, no one <em>needs</em> digital signage to run their business — but it dramatically improves how you communicate with your audience.
            </p>

            <ul className="mt-6 space-y-3">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300 leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <h4 className="text-xl font-bold text-white mb-6">What you need to get started</h4>

            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-400">{step.number}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="mt-1 text-sm text-gray-400 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-all duration-200"
                style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
