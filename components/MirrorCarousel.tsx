"use client";

import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const mirrors = [
  { src: "/gallery/mirrors/service-mirror-01.png", title: "Hair Styling", sub: "Cut, blowdry, finish" },
  { src: "/gallery/mirrors/service-mirror-02.png", title: "Hair Color", sub: "Gloss and tone" },
  { src: "/gallery/mirrors/service-mirror-03.png", title: "Makeup Looks", sub: "Occasion ready" },
  { src: "/gallery/mirrors/service-mirror-04.png", title: "Henna Art", sub: "Arabic detail" },
  { src: "/gallery/mirrors/service-mirror-05.png", title: "Nail Care", sub: "Polished hands" },
  { src: "/gallery/mirrors/service-mirror-06.png", title: "Skin Glow", sub: "Beauty treatment" },
  { src: "/gallery/mirrors/service-mirror-07.png", title: "Brows", sub: "Shape and tint" },
  { src: "/gallery/mirrors/service-mirror-08.png", title: "Lashes", sub: "Soft definition" },
  { src: "/gallery/mirrors/service-mirror-09.png", title: "Hair Care", sub: "Repair rituals" },
  { src: "/gallery/mirrors/service-mirror-10.png", title: "Salon Offers", sub: "Premium packages" },
];

export default function MirrorCarousel({ immersive = false, compact = false }: { immersive?: boolean; compact?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(900);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const ringAngle = useMotionValue(0);
  const pausedUntilRef = useRef(0);
  const fromDriftRef = useRef(false);
  const isSpringingRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const slotDeg = 360 / mirrors.length;
  const radius = compact
    ? Math.max(150, Math.min(220, stageW * 0.45))
    : immersive
      ? Math.max(300, Math.min(560, stageW * 0.31))
      : Math.max(220, Math.min(330, stageW * 0.4));

  useEffect(() => {
    if (!stageRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) setStageW(entry.contentRect.width);
    });
    resizeObserver.observe(stageRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!isSpringingRef.current && now >= pausedUntilRef.current) {
        ringAngle.set(ringAngle.get() - dt * 3.1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion, ringAngle]);

  useMotionValueEvent(ringAngle, "change", (value) => {
    if (isSpringingRef.current) return;
    const normalized = ((-value % 360) + 360) % 360;
    const nextIndex = Math.round(normalized / slotDeg) % mirrors.length;
    if (nextIndex !== focusedIndex) {
      fromDriftRef.current = true;
      setFocusedIndex(nextIndex);
    }
  });

  useEffect(() => {
    if (fromDriftRef.current) {
      fromDriftRef.current = false;
      return;
    }
    pausedUntilRef.current = performance.now() + 4500;
    const target = -focusedIndex * slotDeg;
    const current = ringAngle.get();
    const delta = (((target - current) % 360) + 540) % 360 - 180;
    isSpringingRef.current = true;
    const controls = animate(ringAngle, current + delta, {
      type: "spring",
      stiffness: 105,
      damping: 24,
      onComplete: () => {
        isSpringingRef.current = false;
      },
    });
    return () => {
      controls.stop();
      isSpringingRef.current = false;
    };
  }, [focusedIndex, ringAngle, slotDeg]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setFocusedIndex((value) => (value + 1) % mirrors.length);
      if (event.key === "ArrowLeft") setFocusedIndex((value) => (value - 1 + mirrors.length) % mirrors.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={stageRef}
      className={`relative mx-auto w-full select-none overflow-hidden [perspective:1600px] ${
        compact
          ? "h-[380px] max-w-[420px] rounded-[2rem]"
          : immersive
            ? "h-[76vh] min-h-[560px] max-w-none rounded-none"
            : "h-[520px] max-w-[680px] rounded-[2rem]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(228,0,124,0.32),transparent_34%),radial-gradient(circle_at_50%_90%,rgba(246,198,207,0.24),transparent_34%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[7%] h-64 w-[56%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,209,220,0.30),transparent_68%)] blur-2xl" />
      <Motes />
      <div className="pointer-events-none absolute left-1/2 top-[53%] h-32 w-[82%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(5,5,5,0.38),transparent_68%)] blur-md" />

      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateY: ringAngle }}>
        {mirrors.map((item, index) => (
          <MirrorPane
            key={`${item.title}-${index}`}
            item={item}
            angleDeg={index * slotDeg}
            radius={radius}
            isFocused={index === focusedIndex}
            immersive={immersive}
            compact={compact}
            onFocus={() => setFocusedIndex(index)}
          />
        ))}
      </motion.div>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
        <button type="button" aria-label="Previous mirror" onClick={() => setFocusedIndex((value) => (value - 1 + mirrors.length) % mirrors.length)} className="grid h-11 w-11 place-items-center rounded-full border border-salonPink/25 bg-white/78 text-rose shadow-soft backdrop-blur transition hover:bg-salonBlack hover:text-salonGold">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="rounded-full border border-white/60 bg-white/78 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-rose shadow-soft backdrop-blur">
          {String(focusedIndex + 1).padStart(2, "0")} / {String(mirrors.length).padStart(2, "0")}
        </div>
        <button type="button" aria-label="Next mirror" onClick={() => setFocusedIndex((value) => (value + 1) % mirrors.length)} className="grid h-11 w-11 place-items-center rounded-full border border-salonPink/25 bg-white/78 text-rose shadow-soft backdrop-blur transition hover:bg-salonBlack hover:text-salonGold">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function MirrorPane({
  item,
  angleDeg,
  radius,
  isFocused,
  immersive,
  compact,
  onFocus,
}: {
  item: (typeof mirrors)[number];
  angleDeg: number;
  radius: number;
  isFocused: boolean;
  immersive: boolean;
  compact: boolean;
  onFocus: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onFocus}
      className="absolute left-1/2 top-[48%] group"
      style={{
        transform: `translate(-50%, -50%) rotateY(${angleDeg}deg) translateZ(${radius}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      {isFocused && (
        <div className="pointer-events-none absolute left-1/2 top-[-54px] h-28 w-44 -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,209,220,0.58),transparent_68%)] blur-xl" />
      )}
      <motion.article
        animate={{ scale: isFocused ? 1.08 : 0.68, opacity: isFocused ? 1 : 0.34 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className={`relative overflow-hidden rounded-[46%] border-[3px] bg-salonBlack/70 p-[7px] backdrop-blur-md ${
          compact
            ? "h-[170px] w-[110px]"
            : immersive
              ? "h-[250px] w-[162px] sm:h-[330px] sm:w-[216px]"
              : "h-[226px] w-[146px] sm:h-[258px] sm:w-[168px]"
        }`}
        style={{
          borderColor: isFocused ? "rgba(255,209,220,0.95)" : "rgba(228,0,124,0.40)",
          boxShadow: isFocused
            ? "0 0 0 1px rgba(228,0,124,0.52), 0 0 34px rgba(255,209,220,0.50), 0 28px 78px rgba(228,0,124,0.44), inset 0 0 28px rgba(255,209,220,0.28)"
            : "0 18px 48px rgba(5,5,5,0.28), inset 0 0 22px rgba(228,0,124,0.16)",
        }}
      >
        <div className="absolute inset-[7px] overflow-hidden rounded-[44%] border border-salonPink/45 bg-white">
          <Image src={item.src} alt={item.title} fill sizes={immersive ? "230px" : "180px"} className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(255,255,255,0.48),transparent_24%,transparent_62%,rgba(255,209,220,0.24)),radial-gradient(circle_at_34%_18%,rgba(255,255,255,0.42),transparent_18%)]" />
          <div className="absolute left-[15%] top-[10%] h-[78%] w-[18%] rotate-[14deg] rounded-full bg-white/18 blur-sm" />
        </div>
        <div className="pointer-events-none absolute inset-[13px] rounded-[43%] border border-white/50" />
        <div className="pointer-events-none absolute left-1/2 top-3 z-10 flex -translate-x-1/2 gap-1.5">
          {[0, 1, 2, 3, 4].map((light) => (
            <span
              key={light}
              className="h-2 w-2 rounded-full bg-blush shadow-[0_0_10px_rgba(255,209,220,0.95)]"
              style={{ opacity: isFocused ? 1 : 0.62 }}
            />
          ))}
        </div>
        <div className="absolute bottom-5 left-1/2 w-[64%] -translate-x-1/2 rounded-xl bg-white/84 px-2 py-2 text-center shadow-soft backdrop-blur sm:w-[66%]">
          <h3 className="text-balance font-serif text-[13px] font-semibold leading-tight text-rose sm:text-[15px]">{item.title}</h3>
          <p className="mt-1 text-[8px] font-semibold uppercase leading-tight tracking-[0.06em] text-charcoal/62 sm:text-[9px]">{item.sub}</p>
        </div>
      </motion.article>
    </button>
  );
}

function Motes() {
  const dots = Array.from({ length: 22 }).map((_, index) => ({
    left: (index * 43) % 100,
    top: (index * 61) % 100,
    delay: (index * 0.25) % 5,
    duration: 7 + ((index * 0.5) % 5),
  }));

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((dot, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: index % 4 === 0 ? 4 : 2,
            height: index % 4 === 0 ? 4 : 2,
            background: index % 3 === 0 ? "#E4007C" : "#F6C6CF",
            boxShadow: "0 0 10px currentColor",
            opacity: 0.34,
          }}
          animate={{ y: [-7, 10, -7], opacity: [0.16, 0.52, 0.16] }}
          transition={{ duration: dot.duration, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
        />
      ))}
    </div>
  );
}
