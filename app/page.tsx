"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import SponsorsSection from "@/app/_components/SponsorsSection";
import HouseModal from "@/app/_components/HouseModal";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp(t, 0, 1);

function windowOpacity(p: number, start: number, end: number, fade = 0.045) {
  if (p <= start || p >= end) return 0;
  const fadeIn = clamp((p - start) / fade, 0, 1);
  const fadeOut = clamp((end - p) / fade, 0, 1);
  return Math.min(fadeIn, fadeOut);
}

const TRAIL_WAYPOINTS: { p: number; x: number }[] = [
  { p: 0.08, x: 50 },
  { p: 0.10, x: 53 },
  { p: 0.24, x: 45 },
  { p: 0.32, x: 60 },
  { p: 0.44, x: 41 },
  { p: 0.54, x: 59 },
  { p: 0.64, x: 44 },
  { p: 0.72, x: 58 },
  { p: 0.80, x: 44 },
  { p: 0.90, x: 56 },
  { p: 1.00, x: 50 },
];

function trailX(p: number) {
  const pts = TRAIL_WAYPOINTS;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = (p - a.p) / (b.p - a.p || 1);
      return lerp(a.x, b.x, t);
    }
  }
  return pts[pts.length - 1].x;
}

const STORYLINE = [
  "Long before the islands rose from the sea, Finn and Jake wandered the dark beneath the mountain — a single torch held high between them and a silence older than memory.",
  "Step by step, the cave gave way to carved stairs, and the stairs to open air. Somewhere far above, they were told, a world of color was waiting to be found.",
  "They climbed not knowing what they'd find — only that the light kept getting closer, and that the legend of AETERNA was about to begin.",
];

const locations = [
  { id: 1, name: "Dulcia",      x: 42, y: 36, color: "amber",  emoji: "🏜️", href: "/",            houseKey: "Dulcia"  },
  { id: 2, name: "Ignara",      x: 62, y: 36, color: "red",    emoji: "🌋", href: "/",            houseKey: "Ignara"  },
  { id: 3, name: "Avelis",      x: 42, y: 65, color: "cyan",   emoji: "🌊", href: "/",            houseKey: "Avelis"  },
  { id: 4, name: "Wygrove",     x: 62, y: 70, color: "green",  emoji: "🌿", href: "/",            houseKey: "Wygrove" },
  { id: 5, name: "Committee",   x: 15, y: 34, color: "purple", emoji: "🎪", href: "/committee",   houseKey: null },
  { id: 6, name: "About Us",    x: 85, y: 34, color: "slate",  emoji: "💻", href: "/about",       houseKey: null },
  { id: 7, name: "Leaderboard", x: 88, y: 75, color: "yellow", emoji: "🏆", href: "/leaderboard", houseKey: null },
  { id: 8, name: "Event",       x: 12, y: 65, color: "teal",   emoji: "🎉", href: "/event",       houseKey: null },
];

const HOUSE_DATA: Record<string, { name: string; gls: string[] }[]> = {
  Dulcia:  [
    { name: "OG 1", gls: ["GL Name", "GL Name"] },
    { name: "OG 2", gls: ["GL Name", "GL Name"] },
  ],
  Ignara:  [
    { name: "OG 5", gls: ["GL Name", "GL Name"] },
    { name: "OG 6", gls: ["GL Name", "GL Name"] },
  ],
  Avelis:  [
    { name: "OG 3", gls: ["GL Name", "GL Name"] },
    { name: "OG 4", gls: ["GL Name", "GL Name"] },
  ],
  Wygrove: [
    { name: "OG 7", gls: ["GL Name", "GL Name"] },
    { name: "OG 8", gls: ["GL Name", "GL Name"] },
  ],
};

type CharPos = { x: number; y: number };
const IDLE: CharPos = { x: 52, y: 52 };

const colorMap: Record<string, { btn: string; ring: string; badge: string; border: string }> = {
  amber:  { btn: "bg-amber-500/90 hover:bg-amber-400",   ring: "bg-amber-400/40",  badge: "bg-amber-100 text-amber-800",   border: "border-amber-400"  },
  red:    { btn: "bg-red-600/90 hover:bg-red-500",       ring: "bg-red-500/40",    badge: "bg-red-100 text-red-800",       border: "border-red-500"    },
  cyan:   { btn: "bg-cyan-500/90 hover:bg-cyan-400",     ring: "bg-cyan-400/40",   badge: "bg-cyan-100 text-cyan-800",     border: "border-cyan-400"   },
  green:  { btn: "bg-green-600/90 hover:bg-green-500",   ring: "bg-green-500/40",  badge: "bg-green-100 text-green-800",   border: "border-green-400"  },
  purple: { btn: "bg-purple-600/90 hover:bg-purple-500", ring: "bg-purple-500/40", badge: "bg-purple-100 text-purple-800", border: "border-purple-400" },
  slate:  { btn: "bg-slate-600/90 hover:bg-slate-500",   ring: "bg-slate-500/40",  badge: "bg-slate-100 text-slate-800",   border: "border-slate-400"  },
  yellow: { btn: "bg-yellow-500/90 hover:bg-yellow-400", ring: "bg-yellow-400/40", badge: "bg-yellow-100 text-yellow-800", border: "border-yellow-400" },
  teal:   { btn: "bg-teal-500/90 hover:bg-teal-400",     ring: "bg-teal-400/40",   badge: "bg-teal-100 text-teal-800",     border: "border-teal-400"   },
};

const SPRING = "left 0.75s cubic-bezier(0.34,1.5,0.64,1), top 0.75s cubic-bezier(0.34,1.5,0.64,1)";

export default function Home() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [finnPos, setFinnPos]       = useState<CharPos>(IDLE);
  const [jakePos, setJakePos]       = useState<CharPos>(IDLE);
  const [openHouse, setOpenHouse]   = useState<string | null>(null);

  const introRef = useRef<HTMLDivElement>(null);
  const [climbProgress, setClimbProgress] = useState(0);
  const [climbDone, setClimbDone] = useState(false);

  useEffect(() => {
    function measure() {
      const el = introRef.current;
      if (!el) return;
      const scrollable = el.offsetHeight - window.innerHeight;
      const raw = scrollable > 0 ? (window.scrollY - el.offsetTop) / scrollable : 0;
      const p = clamp(raw, 0, 1);
      setClimbProgress(p);
      if (p >= 0.999) setClimbDone(true);
    }
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (!climbDone) return;
    const el = introRef.current;
    if (!el) return;
    const floor = el.offsetTop + (el.offsetHeight - window.innerHeight);
    function holdFloor() {
      if (window.scrollY < floor) window.scrollTo({ top: floor });
    }
    window.addEventListener("scroll", holdFloor, { passive: true });
    return () => window.removeEventListener("scroll", holdFloor);
  }, [climbDone]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("map") !== "1") return;

    // Remove the param from the URL without a reload
    window.history.replaceState({}, "", "/");

    // Wait one frame for the DOM to settle, then jump to the end
    requestAnimationFrame(() => {
      const el = introRef.current;
      if (!el) return;
      const floor = el.offsetTop + (el.offsetHeight - window.innerHeight);
      window.scrollTo({ top: floor, behavior: "instant" });
      setClimbProgress(1);
      setClimbDone(true);
    });
  }, []); // runs once on mount

  function handleSelect(loc: (typeof locations)[0]) {
    setSelectedId(loc.id);
    setFinnPos({ x: loc.x + 3,   y: loc.y });
    setJakePos({ x: loc.x - 3.5, y: loc.y });
  }

  const selectedLoc = locations.find((l) => l.id === selectedId);

  // ── Derived animation values ──

  const climbersTop     = lerp(82, 16, climbProgress);
  const torchGlowSize   = lerp(260, 460, Math.min(climbProgress * 1.4, 1));
  const darknessOpacity = lerp(0.97, 0.28, clamp(climbProgress / 0.62, 0, 1));
  const skyGlowOpacity  = clamp((climbProgress - 0.55) / 0.35, 0, 1);
  const climbersLeft    = trailX(climbProgress);

  const para0 = windowOpacity(climbProgress, 0.15, 0.34, 0.05);
  const para1 = windowOpacity(climbProgress, 0.40, 0.59, 0.05);
  const para2 = windowOpacity(climbProgress, 0.65, 0.84, 0.05);
  const storylineOpacities = [para0, para1, para2];

  const storylineLayout: { side: "left" | "right"; top: number }[] = [
    { side: "right", top: lerp(82, 16, 0.245) },
    { side: "left",  top: lerp(82, 16, 0.495) },
    { side: "right", top: lerp(82, 16, 0.745) },
  ];

  const introHintOpacity = lerp(1, 0, Math.min(climbProgress / 0.08, 1));

  // ── Path pan ──
  // Reaches 4% (peak just visible) at p=0.85, then FREEZES.
  // The remaining 0.85→1.0 scroll travel is reserved entirely for
  // the cloud reveal — the mountain is stationary while clouds part.
  const pathProgress    = clamp(climbProgress / 0.85, 0, 1);
  const pathPanPercent  = lerp(100, 4, pathProgress);

  // ── Clouds pan in sync with the path, then freeze with it ──
  const cloudPanPercent = pathPanPercent;

  // Clouds start splitting the moment the path freezes (p=0.85)
  // and finish at p=1.0 — 15% of scroll dedicated to the reveal.
  const cloudSplitRaw   = clamp((climbProgress - 0.85) / 0.15, 0, 1);
  const cloudSplitEased = cloudSplitRaw < 0.5
    ? 2 * cloudSplitRaw * cloudSplitRaw
    : 1 - Math.pow(-2 * cloudSplitRaw + 2, 2) / 2;
  const cloudLeftX  = lerp(0, -110, cloudSplitEased);
  const cloudRightX = lerp(0,  110, cloudSplitEased);

  // Fade characters/torch/darkness/sky in the same window
  const climbSceneOpacity = lerp(1, 0, clamp((climbProgress - 0.85) / 0.15, 0, 1));

  // Map becomes interactive once clouds are fully gone
  const mapInteractive = cloudSplitEased >= 0.999;

  return (
    <>
    <div ref={introRef} className="relative w-full" style={{ height: "800vh", background: "#06070f" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: "#06070f" }}>

        {/*
          LAYER STACK (back → front)
          ─────────────────────────────────────────────────────
          z:1  Dark base (#06070f)  ← parent background
          z:2  Map (always present, revealed when clouds part)
          z:3  clouds_l  (pan with path, then slide left)
          z:4  clouds_r  (pan with path, then slide right)
          z:5  path.png  (front; transparent top shows clouds/map through)
          z:6  Sky glow
          z:7  Torch glow
          z:8  Darkness overlay
          z:9  Finn & Jake
          z:20 Storyline text / scroll hint
          ─────────────────────────────────────────────────────
        */}

        {/* ── z:2 — Map, permanently behind everything, revealed by parting clouds ── */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 2, background: "#e8dcc8", pointerEvents: mapInteractive ? "auto" : "none", filter: openHouse ? "blur(4px)" : "none", transition: "filter 0.2s ease" }}
        >
          {/* ═══════════════════ DESKTOP MAP ═══════════════════ */}
          <div className="hidden md:block relative h-full w-full">
            <Image src="/images/map.png" alt="World Map" fill className="object-cover" />

            {/* Title */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
              <h1 className="text-4xl font-bold tracking-widest text-white uppercase"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
                GTD XXVIII
              </h1>
              <h2 className="text-6xl font-bold tracking-widest text-white uppercase mt-1"
                style={{ fontFamily: "UncialAntiqua, serif", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
                AETERNA
              </h2>
              <p className="text-sky-200 text-sm tracking-wider mt-1">
                {selectedLoc ? `✈ Traveling to ${selectedLoc.name}…` : "Click a region to begin your adventure"}
              </p>
            </div>

            {/* Characters + location pins */}
            <div className="absolute inset-0">
              <div className="absolute z-10 pointer-events-none"
                style={{ left: `${finnPos.x}%`, top: `${finnPos.y}%`, transform: "translate(-50%, -100%)", transition: SPRING }}>
                <div className="char-float-finn">
                  <Image src="/images/Finn.png" alt="Finn" width={64} height={88} style={{ objectFit: "contain" }} />
                </div>
              </div>
              <div className="absolute z-10 pointer-events-none"
                style={{ left: `${jakePos.x}%`, top: `${jakePos.y}%`, transform: "translate(-50%, -100%)", transition: SPRING }}>
                <div className="char-float-jake">
                  <Image src="/images/Jake.png" alt="Jake" width={50} height={61} unoptimized style={{ objectFit: "contain" }} />
                </div>
              </div>

              {locations.map((loc) => {
                const c = colorMap[loc.color];
                const active = selectedId === loc.id;
                return (
                  <a key={loc.id} href={loc.houseKey ? "#" : loc.href}
                    onClick={(e) => { handleSelect(loc); if (loc.houseKey) { e.preventDefault(); setTimeout(() => setOpenHouse(loc.houseKey), 800); } }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center z-20"
                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}>
                    <span className={`absolute w-10 h-10 rounded-full ${c.ring} animate-ping ${active ? "opacity-100" : "opacity-60"}`} />
                    <span className={`relative z-10 flex items-center gap-1.5 ${c.btn} text-white border ${active ? `${c.border} ring-2 ring-white/60 scale-110` : "border-white/25"} px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm whitespace-nowrap transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl`}>
                      <span className="text-xs">{loc.emoji}</span>
                      {loc.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* ═══════════════════ MOBILE MAP ═══════════════════ */}
          <div className="md:hidden h-full w-full overflow-y-auto"
            style={{ background: "radial-gradient(ellipse at 50% 30%, #93c5fd 0%, #3b82f6 40%, #1d4ed8 100%)" }}>
            <div className="sticky top-0 z-20 text-center pt-6 pb-3 px-4"
              style={{ background: "linear-gradient(to bottom, #1d4ed8 75%, transparent)" }}>
              <h1 className="text-3xl font-bold tracking-widest text-white uppercase"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>GTD XXVIII</h1>
              <h2 className="text-5xl font-bold tracking-widest text-white uppercase mt-1"
                style={{ fontFamily: "UncialAntiqua, serif", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>AETERNA</h2>
              <p className="text-sky-200 text-xs tracking-wider mt-0.5">
                {selectedLoc ? `✈ Traveling to ${selectedLoc.name}…` : "Choose your destination"}
              </p>
            </div>
            <div className="mx-4 mt-1 mb-6 rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 0 30px 4px rgba(147,197,253,0.3), 0 8px 32px rgba(0,0,0,0.5)" }}>
              <div className="relative aspect-video">
                <Image src="/images/map.png" alt="World Map" fill className="object-cover" />
                {locations.map((loc) => {
                  const c = colorMap[loc.color];
                  const active = selectedId === loc.id;
                  return (
                    <button key={loc.id} onClick={() => handleSelect(loc)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                      style={{ left: `${loc.x}%`, top: `${loc.y}%` }}>
                      <span className={`absolute -inset-1.5 rounded-full ${c.ring} ${active ? "animate-ping opacity-100" : "opacity-0"}`} />
                      <span className={`relative block w-3 h-3 rounded-full ${c.btn} border border-white/70 transition-transform ${active ? "scale-125" : ""}`} />
                    </button>
                  );
                })}
                <div className="absolute z-10 pointer-events-none"
                  style={{ left: `${finnPos.x}%`, top: `${finnPos.y}%`, transform: "translate(-50%, -100%)", transition: SPRING }}>
                  <Image src="/images/Finn.png" alt="Finn" width={26} height={36} style={{ objectFit: "contain" }} />
                </div>
                <div className="absolute z-10 pointer-events-none"
                  style={{ left: `${jakePos.x}%`, top: `${jakePos.y}%`, transform: "translate(-50%, -100%)", transition: SPRING }}>
                  <Image src="/images/Jake.png" alt="Jake" width={22} height={28} unoptimized style={{ objectFit: "contain" }} />
                </div>
              </div>
              <div className="bg-slate-950/90 divide-y divide-white/5">
                {locations.map((loc) => {
                  const c = colorMap[loc.color];
                  const active = selectedId === loc.id;
                  return (
                    <button key={loc.id} onClick={() => { handleSelect(loc); if (loc.houseKey) setTimeout(() => setOpenHouse(loc.houseKey), 800); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition active:scale-[0.98] ${active ? "bg-white/5" : ""}`}>
                      <span className={`flex-shrink-0 w-9 h-9 rounded-lg ${c.btn} flex items-center justify-center text-base shadow`}>
                        {loc.emoji}
                      </span>
                      <span className="text-white text-sm font-medium">{loc.name}</span>
                      {active && <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />}
                      <span className="ml-auto text-white/40 text-lg">→</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── z:3 — Left cloud: pans with path, then slides off-screen left ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 3,
            transform: `translateX(${cloudLeftX}%)`,
            willChange: "transform",
          }}
        >
          <Image
            src="/images/clouds_l.png"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: `left ${cloudPanPercent}%` }}
          />
        </div>

        {/* ── z:4 — Right cloud: pans with path, then slides off-screen right ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 4,
            transform: `translateX(${cloudRightX}%)`,
            willChange: "transform",
          }}
        >
          <Image
            src="/images/clouds_r.png"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: `right ${cloudPanPercent}%` }}
          />
        </div>

        {/* ── z:5 — path.png — always visible, peak stays at 4% ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          <Image
            src="/images/path_v2.png"
            alt="A winding jungle path climbing from a campfire at its base to a glowing plateau"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: `center ${pathPanPercent}%` }}
          />
        </div>

        {/* ── z:6 — Sky glow ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 6,
            background: "radial-gradient(ellipse at 50% 8%, rgba(186,212,255,0.55) 0%, rgba(147,197,253,0.18) 35%, rgba(147,197,253,0) 65%)",
            opacity: skyGlowOpacity * climbSceneOpacity,
          }} />

        {/* ── z:7 — Torch glow ── */}
        <div className="absolute rounded-full pointer-events-none"
          style={{
            zIndex: 7,
            left: `${climbersLeft}%`,
            top: `${climbersTop}%`,
            width: torchGlowSize,
            height: torchGlowSize,
            transform: "translate(-50%, -55%)",
            background: "radial-gradient(circle, rgba(255,180,96,0.55) 0%, rgba(255,140,40,0.22) 38%, rgba(255,140,40,0) 72%)",
            filter: "blur(1px)",
            opacity: climbSceneOpacity,
          }} />

        {/* ── z:8 — Darkness overlay ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 8,
            background: `radial-gradient(circle at ${climbersLeft}% ${climbersTop}%, transparent 0%, rgba(4,6,16,0.35) 16%, rgba(2,4,12,0.95) 44%)`,
            opacity: climbSceneOpacity > 0 ? darknessOpacity * climbSceneOpacity : 0,
          }} />

        {/* ── z:9 — Finn & Jake ── */}
        <div className="absolute flex items-end gap-1.5"
          style={{
            zIndex: 9,
            left: `${climbersLeft}%`,
            top: `${climbersTop}%`,
            transform: "translate(-50%, -100%)",
            opacity: climbSceneOpacity,
          }}>
          <Image src="/images/Jake.png" alt="Jake" width={42} height={52} unoptimized style={{ objectFit: "contain" }} />
          <div className="w-[5px] h-9 rounded-full self-center"
            style={{ background: "linear-gradient(to top, #6b3f1d, #f3a44d)", boxShadow: "0 0 18px 6px rgba(255,170,80,0.55)" }} />
          <Image src="/images/Finn.png" alt="Finn" width={48} height={64} style={{ objectFit: "contain" }} />
        </div>

        {/* ── z:20 — Storyline textboxes ── */}
        {STORYLINE.map((line, i) => {
          const layout = storylineLayout[i];
          const isRight = layout.side === "right";
          return (
            <div key={i}
              className={`absolute pointer-events-none w-[72%] sm:w-[58%] md:w-[34%] ${
                isRight ? "right-[4%] md:right-[7%] text-right" : "left-[4%] md:left-[7%] text-left"
              }`}
              style={{
                zIndex: 20,
                top: `${layout.top}%`,
                opacity: storylineOpacities[i],
                transform: `translate(${isRight ? lerp(28, 0, storylineOpacities[i]) : lerp(-28, 0, storylineOpacities[i])}px, -50%)`,
              }}>
              <p className="inline-block text-amber-50/95 text-sm md:text-base leading-relaxed tracking-wide bg-black/35 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5"
                style={{ fontFamily: "UncialAntiqua, serif", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
                {line}
              </p>
            </div>
          );
        })}

        {/* ── z:20 — Scroll hint ── */}
        <div className="absolute inset-x-0 top-10 text-center pointer-events-none"
          style={{ zIndex: 20, opacity: introHintOpacity }}>
          <p className="text-white/60 text-xs md:text-sm tracking-[0.35em] uppercase">Scroll to begin the climb</p>
        </div>

        {/* ── z:20 — Skip button ── fades out once map is revealed ── */}
        <div
          className="absolute bottom-8 right-6 md:bottom-10 md:right-10"
          style={{ zIndex: 20, opacity: mapInteractive ? 0 : 1, transition: "opacity 0.4s ease", pointerEvents: mapInteractive ? "none" : "auto" }}
        >
          <button
            onClick={() => {
              const el = introRef.current;
              if (!el) return;
              const floor = el.offsetTop + (el.offsetHeight - window.innerHeight);
              window.scrollTo({ top: floor, behavior: "smooth" });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white/70 hover:text-white border border-white/20 hover:border-white/50 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-xs tracking-[0.2em] uppercase transition-all duration-200"
          >
            Skip intro
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </div>

    {openHouse && (
      <HouseModal
        houseName={openHouse}
        ogs={HOUSE_DATA[openHouse]}
        onClose={() => setOpenHouse(null)}
      />
    )}

    <SponsorsSection />
    </>
  );
}
