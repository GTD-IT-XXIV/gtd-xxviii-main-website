"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Player {
  Rank: number;
  Name: string;
  Score: number;
}



export default function Page() {
  const [rankingList, setRankingList] = useState<Player[]>([]);
 

  useEffect(() => {
  async function loadData() {
    const API_URL = process.env.NEXT_PUBLIC_LEADERBOARD_API!;
    const res = await fetch(
      `${API_URL}`
    );
    
    const data = await res.json();
    setRankingList(data);
  }

  loadData();
}, []);

const first = rankingList[0];
const second = rankingList[1];
const third = rankingList[2];

  return (
    <div
      className="flex h-screen w-screen items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/leaderboard_bg.png')" }}
    >
     
      <div className="relative aspect-[1320/880] w-[80vw] max-w-[900px] text-[0.8vw] font-extrabold text-[#5c3a1e]">
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

           
            <div className="absolute bottom-[14%] left-[8%] right-[8%] text-center">
              <p>{second?.Name}</p>
                <p>{second?.Score.toLocaleString()} pts</p>  
            </div>
          </div>
        </div>

        {/* 1st Place */}
        <div className="absolute left-1/2 top-[-8%] z-[2] w-[24%] -translate-x-1/2">
          <div className="relative">
            

            <Image
              src="/images/leaderboard_3.png"
              alt="1st place"
              width={220}
              height={300}
              className="h-auto w-full"
            />

            <div className="absolute bottom-[14%] left-[8%] right-[8%] text-center">
               <p>{first?.Name}</p>
                <p>{first?.Score.toLocaleString()} pts</p>  
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

            <div className="absolute bottom-[14%] left-[8%] right-[8%] text-center">
               <p>{third?.Name}</p>
                <p>{third?.Score.toLocaleString()} pts</p>  
            </div>
          </div>
        </div>

        {/* Ranking List */}
        {/* CHANGED: w-[70%] -> w-[80%], made it noticeably bigger since it was too small before */}
        <div className="absolute bottom-0 left-1/2 z-[3] w-[80%] -translate-x-1/2">
          <div className="relative">
            <Image
              src="/images/ranking_list.png"
              alt="Ranking list"
              width={600}
              height={220}
              className="h-auto w-full"
            />

            
            <div className="absolute bottom-[10%] left-[12%] right-[10%] top-[16%] flex flex-col justify-center gap-3">
              {rankingList.slice(3).map((player, i) => (
                <div
                  key={player.Rank}
                  className={`flex flex-1 items-center justify-between px-4 ${
                    i !== rankingList.length - 1
                      ? "border-b border-[rgba(139,90,43,0.15)]"
                      : ""
                  }`}
                >
                  <span className="w-[10%] shrink-0 ">
                    {player.Rank}
                  </span>
                  <span className="min-w-0 flex-1 truncate pr-2 ">
                    {player.Name}
                  </span>
                  <span className="shrink-0 whitespace-nowrap ">
                    ⭐ {player.Score.toLocaleString()} pts
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

// AKfycbxJHD0DvD4op2Yft8uSZcrjxAfftjHMP5OoUL1z76ej1pNQu3ViDaT8epyQW1g4Hrtl