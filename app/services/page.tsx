import FeaturedServices from "@/components/FeaturedServices";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/data/services";

export const metadata = {
  title: "Services",
  description: "Explore hair, makeup, henna, beauty treatment, nail care, and cosmetics services at Abla Fahita Salon.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-salonBlack pb-16 pt-32 text-white">
        <div className="section-shell">
          <SectionTitle
            eyebrow="Services"
            title="Salon Services for Every Beauty Moment"
            subtitle="Professional hairdressing, beauty treatment, henna pigmenting, makeup, personal beauty services, and retail beauty tools."
            light
          />
        </div>
      </section>
      <section className="bg-[linear-gradient(180deg,#050505,#2b0718)] py-20">
        <div className="section-shell grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </section>
      <FeaturedServices />
    </>
  );
}
