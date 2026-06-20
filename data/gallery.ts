export const galleryItems = [
  { src: "/gallery/gallery-pink-interior.png", title: "Pink Salon Interior" },
  { src: "/gallery/gallery-luxury-chairs.png", title: "Luxury Treatment Chairs" },
  { src: "/gallery/gallery-offers.png", title: "Abla Fahita Offers" },
  { src: "/gallery/gallery-seasonal-packages.png", title: "Seasonal Beauty Packages" },
  { src: "/gallery/gallery-salon-care.png", title: "Salon Care" },
  { src: "/gallery/gallery-beauty-products.png", title: "Beauty Products" },
];

export const happyCustomerItems = Array.from({ length: 67 }, (_, index) => ({
  src: `/gallery/happy-customers/happy-customer-${String(index + 1).padStart(2, "0")}.jpg`,
  title: `Abla Fahita Happy Customers ${index + 1}`,
}));
