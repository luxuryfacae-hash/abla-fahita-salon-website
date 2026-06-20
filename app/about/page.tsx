import Image from "next/image";
import LocationSection from "@/components/LocationSection";
import MotionReveal from "@/components/MotionReveal";
import { site } from "@/data/site";
import { BadgeCheck, Gem, MapPin, Sparkles } from "lucide-react";

export const metadata = {
  title: "About",
  description: "Learn about Abla Fahita Salon, a premium ladies salon in Reem Mall, Abu Dhabi.",
};

const values = [
  { title: "Ladies Salon Atmosphere", icon: Sparkles },
  { title: "Professional Team", icon: BadgeCheck },
  { title: "Premium Beauty Experience", icon: Gem },
  { title: "Modern Service Standards", icon: MapPin },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-salonBlack pt-24">
        <div className="section-shell">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-salonGold/25 shadow-gold sm:aspect-[16/10] lg:aspect-[1448/820]">
            <Image
              src="/gallery/about-cover.jpg"
              alt="About Abla Fahita Salon — Reem Mall, Abu Dhabi"
              fill
              priority
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-salonBlack py-16 text-white">
        <div className="section-shell mx-auto max-w-3xl text-center text-lg leading-8 text-white/80">
          <MotionReveal>
            <p>
              Abla Fahita Salon is a premium beauty and hairdressing salon located in Reem Mall, Al Reem Island,
              Abu Dhabi. We offer professional hair styling, beauty treatments, henna, makeup, and personal care services
              in a stylish, welcoming, and elegant environment.
            </p>
            <p className="mt-5">
              Our ladies salon atmosphere combines a professional team, premium beauty experience, and modern salon
              service standards for clients across Abu Dhabi and Al Reem Island. The salon is licensed for hairdressing,
              beauty treatment, henna pigmenting, tattoo engraving, personal beauty services, and retail cosmetics
              equipment and tools.
            </p>
          </MotionReveal>
        </div>
      </section>

      <section className="bg-ivory py-20">
        <div className="section-shell grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ title, icon: Icon }) => (
            <MotionReveal key={title}>
              <div className="h-full rounded-lg border border-salonGold/20 bg-white p-6 text-center shadow-soft">
                <Icon className="mx-auto mb-4 h-7 w-7 text-salonGold" />
                <h2 className="font-serif text-xl font-semibold text-salonBlack">{title}</h2>
              </div>
            </MotionReveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="section-shell">
          <div className="rounded-[2rem] border border-salonGold/20 bg-champagne/45 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.24em] text-salonGold">Company Details</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-salonBlack">{site.legalName}</h2>
            <p className="mt-3 text-charcoal">Trade name: {site.tradeName}</p>
            <p className="text-charcoal">Registration No. {site.registrationNumber}</p>
          </div>
        </div>
      </section>

      <LocationSection />
    </>
  );
}
