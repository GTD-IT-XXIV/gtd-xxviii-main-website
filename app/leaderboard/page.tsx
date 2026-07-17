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
  top: string;
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
  top,
  left,
  right,
  width,
  photoWidth = "38%",
  photoTop = "10%",
  textTop = "38%",
  borderColor = "rgba(92,58,30,0.4)",
}: PodiumCardProps) {
  return (
    <div
      className="absolute z-[2]"
      style={{ top, left, right, width, aspectRatio: "3 / 4" }}
    >
      {/* Card frame */}
      <Image src={frameSrc} alt={`${name} frame`} fill className="object-contain" />

      {/* Group photo — small, round, inset inside the frame */}
      <div
        className="absolute -translate-x-1/2 aspect-square overflow-hidden rounded-full bg-white shadow-md"
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
        <h1 className="mb-10 text-center text-3xl font-extrabold tracking-wide text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
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
            {/* Podium background */}
            <Image src="/images/podium.png" alt="Podium" fill className="z-[1] object-contain" />

            {/* 1st / 2nd / 3rd — each positioned independently with fixed coordinates */}
            {second && (
              <PodiumCard
                frameSrc="/images/leaderboard_2.png"
                photoSrc="/images/team_2nd.png"
                name={second.Name}
                score={second.Score}
                top="0%"
                left="9%"
                width="24%"
              />
            )}

            {first && (
              <PodiumCard
                frameSrc="/images/leaderboard_1.png"
                photoSrc="/images/team_1st.png"
                name={first.Name}
                score={first.Score}
                top="-2%"
                left="37%"
                width="26%"
                borderColor="#fbbf24"
                photoWidth="40%"
              />
            )}

            {third && (
              <PodiumCard
                frameSrc="/images/leaderboard_3.png"
                photoSrc="/images/team_3rd.png"
                name={third.Name}
                score={third.Score}
                top="10%"
                right="9%"
                width="24%"
              />
            )}

            {/* Ranking List (rank 4+) */}
            <div className="absolute bottom-0 left-1/2 z-[3] w-[80%] -translate-x-1/2">
              <div className="relative aspect-[600/220]">
                <Image src="/images/ranking_list.png" alt="Ranking list" fill className="object-contain" />

                <div className="absolute bottom-[6%] left-[8%] right-[8%] top-[14%] flex flex-col">
                  <div className="flex items-center justify-between border-b border-[rgba(139,90,43,0.3)] px-4 pb-1 text-[0.7vw] uppercase tracking-wider opacity-70">
                    <span className="w-[10%] shrink-0">Rank</span>
                    <span className="min-w-0 flex-1 pl-2">OG Name</span>
                    <span className="shrink-0">Points</span>
                  </div>

                  <div className="flex flex-1 flex-col justify-center gap-2 overflow-y-auto">
                    {restRows.length === 0 && (
                      <p className="px-4 py-2 text-center text-sm opacity-60">
                        No more teams yet
                      </p>
                    )}
                    {restRows.map((player, i, arr) => (
                      <div
                        key={player.Rank}
                        className={`flex items-center justify-between px-4 py-1 ${
                          i !== arr.length - 1 ? "border-b border-[rgba(139,90,43,0.15)]" : ""
                        }`}
                      >
                        <span className="w-[10%] shrink-0">{player.Rank}</span>
                        <span className="min-w-0 flex-1 truncate pl-2 pr-2">{player.Name}</span>
                        <span className="shrink-0 whitespace-nowrap">⭐ {player.Score.toLocaleString()} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}