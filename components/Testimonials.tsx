import Image from "next/image";
import MotionReveal from "@/components/MotionReveal";
import SectionTitle from "@/components/SectionTitle";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="bg-[linear-gradient(135deg,#050505,#4b102b)] py-20 text-white">
      <div className="section-shell">
        <SectionTitle
          eyebrow="Testimonials"
          title="Client Words"
          subtitle="Real client feedback shared with Abla Fahita Salon."
          light
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item) => (
            <MotionReveal key={item.src}>
              <article className="relative aspect-[7/5] overflow-hidden rounded-lg border border-salonGold/18 bg-white shadow-gold">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-contain"
                />
              </article>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
