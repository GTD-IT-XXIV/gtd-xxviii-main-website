"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CommitteeMember } from "./committeeConfig";

interface MemberCardProps {
  member: CommitteeMember;
  index: number;
  topicIndex: number;
  onExpand: () => void;
}

/** Sparkle dots rendered inside the card frame */
function Sparkles() {
  return (
    <div className="sparkle-container">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="sparkle" />
      ))}
    </div>
  );
}

export default function MemberCard({ member, index, topicIndex, onExpand }: MemberCardProps) {
  return (
    <motion.div
      layoutId={`card-${topicIndex}-${index}`}
      className="relative cursor-pointer card-glow-hover"
      style={{ aspectRatio: "3 / 4.2" }}
      onClick={onExpand}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.97 }}
    >
      {/* ── Card frame (background layer) ── */}
      <Image
        src="/images/committee_card.png"
        alt=""
        fill
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 18vw"
        className="object-contain pointer-events-none select-none"
        draggable={false}
      />

      {/* ── Member photo (positioned inside the frame's parchment area) ── */}
      <div
        className="absolute overflow-hidden rounded-sm"
        style={{ top: "13%", left: "13%", right: "13%", bottom: "24%" }}
      >
        <Image
          src={member.first_image}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 35vw, (max-width: 1024px) 22vw, 14vw"
          className="object-cover"
        />
      </div>

      {/* ── Name on blue banner ── */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center"
        style={{ bottom: "9%", height: "11%" }}
      >
        <span className="card-banner-text text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold truncate px-4">
          {member.name}
        </span>
      </div>

      <Sparkles />
    </motion.div>
  );
}

/* ─── Expanded Card Overlay ───────────────────────────────────── */

interface ExpandedCardProps {
  member: CommitteeMember;
  index: number;
  topicIndex: number;
  onClose: () => void;
}

export function ExpandedCard({ member, index, topicIndex, onClose }: ExpandedCardProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* ── Backdrop ── */}
      <motion.div
        className="absolute inset-0 bg-black/60 card-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* ── Expanded card ── */}
      <motion.div
        layoutId={`card-${topicIndex}-${index}`}
        className="relative z-10 cursor-pointer"
        style={{ width: "min(340px, 88vw)", aspectRatio: "3 / 4.2" }}
        onClick={onClose}
      >
        {/* ── Card frame ── */}
        <Image
          src="/images/committee_card.png"
          alt=""
          fill
          sizes="340px"
          className="object-contain pointer-events-none select-none"
          draggable={false}
        />

        {/* ── Second image (top portion of parchment area) ── */}
        <div
          className="absolute overflow-hidden rounded-sm"
          style={{ top: "13%", left: "13%", right: "13%", height: "36%" }}
        >
          <Image
            src={member.second_image}
            alt={member.full_name}
            fill
            sizes="260px"
            className="object-cover"
          />
        </div>

        {/* ── Detail text (below photo, in parchment area) ── */}
        <div
          className="absolute flex flex-col items-center justify-center gap-1"
          style={{ top: "52%", left: "13%", right: "13%", bottom: "24%" }}
        >
          <span className="expanded-detail-text text-stone-900 text-base sm:text-lg md:text-xl font-bold text-center leading-tight">
            {member.full_name}
          </span>
          <span className="expanded-detail-text text-stone-700 text-xs sm:text-sm md:text-base text-center">
            {member.year_course}
          </span>
          <span className="expanded-detail-text text-stone-600 text-xs sm:text-sm md:text-base text-center">
            {member.og}
          </span>
        </div>

        {/* ── Banner area (bottom) ── */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center"
          style={{ bottom: "9%", height: "11%" }}
        />

        <Sparkles />
      </motion.div>
    </motion.div>
  );
}
