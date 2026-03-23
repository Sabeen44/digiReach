import { useState, useEffect, useRef, useCallback } from "react";



import apnaBazarBellevue from "../../assets/digi-locations/Apna-Bazar-Bellevue.jpg";
import apnaBazarBothell from "../../assets/digi-locations/Apna-Bazar-Bothell.jpg";
import apnaBazarSammamish from "../../assets/digi-locations/Apna-Bazar-Sammamish.jpg";
import canamPizza from "../../assets/digi-locations/CanAm-pizza.jpg";
import chaatCornerBellevue from "../../assets/digi-locations/Chaat-Corner-Bellevue.jpg";
import communityBoard from "../../assets/digi-locations/Community-Board.jpg";
import halalMeatsBothell from "../../assets/digi-locations/Halal-Meats-Bothell-1.jpg";
import intlFoodBazarBellevue from "../../assets/digi-locations/International-food-bazar-Bellevue-Redmond.jpg";
import intlFoodBazarKent from "../../assets/digi-locations/International-food-bazar-Kent-Seattle.jpg";
import shalimarGroceryFruits from "../../assets/digi-locations/Local-Advertising-Shalimar-Grocery-Redmond-Fruits-and-Vegjpg.jpg";
import mauryaGroceryIssaquah from "../../assets/digi-locations/Maurya-Grocery-Issaquah.jpg";
import mayuriBakeryScreen2 from "../../assets/digi-locations/Mayuri-Bakery-Screen-2-Redmond.jpg";
import mayuriBakery from "../../assets/digi-locations/Mayuri-Bakery.jpg";
import mayuriBothell2 from "../../assets/digi-locations/Mayuri-Bothell-2.jpg";
import mayuriGroceryRedmond2 from "../../assets/digi-locations/Mayuri-Grocery-Redmond-2.jpg";
import mayuriGroceryRedmondBellevue from "../../assets/digi-locations/Mayuri-Grocery-Redmond-Bellevue.jpg";
import mayuriPlazaOutside from "../../assets/digi-locations/Mayuri-Plaza-Outside.jpg";
import saagarGroceryKirkland from "../../assets/digi-locations/Saagar-Grocery-Kirkland.jpg";
import shalimarGroceryRedmond from "../../assets/digi-locations/Shalimar-Grocery-Store-Redmond.jpg";

const defaultScreens = [
  { src: mayuriBakery,               label: "Mayuri Bakery",                    location: "Mayuri Bakery — Redmond, WA" },
  { src: mayuriBakeryScreen2,        label: "Mayuri Bakery – Screen 2",         location: "Mayuri Bakery, Screen 2 — Redmond, WA" },
  { src: mayuriGroceryRedmondBellevue, label: "Mayuri Grocery Store",           location: "Mayuri Grocery Store — Redmond/Bellevue, WA" },
  { src: mayuriGroceryRedmond2,      label: "Mayuri Grocery – Screen 2",        location: "Mayuri Grocery Store, Screen 2 — Redmond, WA" },
  { src: mayuriBothell2,             label: "Mayuri Bothell",                   location: "Mayuri — Bothell, WA" },
  { src: mayuriPlazaOutside,         label: "Mayuri Plaza – Outdoor",           location: "Mayuri Plaza — Outdoor Sign, WA" },
  { src: apnaBazarBellevue,          label: "Apna Bazar Bellevue",              location: "Apna Bazar — Bellevue, WA" },
  { src: apnaBazarBothell,           label: "Apna Bazar Bothell",               location: "Apna Bazar — Bothell, WA" },
  { src: apnaBazarSammamish,         label: "Apna Bazar Sammamish",             location: "Apna Bazar — Sammamish, WA" },
  { src: canamPizza,                 label: "CanAm Pizza",                      location: "CanAm Pizza — Kent, WA" },
  { src: chaatCornerBellevue,        label: "Chaat Corner",                     location: "Chaat Corner — Bellevue, WA" },
  { src: communityBoard,             label: "Community Board",                  location: "Community Board — Redmond Grocery, WA" },
  { src: halalMeatsBothell,          label: "Halal Meats Bothell",              location: "Halal Meats — Bothell, WA" },
  { src: intlFoodBazarBellevue,      label: "Intl Food Bazar – Bellevue",       location: "International Food Bazar — Bellevue/Redmond, WA" },
  { src: intlFoodBazarKent,          label: "Intl Food Bazar – Kent",           location: "International Food Bazar — Kent/Seattle, WA" },
  { src: shalimarGroceryFruits,      label: "Shalimar Grocery – Produce",       location: "Shalimar Grocery — Redmond, WA" },
  { src: shalimarGroceryRedmond,     label: "Shalimar Grocery Store",           location: "Shalimar Grocery Store — Redmond, WA" },
  { src: mauryaGroceryIssaquah,      label: "Maurya Grocery",                   location: "Maurya Grocery — Issaquah, WA" },
  { src: saagarGroceryKirkland,      label: "Saagar Grocery",                   location: "Saagar Grocery — Kirkland, WA" },
];


const AUTOPLAY_INTERVAL = 3500;

// clip-path can't be expressed as a Tailwind class — kept as a style prop
const CLIP_PATH =
  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)";

export default function ScreensShowcase({ screens = defaultScreens }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const stripRef = useRef(null);
  const thumbRefs = useRef([]);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (idx) => {
      if (idx === current) return;
      setFading(true);
      setTimeout(() => {
        setCurrent(idx);
        setFading(false);
      }, 200);
    },
    [current]
  );

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % screens.length;
        setFading(true);
        setTimeout(() => setFading(false), 200);
        return next;
      });
    }, AUTOPLAY_INTERVAL);
  }, [screens.length]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const hasInteracted = useRef(false);
  
  useEffect(() => {
    if (!hasInteracted.current) return;
    const thumb = thumbRefs.current[current];
    if (thumb && stripRef.current) {
      thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [current]);

  const handleThumbClick = (idx) => {
    clearInterval(timerRef.current);
    goTo(idx);
    startTimer();
  };

  const active = screens[current];

  return (
    <section className="relative bg-gray-950 overflow-hidden py-24 lg:py-32 px-6 sm:px-12">

      {/* DOT GRID TEXTURE */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* TOP LEFT BLOB */}
      <div
        aria-hidden="true"
        className="absolute -top-64 -left-32 blur-3xl pointer-events-none"
      >
        <div
          className="w-[60rem] aspect-[1155/678] bg-gradient-to-tr from-violet-600 to-indigo-400 opacity-20"
          style={{ clipPath: CLIP_PATH }}
        />
      </div>

      {/* BOTTOM RIGHT BLOB */}
      <div
        aria-hidden="true"
        className="absolute -bottom-40 right-0 blur-3xl pointer-events-none"
      >
        <div
          className="w-[50rem] aspect-[1155/678] bg-gradient-to-tl from-pink-500 to-violet-500 opacity-15"
          style={{ clipPath: CLIP_PATH }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative w-full mx-auto max-w-screen-xl">

        {/* HEADER */}
        <div className="text-center mb-14">

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
            </span>
            <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">
              Real screens, real locations
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-4">
            Your ad in places{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
              people actually visit
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
            From bakeries to grocery stores — your brand runs on screens where
            your customers spend their day.
          </p>
        </div>

        {/* HERO IMAGE */}
        <div className="relative max-w-2xl mx-auto mb-3">

          {/* Glow ring behind image */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -m-6 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-pink-500/20 blur-2xl pointer-events-none"
          />

          <div className="relative rounded-2xl overflow-hidden border border-indigo-400/30 shadow-[0_0_60px_rgba(129,140,248,0.15),0_40px_80px_rgba(0,0,0,0.5)]">
            <img
              key={active.src}
              src={active.src}
              alt={active.label}
              className={`w-full h-72 sm:h-80 object-cover block transition-opacity duration-200 ${
                fading ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>

          {/* Image label badge */}
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 bg-gray-950/85 border border-indigo-400/40 text-indigo-200 text-[11px] font-medium tracking-widest uppercase px-4 py-1.5 rounded-full whitespace-nowrap backdrop-blur-md">
            {active.label}
          </div>
        </div>

        {/* LOCATION LABEL */}
        <p className="text-center text-sm text-gray-500 mb-5 max-w-2xl mx-auto">
          {active.location}
        </p>

        {/* THUMBNAIL STRIP */}
        <div className="relative max-w-2xl mx-auto">

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-950 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none z-10" />

          <div
            ref={stripRef}
            className="flex gap-2.5 overflow-x-auto scroll-smooth py-1 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {screens.map((screen, i) => (
              <button
                key={screen.src}
                ref={(el) => (thumbRefs.current[i] = el)}
                onClick={() => handleThumbClick(i)}
                aria-label={`View ${screen.label}`}
                className={`flex-none w-[108px] h-[68px] rounded-xl overflow-hidden border-2 transition-all duration-200 p-0 bg-transparent outline-none cursor-pointer hover:-translate-y-0.5 ${
                  i === current
                    ? "opacity-100 border-indigo-400 shadow-[0_0_14px_rgba(129,140,248,0.4)]"
                    : "opacity-50 border-transparent hover:opacity-90 hover:border-indigo-400/50"
                }`}
              >
                <img
                  src={screen.src}
                  alt={screen.label}
                  className="w-full h-full object-cover block pointer-events-none"
                />
              </button>
            ))}
          </div>
        </div>

      
        {/* <p className="text-center mt-3.5 text-xs text-gray-500 tracking-wide">
          <span className="text-indigo-400 font-semibold">{current + 1}</span>
          {" / "}
          {screens.length} locations
        </p>

        <div className="mt-14 flex flex-wrap justify-center items-center gap-y-4">
          {stats.map(({ value, label }, i) => (
            <div key={label} className="flex items-center">
              {i > 0 && <div className="w-px h-11 bg-white/[0.08]" />}
              <div className="text-center px-10">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5 tracking-wide uppercase">{label}</p>
              </div>
            </div>
          ))}
        </div> */}

      </div>

      {/* BOTTOM DIVIDER FADE */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />

    </section>
  );
}