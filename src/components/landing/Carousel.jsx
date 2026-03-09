import { useState, useEffect } from "react";

import screen1 from "../../assets/images/digiscreen1.jpg";
import screen2 from "../../assets/images/digiscreen4.avif";
import screen3 from "../../assets/images/digiscreen2.jpg";

export default function Carousel({
  images = [screen1, screen2, screen3],
  autoSlide = true,
  autoSlideInterval = 4000,
}) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(next, autoSlideInterval);
    return () => clearInterval(interval);
  }, [current, autoSlide, autoSlideInterval]);

  return (
    <div className="relative">

      {/* Glow behind carousel — matches Hero */}
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-3xl pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15), rgba(236,72,153,0.2))",
          filter: "blur(32px)",
        }}
      />

      {/* Carousel frame */}
      <div className="relative w-[36rem] max-w-full overflow-hidden rounded-2xl shadow-2xl"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >

        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt=""
              className="w-full flex-shrink-0 object-cover h-80"
            />
          ))}
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent pointer-events-none" />

        {/* Left arrow */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/15 hover:border-white/20 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/15 hover:border-white/20 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                current === idx
                  ? "w-6 bg-indigo-400"
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}