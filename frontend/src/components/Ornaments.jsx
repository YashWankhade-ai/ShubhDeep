import React from "react";

// Decorative Indian ornamental SVGs — restrained, used as section accents.

export const GoldDivider = ({ className = "", light = false }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`}>
    <span
      className={`h-px w-20 ${
        light
          ? "bg-gradient-to-r from-transparent via-[#C5A15B] to-[#C5A15B]"
          : "bg-gradient-to-r from-transparent via-[#C5A15B]/70 to-[#C5A15B]/80"
      }`}
    />
    <DiyaMark className="h-5 w-5" light={light} />
    <span
      className={`h-px w-20 ${
        light
          ? "bg-gradient-to-l from-transparent via-[#C5A15B] to-[#C5A15B]"
          : "bg-gradient-to-l from-transparent via-[#C5A15B]/70 to-[#C5A15B]/80"
      }`}
    />
  </div>
);

export const DiyaMark = ({ className = "", light = false }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
    <ellipse
      cx="16"
      cy="22"
      rx="12"
      ry="4"
      stroke="#C5A15B"
      strokeWidth="1.2"
    />
    <path
      d="M16 6 C 13.5 10, 13.5 14, 16 18 C 18.5 14, 18.5 10, 16 6 Z"
      fill="#D99A35"
      className="flame-flicker"
    />
    <circle
      cx="16"
      cy="20"
      r="1.4"
      fill={light ? "#C5A15B" : "#641B25"}
    />
  </svg>
);

export const PaisleyCorner = ({ className = "" }) => (
  <svg
    viewBox="0 0 120 120"
    className={`pointer-events-none absolute ${className}`}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M10 110 C 10 50, 50 10, 110 10"
      stroke="#C5A15B"
      strokeOpacity="0.45"
      strokeWidth="1.2"
    />
    <path
      d="M22 100 C 24 70, 50 40, 86 42"
      stroke="#C5A15B"
      strokeOpacity="0.35"
      strokeWidth="1"
    />
    <circle cx="68" cy="58" r="2.5" fill="#C5A15B" fillOpacity="0.55" />
    <circle cx="82" cy="46" r="1.6" fill="#C5A15B" fillOpacity="0.4" />
  </svg>
);

export const Marigold = ({ className = "" }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <g>
      {Array.from({ length: 10 }).map((_, i) => (
        <circle
          key={i}
          cx={24 + Math.cos((i * Math.PI * 2) / 10) * 12}
          cy={24 + Math.sin((i * Math.PI * 2) / 10) * 12}
          r="5"
          fill="#D99A35"
          fillOpacity="0.9"
        />
      ))}
      <circle cx="24" cy="24" r="7" fill="#B85C38" />
      <circle cx="24" cy="24" r="3" fill="#C5A15B" />
    </g>
  </svg>
);
