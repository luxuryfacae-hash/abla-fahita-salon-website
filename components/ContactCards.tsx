import { Camera, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import AblaCharacter from "@/components/AblaCharacter";
import { site, whatsappHref } from "@/data/site";

const contacts = [
  { label: "WhatsApp Booking", href: whatsappHref(), icon: MessageCircle },
  { label: "Instagram", href: site.instagram, icon: Camera },
  { label: "Facebook", href: site.facebook, icon: Share2 },
  { label: "Location", href: site.mapsUrl, icon: MapPin },
  { label: "Call Salon", href: `tel:${site.phone}`, icon: Phone },
];

export default function ContactCards() {
  return (
    <section className="arabic-pattern py-20">
      <div className="section-shell">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-salonPink/18 bg-white/88 p-6 shadow-gold backdrop-blur md:p-10">
          <AblaCharacter className="absolute -right-5 -top-5 h-28 w-28 md:h-36 md:w-36" />
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-salonGold">Contact</p>
          <h2 className="mt-4 max-w-2xl bg-[linear-gradient(135deg,#050505,#8A2942,#E4007C)] bg-clip-text font-serif text-4xl font-semibold text-transparent">Let Us Prepare Your Next Look</h2>
          <p className="mt-4 text-lg leading-8 text-charcoal/76">
            {site.openingHours}. Please confirm timings directly with the salon.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {contacts.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex items-center gap-4 rounded-lg border border-salonPink/15 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-salonPink/45 hover:bg-blush/45"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-gradient text-salonBlack shadow-gold transition group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-semibold">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
