# Abla Fahita Salon Website

Modern, responsive Next.js 15 website for **ABLA FAHITA SALON / صالون أبلة فاهيتا**.

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Static data files for contact, services, testimonials, and gallery

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## Editable Placeholders

Update business/contact details in `data/site.ts`. Current values:

- `whatsapp`: `+971553673674`
- `phone`: `+971553673674`
- `mapsUrl`: Reem Mall Google Maps search
- Embedded map iframe in `components/LocationSection.tsx` points to the real Salon Abla Fahita Reem Mall pin

## Look Lab images

By default the swipe feed pulls AI-generated reference images from Pollinations.ai (free, no key) — quality is hit-or-miss. For production, drop your own curated images and they override the AI source automatically:

1. Drop a JPG/PNG at `public/look-lab/{id}.jpg` (e.g. `public/look-lab/h-soft-waves.jpg`)
2. Add `localImage: "/look-lab/h-soft-waves.jpg"` to the matching entry in `data/lookLab.ts`
3. Reload — the look uses your photo immediately

Recommended aspect ratio: portrait, 800×1000 or similar. Recommended size: <200 KB per image.

If `localImage` is omitted the Pollinations Flux URL is used as a fallback.

## Images

- Logo: `public/logo-pink-final.png`
- Hero video: `public/abla-hero.mp4` (looping background) + `public/gallery/salon-wide.jpg` (poster)
- Featured service covers: `public/gallery/featured-{hair,bridal,henna,glam}.png`
- Gallery covers: `public/gallery/gallery-{pink-interior,luxury-chairs,offers,seasonal-packages,salon-care,beauty-products}.png`
- Mirror carousel: `public/gallery/mirrors/service-mirror-01.png` … `-10.png`
- Happy customers grid: `public/gallery/happy-customers/happy-customer-01.jpg` … `-67.jpg`
- Floating assistant character: `public/abla-character-{1,2,3}.png`
- OG/social image: `public/og-image.jpg`
- Favicon: `app/icon.png`

The floating Q&A assistant is implemented in:

- `components/FloatingAblaAssistant.tsx`

It is a local no-backend assistant for booking, services, timings, location, and pricing guidance. Connect it to a real AI/backend later if live natural-language answers are required.

## Content Data

- Services: `data/services.ts`
- Testimonials: `data/testimonials.ts`
- Gallery captions: `data/gallery.ts`
- Site/contact/company info: `data/site.ts`

## Social Media Note

The provided Facebook and Instagram links are included in the site. Public social content was not accessible during development due blocking/fetch limits, so launch content uses professional placeholders that can be replaced with verified real captions and images later.
