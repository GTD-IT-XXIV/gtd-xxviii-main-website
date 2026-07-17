"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "./components/heroSection";
import Anthem from "./components/anthem";
import FAQ from "./components/FAQ";
import ContactUs from "./components/contactUs";

export default function Page() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
        <Image
          src="/images/abt_page_bg.png"
          alt=""
          fill
          priority
          style={{
            objectFit: "cover",
            objectPosition: "top center",
          }}
        />
      </div>

      {/* Added flex, flex-col, and gap-6 to evenly space all sections */}
      <div 
        className="relative z-10 flex flex-col gap-6 md:gap-8 pb-10 pt-4"
      >
        <Link
          href="/?map=1"
          className="home-button absolute top-4 left-4 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-stone-800/70 border-2 border-amber-500/50 flex items-center justify-center text-white hover:bg-stone-700/80"
          aria-label="Back to map"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
        <HeroSection />
        <Anthem />
        <FAQ />
        <ContactUs />
        
      </div>
      
    </div>
  );
}