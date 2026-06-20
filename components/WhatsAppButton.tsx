import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/data/site";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noreferrer"
      aria-label="Book on WhatsApp"
      className="shine fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient text-salonBlack shadow-gold transition hover:-translate-y-1"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
