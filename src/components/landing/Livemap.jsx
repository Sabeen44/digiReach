import { useState } from "react";

/**
 * LiveMap
 *
 * A pure SVG map of the greater Seattle / Eastside area showing
 * all active screen locations as animated glowing dots.
 *
 * No external map library needed — drop it anywhere.
 *
 * USAGE:
 *   import LiveMap from "./LiveMap";
 *   <LiveMap />
 */

const LOCATIONS = [
  { name: "Mayuri Bakery",              city: "Redmond",   lat: 47.674, lng: -122.121, screens: 2 },
  { name: "Mayuri Grocery",             city: "Redmond",   lat: 47.670, lng: -122.118, screens: 2 },
  { name: "Mayuri Plaza – Outdoor",     city: "Redmond",   lat: 47.672, lng: -122.115, screens: 1 },
  { name: "Mayuri Bothell",             city: "Bothell",   lat: 47.762, lng: -122.205, screens: 1 },
  { name: "Apna Bazar",                 city: "Bellevue",  lat: 47.615, lng: -122.187, screens: 1 },
  { name: "Apna Bazar",                 city: "Bothell",   lat: 47.758, lng: -122.212, screens: 1 },
  { name: "Apna Bazar",                 city: "Sammamish", lat: 47.616, lng: -122.035, screens: 1 },
  { name: "CanAm Pizza",                city: "Kent",      lat: 47.380, lng: -122.235, screens: 1 },
  { name: "Chaat Corner",               city: "Bellevue",  lat: 47.610, lng: -122.190, screens: 1 },
  { name: "Community Board",            city: "Redmond",   lat: 47.668, lng: -122.124, screens: 1 },
  { name: "Halal Meats",                city: "Bothell",   lat: 47.755, lng: -122.208, screens: 1 },
  { name: "Intl Food Bazar",            city: "Bellevue",  lat: 47.618, lng: -122.184, screens: 1 },
  { name: "Intl Food Bazar",            city: "Kent",      lat: 47.384, lng: -122.230, screens: 1 },
  { name: "Shalimar Grocery",           city: "Redmond",   lat: 47.676, lng: -122.119, screens: 2 },
  { name: "Maurya Grocery",             city: "Issaquah",  lat: 47.530, lng: -122.032, screens: 1 },
  { name: "Saagar Grocery",             city: "Kirkland",  lat: 47.681, lng: -122.209, screens: 1 },
];

const W = 480;
const H = 420;

const LAT_MAX = 47.82;
const LAT_MIN = 47.33;
const LNG_MIN = -122.32;
const LNG_MAX = -121.98;

function toSVG(lat, lng) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H;
  return { x, y };
}

const LAKE_WASHINGTON = `
  M 330 60 C 345 80 348 110 342 145 C 336 180 328 210 320 240
  C 312 270 305 295 298 310 C 291 325 285 335 275 340
  C 265 345 250 342 240 335 C 230 328 222 315 218 298
  C 214 281 215 260 220 240 C 225 220 233 200 240 180
  C 247 160 254 140 258 118 C 262 96 262 75 258 58
  C 265 50 290 48 310 52 Z
`;

const LAKE_SAMMAMISH = `
  M 390 155 C 398 165 400 180 396 198 C 392 216 384 228 374 234
  C 364 240 352 238 344 228 C 336 218 334 202 338 186
  C 342 170 352 158 364 153 C 376 148 385 148 390 155 Z
`;

// Roads with label positions
const ROADS = [
  { d: "M 295 40 L 288 120 L 278 200 L 268 280 L 252 360 L 235 410", label: "I-405",  lx: 302, ly: 105, highway: true  },
  { d: "M 100 198 L 180 195 L 220 192 L 270 188 L 320 184 L 380 178", label: "SR-520", lx: 142, ly: 188, highway: false },
  { d: "M 100 282 L 180 276 L 230 272 L 280 268 L 340 262 L 400 256", label: "I-90",   lx: 142, ly: 272, highway: true  },
  { d: "M 88 40 L 84 120 L 80 200 L 76 280 L 72 360 L 68 410",        label: "I-5",    lx: 56,  ly: 155, highway: true  },
];

const CITY_LABELS = [
  { name: "Seattle",   x: 50,  y: 232 },
  { name: "Bellevue",  x: 205, y: 218 },
  { name: "Redmond",   x: 312, y: 138 },
  { name: "Kirkland",  x: 220, y: 138 },
  { name: "Bothell",   x: 238, y: 68  },
  { name: "Issaquah",  x: 370, y: 275 },
  { name: "Kent",      x: 162, y: 365 },
  { name: "Sammamish", x: 418, y: 205 },
];

export default function LiveMap() {
  const [hovered, setHovered] = useState(null);

  const handleDotClick = (i) => setHovered((prev) => (prev === i ? null : i));

  return (
    <div className="relative w-full  mx-auto select-none">

      {/* Outer glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -m-8 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-pink-500/20 blur-2xl pointer-events-none"
      />

      {/* Map card */}
      <div className="relative rounded-2xl overflow-hidden border border-indigo-400/25 shadow-[0_0_60px_rgba(129,140,248,0.15),0_40px_80px_rgba(0,0,0,0.6)] bg-[#060c1a]">

        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.07] bg-white/[0.02]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="text-[11px] text-gray-400 tracking-widest uppercase font-medium">
            Greater Seattle Area
          </span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400"></span>
            </span>
            <span className="text-[10px] text-green-400 font-semibold tracking-wide">LIVE</span>
          </div>
        </div>

        {/* SVG Map */}
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "auto" }}>
          <defs>
            {/* Strong dot glow */}
            <filter id="glow-dot" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Road glow filter */}
            <filter id="glow-road" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Grid pattern */}
            <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
            </pattern>

            {/* Lake gradient — deeper blue for clear water contrast */}
            <radialGradient id="lakeGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%"   stopColor="#0d2d5e" stopOpacity="1" />
              <stop offset="100%" stopColor="#081a3a" stopOpacity="1" />
            </radialGradient>

            {/* Highway shield bg */}
            <filter id="label-bg" x="-20%" y="-20%" width="140%" height="140%">
              <feFlood floodColor="#0d1b35" result="bg" />
              <feComposite in="bg" in2="SourceGraphic" operator="over" />
            </filter>
          </defs>

          {/* Base land fill */}
          <rect width={W} height={H} fill="#0b1628" />

          {/* Grid */}
          <rect width={W} height={H} fill="url(#grid)" />

          {/* Lake Washington — clear deep blue */}
          <path
            d={LAKE_WASHINGTON}
            fill="url(#lakeGrad)"
            stroke="rgba(96,165,250,0.35)"
            strokeWidth="1"
          />

          {/* Lake Sammamish */}
          <path
            d={LAKE_SAMMAMISH}
            fill="url(#lakeGrad)"
            stroke="rgba(96,165,250,0.35)"
            strokeWidth="1"
          />

          {/* Lake labels */}
          <text x="278" y="200" fill="rgba(147,197,253,0.55)" fontSize="7.5" textAnchor="middle" fontStyle="italic" fontFamily="ui-sans-serif, system-ui, sans-serif">
            Lake Washington
          </text>
          <text x="368" y="196" fill="rgba(147,197,253,0.5)" fontSize="6.5" textAnchor="middle" fontStyle="italic" fontFamily="ui-sans-serif, system-ui, sans-serif">
            Lake Sammamish
          </text>

          {/* Roads — brighter, with glow */}
          {ROADS.map((road) => (
            <g key={road.label}>
              {/* Glow underneath */}
              <path
                d={road.d}
                fill="none"
                stroke={road.highway ? "rgba(99,120,200,0.3)" : "rgba(99,120,180,0.2)"}
                strokeWidth={road.highway ? 4 : 3}
                strokeLinecap="round"
              />
              {/* Main road line */}
              <path
                d={road.d}
                fill="none"
                stroke={road.highway ? "rgba(148,163,220,0.65)" : "rgba(148,163,200,0.45)"}
                strokeWidth={road.highway ? 1.8 : 1.2}
                strokeLinecap="round"
                strokeDasharray={road.highway ? "none" : "6 4"}
              />
            </g>
          ))}

          {/* Road labels — small shield-style badges */}
          {ROADS.map((road) => (
            <g key={`label-${road.label}`}>
              <rect
                x={road.lx - 10}
                y={road.ly - 7}
                width={road.highway ? 22 : 28}
                height={12}
                rx={3}
                fill={road.highway ? "rgba(30,50,100,0.85)" : "rgba(30,50,90,0.75)"}
                stroke="rgba(99,120,200,0.4)"
                strokeWidth="0.6"
              />
              <text
                x={road.lx + (road.highway ? 1 : 4)}
                y={road.ly + 2}
                fill="rgba(199,210,254,0.9)"
                fontSize="6.5"
                textAnchor="middle"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="600"
                letterSpacing="0.02em"
              >
                {road.label}
              </text>
            </g>
          ))}

          {/* City labels — much more visible */}
          {CITY_LABELS.map((city) => (
            <text
              key={city.name}
              x={city.x}
              y={city.y}
              fill="rgba(203,213,225,0.6)"
              fontSize="8.5"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="600"
              letterSpacing="0.08em"
            >
              {city.name.toUpperCase()}
            </text>
          ))}

          {/* Location dots */}
          {LOCATIONS.map((loc, i) => {
            const { x, y } = toSVG(loc.lat, loc.lng);
            const isHovered = hovered === i;
            const delay = `${(i * 0.28) % 2.2}s`;

            return (
              <g
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleDotClick(i)}
                style={{ cursor: "pointer" }}
              >
                {/* Ping ring */}
                <circle
                  cx={x} cy={y}
                  r={isHovered ? 16 : 12}
                  fill="none"
                  stroke={isHovered ? "rgba(129,140,248,0.6)" : "rgba(129,140,248,0.3)"}
                  strokeWidth="1"
                  style={{
                    animation: `map-ping 2.2s ease-out ${delay} infinite`,
                    transformOrigin: `${x}px ${y}px`,
                  }}
                />

                {/* Inner ring */}
                <circle
                  cx={x} cy={y}
                  r={isHovered ? 9 : 6.5}
                  fill="none"
                  stroke={isHovered ? "rgba(129,140,248,0.8)" : "rgba(129,140,248,0.5)"}
                  strokeWidth="0.8"
                  style={{
                    animation: `map-ping 2.2s ease-out ${delay} infinite`,
                    animationDelay: `${parseFloat(delay) + 0.35}s`,
                    transformOrigin: `${x}px ${y}px`,
                  }}
                />

                {/* Core dot — larger and brighter */}
                <circle
                  cx={x} cy={y}
                  r={isHovered ? 5.5 : loc.screens > 1 ? 4.5 : 3.5}
                  fill={isHovered ? "#c7d2fe" : "#818cf8"}
                  filter="url(#glow-dot)"
                  style={{ transition: "r 0.15s ease, fill 0.15s ease" }}
                />

                {/* Multi-screen +N badge */}
                {loc.screens > 1 && (
                  <g>
                    <circle cx={x + 7} cy={y - 7} r={5.5} fill="#1e1b4b" stroke="#f472b6" strokeWidth="0.8" filter="url(#glow-dot)" />
                    <text x={x + 7} y={y - 4.5} fill="#f472b6" fontSize="5.5" textAnchor="middle" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">+{loc.screens}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip — flips to top when dot is in the lower half of the map */}
        {(() => {
          const isLower = hovered !== null && toSVG(LOCATIONS[hovered].lat, LOCATIONS[hovered].lng).y > H * 0.55;
          return (
            <div
              className={`absolute left-1/2 -translate-x-1/2 transition-all duration-150 pointer-events-none z-10 max-w-[90vw] ${
                isLower ? "top-10" : "bottom-14"
              } ${hovered !== null ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
            >
          {hovered !== null && (
            <div className="bg-gray-950/95 border border-indigo-400/40 backdrop-blur-md rounded-xl px-4 py-3 text-center whitespace-nowrap shadow-2xl">
              <p className="text-white text-sm font-semibold">{LOCATIONS[hovered].name}</p>
              <p className="text-indigo-300 text-xs mt-0.5">{LOCATIONS[hovered].city}, WA</p>
              <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-widest">
                {LOCATIONS[hovered].screens} active {LOCATIONS[hovered].screens > 1 ? "screens" : "screen"}
              </p>
            </div>
          )}
            </div>
          );
        })()}

        {/* Footer legend */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.07] bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" style={{ boxShadow: "0 0 8px rgba(129,140,248,0.9)" }} />
              <span className="text-[11px] text-gray-400">Screen location</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-400" style={{ boxShadow: "0 0 8px rgba(244,114,182,0.9)" }} />
              <span className="text-[11px] text-gray-400">Multiple screens</span>
            </div>
          </div>
          <span className="text-[11px] text-gray-500 font-medium">{LOCATIONS.length} locations</span>
        </div>
      </div>

      <style>{`
        @keyframes map-ping {
          0%   { transform: scale(1);   opacity: 0.9; }
          80%  { transform: scale(2.4); opacity: 0;   }
          100% { transform: scale(2.4); opacity: 0;   }
        }
      `}</style>
    </div>
  );
}