import Image from "next/image";
import MotionReveal from "@/components/MotionReveal";
import SectionTitle from "@/components/SectionTitle";
import { featuredServices } from "@/data/services";
import { whatsappHref } from "@/data/site";

export default function FeaturedServices() {
  return (
    <section className="relative overflow-hidden bg-salonBlack py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(228,0,124,0.24),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(246,198,207,0.22),transparent_26%)]" />
      <div className="section-shell">
        <SectionTitle
          eyebrow="Featured"
          title="Signature Beauty Experiences"
          subtitle="Highlighted services created for visible transformation, special occasions, and elegant daily confidence."
          light
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredServices.map((item) => (
            <MotionReveal key={item.title}>
              <a
                href={whatsappHref(`Hello Abla Fahita Salon, I would like to book ${item.title}.`)}
                target="_blank"
                rel="noreferrer"
                aria-label={`Book ${item.title} on WhatsApp`}
                className="group relative block aspect-[543/724] overflow-hidden rounded-[1.5rem] shadow-gold transition hover:-translate-y-0.5"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </a>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
