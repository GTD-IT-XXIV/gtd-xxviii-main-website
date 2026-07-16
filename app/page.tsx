"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import SponsorsSection from "@/app/_components/SponsorsSection";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp(t, 0, 1);

function windowOpacity(p: number, start: number, end: number, fade = 0.045) {
  if (p <= start || p >= end) return 0;
  const fadeIn = clamp((p - start) / fade, 0, 1);
  const fadeOut = clamp((end - p) / fade, 0, 1);
  return Math.min(fadeIn, fadeOut);
}

const TRAIL_WAYPOINTS: { p: number; x: number }[] = [
  { p: 0.00, x: 50 },
  { p: 0.05, x: 38 },
  { p: 0.17, x: 58 },
  { p: 0.28, x: 40 },
  { p: 0.37, x: 61 },
  { p: 0.46, x: 47 },
  { p: 0.53, x: 61 },
  { p: 0.58, x: 46 },
  { p: 0.60, x: 53 },
  { p: 0.62, x: 48 },
  { p: 0.63, x: 50 },
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
  { id: 1, name: "Dulcia",      x: 42, y: 36, color: "amber",  emoji: "🏜️", href: "/" },
  { id: 2, name: "Ignara",      x: 62, y: 36, color: "red",    emoji: "🌋", href: "/" },
  { id: 3, name: "Avelis",      x: 42, y: 65, color: "cyan",   emoji: "🌊", href: "/" },
  { id: 4, name: "Wygrove",     x: 62, y: 70, color: "green",  emoji: "🌿", href: "/" },
  { id: 5, name: "Committee",   x: 15, y: 34, color: "purple", emoji: "🎪", href: "/committee" },
  { id: 6, name: "About Us",    x: 85, y: 34, color: "slate",  emoji: "💻", href: "/about" },
  { id: 7, name: "Leaderboard", x: 88, y: 75, color: "yellow", emoji: "🏆", href: "/leaderboard" },
  { id: 8, name: "Event",       x: 12, y: 65, color: "teal",   emoji: "🎉", href: "/event" },
];

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

// ── Walk cycle: frame_0 … frame_13 of Finn carrying Jake ──
const WALK_FRAMES = 14;   // number of frames in public/images/finn_walk/
const WALK_CYCLES = 20;   // full step-cycles across the whole climb (stride cadence)

// ── Idle (breathing) loop played when the user stops scrolling ──
const IDLE_FRAMES = 12;   // number of frames in public/images/finn_idle/
const IDLE_FPS    = 8;    // idle playback speed (frames per second)
const IDLE_DELAY  = 150;  // ms of no-scroll before switching walk → idle

// ── Jump (leap off the cliff) and Land (touchdown at map centre) ──
const JUMP_FRAMES = 10;   // number of frames in public/images/finn_jump/
const LAND_FRAMES = 11;   // number of frames in public/images/finn_land/

export default function Home() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [finnPos, setFinnPos]       = useState<CharPos>(IDLE);
  const [jakePos, setJakePos]       = useState<CharPos>(IDLE);

  const introRef = useRef<HTMLDivElement>(null);
  const [climbProgress, setClimbProgress] = useState(0);
  const [climbDone, setClimbDone] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [idleFrame, setIdleFrame] = useState(0);

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;
    function measure() {
      const el = introRef.current;
      if (!el) return;
      const scrollable = el.offsetHeight - window.innerHeight;
      const raw = scrollable > 0 ? (window.scrollY - el.offsetTop) / scrollable : 0;
      const p = clamp(raw, 0, 1);
      setClimbProgress(p);
      if (p >= 0.999) setClimbDone(true);
    }
    function onScroll() {
      measure();
      // Mark as actively scrolling → play walk; flip to idle after a short pause.
      setIsScrolling(true);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsScrolling(false), IDLE_DELAY);
    }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("scroll", onScroll);
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

  // Preload every sprite set so switching never flashes an unloaded frame
  useEffect(() => {
    const sets: [string, number][] = [
      ["finn_walk", WALK_FRAMES],
      ["finn_idle", IDLE_FRAMES],
      ["finn_jump", JUMP_FRAMES],
      ["finn_land", LAND_FRAMES],
    ];
    for (const [dir, n] of sets) {
      for (let i = 0; i < n; i++) {
        const img = new window.Image();
        img.src = `/images/${dir}/frame_${i}.png`;
      }
    }
  }, []);

  // Idle breathing loop: advance the idle frame on a timer while the user isn't
  // actively scrolling. Shown during the walk phase and after landing on the map.
  useEffect(() => {
    if (isScrolling) return;
    const id = setInterval(
      () => setIdleFrame((f) => (f + 1) % IDLE_FRAMES),
      1000 / IDLE_FPS,
    );
    return () => clearInterval(id);
  }, [isScrolling]);

  function handleSelect(loc: (typeof locations)[0]) {
    setSelectedId(loc.id);
    setFinnPos({ x: loc.x + 3,   y: loc.y });
    setJakePos({ x: loc.x - 3.5, y: loc.y });
  }
  
  const selectedLoc = locations.find((l) => l.id === selectedId);

  // ── Derived animation values ──

  // ── Phase timeline (all forward scroll) ──
  //   0        → WALK_END   walk up the path onto the cliff plateau
  //   WALK_END → FALL_END   jump off the cliff and fall toward the map centre
  //                         under gravity; the clouds part around p=0.85 so the
  //                         drop lands them onto the revealed map
  //   FALL_END → 1.0        land (crouch) at map centre; sprite stays put
  const WALK_END    = 0.63;   // finish climbing, launch off the cliff
  const FALL_END    = 0.97;   // reach map centre (clouds essentially open by now)
  const cliffTop    = 40;     // how high they climb before jumping (% from top)
  const MAP_CENTER  = { x: 51, y: 55 };   // where the sprite lands on the map (a touch left + lower than dead centre)

  const walking = climbProgress < WALK_END;
  const landing = climbProgress >= FALL_END;              // crouch/settle at centre
  const jumping = !walking && !landing;                   // airborne (hang + fall)

  const torchGlowSize   = lerp(260, 460, Math.min(climbProgress * 1.4, 1));
  const darknessOpacity = lerp(0.97, 0.28, clamp(climbProgress / 0.62, 0, 1));
  const skyGlowOpacity  = clamp((climbProgress - 0.55) / 0.35, 0, 1);

  // ── Character position ──
  // Walk up to cliffTop, then fall to map centre across the whole airborne
  // window. The gravity curve (flightRaw²) means they start drifting down/right
  // the instant they leave the cliff and accelerate — no dead hang — but most of
  // the drop still lands during the cloud-part window onto the revealed map.
  const spawnTop  = 88;   // starting height at p=0 (higher % = spawns lower on screen)
  const walkTop   = lerp(spawnTop, cliffTop, clamp(climbProgress / WALK_END, 0, 1));
  const flightRaw = clamp((climbProgress - WALK_END) / (FALL_END - WALK_END), 0, 1);
  const flightEased = flightRaw * flightRaw;   // gravity: slow at first, then accelerating
  // Once the climb is finished and a region is picked, the landed sprite travels
  // to that region's pin (centred on it).
  const travelTarget = climbDone ? locations.find((l) => l.id === selectedId) : undefined;
  const climbersTop  = travelTarget ? travelTarget.y
    : walking ? walkTop
    : lerp(cliffTop, MAP_CENTER.y, flightEased);
  const climbersLeft = travelTarget ? travelTarget.x
    : walking ? trailX(climbProgress)
    : lerp(trailX(WALK_END), MAP_CENTER.x, flightEased);
  const traveled = travelTarget !== undefined;

  // ── Which sprite + frame to show ──
  // walk: scroll-driven step cycle (or idle breathing when stopped)
  // jump: play jump frames across the airborne window (leap → hang → fall)
  // land: play land frames across the landing window, holding the final standing frame
  const walkFrame = Math.floor(climbProgress * WALK_FRAMES * WALK_CYCLES) % WALK_FRAMES;
  const showIdle  = walking && !isScrolling;
  const jumpFrame = Math.min(
    JUMP_FRAMES - 1,
    Math.floor(clamp((climbProgress - WALK_END) / (FALL_END - WALK_END), 0, 1) * JUMP_FRAMES),
  );
  const landFrame = Math.min(
    LAND_FRAMES - 1,
    Math.floor(clamp((climbProgress - FALL_END) / (1 - FALL_END), 0, 1) * LAND_FRAMES),
  );

  let spriteDir: string, spriteFrame: number;
  if (climbDone)    { spriteDir = "finn_idle"; spriteFrame = idleFrame; }   // landed — breathe at map centre
  else if (landing) { spriteDir = "finn_land"; spriteFrame = landFrame; }
  else if (jumping) { spriteDir = "finn_jump"; spriteFrame = jumpFrame; }
  else if (showIdle){ spriteDir = "finn_idle"; spriteFrame = idleFrame; }
  else              { spriteDir = "finn_walk"; spriteFrame = walkFrame; }

  // Face the direction they're weaving up the path; keep that facing through the jump.
  const facingRight = walking
    ? trailX(climbProgress) >= trailX(Math.max(0, climbProgress - 0.005))
    : trailX(WALK_END) >= trailX(WALK_END - 0.005);

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
  const pathPanPercent  = lerp(100, 0, pathProgress) - 10;

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
  const cloudFadeEased = clamp((cloudSplitRaw - 0.15) / 0.85, 0, 1); // starts fading a bit later than the split
  const cloudOpacity   = lerp(1, 0, cloudFadeEased);

  // Fade the climb backdrop (torch/darkness/sky) as the clouds part…
  const climbSceneOpacity = lerp(1, 0, clamp((climbProgress - 0.85) / 0.15, 0, 1));
  // …but the CHARACTER stays fully visible — it jumps off the cliff and lands on
  // the map, so it must survive the reveal and remain at map centre.
  const charOpacity = 1;

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
          style={{ zIndex: 2, background: "#e8dcc8", pointerEvents: mapInteractive ? "auto" : "none" }}
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
                style={{ fontFamily: "AdventureTime, UncialAntiqua, serif", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
                AETERNA
              </h2>
              <p className="text-sky-200 text-sm tracking-wider mt-1">
                {selectedLoc ? `✈ Traveling to ${selectedLoc.name}…` : "Click a region to begin your adventure"}
              </p>
            </div>

            {/* Location pins (the character itself is the shared z:10 sprite
                that jumped onto the map — see below) */}
            <div className="absolute inset-0">
              {locations.map((loc) => {
                const c = colorMap[loc.color];
                const active = selectedId === loc.id;
                return (
                  <a key={loc.id} href={loc.href} onClick={() => handleSelect(loc)}
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
                style={{ fontFamily: "AdventureTime, UncialAntiqua, serif", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>AETERNA</h2>
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
                  style={{
                    left: `${climbersLeft}%`,
                    top: `${climbersTop}%`,
                    transform: `translate(-50%, -100%) scaleX(${facingRight ? 1 : -1})`,
                    opacity: charOpacity,
                    transition: traveled ? "left 0.75s cubic-bezier(0.34,1.5,0.64,1), top 0.75s cubic-bezier(0.34,1.5,0.64,1)"
                      : landing ? "left 0.2s linear, top 0.2s linear" : undefined,
                  }}>
                  <Image
                    src={`/images/${spriteDir}/frame_${spriteFrame}.png`}
                    alt="Finn and Jake"
                    width={44}
                    height={48}
                    unoptimized
                    priority
                    style={{ objectFit: "contain", imageRendering: "pixelated" }}
                  />
                </div>
              </div>
              <div className="bg-slate-950/90 divide-y divide-white/5">
                {locations.map((loc) => {
                  const c = colorMap[loc.color];
                  const active = selectedId === loc.id;
                  return (
                    <button key={loc.id} onClick={() => handleSelect(loc)}
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
            opacity: cloudOpacity,
            willChange: "transform, opacity",
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

        {/* ── z:4 — Right cloud: pans with path, then slides + fades off-screen right ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 4,
            transform: `translateX(${cloudRightX}%)`,
            opacity: cloudOpacity,
            willChange: "transform, opacity",
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
        <div className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 5, opacity: climbSceneOpacity }}>
          <div className="absolute inset-y-0 -left-1/2 -right-1/2 md:left-0 md:right-0">
            <Image
              src="/images/path_v2.png"
              alt="A winding jungle path climbing from a campfire at its base to a glowing plateau"
              fill
              priority
              className="object-cover"
              style={{ objectPosition: `center ${pathPanPercent}%` }}
            />
          </div>
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

        {/* ── z:10 — Finn carrying Jake — walks up, jumps off the cliff, lands on
             the map. Stays fully visible through the reveal (charOpacity), and
             sits above the map (z:10 > map z:2) once landed. Desktop cinematic
             only — mobile uses its own map card with location markers. ── */}
        <div className="absolute pointer-events-none"
          style={{
            zIndex: 10,
            left: `${climbersLeft}%`,
            top: `${climbersTop}%`,
            transform: `translate(-50%, -100%) scaleX(${facingRight ? 1 : -1})`,
            opacity: charOpacity,
            transition: traveled ? "left 0.75s cubic-bezier(0.34,1.5,0.64,1), top 0.75s cubic-bezier(0.34,1.5,0.64,1)"
              : landing ? "left 0.2s linear, top 0.2s linear" : undefined,
          }}>
          <Image
            src={`/images/${spriteDir}/frame_${spriteFrame}.png`}
            alt="Finn and Jake climbing"
            width={64}
            height={70}
            unoptimized
            priority
            style={{ objectFit: "contain", imageRendering: "pixelated" }}
          />
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
                style={{ fontFamily: "AdventureTime, UncialAntiqua, serif", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
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
    <SponsorsSection />
    </>
  );
}
