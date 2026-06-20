import Image from "next/image";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import SectionTitle from "@/components/SectionTitle";
import { galleryItems, happyCustomerItems } from "@/data/gallery";

export default function GalleryGrid({ standalone = false }: { standalone?: boolean }) {
  return (
    <section id="gallery" className={`relative overflow-hidden ${standalone ? "bg-ivory" : "bg-salonBlack"} py-20`}>
      <div className="section-shell">
        {!standalone && (
          <SectionTitle
            eyebrow="Gallery"
            title="Salon Style, Ready for Real Photos"
            light
          />
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
          {galleryItems.map((item) => (
            <MotionReveal key={item.src}>
              <figure className="group relative aspect-[638/410] overflow-hidden rounded-lg shadow-soft">
                <Image src={item.src} alt={item.title} fill sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
              </figure>
            </MotionReveal>
          ))}
          {!standalone && (
            <MotionReveal className="md:col-span-3">
              <Link
                href="/gallery#happy-customers"
                className="group relative flex min-h-56 overflow-hidden rounded-lg border border-salonPink/25 bg-salonBlack shadow-gold md:min-h-72"
              >
                <div className="absolute inset-0 grid grid-cols-4 opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90">
                  {happyCustomerItems.slice(0, 8).map((item) => (
                    <div key={item.src} className="relative">
                      <Image src={item.src} alt="" fill sizes="25vw" className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/48 to-transparent" />
                <div className="relative z-10 flex max-w-xl flex-col justify-center p-6 text-white md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-salonGold">Customers</p>
                  <h3 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Abla Fahita Happy Customers</h3>
                  <p className="mt-3 text-sm leading-6 text-white/78 md:text-base">
                    View real salon moments and client looks from the full gallery.
                  </p>
                </div>
              </Link>
            </MotionReveal>
          )}
        </div>
        {standalone && (
          <div id="happy-customers" className="mt-20 scroll-mt-28">
            <SectionTitle
              eyebrow="Customers"
              title="Abla Fahita Happy Customers"
              subtitle="Real salon moments and client looks from Abla Fahita Salon."
            />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {happyCustomerItems.map((item) => (
                <figure
                  key={item.src}
                  className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-salonPink/15 bg-white shadow-soft"
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
