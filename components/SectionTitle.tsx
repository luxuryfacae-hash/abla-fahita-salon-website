import { ReactNode } from "react";

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  light = false,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.28em] text-salonGold">{eyebrow}</p>}
      <h1
        className={`mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl ${
          light
            ? "bg-[linear-gradient(135deg,#FFFFFF,#FFD1DC,#E4007C)] bg-clip-text text-transparent"
            : "text-salonBlack"
        }`}
      >
        {title}
      </h1>
      {subtitle && <p className={`mt-4 text-lg leading-8 ${light ? "text-white/76" : "text-charcoal/75"}`}>{subtitle}</p>}
      {children}
    </div>
  );
}
