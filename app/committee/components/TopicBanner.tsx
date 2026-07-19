"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { CommitteeTopic } from "../committeeConfig";

interface TopicBannerProps {
  topic: CommitteeTopic;
  topicIndex: number;
  totalTopics: number;
  direction: number; // -1 = left, 1 = right (for slide direction)
  onPrev: () => void;
  onNext: () => void;
}

const bannerVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.95,
  }),
};

export default function TopicBanner({
  topic,
  topicIndex,
  totalTopics,
  direction,
  onPrev,
  onNext,
}: TopicBannerProps) {
  return (
    <div className="relative flex items-center justify-center gap-0">
      {/* ── Left Arrow ── */}
      <button
        onClick={onPrev}
        className="topic-arrow z-20 flex-shrink-0 text-white hover:text-amber-300"
        aria-label="Previous topic"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          className="w-6 h-6 sm:w-10 sm:h-10"
        >
          <path
            d="M25 8L13 20L25 32"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ── Banner Frame + Content ── */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: "min(720px, calc(100vw - 64px))",
          aspectRatio: "1259 / 902",
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={topicIndex}
            custom={direction}
            variants={bannerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            {/* ── Frame overlay (on top) ── */}
            <div
              className="absolute pointer-events-none z-10"
              style={{ top: "6%", left: "6%", right: "6%", bottom: "6%" }}
            >
              <Image
                src="/images/committee_grp.png"
                alt=""
                fill
                sizes="(max-width: 640px) 65vw, 560px"
                className="object-contain pointer-events-none select-none"
                draggable={false}
                priority
              />
            </div>

            {/* ── Group photo (behind the frame) ── */}
            <div
              className="absolute overflow-hidden rounded-xl"
              style={{ top: "13.5%", left: "15.5%", right: "15%", bottom: "23%" }}
            >
              <Image
                src={topic.group_image}
                alt={`${topic.title} group photo`}
                fill
                sizes="(max-width: 640px) 58vw, 500px"
                className="object-cover"
              />
            </div>

            {/* ── Title on blue banner ── */}
            <div
              className="absolute left-0 right-0 flex items-center justify-center z-20"
              style={{ bottom: "16%", height: "10%", right: "2%", transform: "translateX(7.5px)" }}
            >
              <h2 className="topic-title text-white text-sm sm:text-xl md:text-2xl font-bold uppercase -translate-x-1 sm:translate-x-0">
                {topic.title}
              </h2>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Topic indicators (dots) ── */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {Array.from({ length: totalTopics }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === topicIndex
                  ? "bg-amber-400 scale-125 shadow-[0_0_8px_rgba(255,200,60,0.6)]"
                  : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Right Arrow ── */}
      <button
        onClick={onNext}
        className="topic-arrow z-20 flex-shrink-0 text-white hover:text-amber-300"
        aria-label="Next topic"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          className="w-6 h-6 sm:w-10 sm:h-10"
        >
          <path
            d="M15 8L27 20L15 32"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
