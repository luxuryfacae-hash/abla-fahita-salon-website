import ContactCards from "@/components/ContactCards";
import LocationSection from "@/components/LocationSection";
import SectionTitle from "@/components/SectionTitle";

export const metadata = {
  title: "Contact",
  description: "Contact Abla Fahita Salon for WhatsApp booking, phone, Instagram, Facebook, and Reem Mall location details.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-salonBlack pb-16 pt-32 text-white">
        <div className="section-shell">
          <SectionTitle
            eyebrow="Contact"
            title="Book Your Beauty Appointment"
            subtitle="Reach the salon by WhatsApp, phone, social media, or visit us at Level 1, Reem Mall, Abu Dhabi."
            light
          />
        </div>
      </section>
      <ContactCards />
      <LocationSection />
    </>
  );
}
