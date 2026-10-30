import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE, buildWhatsAppUrl } from "../config/site";
import { DiyaMark } from "./Ornaments";

export const Footer = () => {
  return (
    <footer
      className="bg-[#42121B] text-[#FFF8EC]"
      data-testid="site-footer"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-[#C5A15B]/60">
                <DiyaMark className="h-6 w-6" light={true} />
              </span>
              <span className="font-serif-display text-2xl text-[#FFF8EC]">
                {SITE.brand}
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[#FFF8EC]/75">
              A traditional Indian Diwali boutique curating handcrafted diyas, brass lamps, hampers and festive décor — made with care, lit with love.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 className="eyebrow text-[#C5A15B]">Shop Collections</h4>
            <ul className="mt-5 space-y-2.5 text-sm">
              {[
                ["/shop/clay-diyas", "Clay Diyas"],
                ["/shop/decorative-diyas", "Decorative Diyas"],
                ["/shop/brass-stands", "Brass Diya Stands"],
                ["/shop/handmade-artistic", "Handmade Artistic"],
                ["/shop/gift-hampers", "Festive Hampers"],
                ["/shop/rangoli-decor", "Rangoli & Decor"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[#FFF8EC]/80 transition-colors hover:text-[#D99A35]"
                    data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutique Policies */}
          <div>
            <h4 className="eyebrow text-[#C5A15B]">Boutique</h4>
            <ul className="mt-5 space-y-2.5 text-sm">
              {[
                ["/track-order", "Track Your Order"],
                ["/our-story", "Our Story"],
                ["/contact", "Contact"],
                ["/policies/shipping", "Shipping Policy"],
                ["/policies/returns", "Returns & Refunds"],
                ["/policies/privacy", "Privacy Policy"],
                ["/policies/terms", "Terms & Conditions"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[#FFF8EC]/80 transition-colors hover:text-[#D99A35]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="eyebrow text-[#C5A15B]">Reach Us</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#C5A15B] shrink-0" />
                <span className="text-[#FFF8EC]/80">{SITE.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#C5A15B] shrink-0" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-[#FFF8EC]/80 transition hover:text-[#C5A15B]"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#C5A15B] shrink-0" />
                <span className="text-[#FFF8EC]/80">{SITE.phoneDisplay}</span>
              </li>
              <li className="pt-2">
                <a
                  href={buildWhatsAppUrl("Namaste ShubhDeep! I would like to inquire about your festive collection.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-[#25D366]/20 border border-[#25D366]/40 px-3 py-1.5 text-xs font-semibold text-[#25D366] hover:bg-[#25D366]/30 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-[#C5A15B]/20 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFF8EC]/60 gap-4">
          <p>© {new Date().getFullYear()} {SITE.brand}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin" className="hover:text-[#C5A15B] transition">Admin Portal</Link>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#C5A15B] transition"
            >
              <Instagram className="h-3.5 w-3.5" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
