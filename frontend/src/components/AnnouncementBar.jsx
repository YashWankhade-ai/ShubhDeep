import React from "react";
import { Sparkles } from "lucide-react";
import { SITE } from "../config/site";

export const AnnouncementBar = () => {
  return (
    <div
      className="bg-[#42121B] text-[#FFF8EC] text-xs tracking-[0.22em] uppercase"
      data-testid="announcement-bar"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5">
        <Sparkles className="h-3.5 w-3.5 text-[#C5A15B]" aria-hidden="true" />
        <p className="text-center font-medium">{SITE.announcement}</p>
        <Sparkles className="h-3.5 w-3.5 text-[#C5A15B]" aria-hidden="true" />
      </div>
    </div>
  );
};
