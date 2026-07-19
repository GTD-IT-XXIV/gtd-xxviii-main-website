"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CommitteeMember } from "../committeeConfig";

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
      {/* ── Member photo (background layer, sits behind the frame) ── */}
      <div
        className="absolute overflow-hidden rounded-lg"
        style={{ top: "15%", left: "15%", right: "15%", bottom: "15%" }}
      >
        <Image
          src={member.first_image}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 35vw, (max-width: 1024px) 22vw, 14vw"
          className="object-cover scale-123"
        />
      </div>

      {/* ── Card frame (foreground overlay, drawn on top of the photo) ── */}
      <Image
        src="/images/committee_card_frame.png"
        alt=""
        fill
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 18vw"
        className="object-contain pointer-events-none select-none"
        draggable={false}
      />

      {/* ── Name on blue banner ── */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center"
        style={{ bottom: "17.5%", height: "7%" }}
      >
        <span className="card-banner-text text-white text-[10px] sm:text-xs md:text-sm font-bold truncate px-4">
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
        style={{ width: "min(400px, 90vw)", aspectRatio: "3 / 4.2" }}
        onClick={onClose}
      >
        {/* ── Member photo (background layer, sits behind the frame) ── */}
        <div
          className="absolute overflow-hidden rounded-lg"
          style={{ top: "15%", left: "15%", right: "15%", bottom: "15%" }}
        >
          <Image
            src={member.second_image}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 35vw, (max-width: 1024px) 22vw, 14vw"
            className="object-cover scale-123"
          />
        </div>

        {/* ── Card frame (foreground overlay, drawn on top of the photo) ── */}
        <Image
          src="/images/committee_card_frame.png"
          alt=""
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 18vw"
          className="object-contain pointer-events-none select-none"
          draggable={false}
        />

        {/* ── Name on blue banner ── */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center"
          style={{ bottom: "17.5%", height: "7%" }}
        >
          <span className="card-banner-text text-white text-[20px] sm:text-md md:text-xl font-bold truncate px-4">
            {member.name}
          </span>
        </div>

          {/* ── Banner area (bottom) ── */}
          <div
            className="absolute left-0 right-0 flex items-center justify-center"
            style={{ bottom: "9%", height: "11%" }}
          />

        <Sparkles />
      </motion.div>
      {/* ── Status card (next to the member card) ── */}
        <div
          className="relative flex-shrink-0"
          style={{ width: "min(340px, 42vw)", aspectRatio: "3 / 4.2" }}
        >
          {/* Status card background image */}
          <Image
            src="/images/status_card.png"
            alt=""
            fill
            sizes="(max-width: 640px) 30vw, 260px"
            className="object-contain pointer-events-none select-none"
            draggable={false}
          />

          {/* Text aligned to each icon row on the status card */}
          <div className="absolute inset-0" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span
              className="expanded-detail-text absolute text-white text-sm sm:text-base md:text-lg font-bold leading-tight truncate"
              style={{ top: "24.5%", left: "22.5%", right: "10%" }}
            >
              Full Name
            </span>
            <span
              className="expanded-detail-text absolute text-white text-sm sm:text-base md:text-lg font-bold leading-tight truncate"
              style={{ top: "33%", left: "17%", right: "15%" }}
            >
              {member.full_name}
            </span>
            <span
              className="expanded-detail-text absolute text-white text-sm sm:text-base md:text-lg font-bold leading-tight truncate"
              style={{ top: "44%", left: "22%", right: "10%" }}
            >
              Course/Year
            </span>
            <span
              className="expanded-detail-text absolute text-white text-sm sm:text-base md:text-lg font-bold leading-tight truncate"
              style={{ top: "59%", left: "17%", right: "10%" }}
            >
              {member.year_course}
            </span>
            <span
              className="expanded-detail-text absolute text-white text-sm sm:text-base md:text-lg font-bold leading-tight truncate"
              style={{ top: "70.5%", left: "22.5%", right: "10%" }}
            >
              {member.og}
            </span>
          </div>
        </div>
    </motion.div>
  );
}
