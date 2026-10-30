import React from "react";
import { Instagram } from "lucide-react";
import { INSTAGRAM_FEED } from "../data/products";
import { SITE } from "../config/site";
import { GoldDivider } from "./Ornaments";

export const InstagramGallery = () => {
  return (
    <section
      className="bg-[#FFF8EC] py-20 lg:py-28"
      data-testid="instagram-gallery-section"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Follow The Glow</span>
          <h2 className="font-serif-display mt-4 text-3xl text-[#42121B] sm:text-4xl lg:text-5xl">
            @shubhdeep on Instagram
          </h2>
          <GoldDivider className="mt-6" />
        </div>

        <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {INSTAGRAM_FEED.map((img, i) => (
            <a
              key={i}
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-white"
            >
              <img
                src={img}
                alt={`ShubhDeep festive diya ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 grid place-items-center bg-[#42121B]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Instagram className="h-7 w-7 text-[#C5A15B]" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
