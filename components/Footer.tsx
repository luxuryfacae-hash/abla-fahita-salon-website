import Link from "next/link";
import { Camera, MapPin, Share2 } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import { services } from "@/data/services";
import { site } from "@/data/site";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-salonBlack pt-16 text-white">
      <div className="section-shell grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_0.9fr_1fr]">
        <div>
          <LogoMark />
          <p className="mt-5 max-w-sm text-white/72">{site.address}</p>
          <div className="mt-6 flex gap-3">
            <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-salonGold/35 p-3 text-salonGold transition hover:bg-salonGold hover:text-salonBlack">
              <Camera className="h-5 w-5" />
            </a>
            <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full border border-salonGold/35 p-3 text-salonGold transition hover:bg-salonGold hover:text-salonBlack">
              <Share2 className="h-5 w-5" />
            </a>
            <a href={site.mapsUrl} target="_blank" rel="noreferrer" aria-label="Location" className="rounded-full border border-salonGold/35 p-3 text-salonGold transition hover:bg-salonGold hover:text-salonBlack">
              <MapPin className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold text-salonGold">Quick Links</h2>
          <div className="mt-5 grid gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-white/72 transition hover:text-salonGold">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold text-salonGold">Services</h2>
          <div className="mt-5 grid gap-3">
            {services.slice(0, 6).map((service) => (
              <Link key={service.title} href="/services" className="text-white/72 transition hover:text-salonGold">
                {service.title}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold text-salonGold">Company</h2>
          <p className="mt-5 text-white/72">{site.legalName}</p>
          <p className="mt-3 text-white/72">Registration No. {site.registrationNumber}</p>
          <p className="mt-3 font-arabic text-salonGold" dir="rtl">
            {site.brandNameAr}
          </p>
        </div>
      </div>
      <div className="border-t border-salonGold/18 py-6">
        <div className="section-shell flex flex-col gap-2 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Abla Fahita Salon. All rights reserved.</p>
          <p>{site.legalName} | Registration No. {site.registrationNumber}</p>
        </div>
      </div>
    </footer>
  );
}
