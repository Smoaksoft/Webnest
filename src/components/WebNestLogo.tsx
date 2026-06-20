import React from "react";

interface WebNestLogoProps {
  /** Size tier: 'sm' for header, 'md' for panels, 'lg' for hero sections or detailed displays */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Whether to show the brand text "WebNest" next to or below the logo icon */
  showText?: boolean;
  /** Whether to show the tagline text below the brand name */
  showTagline?: boolean;
  /** 'light' (default) uses dark navy for "Web" text, 'dark' uses white */
  theme?: "light" | "dark";
  /** Optional container className for spacing or layout override */
  className?: string;
  /** Align logo and text horizontally (row) or vertically (col) */
  direction?: "row" | "col";
}

export default function WebNestLogo({
  size = "md",
  showText = true,
  showTagline = false,
  theme = "light",
  className = "",
  direction = "row"
}: WebNestLogoProps) {
  // Determine sizing values
  const sizeMap = {
    xs: { iconWidth: 24, iconHeight: 18, textClass: "text-sm", taglineClass: "text-[8px]" },
    sm: { iconWidth: 32, iconHeight: 24, textClass: "text-base", taglineClass: "text-[9px]" },
    md: { iconWidth: 48, iconHeight: 36, textClass: "text-xl", taglineClass: "text-[10px]" },
    lg: { iconWidth: 80, iconHeight: 60, textClass: "text-3xl", taglineClass: "text-[12px]" },
    xl: { iconWidth: 154, iconHeight: 115, textClass: "text-5xl", taglineClass: "text-[14px]" }
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isDark = theme === "dark";

  return (
    <div 
      className={`inline-flex items-center ${
        direction === "col" ? "flex-col text-center" : "flex-row text-left"
      } gap-3 ${className}`}
      id="webnest-logo-wrapper"
    >
      {/* PERFECT SCALABLE SVG LOGO MARK */}
      <svg
        width={currentSize.iconWidth}
        height={currentSize.iconHeight}
        viewBox="0 0 170 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform duration-300 hover:scale-105"
        id="webnest-logo-svg"
      >
        <defs>
          {/* Main glowing light-cyan to primary blue gradient (Left leg of W) */}
          <linearGradient id="wn-cyan-blue" x1="28" y1="20" x2="68" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00C2FF" />
            <stop offset="100%" stopColor="#0A66FF" />
          </linearGradient>

          {/* Deep royal blue to navy/black gradient (Middle ribbon fold) */}
          <linearGradient id="wn-royal-navy" x1="110" y1="20" x2="70" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0A66FF" />
            <stop offset="100%" stopColor="#05256E" />
          </linearGradient>

          {/* Saturated primary blue to midnight blue gradient (Right peak ribbon) */}
          <linearGradient id="wn-blue-midnight" x1="130" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0A66FF" />
            <stop offset="100%" stopColor="#001850" />
          </linearGradient>
          
          {/* Drop shadow for visual 3D overlapping depth */}
          <filter id="wn-shadow" x="-5" y="-5" width="180" height="130" filterUnits="userSpaceOnUse">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        <g filter="url(#wn-shadow)">
          {/* Left Ribbon-Loop going down and up into the center crest */}
          {/* Beautiful 3D folded pill vector representation */}
          <path
            d="M 28.5 24 C 20 22 18 36 24 45 L 61 100 C 65.5 107 76.5 107 81 100 L 92.5 83 C 94.5 80 94.5 76 92 73.5 L 62.5 45 C 57 39.5 49.5 31.5 46.5 28.5 L 42 24 C 37.5 20.5 33 22 28.5 24 Z"
            fill="url(#wn-cyan-blue)"
          />

          {/* Overlapping Middle Ribbon folding down into the right valley */}
          <path
            d="M 92.5 83 L 110.5 100 C 115 107 126 107 130.5 100 L 157 58 C 163 48.5 152 35.5 142.5 43.5 L 126.5 57 C 123.5 59.5 119.5 59.5 116.5 57 L 92.5 37 C 88 33 80.5 40 85 46 L 105 73.5 L 92.5 83 Z"
            fill="url(#wn-royal-navy)"
          />

          {/* Right main ribbon crest matching the user logo image */}
          <path
            d="M 116.5 57 L 142.5 24 C 147 18.5 158 20 162.5 27 C 165 31 164.5 36.5 161.5 41 L 130.5 88 C 126.5 94 115 94 111 88 L 92.5 61"
            fill="url(#wn-blue-midnight)"
            opacity="0.92"
          />

          {/* Floating/disruptive technical pixels scattering at top-right peak representing web innovation */}
          {/* Top pixel (Dark Blue) */}
          <rect x="156" y="10" width="8" height="8" fill="#001B5E" rx="1.5" />
          {/* Bright Primary Blue Pixel */}
          <rect x="144" y="12" width="10" height="10" fill="#0A66FF" rx="1.5" />
          {/* Small Cyan Pixel */}
          <rect x="135" y="24" width="7" height="7" fill="#00C2FF" rx="1" />
          {/* High Right Pixel */}
          <rect x="167" y="16.5" width="8" height="8" fill="#001B5E" rx="1.5" />
          {/* Tiny bottom pixel */}
          <rect x="151.5" y="27" width="7" height="7" fill="#0A66FF" rx="1" />
          {/* Additional background accent pixels for density */}
          <rect x="140" y="34.5" width="6" height="6" fill="#D3E5FF" rx="1" />
        </g>
      </svg>

      {/* TYPOGRAPHY SECTION */}
      {(showText || showTagline) && (
        <div className="flex flex-col select-none">
          {showText && (
            <div className={`font-sans tracking-tight leading-none ${currentSize.textClass}`}>
              <span className={`font-black ${isDark ? "text-white" : "text-[#001B5E]"}`}>
                Web
              </span>
              <span className="font-extrabold text-[#0A66FF]">
                Nest
              </span>
            </div>
          )}

          {/* Standard brand tagline shown in hero or about banners */}
          {showTagline && (
            <div className={`mt-1 font-sans ${currentSize.taglineClass} text-slate-400 font-medium tracking-wide`}>
              Building Digital Experiences That Drive Growth
            </div>
          )}
        </div>
      )}
    </div>
  );
}
