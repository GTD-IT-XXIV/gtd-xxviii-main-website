"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useState } from "react";

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
    name: "Event Name One",
    date: "Date TBA",
    description:
      "Details for this event are coming soon. Check back closer to GTD XXVIII for the full schedule and description.",
  },
  {
    name: "Event Name Two",
    date: "Date TBA",
    description:
      "Details for this event are coming soon. Check back closer to GTD XXVIII for the full schedule and description.",
  },
  {
    name: "Event Name Three",
    date: "Date TBA",
    description:
      "Details for this event are coming soon. Check back closer to GTD XXVIII for the full schedule and description.",
  },
  {
    name: "Event Name Four",
    date: "Date TBA",
    description:
      "Details for this event are coming soon. Check back closer to GTD XXVIII for the full schedule and description.",
  },
];

export default function Page() {
  const [index, setIndex] = useState(0);
  const event = EVENTS[index];

  function prev() {
    setIndex((i) => (i - 1 + EVENTS.length) % EVENTS.length);
  }
  function next() {
    setIndex((i) => (i + 1) % EVENTS.length);
  }

  return (
    <div className="relative min-h-screen w-full">
      <Image
        src="/images/event_bg_v2.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/25" />

      <Link
        href="/?map=1"
        className="absolute top-4 left-4 z-30 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg transition hover:scale-105"
      >
        ← Back to Home
      </Link>

      {/* Desktop */}
      <div className="relative z-10 hidden min-h-screen w-full items-center justify-center overflow-x-auto px-6 py-20 md:flex md:px-16">
        <div className="relative w-[1152px] shrink-0">
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

            {/* Parchment card, stacked on top of the board's inner panel */}
            <div className="absolute inset-0 flex flex-col mt-76 mb-54 mx-40 overflow-hidden rounded-md shadow-inner">
              <Image
                src="/images/event_card.png"
                alt=""
                fill
                className="pointer-events-none select-none object-cover"
              />

              {/* Event content on top of the card */}
              <div className="absolute inset-0 flex flex-col mx-24 my-0 text-stone-900 sm:gap-2 sm:p-5 md:p-6">
                <h2
                  className={`${adventureTimeLogo.className} text-sm tracking-wide sm:text-lg md:text-2xl`}
                >
                  {event.name.toUpperCase()}
                </h2>
                <p
                  className={`${adventureTimeLogo.className} text-[10px] text-stone-700 sm:text-xs md:text-sm`}
                >
                  {event.date}
                </p>
                <p
                  className={`${thunderman.className} mt-1 line-clamp-4 text-[9px] leading-snug text-stone-800 sm:line-clamp-5 sm:text-[11px] md:text-sm md:leading-relaxed`}
                >
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="relative z-10 flex h-screen w-full items-center justify-center overflow-auto px-2 py-6 md:hidden">
        <div className="relative flex w-[700px] shrink-0 flex-col">
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

          {/* Content panel: parchment card as background — sized independently */}
          <div className="relative -mt-px h-[500px] w-[60%] shrink-0 self-center overflow-hidden">
            <Image
              src="/images/event_card_crop.png"
              alt=""
              fill
              className="pointer-events-none select-none object-cover"
            />
            <div className="relative flex h-full flex-col items-center justify-center gap-4 px-5 py-8 text-center text-stone-900">
              <p
                className={`${thunderman.className} text-sm leading-relaxed text-stone-800`}
              >
                {event.description}
              </p>
              <p
                className={`${adventureTimeLogo.className} text-xl tracking-wide`}
              >
                {event.date.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Board bottom: base rail with nav arrows + event name pill */}
          <div className="relative -mt-px w-full shrink-0 ">
            <Image
              src="/images/event_board_bottom.png"
              alt=""
              width={1536}
              height={202}
              className="pointer-events-none w-full select-none"
            />

            <button
              type="button"
              onClick={prev}
              aria-label="Previous event"
              className="absolute left-[25%] top-[34%] z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-4 border-sky-200 bg-blue-900/90 text-xl text-white shadow-lg transition hover:scale-110"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next event"
              className="absolute right-[25%] top-[34%] z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-4 border-sky-200 bg-blue-900/90 text-xl text-white shadow-lg transition hover:scale-110"
            >
              →
            </button>

            <div className="absolute left-1/2 top-1/3 z-20 flex h-[35px] w-[200px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f4e3c1] px-4 text-center shadow-lg">
              <span
                className={`${adventureTimeLogo.className} text-md tracking-wide text-stone-900`}
              >
                {event.name.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
