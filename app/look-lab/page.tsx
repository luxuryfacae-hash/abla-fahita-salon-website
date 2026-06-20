import type { Metadata } from "next";
import LookSwipeFeed from "@/components/look-lab/LookSwipeFeed";

export const metadata: Metadata = {
  title: "Fahita Look Lab",
  description:
    "An interactive virtual beauty consultation. Swipe through hairstyles, hair colours, makeup, lashes and nail designs tailored to your features, occasion and personal style.",
  alternates: { canonical: "/look-lab" },
};

export default function LookLabPage() {
  return <LookSwipeFeed />;
}
