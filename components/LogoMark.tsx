"use client";

import { useState } from "react";
import { site } from "@/data/site";

export default function LogoMark({ compact = false }: { compact?: boolean }) {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="flex items-center">
      <div className={`relative flex-none overflow-hidden rounded-lg border border-salonPink/35 bg-salonBlack shadow-gold ${compact ? "h-12 w-24" : "h-14 w-36 sm:w-44"}`}>
        {!logoError ? (
          // Plain img keeps the fallback reliable when the user has not added the logo file yet.
          // Next/Image treats a missing local asset as an optimizer error in dev.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/logo-pink-final.png"
            alt={`${site.brandName} logo`}
            className="h-full w-full object-contain p-1.5"
            onError={() => setLogoError(true)}
          />
        ) : (
          <span className="grid h-full place-items-center px-4 font-serif text-xl font-bold text-salonPink">AF</span>
        )}
      </div>
    </div>
  );
}
