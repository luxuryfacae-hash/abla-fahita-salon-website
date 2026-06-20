import GalleryGrid from "@/components/GalleryGrid";
import InstagramVideos from "@/components/InstagramVideos";
import SectionTitle from "@/components/SectionTitle";

export const metadata = {
  title: "Gallery",
  description: "View the Abla Fahita Salon gallery and replace placeholder images with real salon photos anytime.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="bg-salonBlack pb-16 pt-32 text-white">
        <div className="section-shell">
          <SectionTitle
            eyebrow="Gallery"
            title="Beauty Moments and Salon Inspiration"
            subtitle="Instagram-style image grid prepared for real salon work, Reem Mall interiors, hair, makeup, henna, and beauty product photos."
            light
          />
        </div>
      </section>
      <GalleryGrid standalone />
      <InstagramVideos />
    </>
  );
}
