import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, ShoppingBag, X, ShieldCheck, User, Sparkles } from "lucide-react";
import { SITE } from "../config/site";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { DiyaMark } from "./Ornaments";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop Diyas" },
  { to: "/shop/decorative-diyas", label: "Decorative Diyas" },
  { to: "/shop/brass-stands", label: "Diya Stands" },
  { to: "/shop/gift-hampers", label: "Festive Hampers" },
  { to: "/our-story", label: "Our Story" },
  { to: "/contact", label: "Contact" },
  { to: "/track-order", label: "Track Order" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { totalCount, openCart } = useCart();
  const { customer, isCustomerAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-40 border-b border-[#C5A15B]/30 bg-[#641B25] text-[#FFF8EC]"
      data-testid="site-header"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
          data-testid="brand-logo-link"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[#C5A15B]/60 bg-[#42121B]/40">
            <DiyaMark className="h-6 w-6" light={true} />
          </span>
          <div className="flex flex-col">
            <span className="font-serif-display text-2xl font-bold tracking-wider text-[#FFF8EC]">
              {SITE.brand}
            </span>
            <span className="eyebrow -mt-1 text-[0.62rem] text-[#C5A15B]">
              {SITE.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `text-xs font-medium tracking-[0.14em] uppercase transition-colors hover:text-[#C5A15B] ${
                  isActive ? "text-[#C5A15B] underline underline-offset-8" : "text-[#FFF8EC]/90"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Customer User Login / Account Button */}
          {isCustomerAuthenticated && customer ? (
            <Link
              to="/account"
              className="flex items-center gap-1.5 rounded-full border border-[#C5A15B]/60 bg-[#42121B] px-3 py-1.5 text-xs font-semibold text-[#FFF8EC] hover:border-[#C5A15B] hover:bg-[#42121B]/90 transition shadow-sm"
              title="My Patron Account"
            >
              <User className="h-3.5 w-3.5 text-[#C5A15B]" />
              <span className="hidden sm:inline max-w-[85px] truncate">{customer.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-full border border-[#C5A15B]/40 bg-[#42121B]/50 px-3 py-1.5 text-xs font-medium text-[#FFF8EC] hover:border-[#C5A15B] hover:text-[#C5A15B] transition"
              title="Sign In / Register"
            >
              <User className="h-3.5 w-3.5 text-[#C5A15B]" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Admin link shortcut */}
          <Link
            to="/admin"
            className="hidden p-2 text-[#C5A15B]/70 hover:text-[#C5A15B] sm:inline-block"
            title="Admin Portal"
            aria-label="Admin Portal"
          >
            <ShieldCheck className="h-4 w-4" />
          </Link>

          {/* Cart Button */}
          <button
            onClick={openCart}
            data-testid="header-cart-button"
            className="relative flex items-center gap-2 rounded-full border border-[#C5A15B]/40 bg-[#42121B] px-4 py-2 text-xs font-semibold tracking-wider text-[#C5A15B] transition-all hover:border-[#C5A15B] hover:bg-[#42121B]/80"
            aria-label={`Shopping cart with ${totalCount} items`}
          >
            <ShoppingBag className="h-4 w-4 text-[#C5A15B]" />
            <span className="hidden sm:inline">Thali</span>
            <span
              data-testid="header-cart-badge"
              className="ml-1 inline-grid h-5 w-5 place-items-center rounded-full bg-[#D99A35] text-[0.7rem] font-bold text-[#42121B]"
            >
              {totalCount}
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="grid h-10 w-10 place-items-center rounded border border-[#C5A15B]/30 text-[#FFF8EC] hover:bg-[#42121B] lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-[#C5A15B]/20 bg-[#42121B] px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wider uppercase ${
                    isActive ? "text-[#C5A15B]" : "text-[#FFF8EC]/90"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {isCustomerAuthenticated && customer ? (
              <NavLink
                to="/account"
                onClick={() => setOpen(false)}
                className="pt-2 border-t border-[#C5A15B]/30 text-sm font-semibold tracking-wider uppercase text-[#C5A15B] flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>My Account ({customer.name.split(" ")[0]})</span>
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className="pt-2 border-t border-[#C5A15B]/30 text-sm font-semibold tracking-wider uppercase text-[#C5A15B] flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>Patron Sign In / Register</span>
              </NavLink>
            )}

            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-2 text-xs text-[#C5A15B]/80 hover:text-[#C5A15B]"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
