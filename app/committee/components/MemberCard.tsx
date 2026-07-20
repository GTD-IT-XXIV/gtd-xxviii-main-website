"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { CommitteeMember } from "../committeeConfig";

/** Tracks whether the viewport is below Tailwind's `sm` breakpoint (640px) */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

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
  const isMobile = useIsMobile();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col sm:flex-row items-center justify-start sm:justify-center gap-3 sm:gap-0 overflow-y-auto py-6 sm:py-0"
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
          className="absolute left-0 right-0 flex items-end justify-center"
          style={{ bottom: "17.5%", minHeight: "7%" }}
        >
          <span className="card-banner-text text-white text-[20px] sm:text-md md:text-xl font-bold text-center px-4 w-full min-w-0 whitespace-normal break-words">
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
        <motion.div
          className="relative flex-shrink-0 z-0 w-[min(340px,80vw)] sm:w-[min(340px,42vw)]"
          style={{ aspectRatio: "3 / 4.2" }}
          initial={isMobile ? { opacity: 0, y: -280 } : { opacity: 0, x: -320 }}
          animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
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
              style={{ top: "21.5%", left: "22.5%", right: "10%" }}
            >
              Full Name
            </span>
            <span
              className="expanded-detail-text absolute text-white text-sm sm:text-base md:text-lg font-bold leading-tight whitespace-normal break-words"
              style={{ top: "42%", left: "17%", right: "15%", transform: "translateY(-100%)" }}
            >
              {member.full_name}
            </span>
            <span
              className="expanded-detail-text absolute text-white text-sm sm:text-base md:text-lg font-bold leading-tight truncate"
              style={{ top: "54.5%", left: "22%", right: "10%" }}
            >
              Course/Year
            </span>
            <span
              className="expanded-detail-text absolute text-white text-sm sm:text-base md:text-lg font-bold leading-tight truncate"
              style={{ top: "62%", left: "17%", right: "10%" }}
            >
              {member.year_course}
            </span>
            <span
              className="expanded-detail-text absolute text-white text-sm sm:text-base md:text-lg font-bold leading-tight truncate"
              style={{ top: "73.5%", left: "22.5%", right: "10%" }}
            >
              {member.og}
            </span>
          </div>
        </motion.div>
    </motion.div>
  );
}
