import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import digiScreen2 from "../assets/images/digiscreen2.jpg"

const dotGrid = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

const blobClip = "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)";

const plans = [
  { name: "Starter", price: "$10/mo", locations: "1 location" },
  { name: "Growth",  price: "$20/mo", locations: "Up to 5 locations" },
  { name: "Enterprise", price: "$30/mo", locations: "All locations" },
];

const onboardingSteps = [
  {
    number: "01",
    title: "Choose a plan",
    body: "Pick the plan that matches your reach. Starter gets you 1 screen location, Growth up to 5, and Enterprise covers all available locations. Monthly billing, cancel anytime.",
  },
  {
    number: "02",
    title: "Upload your ad creative",
    body: "After subscribing you'll be prompted to upload your ad. We accept PNG, JPG, and MP4 files. Keep it bold and simple — screens are viewed from a distance in busy environments.",
  },
  {
    number: "03",
    title: "Pick your screen locations",
    body: "Browse our network of partner venues — cafés, gyms, salons, and more. Select the locations that match your audience, up to your plan's limit.",
  },
  {
    number: "04",
    title: "Go live",
    body: "Your ad is reviewed before going live, typically within 1–2 business days. Once approved it starts displaying immediately. Track the status of each location from your dashboard.",
  },
];

const dashboardFeatures = [
  { label: "My Ad", desc: "Replace your creative at any time. A new upload resets your locations to pending for re-approval." },
  { label: "My Locations", desc: "See every screen your ad is running on and add locations if your plan allows." },
  { label: "Change Plan", desc: "Upgrade or downgrade instantly with prorated billing. You re-select your locations when switching." },
  { label: "Manage Billing", desc: "Update your payment method or cancel via the secure billing portal." },
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
                src={digiScreen2}
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
            { value: "20+", label: "Screens managed" },
            { value: "30 secs", label: "Uptime guaranteed" },
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
              <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">Getting started</span>
            </div>

            <h3 className="text-3xl font-bold text-white leading-tight">
              Up and running
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
                in minutes
              </span>
            </h3>

            <p className="mt-4 text-gray-400 leading-relaxed">
              Place your ad on real screens inside local businesses — cafés, gyms, salons, and more. Pick your locations, upload your creative, and go live. No hardware, no installation, no hassle.
            </p>

            {/* Plans */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {plans.map((plan) => (
                <div key={plan.name} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-center">
                  <p className="text-sm font-semibold text-white">{plan.name}</p>
                  <p className="text-xs text-indigo-400 mt-1">{plan.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{plan.locations}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Steps */}
            <h4 className="text-base font-bold text-white mb-4">How it works</h4>
            <div className="space-y-3">
              {onboardingSteps.map((step) => (
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

            {/* Divider */}
            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Dashboard features */}
            <h4 className="text-base font-bold text-white mb-4">Managing your account</h4>
            <ul className="space-y-3">
              {dashboardFeatures.map((f) => (
                <li key={f.label} className="flex items-start gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300 leading-relaxed">
                    <span className="font-semibold text-white">{f.label} — </span>{f.desc}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-3 justify-end">
              <a
                href="/pricing"
                className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-all duration-200"
                style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
              >
                View plans
              </a>
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-200"
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
