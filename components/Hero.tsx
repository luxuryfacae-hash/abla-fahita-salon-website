"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarHeart, MapPin } from "lucide-react";
import Link from "next/link";
import MirrorCarousel from "@/components/MirrorCarousel";
import { site, whatsappHref } from "@/data/site";

export default function Hero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-salonBlack text-white">
      <div className="absolute inset-0 -z-30 bg-salonBlack" />
      <video
        src="/abla-hero.mp4"
        poster="/gallery/salon-wide.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55 lg:opacity-70"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,5,5,0.55),rgba(5,5,5,0.30)_46%,rgba(5,5,5,0.80))] lg:bg-[radial-gradient(circle_at_50%_46%,rgba(228,0,124,0.16),transparent_45%),linear-gradient(90deg,rgba(5,5,5,0.78),rgba(5,5,5,0.22)_46%,rgba(5,5,5,0.78))]" />
      <div className="absolute inset-x-0 top-24 z-20">
        <div className="section-shell flex items-center justify-end">
          <p className="hidden items-center gap-2 rounded-full border border-salonGold/35 bg-black/35 px-4 py-2 text-sm font-semibold text-blush shadow-soft backdrop-blur md:inline-flex">
            <MapPin className="h-4 w-4 text-salonGold" />
            {site.shortAddress}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center pt-28">
        <div className="absolute inset-x-0 top-[14vh] z-0 hidden md:block">
          <MirrorCarousel immersive />
        </div>

        <div className="section-shell pointer-events-none relative z-20 grid min-h-[calc(100vh-7rem)] items-end pb-16 pt-20 lg:grid-cols-[0.95fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="pointer-events-auto max-w-2xl"
          >
            <h1 className="font-serif text-5xl font-semibold leading-[0.98] sm:text-7xl lg:text-8xl">
              <span className="bg-[linear-gradient(135deg,#fff,#F6C6CF,#E4007C,#FFD1DC)] bg-clip-text text-transparent">
                Where Beauty
              </span>
              <br />
              Meets Confidence
            </h1>
            <p className="mt-5 max-w-xl text-center font-arabic text-2xl text-blush" dir="rtl">
              جمالك يبدأ من صالون أبلة فاهيتا
            </p>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/76">
              Premium hair, beauty, henna, makeup and self-care services inside Reem Mall, Abu Dhabi.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                className="shine inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-7 py-4 font-semibold text-salonBlack shadow-gold transition hover:-translate-y-0.5"
              >
                <CalendarHeart className="h-5 w-5" />
                Book on WhatsApp
              </a>
              <Link
                href="/services"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 font-semibold text-white shadow-soft backdrop-blur transition hover:border-salonPink hover:bg-salonPink/20"
              >
                View Services
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

