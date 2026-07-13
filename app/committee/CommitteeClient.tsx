"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

import { committeeTopics } from "./committeeConfig";
import TopicBanner from "./TopicBanner";
import MemberCard, { ExpandedCard } from "./MemberCard";
import "./committee.css";

/* ── Stagger variants for the member card grid ── */
const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const cardVariants = {
  hidden: (direction: number) => ({
    y: 60,
    x: direction * 30,
    opacity: 0,
    scale: 0.85,
  }),
  show: {
    y: 0,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
  exit: (direction: number) => ({
    y: 40,
    x: direction * -30,
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2, ease: "easeIn" },
  }),
};

/* ── Ambient floating particles ── */
function AmbientParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${8 + Math.random() * 84}%`,
    bottom: `${Math.random() * 40}%`,
    delay: `${Math.random() * 4}s`,
    duration: `${3.5 + Math.random() * 3}s`,
    size: `${3 + Math.random() * 4}px`,
  }));

  return (
    <div className="relative w-full h-full pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="ambient-particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

export default function CommitteeClient() {
  const [topicIndex, setTopicIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const topic = committeeTopics[topicIndex];
  const total = committeeTopics.length;

  const goToTopic = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setExpandedIndex(null);
      setTopicIndex((prev) => (prev + dir + total) % total);
    },
    [total],
  );

  return (
    <div className="relative w-full min-h-screen">
      {/* ── Background (fixed so it stays during scroll) ── */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/committee_bg.png"
          alt="Fantasy castle background"
          fill
          priority
          className="object-cover object-top select-none opacity-50"
          draggable={false}
        />
      </div>

      {/* ── Dark vignette overlay — darker at edges, lighter in center ── */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background: [
            "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.75) 100%)",
            "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.4) 100%)",
          ].join(", "),
        }}
      />

      <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
        <AmbientParticles />
      </div>

      {/* ── Main content container ── */}
      <div className="relative z-10 flex flex-col items-center min-h-screen pt-3 sm:pt-4 pb-8 committee-scroll">
        {/* ── Home button ── */}
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

        {/* ── Topic Banner ── */}
        <div className="w-full flex-shrink-0 mt-1 sm:mt-2">
          <TopicBanner
            topic={topic}
            topicIndex={topicIndex}
            totalTopics={total}
            direction={direction}
            onPrev={() => goToTopic(-1)}
            onNext={() => goToTopic(1)}
          />
        </div>

        {/* ── Member Cards Grid ── */}
        <LayoutGroup>
          <div className="w-full flex items-start justify-center px-3 sm:px-6 md:px-8 mt-6 sm:mt-8 md:mt-10 pb-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={topicIndex}
                custom={direction}
                variants={gridVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-[1000px]"
              >
                {topic.members.map((member, i) => (
                  <motion.div
                    key={`${topicIndex}-${i}`}
                    custom={direction}
                    variants={cardVariants}
                  >
                    <MemberCard
                      member={member}
                      index={i}
                      topicIndex={topicIndex}
                      onExpand={() => setExpandedIndex(i)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Expanded Card Overlay ── */}
          <AnimatePresence>
            {expandedIndex !== null && (
              <ExpandedCard
                member={topic.members[expandedIndex]}
                index={expandedIndex}
                topicIndex={topicIndex}
                onClose={() => setExpandedIndex(null)}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  );
}
