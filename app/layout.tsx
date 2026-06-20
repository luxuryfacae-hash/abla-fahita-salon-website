import type { Metadata } from "next";
import { Cairo, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingAblaAssistant from "@/components/FloatingAblaAssistant";
import WhatsAppButton from "@/components/WhatsAppButton";
import { site } from "@/data/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

export const metadata: Metadata = {
  metadataBase: new URL("https://salonablafahita.com"),
  title: {
    default: "Abla Fahita Salon | Premium Ladies Salon in Reem Mall Abu Dhabi",
    template: "%s | Abla Fahita Salon",
  },
  description:
    "Premium hair, beauty, henna, makeup and personal care services at Abla Fahita Salon in Reem Mall, Al Reem Island, Abu Dhabi.",
  keywords: [
    site.brandName,
    site.brandNameAr,
    "ladies salon Abu Dhabi",
    "Reem Mall salon",
    "hair salon Abu Dhabi",
    "henna Abu Dhabi",
    "bridal makeup Abu Dhabi",
  ],
  openGraph: {
    title: "Abla Fahita Salon",
    description:
      "Where Beauty Meets Confidence. Premium ladies salon services in Reem Mall, Abu Dhabi.",
    url: "https://salonablafahita.com",
    siteName: site.brandName,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: site.brandName }],
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abla Fahita Salon",
    description: "Premium hair, beauty, henna and makeup services in Abu Dhabi.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: site.brandName,
  alternateName: site.brandNameAr,
  legalName: site.legalName,
  url: "https://salonablafahita.com",
  telephone: site.phone,
  image: "https://salonablafahita.com/og-image.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop/Office 115, Level 1, Reem Mall, Najmat Abu Dhabi, Al Reem Island",
    addressLocality: "Abu Dhabi",
    addressCountry: "AE",
  },
  openingHours: "Mo-Su 10:00-22:00",
  sameAs: [site.instagram, site.facebook],
  priceRange: "$$",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AE" dir="ltr" className={`${inter.variable} ${playfair.variable} ${cairo.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingAblaAssistant />
        <WhatsAppButton />
      </body>
    </html>
  );
}
