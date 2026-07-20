"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useRef, useState, type TouchEvent } from "react";

const adventureTimeLogo = localFont({
  src: "../../public/fonts/AdventureTimeLogo.ttf",
});
const thunderman = localFont({
  src: "../../public/fonts/Thunderman.ttf",
});

type EventItem = {
  name: string;
  date: string;
  description: string;
  image?: string;
};

// TODO: replace with the real GTD XXVIII event schedule/descriptions.
const EVENTS: EventItem[] = [
  {
    name: "Senior Camp",
    date: "17-19 July 2026",
    description:
      "Details for this event are coming soon. Check back closer to GTD XXVIII for the full schedule and description.",
  },
  {
    name: "BFM Project",
    date: "Date TBA",
    description:
      "Details for this event are coming soon. Check back closer to GTD XXVIII for the full schedule and description.",
  },
  {
    name: "Subcommittee Bonding Day",
    date: "Date TBA",
    description:
      "Details for this event are coming soon. Check back closer to GTD XXVIII for the full schedule and description.",
  },
  {
    name: "POLOG Project: Arcanex",
    date: "28 February - 1 Marh 2026",
    description:
      "Details for this event are coming soon. Check back closer to GTD XXVIII for the full schedule and description.",
  },
];

export default function Page() {
  const [index, setIndex] = useState(0);
  const event = EVENTS[index];
  const touchStartX = useRef<number | null>(null);

  function prev() {
    setIndex((i) => (i - 1 + EVENTS.length) % EVENTS.length);
  }
  function next() {
    setIndex((i) => (i + 1) % EVENTS.length);
  }

  function onTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta < -40) next();
    else if (delta > 40) prev();
  }

  return (
    <div className="relative min-h-screen w-full bg-black">
      <Image
        src="/images/event_bg_v2.png"
        alt=""
        fill
        priority
        className="object-cover opacity-[65%] md:object-[center_40%]"
      />
      <div className="absolute inset-0 bg-black/25" />

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

      {/* Desktop */}
      <div className="relative z-10 hidden min-h-screen w-full items-center justify-center overflow-x-auto px-6 py-8 md:flex md:px-16">
        <div className="relative mt-16 shrink-0" style={{ width: "min(1300px, 145vh)" }}>
          {/* Left / right navigation arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous event"
            className="absolute left-0 top-1/2 z-30 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-sky-200 bg-blue-900/90 text-2xl text-white shadow-lg transition hover:scale-110 md:h-14 md:w-14"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next event"
            className="absolute right-0 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border-4 border-sky-200 bg-blue-900/90 text-2xl text-white shadow-lg transition hover:scale-110 md:h-14 md:w-14"
          >
            →
          </button>

          {/* Wooden events board */}
          <div className="relative aspect-[1536/1024] w-full">
            <Image
              src="/images/event_board.png"
              alt=""
              fill
              className="pointer-events-none select-none object-contain"
            />

            {/* Parchment card, stacked on top of the board's inner panel —
                solid color to match the mobile card. */}
            <div className="absolute inset-0 flex flex-col mt-72 mb-50 mx-59 overflow-hidden rounded-md bg-[#f4e3c1] shadow-inner">

              {/* Event content on top of the card — text left, photo right */}
              <div className="absolute inset-0 flex items-start gap-6 mx-24 my-6 text-stone-900 sm:p-5 md:p-6">
                <div className="flex min-w-0 flex-1 flex-col items-start text-left sm:gap-2">
                  <h2
                    className={`${adventureTimeLogo.className} text-sm tracking-wide sm:text-lg md:text-2xl`}
                  >
                    {event.name.toUpperCase()}
                  </h2>
                  <p className="font-semibold text-[10px] text-stone-700 sm:text-xs md:text-sm">
                    {event.date}
                  </p>
                  <p
                    className={`${thunderman.className} mt-1 line-clamp-4 text-left text-[9px] leading-snug text-stone-800 sm:line-clamp-5 sm:text-[11px] md:text-sm md:leading-relaxed`}
                  >
                    {event.description}
                  </p>
                </div>

                {/* Event photo */}
                <div className="relative h-full w-[30%] shrink-0 overflow-hidden rounded-md ring-2 ring-stone-800/20">
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.name}
                      fill
                      className="pointer-events-none select-none object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-stone-300/70 text-[10px] text-stone-600">
                      Photo
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center overflow-y-auto px-5 py-6 md:hidden">
        <div className="relative w-full max-w-[420px] shrink-0">
          {/* Board top: EVENTS banner */}
          <div className="relative w-full shrink-0">
            <Image
              src="/images/event_board_top.png"
              alt=""
              width={1500}
              height={276}
              className="pointer-events-none w-full select-none"
            />
          </div>

          {/* Nav bar: prev arrow · dots · next arrow */}
          <div className="relative -mt-3 flex w-fit items-center gap-3 self-center justify-self-center rounded-full border border-amber-500/30 bg-stone-900/70 px-3 py-1.5 mx-auto">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous event"
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-amber-600 bg-amber-800/90 text-sm text-amber-100 shadow transition hover:scale-110"
            >
              ←
            </button>
            <div className="flex items-center gap-1.5">
              {EVENTS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    i === index ? "w-3 bg-amber-400" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Next event"
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-amber-600 bg-amber-800/90 text-sm text-amber-100 shadow transition hover:scale-110"
            >
              →
            </button>
          </div>

          {/* Card: photo on top, details below — swipeable */}
          <div
            className="relative mt-4 min-h-[70vh] overflow-hidden rounded-2xl border-[6px] border-amber-950/85 bg-[#f4e3c1] shadow-2xl"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* corner rivets */}
            {["top-1.5 left-1.5", "top-1.5 right-1.5", "bottom-1.5 left-1.5", "bottom-1.5 right-1.5"].map((pos) => (
              <span key={pos} className={`absolute ${pos} z-10 h-2 w-2 rounded-full bg-amber-950/70 shadow-inner`} />
            ))}

            <div className="flex flex-col gap-3 p-4 pb-8">
              {/* Event photo */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg ring-2 ring-amber-900/30">
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    className="pointer-events-none select-none object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-stone-300/70 text-xs text-stone-600">
                    Photo
                  </div>
                )}
              </div>

              <div className="text-center text-stone-900">
                <h2 className={`${adventureTimeLogo.className} text-lg tracking-wide`}>
                  {event.name.toUpperCase()}
                </h2>

                <div className="mx-auto my-2 flex max-w-[80%] items-center gap-2 text-amber-800/50">
                  <span className="h-px flex-1 bg-amber-800/40" />
                  <span className="text-[10px]">◆</span>
                  <span className="h-px flex-1 bg-amber-800/40" />
                </div>

                <p className="flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-700">
                  <span aria-hidden>📅</span> {event.date.toUpperCase()}
                </p>

                <div className="mx-auto my-2 flex max-w-[80%] items-center gap-2 text-amber-800/50">
                  <span className="h-px flex-1 bg-amber-800/40" />
                  <span className="text-[10px]">◆</span>
                  <span className="h-px flex-1 bg-amber-800/40" />
                </div>

                <p className={`${thunderman.className} text-sm leading-relaxed text-stone-800`}>
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
