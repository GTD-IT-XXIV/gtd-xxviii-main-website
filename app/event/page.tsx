"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  images?: string[];
};

// TODO: replace with the real GTD XXVIII event schedule/descriptions.
const EVENTS: EventItem[] = [
  {
    name: "Senior Camp",
    date: "17-19 July 2026",
    description:
      "A 3-day retreat for seniors to reconnect, recharge, and bond through games and shared experiences.\n\nSenior Camp is a special 3-day retreat designed for seniors to relax, reconnect, and strengthen their bonds with fellow GTD committee members. Through team-building games, the camp fosters friendship, collaboration, and a renewed sense of purpose ahead of the main GTD events. It's a time to unwind, laugh, and grow together.",
    images: [
      "/images/events/senior1.JPG",
      "/images/events/senior2.JPG",
      "/images/events/senior3.JPG",
      "/images/events/senior4.JPG",
    ],
  },
  {
    name: "BFM Project",
    date: "22 March 2026",
    description:
      "A delicious fundraising initiative selling traditional Indonesian snacks to support GTD.\n\nSilaturahmi Abah Finn is a creative fundraising effort under the BFM Project, where a variety of beloved Indonesian street snacks were sold to support GTD. The menu featured Martabak and Risol Mayonnaise bringing nostalgic flavors and joyful vibes to the GTD community.\n\nBFM Project also sold Teh Botol & Fruit Tea in Beach Day Trial GTD, bringing a refreshment on top of the heat of Sentosa Beach.",
    images: [
      "/images/events/bfm1.jpg",
      "/images/events/bfm2.jpg",
      "/images/events/bfm3.jpg",
      "/images/events/bfm4.jpg",
    ],
  },
  {
    name: "Subcommittee Bonding Day",
    date: "14 March 2026",
    description:
      "A two-day event filled with games and activities to strengthen the bond among GTD subcommittees.\n\nSubcommittee Bonding Day (SCBD) is a two-day event dedicated to building camaraderie and unity among the GTD subcommittees. Through a series of fun games, challenges, and interactive activities, members get to know one another beyond their roles—fostering teamwork, friendship, and a shared sense of purpose as they prepare for the main event.",
    images: [
      "/images/events/scbd1.JPG",
      "/images/events/scbd2.JPG",
      "/images/events/scbd3.JPG",
      "/images/events/scbd4.JPG",
    ],
  },
  {
    name: "POLOG Project Arcanex",
    date: "28 February - 1 Marh 2026",
    description:
      "A public game-based fundraising project by POLOG in support of GTD.\n\nArcanex is a creative fundraising initiative by POLOG, story-driven games open to the public. Designed to raise funds for the GTD orientation program, the event challenges participants to solve mysteries, work as a team, and immerse themselves in unique narratives. Whether you're escaping danger or uncovering hidden truths, Arcanex offers an unforgettable experience for a good cause.",
    images: [
      "/images/events/polog1.jpg",
      "/images/events/polog2.JPG",
      "/images/events/polog3.JPG",
      "/images/events/polog4.JPG",
    ],
  },
];

/* Image carousel — crossfades between photos, advances automatically, and is
   navigable via the dots only (no arrow buttons, per design). Remounts fresh
   whenever the parent event changes (it lives inside a keyed motion.div), so
   it always starts back at photo 1 for a newly-opened event. */
function ImageCarousel({
  images,
  alt,
  wrapperClassName,
  imageClassName,
}: {
  images: string[];
  alt: string;
  wrapperClassName?: string;
  imageClassName?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setI((prev) => (prev + 1) % images.length), 4500);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className={`flex w-full flex-col gap-1.5 sm:gap-2 ${wrapperClassName ?? ""}`}>
      <div className={`relative overflow-hidden ${imageClassName ?? ""}`}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[i]}
              alt={`${alt} photo ${i + 1}`}
              fill
              className="pointer-events-none select-none object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex shrink-0 items-center justify-center gap-1.5">
        {images.map((_, dotI) => (
          <button
            key={dotI}
            type="button"
            aria-label={`Show photo ${dotI + 1}`}
            aria-current={dotI === i}
            onClick={() => setI(dotI)}
            className={`h-1.5 rounded-full transition-all ${
              dotI === i ? "w-4 bg-amber-500" : "w-1.5 bg-stone-800/30 hover:bg-stone-800/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Content slide/fade when switching events — direction-aware so "next" glides
// in from the right and "prev" from the left, instead of just cutting instantly.
const eventVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: -dir * 28 }),
};

export default function Page() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const event = EVENTS[index];
  const touchStartX = useRef<number | null>(null);

  function prev() {
    setDirection(-1);
    setIndex((i) => (i - 1 + EVENTS.length) % EVENTS.length);
  }
  function next() {
    setDirection(1);
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
      <style>{`
        .event-desc-scroll::-webkit-scrollbar { width: 4px; }
        .event-desc-scroll::-webkit-scrollbar-track { background: transparent; }
        .event-desc-scroll::-webkit-scrollbar-thumb { background: rgba(120, 72, 24, 0.35); border-radius: 3px; }
        .event-desc-scroll::-webkit-scrollbar-thumb:hover { background: rgba(120, 72, 24, 0.55); }
      `}</style>
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
      <div className="relative z-10 hidden min-h-screen w-full items-center justify-center overflow-x-auto px-6 py-8 md:flex md:px-6">
        {/* Width is driven off viewport WIDTH (not height) — vh-based sizing could
            render a board wider than the actual available space on shorter/wider
            windows, which is what was causing the content to overlap the frame. */}
        <div className="relative mt-16 shrink-0" style={{ width: "min(1550px, 90vw)" }}>
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
                solid color to match the mobile card. Positioned with percentage
                insets (measured against the board art's inner panel) instead of
                fixed pixels, so it scales cleanly with the board's own size. */}
            <div
              className="absolute overflow-hidden rounded-md bg-[#f4e3c1] shadow-inner"
              style={{ top: "36.2%", bottom: "23.1%", left: "17%", right: "17%" }}
            >

              {/* Event content on top of the card — text left, photo right.
                  A single percentage padding (no extra margin stacked on top)
                  so the content actually uses the card's space instead of
                  leaving large blank borders. AnimatePresence + the card's own
                  overflow-hidden give a clean slide/fade when switching events. */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={index}
                  custom={direction}
                  variants={eventVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="absolute inset-0 flex items-start gap-6 text-stone-900"
                  style={{ padding: "4%" }}
                >
                  <div className="flex h-full min-w-0 flex-1 flex-col items-start text-left sm:gap-2">
                    <h2
                      className={`${adventureTimeLogo.className} shrink-0 text-base tracking-wide sm:text-xl md:text-3xl`}
                    >
                      {event.name.toUpperCase()}
                    </h2>
                    <p className="shrink-0 font-semibold text-[10px] text-stone-700 sm:text-xs md:text-sm">
                      {event.date}
                    </p>

                    {/* Description — fills the remaining card height and scrolls
                        internally (rather than being clamped/cut off) so long
                        write-ups stay fully readable without breaking the frame
                        art's fixed size. A bottom fade hints there's more to scroll. */}
                    <div className="relative mt-1 min-h-0 w-full flex-1">
                      <div className="event-desc-scroll absolute inset-0 overflow-y-auto pr-2">
                        <p
                          className={`${thunderman.className} whitespace-pre-line text-left text-[9px] leading-snug text-stone-800 sm:text-[11px] md:text-sm md:leading-relaxed`}
                        >
                          {event.description}
                        </p>
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-[#f4e3c1] to-transparent" />
                    </div>
                  </div>

                  {/* Event photo carousel */}
                  <div className="h-full w-[36%] shrink-0">
                    {event.images && event.images.length > 0 ? (
                      <ImageCarousel
                        images={event.images}
                        alt={event.name}
                        wrapperClassName="h-full"
                        imageClassName="min-h-0 flex-1 rounded-md ring-2 ring-stone-800/20"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-md bg-stone-300/70 text-[10px] text-stone-600 ring-2 ring-stone-800/20">
                        Photo
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
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

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={eventVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="flex flex-col gap-3 p-4 pb-8"
              >
              {/* Event photo carousel */}
              {event.images && event.images.length > 0 ? (
                <ImageCarousel
                  images={event.images}
                  alt={event.name}
                  imageClassName="aspect-[16/10] w-full rounded-lg ring-2 ring-amber-900/30"
                />
              ) : (
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg ring-2 ring-amber-900/30">
                  <div className="flex h-full w-full items-center justify-center bg-stone-300/70 text-xs text-stone-600">
                    Photo
                  </div>
                </div>
              )}

              <div className="text-center text-stone-900">
                <h2 className={`${adventureTimeLogo.className} text-2xl tracking-wide`}>
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

                <p
                  className={`${thunderman.className} whitespace-pre-line text-left text-sm leading-relaxed text-stone-800`}
                >
                  {event.description}
                </p>
              </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
