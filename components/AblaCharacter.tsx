import Image from "next/image";

export default function AblaCharacter({
  className = "",
  variant = "offer",
}: {
  className?: string;
  variant?: "offer" | "ramadan";
}) {
  const src = variant === "offer" ? "/gallery/abla-offer.jpg" : "/gallery/abla-ramadan.jpg";

  return (
    <div className={`relative overflow-hidden rounded-full border-4 border-white bg-blush shadow-gold ${className}`}>
      <Image
        src={src}
        alt="Abla Fahita salon character"
        fill
        sizes="160px"
        className="object-cover"
        style={{
          objectPosition: variant === "offer" ? "50% 72%" : "50% 58%",
        }}
      />
      <div className="absolute inset-0 rounded-full ring-2 ring-salonGold/60" />
    </div>
  );
}
