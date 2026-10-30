import React from "react";
import { Sparkles, Flower2, Gift, MessageCircle } from "lucide-react";
import { GoldDivider } from "./Ornaments";

const FEATURES = [
  {
    icon: Flower2,
    title: "Beautiful Designs",
    text: "Each piece is thoughtfully curated — never mass-produced, always festive."
  },
  {
    icon: Gift,
    title: "Festive Gifting",
    text: "Hamper-ready packaging with handwritten notes for family and corporates."
  },
  {
    icon: MessageCircle,
    title: "Easy Ordering",
    text: "Order online or on WhatsApp in under a minute — we confirm, pack and ship."
  },
  {
    icon: Sparkles,
    title: "A Celebration of Tradition",
    text: "Supporting Indian potters, weavers and artisan women every Diwali."
  }
];

export const WhyShopWithUs = () => {
  return (
    <section
      className="bg-[#FFF8EC] py-20 lg:py-28"
      data-testid="why-shop-with-us-section"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Why Shop With Us</span>
          <h2 className="font-serif-display mt-4 text-3xl text-[#42121B] sm:text-4xl lg:text-5xl">
            Little details, large joys.
          </h2>
          <GoldDivider className="mt-6" />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group relative border border-[#C5A15B]/30 bg-white p-8 text-center transition-all hover:border-[#C5A15B] hover:shadow-lg"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#C5A15B]/50 bg-[#FFF8EC] text-[#641B25] transition-colors group-hover:bg-[#641B25] group-hover:text-[#C5A15B]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif-display mt-6 text-xl text-[#42121B]">
                  {f.title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-[#8A5A44]">
                  {f.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
