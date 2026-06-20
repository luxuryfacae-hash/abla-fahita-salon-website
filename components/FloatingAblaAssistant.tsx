"use client";

import { motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { site, whatsappHref } from "@/data/site";

type ChatMessage = {
  role: "abla" | "guest";
  text: string;
};

const quickQuestions = [
  "How do I book?",
  "Where are you located?",
  "What services do you offer?",
  "What are the timings?",
];

function answerQuestion(question: string) {
  const normalized = question.toLowerCase();

  if (normalized.includes("book") || normalized.includes("appointment") || normalized.includes("whatsapp")) {
    return "Book through WhatsApp and the salon team will confirm your appointment. Tap the pink WhatsApp button and tell us the service you want.";
  }
  if (normalized.includes("where") || normalized.includes("location") || normalized.includes("reem") || normalized.includes("mall")) {
    return `We are at ${site.shortAddress}. Use the Location button for Google Maps.`;
  }
  if (normalized.includes("service") || normalized.includes("hair") || normalized.includes("makeup") || normalized.includes("henna")) {
    return "We offer hair styling, cutting, coloring, blow dry, hair treatments, makeup, bridal beauty, henna, nail care, eyebrow and face beauty services.";
  }
  if (normalized.includes("time") || normalized.includes("open") || normalized.includes("hour")) {
    return `${site.openingHours}. Please confirm directly with the salon before visiting.`;
  }
  if (normalized.includes("price") || normalized.includes("cost") || normalized.includes("offer")) {
    return "Prices and offers can change by service and season. Send us your requested service on WhatsApp and the team will share current pricing.";
  }

  return "I can help with services, location, timings, and booking. For exact prices or availability, WhatsApp the salon team directly.";
}

export default function FloatingAblaAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "abla",
      text: "Hi, I am Abla, your salon assistant. Ask me about booking, services, timings, or location.",
    },
  ]);

  const character = useMemo(() => (open ? "/abla-character-1.png" : "/abla-character-2.png"), [open]);

  const ask = (question: string) => {
    const clean = question.trim();
    if (!clean) return;
    setMessages((current) => [
      ...current,
      { role: "guest", text: clean },
      { role: "abla", text: answerQuestion(clean) },
    ]);
    setInput("");
    setOpen(true);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ask(input);
  };

  return (
    <div className="fixed bottom-6 left-4 z-50 sm:left-6">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-3 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-salonPink/20 bg-white/92 shadow-gold backdrop-blur-xl"
        >
          <div className="flex items-center justify-between bg-[linear-gradient(135deg,#E4007C,#F6C6CF,#FFD1DC)] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full bg-white/50">
                <Image src="/abla-character-3.png" alt="Abla Fahita assistant" fill sizes="48px" className="object-contain" />
              </div>
              <div>
                <p className="font-serif text-lg font-semibold text-salonBlack">Ask Abla</p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose">Salon Q&A</p>
              </div>
            </div>
            <button type="button" aria-label="Close assistant" onClick={() => setOpen(false)} className="rounded-full bg-white/55 p-2 text-rose">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-72 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "guest" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "guest" ? "bg-salonBlack text-white" : "bg-blush/55 text-charcoal"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 px-4 pb-3">
            {quickQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => ask(question)}
                className="rounded-full border border-salonPink/20 bg-white px-3 py-1.5 text-xs font-semibold text-rose transition hover:bg-blush/50"
              >
                {question}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 border-t border-salonPink/10 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Abla..."
              className="min-w-0 flex-1 rounded-full border border-salonPink/20 bg-ivory px-4 py-3 text-sm outline-none focus:border-salonPink"
            />
            <button type="submit" aria-label="Send question" className="grid h-11 w-11 place-items-center rounded-full bg-salonBlack text-salonGold">
              <Send className="h-4 w-4" />
            </button>
          </form>

          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="block bg-salonBlack px-4 py-3 text-center text-sm font-semibold text-salonGold"
          >
            Continue booking on WhatsApp
          </a>
        </motion.div>
      )}

      <motion.button
        type="button"
        aria-label="Open Abla Fahita assistant"
        onClick={() => setOpen((value) => !value)}
        className="relative flex items-end gap-2"
        animate={{ x: [0, 8, 0, -6, 0], y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="hidden rounded-full border border-white/60 bg-white/82 px-4 py-3 text-sm font-semibold text-rose shadow-soft backdrop-blur sm:inline-flex">
          <Sparkles className="mr-2 h-4 w-4 text-salonPink" />
          Ask Abla
        </span>
        <span className="relative h-20 w-20 drop-shadow-2xl sm:h-24 sm:w-24">
          <Image src={character} alt="Abla Fahita moving assistant" fill sizes="112px" className="object-contain" />
          <span className="absolute bottom-2 right-1 grid h-9 w-9 place-items-center rounded-full bg-salonBlack text-salonGold shadow-soft">
            <MessageCircle className="h-5 w-5" />
          </span>
        </span>
      </motion.button>
    </div>
  );
}
