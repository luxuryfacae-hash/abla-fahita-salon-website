"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import LogoMark from "@/components/LogoMark";
import { whatsappHref } from "@/data/site";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Look Lab", href: "/look-lab" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-salonBlack/96 shadow-lg shadow-black/20 backdrop-blur-xl" : "bg-salonBlack/90 shadow-lg shadow-black/25 backdrop-blur-xl"
      }`}
    >
      <nav className="section-shell flex h-20 items-center justify-between">
        <Link href="/" aria-label="Abla Fahita Salon home" className="focus-ring rounded-full">
          <LogoMark />
        </Link>
        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-white/12 text-salonGold shadow-soft"
                    : "text-white hover:bg-white/10 hover:text-blush"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="shine rounded-full bg-gold-gradient px-5 py-3 text-sm font-semibold text-salonBlack shadow-gold transition hover:-translate-y-0.5"
          >
            Book on WhatsApp
          </a>
        </div>
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((value) => !value)}
          className="focus-ring rounded-full border border-salonGold/40 p-3 text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-salonGold/20 bg-salonBlack px-4 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-3 text-base font-medium ${
                  pathname === item.href ? "bg-salonGold/12 text-salonGold" : "text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noreferrer"
              className="shine mt-2 rounded-full bg-gold-gradient px-5 py-3 text-center font-semibold text-salonBlack"
            >
              Book on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
