"use client";

import React from 'react';

export default function Trailer() {
  return (
    <div className="relative flex justify-center p-6 md:p-10 w-full">
      <style>{`
        @font-face {
          font-family: 'MyDirectFont';
          src: url('/fonts/LibreBaskerville-VariableFont_wght.ttf') format('truetype');
          font-display: swap;
        }
      `}</style>

      <div className="w-full max-w-5xl text-white">

        <div className="flex justify-center items-center mb-10 md:mb-14 text-center">
          <span className="hidden sm:block">
            <img src="/images/star.png" alt="" className="h-4 md:h-5 mx-4" />
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-wider text-[#EFECE6]"
            style={{ fontFamily: "'MyDirectFont', serif" }}
          >
            TRAILER
          </h2>
          <span className="hidden sm:block">
            <img src="/images/star.png" alt="" className="h-4 md:h-5 mx-4" />
          </span>
        </div>

        <div className="w-full max-w-3xl mx-auto rounded-[1.5rem] overflow-hidden border border-white/20 shadow-xl aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/i_kbRaXuR38"
            title="GTD Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

      </div>
    </div>
  );
}
