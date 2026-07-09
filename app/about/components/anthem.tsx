"use client";

import React, { useState, useRef } from 'react';

export default function Anthem() {
  // 1. State for playing status and progress bar width (0 to 100)
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // 2. Refs to target the hidden audio element and the progress bar div
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // 3. Play/Pause toggle logic
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 4. Update the progress bar as the song plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      // Calculate percentage for the width
      if (duration) {
        const progressPercent = (current / duration) * 100;
        setProgress(progressPercent);
      }
    }
  };

  // 5. Allow clicking on the progress bar to skip around the song
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressBarRef.current) {
      // Get where the user clicked relative to the bar's width
      const barWidth = progressBarRef.current.clientWidth;
      const clickPosition = e.nativeEvent.offsetX;
      const duration = audioRef.current.duration;
      
      if (duration) {
        // Calculate the new time and update the audio element
        const newTime = (clickPosition / barWidth) * duration;
        audioRef.current.currentTime = newTime;
        setProgress((newTime / duration) * 100);
      }
    }
  };

  // 6. Reset when the song ends
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="relative flex justify-center p-6 md:p-10 w-full">
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src="/gtd-theme-song-mp3.mp3" 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <style>{`
        @font-face {
          font-family: 'MyDirectFont';
          src: url('/fonts/LibreBaskerville-VariableFont_wght.ttf') format('truetype');
          font-display: swap;
        }

        @font-face {
          font-family: 'ParagraphFont';
          src: url('/fonts/Inter-VariableFont_opsz,wght.ttf') format('truetype');
          font-display: swap;
        }

        .lyrics-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .lyrics-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .lyrics-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .lyrics-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>

      <div className="w-full max-w-5xl rounded-[2rem] border border-white/10 bg-[#0f284d]/70 backdrop-blur-md p-8 md:p-12 text-white shadow-2xl">
        
        <div className="flex justify-center items-center mb-10 md:mb-14 text-center">
          <span className="hidden sm:block">
            <img src="/images/star.png" alt="" className="h-4 md:h-5 mx-4" />
          </span>
          <h2 
            className="text-4xl md:text-5xl font-bold tracking-wider text-[#EFECE6]"
            style={{ fontFamily: "'MyDirectFont', serif" }}
          >
            GTD ANTHEM
          </h2>
          <span className="hidden sm:block">
            <img src="/images/star.png" alt="" className="h-4 md:h-5 mx-4" />
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          
          {/* ===================== */}
          {/* LEFT: Audio Player UI */}
          {/* ===================== */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-sm rounded-full border border-white/20 bg-gradient-to-r from-white/10 to-transparent p-4 flex items-center gap-4 md:gap-6 shadow-inner">
              
              {/* Play/Pause Button */}
              <button 
                onClick={togglePlayPause}
                className="flex-shrink-0 text-[#fdecd5] hover:text-white transition-colors ml-2 md:ml-4"
              >
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="24" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3L19 12L5 21V3Z" />
                  </svg>
                )}
              </button>

              {/* Progress Bar Container */}
              <div 
                ref={progressBarRef}
                onClick={handleSeek}
                className="flex-1 h-1.5 bg-gray-500/40 rounded-full overflow-hidden relative mr-4 md:mr-6 cursor-pointer"
              >
                {/* Dynamic Progress Indicator */}
                <div 
                  className="absolute top-0 left-0 h-full bg-[#e3d1bb] rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

            </div>
          </div>

          {/* ===================== */}
          {/* RIGHT: Lyrics Section */}
          {/* ===================== */}
          <div className="relative md:pr-8">
            <div 
              className="h-62 overflow-y-auto lyrics-scrollbar pr-4 flex flex-col gap-6 text-sm md:text-base text-gray-200 tracking-wide leading-relaxed"
              style={{ fontFamily: "'ParagraphFont', sans-serif" }}
            >
              <p>
                From different place, different times<br />
                With a common goal in our mind<br />
                We meet the day this moment we felt is fate
              </p>
              
              <p>
                Have you ever stopped and wonder why<br />
                The answers we have in our memory<br />
                So many of us with different childhoods<br />
                Different dreams, different lives
              </p>

              <p className="font-bold">
                Chorus:<br />
                I know now what the answer is<br />
                I'm sure I'm gonna miss<br />
                This special day when we get together
              </p>
              
              <p>
                As clouds drift and seasons flee<br />
                We will probably not meet<br />
                And different lives we'll live<br />
                No once we'll forget this great day we have
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}