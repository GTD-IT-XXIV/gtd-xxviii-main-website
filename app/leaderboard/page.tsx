"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Player {
  Rank: number;
  Name: string;
  Score: number;
}

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

export default function Page() {
  const [rankingList, setRankingList] = useState<Player[]>([]);
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

        const list: Player[] = Array.isArray(data) ? data : data.values ?? data.data ?? [];
        setRankingList(list);
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

  const first = rankingList[0];
  const second = rankingList[1];
  const third = rankingList[2];
  const restRows = rankingList.slice(3);

  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center overflow-hidden bg-cover bg-center py-10"
      style={{ backgroundImage: "url('/images/leaderboard_bg.png')" }}
    >
      <div className="relative w-[80vw] max-w-[900px] text-[#5c3a1e]">
        <h1 className="-mt-4 mb-14 text-center text-3xl font-extrabold tracking-wide text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
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

        {!loading && !err && rankingList.length === 0 && (
          <div className="text-center text-white/80 tracking-widest text-sm">
            No rankings yet
          </div>
        )}

        {!loading && !err && rankingList.length > 0 && (
          <div className="relative aspect-[1320/880] w-full text-[0.8vw] font-extrabold">
            {/* Podium + winner cards — the whole group is shrunk (w-[88%]) and nudged
                down (top-[8%]) so the 1st-place card doesn't run off the top. Card
                positions below are relative to THIS wrapper, so they track the podium. */}
            <div className="absolute left-1/2 top-[11%] z-[1] w-[76%] -translate-x-1/2">
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

            {/* Ranking List (rank 4+) — ranking_list.png is a 1:1 image whose actual
                board sits in the middle band. We render it in a wide box with
                object-cover so only that board band shows (top/bottom cropped). */}
            <div className="absolute bottom-[-5%] left-1/2 z-[3] w-[84%] -translate-x-1/2 text-[#243158]">
              <div className="relative aspect-[1651/600] overflow-hidden">
                <Image src="/images/ranking_list.png" alt="Ranking list" fill className="object-cover" style={{ objectPosition: "center 50%" }} />

                {/* Header row — sits in the blue strip, so text is white */}
                <div
                  className="absolute flex items-center text-[0.8vw] font-bold uppercase tracking-wider text-white"
                  style={{ top: "4%", left: "11%", right: "10%" }}
                >
                  <span className="w-[8%] shrink-0 text-center">Rank</span>
                  <span className="flex-1 pl-[9%]">OG Name</span>
                  <span className="shrink-0 pr-[2%]">Points</span>
                </div>

                {/* Rows — evenly distributed to sit on the board's printed rule lines */}
                <div
                  className="absolute flex flex-col justify-between text-[0.85vw]"
                  style={{ top: "17%", bottom: "5%", left: "11%", right: "9%" }}
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
      </div>
    </div>
  );
}