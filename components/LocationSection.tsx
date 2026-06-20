import { MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import AblaCharacter from "@/components/AblaCharacter";
import SectionTitle from "@/components/SectionTitle";
import { site, whatsappHref } from "@/data/site";

export default function LocationSection() {
  return (
    <section id="location" className="bg-salonBlack py-20 text-white">
      <div className="section-shell">
        <SectionTitle
          eyebrow="Location"
          title="Visit Us at Reem Mall"
          subtitle="Abla Fahita Salon is located on Level 1, Shop/Office 115, inside Reem Mall on Al Reem Island."
          light
        />
        <div className="grid overflow-hidden rounded-[2rem] border border-salonPink/18 bg-[#fff5f8] shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-8 lg:p-10">
            <AblaCharacter className="mb-5 h-20 w-20" />
            <MapPin className="h-10 w-10 text-salonGold" />
            <h2 className="mt-6 bg-[linear-gradient(135deg,#050505,#8A2942,#E4007C)] bg-clip-text font-serif text-3xl font-semibold text-transparent">Abla Fahita Salon</h2>
            <p className="mt-4 whitespace-pre-line bg-[linear-gradient(135deg,#050505,#8A2942,#E4007C)] bg-clip-text text-lg font-semibold leading-8 text-transparent">
              Shop/Office 115, Level 1, Reem Mall,{"\n"}
              Najmat Abu Dhabi, Al Reem Island,{"\n"}
              Abu Dhabi, United Arab Emirates
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-salonPink/30 bg-white px-5 py-3 font-semibold shadow-soft transition hover:-translate-y-0.5 hover:bg-blush/50">
                <Navigation className="h-5 w-5 text-rose" />
                <span className="bg-[linear-gradient(135deg,#050505,#8A2942,#E4007C)] bg-clip-text text-transparent">
                  Open in Google Maps
                </span>
              </a>
              <a href={`tel:${site.phone}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-salonPink/30 bg-white px-5 py-3 font-semibold text-salonBlack shadow-soft transition hover:-translate-y-0.5 hover:bg-blush/50">
                <Phone className="h-5 w-5" />
                Call Salon
              </a>
              <a href={whatsappHref()} target="_blank" rel="noreferrer" className="shine inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-5 py-3 font-semibold text-salonBlack">
                <MessageCircle className="h-5 w-5" />
                Book on WhatsApp
              </a>
            </div>
          </div>
          <div className="min-h-[420px] bg-salonBlack p-4">
            <div className="h-full min-h-[390px] overflow-hidden rounded-[1.5rem] border border-salonGold/30 bg-salonBlack shadow-gold">
              <iframe
                title="Salon Abla Fahita location at Reem Mall"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3630.8985791147215!2d54.400290299999995!3d24.4889707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e6700554ded03%3A0xd8fcc880d6d93917!2zU2Fsb24gQWJsYSBGYWhpdGEgLSBSZWVtIE1hbGwg2LXYp9mE2YjZhiDYo9io2YTZhyDZgdin2YfZitiq2KcgLSDYsdmK2YUg2YXZiNmE!5e0!3m2!1sen!2sae!4v1780947466762!5m2!1sen!2sae"
                className="h-full min-h-[390px] w-full"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
