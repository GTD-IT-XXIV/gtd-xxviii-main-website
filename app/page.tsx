"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
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
  { p: 0.02, x: 45 },
  { p: 0.11, x: 58 },
  { p: 0.21, x: 40 },
  { p: 0.29, x: 61 },
  { p: 0.38, x: 47 },
  { p: 0.44, x: 61 },
  { p: 0.50, x: 50 },
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
  "Long ago, the Land of Ooo was divided into four thriving kingdoms, each sustained by a unique source of life. Water nourished the people of Avelis, fire gave strength to Ignara, the forests of Wygrove provided abundance, and the floating kingdom of Dulcia flourished through the sweetness of its precious resources. For generations, the kingdoms prospered in harmony—until their life sources began to fade.",
  "With their futures at stake, each kingdom sends a group of brave adventurers on a journey to the legendary Dreamland, the only place believed to hold the power to restore what has been lost. United by a common purpose yet shaped by different cultures, strengths, and traditions, these groups must venture beyond the safety of their homes into an uncertain world.",
  "As the journey unfolds, resources grow scarce, their means of travel comes to a halt, and desperation begins to test the trust between the kingdoms. Faced with impossible choices, they soon realize that survival is not about protecting the interests of a single kingdom, but about recognizing that every kingdom's strength is interconnected. Only by working together can they overcome the challenges ahead, reach Dreamland, and restore balance to the Land of Ooo.",
];

const locations = [
  { id: 1, name: "Dulcia",      x: 42, y: 42, color: "amber",  emoji: "🏜️", href: "/" },
  { id: 2, name: "Ignara",      x: 62, y: 42, color: "red",    emoji: "🌋", href: "/" },
  { id: 3, name: "Avelis",      x: 44, y: 78, color: "cyan",   emoji: "🌊", href: "/" },
  { id: 4, name: "Wygrove",     x: 59, y: 78, color: "green",  emoji: "🌿", href: "/" },
  { id: 5, name: "Committee",   x: 22, y: 38, color: "purple", emoji: "🎪", href: "/committee" },
  { id: 6, name: "About Us",    x: 83, y: 40, color: "slate",  emoji: "💻", href: "/about" },
  { id: 7, name: "Leaderboard", x: 85, y: 80, color: "yellow", emoji: "🏆", href: "/leaderboard" },
  { id: 8, name: "Events",      x: 20, y: 72, color: "teal",   emoji: "🎉", href: "/event" },
];

type CharPos = { x: number; y: number };
const IDLE: CharPos = { x: 52, y: 52 };
// Where the sprite lands on the map (a touch left + lower than dead centre).
// Also the launch point for the first umbrella flight.
const MAP_CENTER: CharPos = { x: 51, y: 55 };

const colorMap: Record<string, { btn: string; ring: string; badge: string; border: string }> = {
  amber:  { btn: "bg-amber-600/80 hover:bg-amber-500",   ring: "bg-amber-500/40",  badge: "bg-amber-200 text-amber-900",   border: "border-amber-500"  },
  red:    { btn: "bg-red-700/80 hover:bg-red-600",       ring: "bg-red-600/40",    badge: "bg-red-200 text-red-900",       border: "border-red-600"    },
  cyan:   { btn: "bg-cyan-600/80 hover:bg-cyan-500",     ring: "bg-cyan-500/40",   badge: "bg-cyan-200 text-cyan-900",     border: "border-cyan-500"   },
  green:  { btn: "bg-green-700/80 hover:bg-green-600",   ring: "bg-green-600/40",  badge: "bg-green-200 text-green-900",   border: "border-green-500"  },
  purple: { btn: "bg-purple-700/90 hover:bg-purple-600", ring: "bg-purple-600/40", badge: "bg-purple-200 text-purple-900", border: "border-purple-500" },
  slate:  { btn: "bg-slate-700/90 hover:bg-slate-600",   ring: "bg-slate-600/40",  badge: "bg-slate-200 text-slate-900",   border: "border-slate-500"  },
  yellow: { btn: "bg-yellow-600/90 hover:bg-yellow-500", ring: "bg-yellow-500/40", badge: "bg-yellow-200 text-yellow-900", border: "border-yellow-500" },
  teal:   { btn: "bg-teal-600/90 hover:bg-teal-500",     ring: "bg-teal-500/40",   badge: "bg-teal-200 text-teal-900",     border: "border-teal-500"   },
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

// ── Umbrella flight: centre → outer island, Jake as the parachute ──
// The 12 frames split into three phases:
//   0–4   Jake unfurls into the canopy      (play once)
//   5–8   canopy open, Finn suspended       (loop while airborne)
//   9–11  canopy folds, Jake drops down     (play once)
const UMBRELLA_FRAMES     = 12;
const UMBRELLA_DEPLOY_END = 5;    // first frame of the airborne loop
const UMBRELLA_FLIGHT_END = 9;    // first frame of the retract
const UMBRELLA_SWAYS      = 1.5;  // canopy cycles across the airborne window
const FLIGHT_MS         = 1500;   // total centre → island duration
const FLIGHT_DEPLOY_T   = 0.2;    // fraction of the flight spent unfurling
const FLIGHT_RETRACT_T  = 0.8;    // fraction after which the canopy folds
const FLIGHT_ARC        = 14;     // apex height above the straight line, in viewport %
const FLIGHT_PEAK_SCALE = 1.6;    // character zoom at mid-flight (map never scales)

// Per-animation render size. Finn's body is the same size in every set; the
// umbrella frames are 78px tall vs 44px because Jake's canopy sits above his
// head, so they need proportionally more box or `contain` would shrink Finn.
const SPRITE_SIZE: Record<string, { w: number; h: number }> = {
  finn_idle:     { w: 64, h: 70 },
  finn_walk:     { w: 64, h: 70 },
  finn_jump:     { w: 64, h: 70 },
  finn_land:     { w: 64, h: 70 },
  finn_umbrella: { w: 64, h: 124 },   // 78/44 × 70 ≈ 124
};

// Parabola peaking at 1 when t=0.5, 0 at both ends — drives arc height and zoom.
const arc = (t: number) => 4 * t * (1 - t);
const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

type Flight = { loc: (typeof locations)[0]; from: CharPos; t: number };

export default function Home() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [finnPos, setFinnPos]       = useState<CharPos>(IDLE);
  const [jakePos, setJakePos]       = useState<CharPos>(IDLE);

  const introRef = useRef<HTMLDivElement>(null);
  const [climbProgress, setClimbProgress] = useState(0);
  const [climbDone, setClimbDone] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [idleFrame, setIdleFrame] = useState(0);

  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const flightRaf = useRef<number | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
      ["finn_umbrella", UMBRELLA_FRAMES],
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

  // Mobile map + the "Traveling to …" title read from this; keep it for both
  // the flying and non-flying paths.
  function handleSelect(loc: (typeof locations)[0]) {
    setSelectedId(loc.id);
    setFinnPos({ x: loc.x + 3,   y: loc.y });
    setJakePos({ x: loc.x - 3.5, y: loc.y });
  }

  function handleMobileSelect(e: React.MouseEvent, loc: (typeof locations)[0]) {
    if (loc.href === "/") {
      // No dedicated page for this island — just select it, don't navigate/reload
      e.preventDefault();
    }
    handleSelect(loc);
  }

  function resetStoryline() {
    setClimbDone(false);
    setClimbProgress(0);
    setSelectedId(null);
    setFinnPos(IDLE);
    setJakePos(IDLE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Desktop: fly Finn from wherever he's standing to the island under Jake's
  // umbrella, then open the page. The pin is an <a>, so without the
  // preventDefault below the browser would navigate instantly and the flight
  // would never be seen.
  const startFlight = useCallback(
    (e: React.MouseEvent, loc: (typeof locations)[0]) => {
      // Islands 1–4 have href:"/" and no page of their own — selecting them
      // shouldn't reload the map.
      if (loc.href === "/") {
        e.preventDefault();
        handleSelect(loc);
        return;
      }

      // Let modified clicks (new tab/window) behave natively.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      e.preventDefault();
      if (flight) return;   // a flight is already running — ignore double-clicks

      handleSelect(loc);

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        router.push(loc.href);
        return;
      }

      // Launch from Finn's current spot: map centre on the first trip, or the
      // island he's already standing on.
      const current = locations.find((l) => l.id === selectedId);
      const from: CharPos = current ? { x: current.x, y: current.y } : MAP_CENTER;

      const start = performance.now();
      setFlight({ loc, from, t: 0 });

      const step = (now: number) => {
        const t = clamp((now - start) / FLIGHT_MS, 0, 1);
        setFlight({ loc, from, t });
        if (t < 1) {
          flightRaf.current = requestAnimationFrame(step);
        } else {
          flightRaf.current = null;
          router.push(loc.href);
        }
      };
      flightRaf.current = requestAnimationFrame(step);
    },
    [flight, selectedId, router],
  );

  // Stop the tween if the page unmounts mid-flight (e.g. the router.push lands).
  useEffect(() => {
    return () => {
      if (flightRaf.current !== null) cancelAnimationFrame(flightRaf.current);
    };
  }, []);

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

  // ── Umbrella flight ──
  // Position eases so the launch and landing settle, but the zoom rides raw t
  // so its peak stays pinned to the apex of the arc.
  const flightPos = flight
    ? (() => {
        const e = easeInOutQuad(flight.t);
        return {
          x: lerp(flight.from.x, flight.loc.x, e),
          y: lerp(flight.from.y, flight.loc.y, e) - FLIGHT_ARC * arc(e),
        };
      })()
    : null;
  const flightScale = flight ? 1 + (FLIGHT_PEAK_SCALE - 1) * arc(flight.t) : 1;

  const climbersTop  = flightPos ? flightPos.y
    : travelTarget ? travelTarget.y
    : walking ? walkTop
    : lerp(cliffTop, MAP_CENTER.y, flightEased);
  const climbersLeft = flightPos ? flightPos.x
    : travelTarget ? travelTarget.x
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

  // Umbrella: unfurl (0–4, once) → airborne (5–8, looped) → fold (9–11, once).
  const umbrellaFrame = (() => {
    if (!flight) return 0;
    const t = flight.t;
    if (t < FLIGHT_DEPLOY_T) {
      const d = t / FLIGHT_DEPLOY_T;
      return Math.min(UMBRELLA_DEPLOY_END - 1, Math.floor(d * UMBRELLA_DEPLOY_END));
    }
    if (t < FLIGHT_RETRACT_T) {
      const loopLen = UMBRELLA_FLIGHT_END - UMBRELLA_DEPLOY_END;   // frames 5–8
      const d = (t - FLIGHT_DEPLOY_T) / (FLIGHT_RETRACT_T - FLIGHT_DEPLOY_T);
      // One and a half sways across the airborne window (~7 fps). Faster than
      // this and the 4-frame cycle aliases into a visible stutter.
      return UMBRELLA_DEPLOY_END + (Math.floor(d * loopLen * UMBRELLA_SWAYS) % loopLen);
    }
    const retractLen = UMBRELLA_FRAMES - UMBRELLA_FLIGHT_END;      // frames 9–11
    const d = (t - FLIGHT_RETRACT_T) / (1 - FLIGHT_RETRACT_T);
    return Math.min(UMBRELLA_FRAMES - 1, UMBRELLA_FLIGHT_END + Math.floor(d * retractLen));
  })();

  let spriteDir: string, spriteFrame: number;
  if (flight)       { spriteDir = "finn_umbrella"; spriteFrame = umbrellaFrame; }   // flying to an island
  else if (climbDone)    { spriteDir = "finn_idle"; spriteFrame = idleFrame; }   // landed — breathe at map centre
  else if (landing) { spriteDir = "finn_land"; spriteFrame = landFrame; }
  else if (jumping) { spriteDir = "finn_jump"; spriteFrame = jumpFrame; }
  else if (showIdle){ spriteDir = "finn_idle"; spriteFrame = idleFrame; }
  else              { spriteDir = "finn_walk"; spriteFrame = walkFrame; }
  const spriteSize = SPRITE_SIZE[spriteDir] ?? SPRITE_SIZE.finn_idle;

  // Face the direction they're weaving up the path; keep that facing through the
  // jump. While flying, face the island being travelled to.
  const facingRight = flight
    ? flight.loc.x >= flight.from.x
    : walking
    ? trailX(climbProgress) >= trailX(Math.max(0, climbProgress - 0.005))
    : trailX(WALK_END) >= trailX(WALK_END - 0.005);

  const para0 = windowOpacity(climbProgress, 0.055, 0.285, 0.07);
  const para1 = windowOpacity(climbProgress, 0.282  , 0.455, 0.07);
  const para2 = windowOpacity(climbProgress, 0.452, 0.645, 0.07);
  const storylineOpacities = [para0, para1, para2];

  const storylineLayout: { side: "left" | "right"; top: number }[] = [
    { side: "right", top: lerp(82, 16, 0.305) },
    { side: "left",  top: lerp(82, 16, 0.455) },
    { side: "right", top: lerp(82, 16, 0.745) },
  ];

  const storylineLayoutMobile: { top: number }[] = [
    { top: 6 },
    { top: 6 },
    { top: 46 },
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

  const globalSpriteOpacity = climbDone && isMobile ? 0 : charOpacity;
  const posTransition = flight ? undefined
    : traveled ? "left 0.75s cubic-bezier(0.34,1.5,0.64,1), top 0.75s cubic-bezier(0.34,1.5,0.64,1)"
    : landing ? "left 0.2s linear, top 0.2s linear" : undefined;
  const globalSpriteTransition = [posTransition, "opacity 0.5s ease"].filter(Boolean).join(", ");

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
              <h1 className="text-2xl font-bold tracking-widest text-white uppercase"
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
                const isKingdom = loc.id <= 4; // Dulcia, Ignara, Avelis, Wygrove

                return (
                  <a key={loc.id} href={loc.href} onClick={(e) => startFlight(e, loc)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center z-20"
                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}>
                    <span className={`absolute ${isKingdom ? "w-20 h-20" : "w-12 h-12"} rounded-full ${c.ring} animate-ping ${active ? "opacity-100" : "opacity-60"}`} />
                    <span className={`relative z-10 flex items-center gap-1.5 ${c.btn} text-gray-200 border ${active ? `${c.border} ring-2 ring-white/60 scale-110` : "border-white/25"} ${isKingdom ? "px-5 py-3 text-lg" : "px-3 py-1.5 text-sm"} rounded-full font-semibold shadow-lg backdrop-blur-sm whitespace-nowrap transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl`}
                      style={{ fontFamily: "Pixel, UncialAntiqua, serif" }}>
                      <span className={isKingdom ? "text-base" : "text-xs"}>{loc.emoji}</span>
                      {loc.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* ═══════════════════ MOBILE MAP ═══════════════════ */}
          <div className="md:hidden h-full w-full flex flex-col"
            style={{ background: "radial-gradient(ellipse at 50% 30%, #93c5fd 0%, #3b82f6 40%, #1d4ed8 100%)" }}>

            {/* Title — fixed, doesn't scroll */}
            <div className="flex-shrink-0 text-center pt-6 pb-3 px-4">
              <h1 className="text-3xl font-bold tracking-widest text-white uppercase"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>GTD XXVIII</h1>
              <h2 className="text-5xl font-bold tracking-widest text-white uppercase mt-1"
                style={{ fontFamily: "AdventureTime, UncialAntiqua, serif", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>AETERNA</h2>
              <p className="text-sky-200 text-xs tracking-wider mt-0.5">
                {selectedLoc ? `✈ Traveling to ${selectedLoc.name}…` : "Choose your destination"}
              </p>
            </div>

            {/* Map card — fixed, doesn't scroll */}
            <div className="flex-shrink-0 mx-4 mt-1 mb-3 rounded-3xl overflow-hidden"
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
            </div>

            {/* Location list — the only scrollable region */}
            <div className="flex-1 min-h-0 overflow-y-auto mx-4 mb-4 rounded-3xl bg-slate-950/90 divide-y divide-white/5"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
              {locations.map((loc) => {
                const c = colorMap[loc.color];
                const active = selectedId === loc.id;
                return (
                  <a key={loc.id} href={loc.href} onClick={(e) => handleMobileSelect(e, loc)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition active:scale-[0.98] ${active ? "bg-white/5" : ""}`}>
                    <span className={`flex-shrink-0 w-9 h-9 rounded-lg ${c.btn} flex items-center justify-center text-base shadow`}>
                      {loc.emoji}
                    </span>
                    <span className="text-white text-sm font-medium" style={{ fontFamily: "Pixel, UncialAntiqua, serif" }}>
                      {loc.name}
                    </span>
                    {active && <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />}
                    <span className="ml-auto text-white/40 text-lg">→</span>
                  </a>
                );
              })}
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

        {/* ── z:10 — Finn carrying Jake ── */}
      <div className="absolute pointer-events-none"
        style={{
          zIndex: 10,
          left: `${climbersLeft}%`,
          top: `${climbersTop}%`,
          transform: `translate(-50%, -100%) scale(${(facingRight ? 1 : -1) * flightScale}, ${flightScale})`,
          transformOrigin: "bottom center",
          opacity: globalSpriteOpacity,
          transition: globalSpriteTransition,
        }}>
        <Image
          src={`/images/${spriteDir}/frame_${spriteFrame}.png`}
          alt="Finn and Jake climbing"
          width={spriteSize.w}
          height={spriteSize.h}
          unoptimized
          priority
          style={{ objectFit: "contain", imageRendering: "pixelated" }}
        />
      </div>

        {/* ── z:20 — Storyline (desktop): alternating left/right ── */}
        {STORYLINE.map((line, i) => {
          const layout = storylineLayout[i];
          const isRight = layout.side === "right";
          return (
            <div key={i}
              className={`hidden md:block absolute pointer-events-none w-[34%] ${
                isRight ? "right-[7%] text-right" : "left-[7%] text-left"
              }`}
              style={{
                zIndex: 20,
                top: `${layout.top}%`,
                opacity: storylineOpacities[i],
                transform: `translate(${isRight ? lerp(28, 0, storylineOpacities[i]) : lerp(-28, 0, storylineOpacities[i])}px, -50%)`,
              }}>
              <p className="inline-block text-amber-50/95 text-base leading-relaxed tracking-wide bg-black/75 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5"
                style={{ fontFamily: "AdventureTime, UncialAntiqua, serif", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
                {line}
              </p>
            </div>
          );
        })}

        {/* ── z:20 — Storyline (mobile): centered, slides up on fade-in ── */}
        {STORYLINE.map((line, i) => {
          const layout = storylineLayoutMobile[i];
          return (
            <div key={`m-${i}`}
              className="md:hidden absolute pointer-events-none left-1/2 w-[82%] text-center"
              style={{
                zIndex: 20,
                top: `${layout.top}%`,
                opacity: storylineOpacities[i],
                transform: `translate(-50%, ${lerp(16, -50, 1) + (50 - lerp(16, 0, storylineOpacities[i]))}px)`,
              }}>
              <p className="inline-block text-amber-50/95 text-sm leading-relaxed tracking-wide bg-black/85 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4"
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
