import { formatINR } from "../config/site";

const BASE_STORE_URL = window.location.origin;

/**
 * Format a clean 10-12 digit Indian phone number for wa.me links
 */
export function formatWhatsAppPhone(phone) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.startsWith("0") && digits.length === 11) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Generates status-specific festive WhatsApp update messages for patrons
 */
export function generateWhatsAppMessage(order, customNote = "") {
  if (!order) return "";

  const name = order.customer_name || "Valued Patron";
  const orderNum = order.order_number || "";
  const status = (order.order_status || "pending").toLowerCase();
  const total = formatINR(order.total_amount);
  const trackingUrl = `${BASE_STORE_URL}/track-order?order=${encodeURIComponent(orderNum)}`;

  const itemsList = Array.isArray(order.items) && order.items.length > 0
    ? order.items.map(i => `  • ${i.product_name_snapshot || i.name} (Qty: ${i.quantity})`).join("\n")
    : "  • Handcrafted Festive Diya Selection";

  const noteBlock = customNote ? `\n📝 *Note from Artisan:* ${customNote}\n` : "";

  switch (status) {
    case "confirmed":
      return `🪔 *ShubhDeep — Order Confirmed!*

Namaste *${name}*,
Thank you for bringing ShubhDeep's handcrafted festive lamps into your home. Your order *${orderNum}* has been officially confirmed!

📦 *Ordered Items:*
${itemsList}

💰 *Total Amount:* ${total}
📍 *Shipping Destination:* ${order.delivery_address}
${noteBlock}
Our artisan communities in Rajasthan & Bengal are preparing your package with sacred care.

🔗 *Live Order Tracking:*
${trackingUrl}

Wishing you and your family a bright and joyous festive season! ✨
— ShubhDeep Traditional Diyas`;

    case "processing":
      return `🪔 *ShubhDeep — Order In Production & Packing*

Namaste *${name}*,
Update regarding order *${orderNum}*:

Your festive diyas are currently being handcrafted, cleaned, and securely packed in our eco-friendly gift boxes. 🎁

💰 *Order Total:* ${total}
${noteBlock}
🔗 *Check Progress Anytime:*
${trackingUrl}

We will notify you as soon as the courier partner picks up your parcel.

Warm regards,
— Team ShubhDeep`;

    case "shipped":
      return `🚚 *ShubhDeep — Order Dispatched & In Transit!*

Namaste *${name}*,
Exciting news! Your handcrafted festive diyas for order *${orderNum}* have been dispatched and are on their way to you!

📍 *Delivering To:* ${order.delivery_address}
📦 *Package:* ${order.items?.length || 1} item(s)
${noteBlock}
🔗 *Live Tracking Link:*
${trackingUrl}

${order.payment_status === "paid" ? "✅ *Payment:* Fully Paid" : "💵 *Payment:* Cash On Delivery (Please keep exact amount ready)"}

Your home will be glowing auspiciously very soon! 🪔
— Team ShubhDeep`;

    case "delivered":
      return `✨ *ShubhDeep — Order Successfully Delivered!*

Namaste *${name}*,
Your ShubhDeep order *${orderNum}* has been delivered to your doorstep.

May the sacred light of these handcrafted diyas bring peace, prosperity, and immense joy to your household this Diwali! 🪔🙏

We would love to see how your festive setup looks. Feel free to share a photo or tag us!

Warm festive greetings,
— ShubhDeep Handcrafted Boutique`;

    case "cancelled":
      return `⚠️ *ShubhDeep — Order Cancellation Update*

Namaste *${name}*,
This is to inform you that your order *${orderNum}* has been marked as cancelled.
${noteBlock}
If this was requested by you, no further action is needed. Any advance payment or reservations will be refunded/settled.

If this was an error, please reply to this WhatsApp message or call us immediately.

— ShubhDeep Support`;

    case "pending":
    default:
      return `🪔 *ShubhDeep — Order Received*

Namaste *${name}*,
We have received your order *${orderNum}* on ShubhDeep Diya Store.

📦 *Ordered Items:*
${itemsList}
💰 *Total Amount:* ${total}
📍 *Delivery Address:* ${order.delivery_address}
${noteBlock}
🔗 *Live Tracking:* ${trackingUrl}

Our team will confirm your order shortly. Please let us know if you need any adjustments.

— Team ShubhDeep`;
  }
}

/**
 * Builds direct https://wa.me link with encoded text
 */
export function buildCustomerWhatsAppUrl(order, customNote = "") {
  const phone = formatWhatsAppPhone(order.customer_phone);
  const message = generateWhatsAppMessage(order, customNote);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
