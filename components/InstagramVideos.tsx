"use client";

import SectionTitle from "@/components/SectionTitle";
import { instagramReels } from "@/data/videos";

function shortcode(url: string) {
  const match = url.match(/\/reel\/([^/?#]+)/);
  return match?.[1] ?? "";
}

export default function InstagramVideos({ compact = false }: { compact?: boolean }) {
  const reels = compact ? instagramReels.slice(0, 6) : instagramReels;

  return (
    <section id="videos" className="relative overflow-hidden bg-[linear-gradient(135deg,#050505,#4b102b)] py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(228,0,124,0.22),transparent_28%),radial-gradient(circle_at_82%_70%,rgba(246,198,207,0.18),transparent_30%)]" />
      <div className="section-shell relative">
        <SectionTitle
          eyebrow="Videos"
          title="Salon Videos"
          subtitle="Watch Abla Fahita Salon reels and social moments from Instagram."
          light
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reels.map((href) => {
            const code = shortcode(href);
            if (!code) return null;
            return (
              <div
                key={href}
                className="overflow-hidden rounded-lg border border-salonGold/18 bg-white shadow-gold"
              >
                <div className="relative aspect-[400/555] w-full overflow-hidden bg-white">
                  <iframe
                    src={`https://www.instagram.com/reel/${code}/embed/`}
                    title="Abla Fahita Salon Instagram reel"
                    loading="lazy"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    scrolling="no"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
