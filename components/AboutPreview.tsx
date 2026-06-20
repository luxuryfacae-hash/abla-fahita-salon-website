import Link from "next/link";
import Image from "next/image";
import AblaCharacter from "@/components/AblaCharacter";
import MotionReveal from "@/components/MotionReveal";
import SectionTitle from "@/components/SectionTitle";
import { site } from "@/data/site";

export default function AboutPreview({ expanded = false }: { expanded?: boolean }) {
  return (
    <section id="about" className="relative overflow-hidden bg-salonBlack py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(228,0,124,0.20),transparent_28%),linear-gradient(180deg,#050505,#2b0718)]" />
      <div className="section-shell grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <MotionReveal>
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-salonBlack p-8 text-white shadow-gold">
            <Image src="/gallery/salon-pink-chairs.jpg" alt="Abla Fahita Salon pink and gold interior" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/24 to-transparent" />
            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.28em] text-white">Reem Mall</p>
              <h2 className="mt-5 font-serif text-5xl font-semibold">Abla Fahita Salon</h2>
              <p className="mt-4 font-arabic text-2xl text-blush" dir="rtl">
                صالون أبلة فاهيتا
              </p>
            </div>
            <AblaCharacter className="absolute right-7 top-7 z-10 h-24 w-24" variant="ramadan" />
            <div className="absolute bottom-8 left-8 right-8 z-10 rounded-2xl border border-salonGold/25 bg-white/10 p-5 backdrop-blur">
              <p className="text-white/84">{site.address}</p>
            </div>
          </div>
        </MotionReveal>
        <MotionReveal>
          <SectionTitle
            eyebrow="About"
            title="About Abla Fahita Salon"
            subtitle="Abla Fahita Salon is a premium beauty and hairdressing salon located in Reem Mall, Al Reem Island, Abu Dhabi."
            light
          />
          <div className="mx-auto max-w-3xl space-y-5 text-lg leading-8 text-white/76 lg:mx-0">
            <p>
              We offer professional hair styling, beauty treatments, henna, makeup, and personal care services in a
              stylish, welcoming, and elegant environment.
            </p>
            <p>
              Our ladies salon atmosphere combines a professional team, premium beauty experience, and modern salon
              service standards for clients across Abu Dhabi and Al Reem Island.
            </p>
            {expanded && (
              <p>
                The salon is licensed for hairdressing, beauty treatment, henna pigmenting, tattoo engraving, personal
                beauty services, and retail cosmetics equipment and tools.
              </p>
            )}
          </div>
          {!expanded && (
            <Link
              href="/about"
              className="shine mt-8 inline-flex rounded-full bg-gold-gradient px-7 py-4 font-semibold text-salonBlack shadow-gold transition hover:-translate-y-0.5"
            >
              Learn More
            </Link>
          )}
        </MotionReveal>
      </div>
    </section>
  );
}
