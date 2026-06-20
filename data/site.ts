export const site = {
  brandName: "Abla Fahita Salon",
  brandNameAr: "صالون أبلة فاهيتا",
  legalName: "SALON ABLA FAHITA FOR HAIRDRESSING L.L.C",
  tradeName: "ABLA FAHITA SALON / صالون أبلة فاهيتا",
  registrationNumber: "22662",
  address:
    "Shop/Office 115, Level 1, Reem Mall, Najmat Abu Dhabi, Al Reem Island, Abu Dhabi, United Arab Emirates",
  shortAddress: "Shop/Office 115, Level 1, Reem Mall, Al Reem Island, Abu Dhabi",
  facebook: "https://www.facebook.com/salonablafahita/",
  instagram: "https://www.instagram.com/salonablafahita/?hl=en",
  whatsapp: "+971553673674",
  phone: "+971553673674",
  openingHours: "Daily: 10:00 AM - 10:00 PM",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Reem%20Mall%20Abu%20Dhabi",
};

export const whatsappHref = (message = "Hello Abla Fahita Salon, I would like to book an appointment.") =>
  `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
