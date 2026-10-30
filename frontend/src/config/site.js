// Centralised site/boutique configuration — easy to edit for the store owner.
export const SITE = {
  brand: "Shubh Deep",
  tagline: "Traditional Diwali Boutique",
  // Store owner: official WhatsApp number including country code (91)
  whatsappNumber: "917499522249",
  email: "hello@shubhdeep.in",
  phoneDisplay: "+91 74995 22249",
  address: "Lane 7, Shilp Nagar, Jaipur · Rajasthan · India",
  instagram: "https://instagram.com/shubhdeep",
  announcement: "Festive Dispatch On · Order Early For Diwali · Free Shipping Pan-India On Orders Above ₹1,499"
};

export const buildWhatsAppUrl = (message) =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(n);
