import FeaturedServices from "@/components/FeaturedServices";
import GalleryGrid from "@/components/GalleryGrid";
import Hero from "@/components/Hero";
import InstagramVideos from "@/components/InstagramVideos";
import LocationSection from "@/components/LocationSection";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import Testimonials from "@/components/Testimonials";
import { services } from "@/data/services";
import { CheckCircle2 } from "lucide-react";

const whyChooseUs = [
  "Prime location inside Reem Mall",
  "Professional beauty specialists",
  "Elegant and comfortable salon experience",
  "Hair, beauty, henna and makeup under one roof",
  "Premium products and attention to detail",
  "Easy booking through WhatsApp",
];

export default function Home() {
  return (
    <>
      <Hero />
      <section id="services" className="relative overflow-hidden bg-[linear-gradient(180deg,#050505,#2b0718)] py-20">
        <div className="absolute inset-0 bg-[url('/gallery/salon-pink-chairs.jpg')] bg-cover bg-center opacity-15" />
        <div className="section-shell">
          <SectionTitle
            eyebrow="Our Services"
            title="Luxury Beauty Care Under One Roof"
            subtitle="From hair transformations to henna and makeup, every service is designed for a polished, confident finish."
            light
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>
      <FeaturedServices />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#4b102b,#050505)] py-20 text-white">
        <div className="absolute inset-0 bg-[url('/gallery/salon-wide.jpg')] bg-cover bg-center opacity-12" />
        <div className="section-shell">
          <SectionTitle
            eyebrow="Why Choose Us"
            title="A Premium Ladies Salon Experience"
            subtitle="Located in the heart of Abu Dhabi's Al Reem Island, our salon brings professional care, comfort, and refined beauty details together."
            light
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-lg border border-salonPink/25 bg-white/10 p-5 text-white shadow-soft backdrop-blur"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-salonGold" />
                <p className="font-medium text-white/90">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <GalleryGrid />
      <InstagramVideos compact />
      <Testimonials />
      <LocationSection />
    </>
  );
}
