import Image from "next/image";
import { LucideIcon } from "lucide-react";
import { whatsappHref } from "@/data/site";

export default function ServiceCard({
  service,
}: {
  service: { title: string; description: string; icon: LucideIcon; image?: string };
}) {
  return (
    <a
      href={whatsappHref(`Hello Abla Fahita Salon, I would like to book ${service.title}.`)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Book ${service.title} on WhatsApp`}
      className="group relative block aspect-square overflow-hidden rounded-xl bg-[#1a0710] transition hover:-translate-y-1 hover:shadow-gold"
    >
      {service.image && (
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      )}
    </a>
  );
}
