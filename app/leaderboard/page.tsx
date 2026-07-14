"use client";

import Image from "next/image";

const rankingList = [
  { rank: 4, name: "Malachar", score: 6420 },
  { rank: 5, name: "Vyndrel", score: 4810 },
  { rank: 6, name: "Orissia", score: 4120 },
  { rank: 7, name: "Fenwick", score: 3250 },
  { rank: 8, name: "Dratheon", score: 2870 },
];

export default function Page() {
  return (
    <div
      className="flex h-screen w-screen items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/leaderboard_bg.png')" }}
    >
      <div className="relative mt-[4vh] aspect-[1320/880] w-[65vw] max-w-[700px]">
        {/* Podium */}
        <Image
          src="/images/podium.png"
          alt="Podium"
          fill
          className="z-[1] object-contain"
        />

        {/* 2nd Place */}
        <div className="absolute left-[9%] top-0 z-[2] w-[22%]">
          <div className="relative">
            <Image
              src="/images/leaderboard_2.png"
              alt="2nd place"
              width={200}
              height={270}
              className="h-auto w-full"
            />

            <div className="absolute bottom-[18%] left-[8%] right-[8%] text-center">
              <p className="truncate text-[1vw] font-bold text-[#3b2a0e]">
                Azkadelia
              </p>
              <p className="mt-px text-[0.8vw] font-semibold text-[#8B4513]">
                9,460 pts
              </p>
            </div>
          </div>
        </div>

        {/* 1st Place */}
        <div className="absolute left-1/2 top-[-12%] z-[2] w-[24%] -translate-x-1/2">
          <div className="relative">
            <Image
              src="/images/leaderboard_3.png"
              alt="1st place"
              width={220}
              height={300}
              className="h-auto w-full"
            />

            <div className="absolute bottom-[18%] left-[8%] right-[8%] text-center">
              <p className="truncate text-[1vw] font-bold text-[#3b2a0e]">
                Thornwick
              </p>
              <p className="mt-px text-[0.8vw] font-semibold text-[#8B4513]">
                12,850 pts
              </p>
            </div>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="absolute right-[9%] top-[8%] z-[2] w-[22%]">
          <div className="relative">
            <Image
              src="/images/leaderboard_1.png"
              alt="3rd place"
              width={200}
              height={270}
              className="h-auto w-full"
            />

            <div className="absolute bottom-[18%] left-[8%] right-[8%] text-center">
              <p className="truncate text-[1vw] font-bold text-[#3b2a0e]">
                Seraphine
              </p>
              <p className="mt-px text-[0.8vw] font-semibold text-[#8B4513]">
                7,230 pts
              </p>
            </div>
          </div>
        </div>

        {/* Ranking List */}
        <div className="absolute bottom-[2%] left-1/2 z-[3] w-[72%] -translate-x-1/2">
          <div className="relative">
            <Image
              src="/images/ranking_list.png"
              alt="Ranking list"
              width={600}
              height={220}
              className="h-auto w-full"
            />

            <div className="absolute bottom-[12%] left-[10%] right-[8%] top-[12%] flex flex-col overflow-hidden">
              {rankingList.map((player, i) => (
                <div
                  key={player.rank}
                  className={`flex min-h-0 flex-1 items-center overflow-hidden ${
                    i !== rankingList.length - 1
                      ? "border-b border-[rgba(139,90,43,0.15)]"
                      : ""
                  }`}
                >
                  <span className="w-[10%] shrink-0 text-[0.9vw] font-extrabold text-[#5c3a1e]">
                    {player.rank}
                  </span>

                  <span className="min-w-0 flex-1 truncate pr-2 text-[0.9vw] font-semibold text-[#3b2a0e]">
                    {player.name}
                  </span>

                  <span className="shrink-0 whitespace-nowrap text-[0.9vw] font-bold text-[#5c3a1e]">
                    ⭐ {player.score.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}