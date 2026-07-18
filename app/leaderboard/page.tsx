"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Player {
  Rank: number;
  Name: string;
  Score: number;
}

type Day = 1 | 2 | 3;

interface PodiumCardProps {
  frameSrc: string;
  photoSrc: string;
  name: string;
  score: number;
  // Position & size — pass raw CSS values, e.g. "4%", "120px"
  bottom: string;
  left?: string;
  right?: string;
  width: string;
  // Optional fine-tuning (has sensible defaults)
  photoWidth?: string;   // % of card width
  photoTop?: string;     // % from top of card
  textTop?: string;      // % from top of card
  borderColor?: string;
}

function PodiumCard({
  frameSrc,
  photoSrc,
  name,
  score,
  bottom,
  left,
  right,
  width,
  photoWidth = "38%",
  photoTop = "50%",
  textTop = "68%",
  borderColor = "rgba(92,58,30,0.4)",
}: PodiumCardProps) {
  return (
    <div
      className="absolute z-[2]"
      style={{ bottom, left, right, width, aspectRatio: "3 / 4" }}
    >
      {/* Card frame */}
      <Image src={frameSrc} alt={`${name} frame`} fill className="object-contain" />

      {/* Group photo — round, centred in the middle of the card's paper area.
          photoTop is the CENTRE of the circle (translate -50% on both axes). */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 aspect-square overflow-hidden rounded-full bg-white shadow-md"
        style={{
          left: "50%",
          top: photoTop,
          width: photoWidth,
          border: `2px solid ${borderColor}`,
        }}
      >
        <Image src={photoSrc} alt={`${name} team`} width={150} height={150} className="h-full w-full object-cover" />
      </div>

      {/* Name / score */}
      <div
        className="absolute left-1/2 w-[80%] -translate-x-1/2 flex flex-col items-center text-center leading-tight"
        style={{ top: textTop }}
      >
        <p className="w-full truncate">{name}</p>
        <p className="w-full">⭐ {score.toLocaleString()} pts</p>
      </div>
    </div>
  );
}

/* Small icon that gracefully hides itself if the PNG isn't present yet. */
function SlotIcon({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setOk(false)}
      className="pointer-events-none max-h-full max-w-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
    />
  );
}

interface DayTabsProps {
  activeDay: Day;
  onChange: (d: Day) => void;
}

/* Day 1 / 2 / 3 switcher.
   Each tab is a full painted card: day_tab_active.png (blue window + crystals) when
   selected, day_tab_inactive.png (stone) otherwise. Both PNGs share the exact same
   frame geometry, so one set of overlay coordinates aligns on both:
     • WINDOW  (icon)  — centred, y ≈ 24%–68%
     • NAMEPLATE (label) — centred, y ≈ 80%–92%
   Cards carry ~21% transparent side-margin, so a negative horizontal margin pulls the
   painted frames together into a continuous bar. */
function DayTabs({ activeDay, onChange }: DayTabsProps) {
  const days: { n: Day; icon: string }[] = [
    { n: 1, icon: "/images/day1_icon.png" },
    { n: 2, icon: "/images/day2_icon.png" },
    { n: 3, icon: "/images/day3_icon.png" },
  ];

  return (
    <div className="mx-auto flex w-[92%] max-w-[560px] items-center justify-center md:w-[64%]">
      {days.map(({ n, icon }) => {
        const active = n === activeDay;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={active}
            aria-label={`Day ${n}`}
            className={`relative aspect-[2722/1536] flex-1 transition-transform duration-200 focus:outline-none ${
              active ? "z-[3] scale-[1.12]" : "z-[1] scale-[0.9] hover:scale-[0.94]"
            }`}
            style={{ marginInline: "-12%" }}
          >
            {/* Card frame (active = blue+crystals, inactive = stone) */}
            <Image
              src={active ? "/images/day_tab_active.png" : "/images/day_tab_inactive.png"}
              alt={`Day ${n}${active ? " (selected)" : ""}`}
              fill
              priority={n === 1}
              className="object-contain"
              style={
                active
                  ? { filter: "drop-shadow(0 0 10px rgba(120,110,255,0.6)) drop-shadow(0 4px 8px rgba(0,0,0,0.45))" }
                  : { filter: "grayscale(0.5) brightness(0.78) saturate(0.85)", opacity: 0.9 }
              }
            />

            {/* Icon — centred in the card's window opening */}
            <span
              className="pointer-events-none absolute flex items-center justify-center"
              style={{
                top: "26%",
                height: "42%",
                left: "27%",
                right: "27%",
                filter: active ? "none" : "grayscale(0.5) brightness(0.8)",
                opacity: active ? 1 : 0.85,
              }}
            >
              <SlotIcon src={icon} alt={`Day ${n} icon`} />
            </span>

            {/* Label — centred in the bottom nameplate */}
            <span
              className="pointer-events-none absolute flex items-center justify-center"
              style={{ top: "80.5%", height: "11%", left: "30%", right: "30%" }}
            >
              <span
                className="whitespace-nowrap font-extrabold uppercase leading-none tracking-wide text-[2.3vw] md:text-[0.85vw]"
                style={{
                  color: active ? "#ffe08a" : "#c3b088",
                  textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                }}
              >
                Day {n}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* Turn any API payload into { 1: Player[], 2: Player[], 3: Player[] }.
   Supports (a) day-keyed objects { day1: [...], day2: [...] }, (b) a flat list
   whose entries carry a Day field, and (c) the legacy single combined list
   (all placed under Day 1) so the page keeps working before per-day data lands. */
function toList(x: any): Player[] {
  if (!x) return [];
  return Array.isArray(x) ? x : x.values ?? x.data ?? [];
}

function bucketByDay(data: any): Record<Day, Player[]> {
  const out: Record<Day, Player[]> = { 1: [], 2: [], 3: [] };
  if (!data) return out;

  const keyed = (n: Day) =>
    data[`day${n}`] ?? data[`Day${n}`] ?? data[`DAY${n}`] ?? data[`day_${n}`];
  if (keyed(1) || keyed(2) || keyed(3)) {
    out[1] = toList(keyed(1));
    out[2] = toList(keyed(2));
    out[3] = toList(keyed(3));
    return out;
  }

  const list = toList(Array.isArray(data) ? data : data.values ?? data.data ?? []);
  const hasDayField = list.some((p: any) => p?.Day != null || p?.day != null);
  if (hasDayField) {
    for (const p of list) {
      const d = Number((p as any).Day ?? (p as any).day) as Day;
      if (d === 1 || d === 2 || d === 3) out[d].push(p);
    }
    return out;
  }

  out[1] = list;
  return out;
}

export default function Page() {
  const [byDay, setByDay] = useState<Record<Day, Player[]>>({ 1: [], 2: [], 3: [] });
  const [activeDay, setActiveDay] = useState<Day>(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_LEADERBOARD_API;
        if (!API_URL) throw new Error("Leaderboard API URL is not configured");

        const res = await fetch(API_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load leaderboard (${res.status})`);

        const data = await res.json();
        if (!alive) return;

        setByDay(bucketByDay(data));
        setErr("");
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Something went wrong");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const rankingList = byDay[activeDay];
  const totalCount = byDay[1].length + byDay[2].length + byDay[3].length;

  const first = rankingList[0];
  const second = rankingList[1];
  const third = rankingList[2];
  const restRows = rankingList.slice(3);

  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center overflow-hidden bg-cover bg-center py-10"
      style={{ backgroundImage: "url('/images/leaderboard_bg.png')" }}
    >
      <div className="relative w-[96vw] max-w-[900px] md:w-[80vw] text-[#5c3a1e]">
        <h1 className="-mt-37 mb-6 text-center text-3xl font-extrabold tracking-wide text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] md:mt-0 md:mb-6">
          LEADERBOARD
        </h1>

        {loading && (
          <div className="text-center text-white/80 tracking-widest text-sm">
            Loading leaderboard…
          </div>
        )}

        {!loading && !!err && (
          <div className="mx-auto max-w-xl rounded-xl bg-black/40 ring-1 ring-red-500/25 p-5 text-center">
            <p className="text-white/90 tracking-widest text-sm">FAILED TO LOAD</p>
            <p className="mt-2 text-gray-200 text-sm">{err}</p>
          </div>
        )}

        {!loading && !err && totalCount === 0 && (
          <div className="text-center text-white/80 tracking-widest text-sm">
            No rankings yet
          </div>
        )}

        {!loading && !err && totalCount > 0 && (
          <>
            <DayTabs activeDay={activeDay} onChange={setActiveDay} />

            {rankingList.length === 0 ? (
              <div className="mt-24 text-center text-white/80 tracking-widest text-sm md:mt-16">
                No rankings for Day {activeDay} yet
              </div>
            ) : (
              <div className="relative mt-36 aspect-[1320/880] w-full text-[2.1vw] md:mt-28 md:text-[0.8vw] font-extrabold">
                {/* Podium + winner cards — the whole group is shrunk (w-[88%]) and nudged
                    down (top-[8%]) so the 1st-place card doesn't run off the top. Card
                    positions below are relative to THIS wrapper, so they track the podium. */}
                <div className="absolute left-1/2 top-[2%] z-[1] w-[152%] md:top-[11%] md:w-[76%] -translate-x-1/2">
                  <div className="relative aspect-[1536/1024]">
                    {/* Podium background */}
                    <Image src="/images/podium.png" alt="Podium" fill className="object-contain" />

                    {/* 1st / 2nd / 3rd — each anchored by its BOTTOM so the card base sits
                        on the flat top of its podium block. bottom = 100% − podium-top%. */}
                    {second && (
                      <PodiumCard
                        frameSrc="/images/leaderboard_2.png"
                        photoSrc="/images/logo.png"
                        name={second.Name}
                        score={second.Score}
                        bottom="57.5%"
                        left="16.5%"
                        width="27%"
                      />
                    )}

                    {first && (
                      <PodiumCard
                        frameSrc="/images/leaderboard_3.png"
                        photoSrc="/images/logo.png"
                        name={first.Name}
                        score={first.Score}
                        bottom="72.5%"
                        left="34.4%"
                        width="31%"
                        borderColor="#fbbf24"
                      />
                    )}

                    {third && (
                      <PodiumCard
                        frameSrc="/images/leaderboard_1.png"
                        photoSrc="/images/logo.png"
                        name={third.Name}
                        score={third.Score}
                        bottom="50.5%"
                        right="20%"
                        width="23%"
                        borderColor="#98683C"
                      />
                    )}
                  </div>
                </div>

                {/* Ranking List (rank 4+) — uses ranking_list_crop.png (tightly cropped to
                    the board art, aspect 1668/775). object-contain shows the WHOLE board
                    with no top/bottom cropping. */}
                <div className="absolute bottom-[-66%] left-[49%] z-[3] w-[100%] md:bottom-[-2%] md:left-1/2 md:w-[66%] -translate-x-1/2 text-[#243158]">
                  <div className="relative aspect-[1668/775]">
                    <Image src="/images/ranking_list_crop.png" alt="Ranking list" fill className="object-contain" />

                    {/* Header row — sits in the blue strip, so text is white */}
                    <div
                      className="absolute flex items-center text-[2vw] md:text-[0.8vw] font-bold uppercase tracking-wider text-white"
                      style={{ top: "8%", left: "6%", right: "6%" }}
                    >
                      <span className="w-[8%] shrink-0 text-center">Rank</span>
                      <span className="flex-1 pl-[10%]">OG Name</span>
                      <span className="shrink-0 pr-[2%]">Points</span>
                    </div>

                    {/* Rows — evenly distributed to sit on the board's printed rule lines */}
                    <div
                      className="absolute flex flex-col justify-between text-[2.2vw] md:text-[0.85vw]"
                      style={{ top: "19.5%", bottom: "8.5%", left: "6%", right: "6%" }}
                    >
                      {restRows.length === 0 && (
                        <p className="text-center opacity-60">No more teams yet</p>
                      )}
                      {restRows.map((player) => (
                        <div
                          key={player.Rank}
                          className="flex items-center"
                        >
                          <span className="w-[8%] shrink-0 text-center">{player.Rank}</span>
                          <span className="flex flex-1 items-center gap-[3%] pl-[2%]">
                            {/* Round team avatar (logo placeholder) */}
                            <span className="aspect-square h-[2.2em] shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-white/60">
                              <Image
                                src="/images/logo.png"
                                alt={`${player.Name} team`}
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                              />
                            </span>
                            <span className="min-w-0 flex-1 truncate">{player.Name}</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-[0.4em] whitespace-nowrap pr-[2%]">
                            <span className="text-[#f5b301]">⭐</span>
                            {player.Score.toLocaleString()} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
