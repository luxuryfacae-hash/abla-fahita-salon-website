import AboutPreview from "@/components/AboutPreview";
import LocationSection from "@/components/LocationSection";
import SectionTitle from "@/components/SectionTitle";
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
      <section className="bg-salonBlack pb-16 pt-32 text-white">
        <div className="section-shell">
          <SectionTitle
            eyebrow="About"
            title="About Abla Fahita Salon"
            subtitle="A stylish and welcoming salon destination in Reem Mall, Al Reem Island, Abu Dhabi."
            light
          />
        </div>
      </section>
      <AboutPreview expanded />
      <section className="bg-ivory py-20">
        <div className="section-shell grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ title, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-salonGold/20 bg-white p-6 text-center shadow-soft">
              <Icon className="mx-auto mb-4 h-7 w-7 text-salonGold" />
              <h2 className="font-serif text-xl font-semibold text-salonBlack">{title}</h2>
            </div>
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
