import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3.5 8h9M9 4.5 12.5 8 9 11.5" />
  </svg>
);

export const ChevronDown = (p: P) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m4 6 4 4 4-4" />
  </svg>
);

export const Check = (p: P) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m3 8.5 3 3 7-7" />
  </svg>
);

export const Sparkle = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2c.5 4.5 3 7 7.5 7.5C15 10 12.5 12.5 12 17c-.5-4.5-3-7-7.5-7.5C9 9 11.5 6.5 12 2Z" />
    <path d="M19 14c.25 2 1.25 3 3.2 3.2-1.95.2-2.95 1.2-3.2 3.2-.25-2-1.25-3-3.2-3.2 1.95-.2 2.95-1.2 3.2-3.2Z" opacity=".7" />
  </svg>
);

export const Message = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.5L3 20.5l1.5-5.1A8.4 8.4 0 1 1 21 11.5Z" />
  </svg>
);

export const Globe = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.8 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.8-3.8-9S9.5 5.6 12 3Z" />
  </svg>
);

export const Bulb = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M9.5 18h5M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3Z" />
  </svg>
);

export const Book = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 4.6A1.6 1.6 0 0 1 6.6 3H19v15.5H6.6A1.6 1.6 0 0 0 5 20V4.6Z" />
    <path d="M5 18.5A1.6 1.6 0 0 0 6.6 21H19M9 7.5h6M9 11h4" />
  </svg>
);

export const Users = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19c.6-3 2.9-4.5 5.5-4.5S13.9 16 14.5 19" />
    <path d="M15.5 5.2A3.2 3.2 0 0 1 17 11M17 14.6c2.2.3 3.9 1.8 4.5 4.4" />
  </svg>
);

export const Mic = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" />
  </svg>
);

export const MapIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="6" cy="6" r="2.4" />
    <circle cx="18" cy="9" r="2.4" />
    <circle cx="10" cy="18" r="2.4" />
    <path d="M8.2 7.2 15.7 8.6M16.6 11 11.4 16.2M7 8.3l2.2 7.4" />
  </svg>
);

export const Shield = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 3 5 5.8v5.4c0 4.4 2.9 7.6 7 9.8 4.1-2.2 7-5.4 7-9.8V5.8L12 3Z" />
    <path d="m9 11.6 2.2 2.2L15.5 9.5" />
  </svg>
);

export const Chart = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 4v16h16" />
    <path d="m7.5 14.5 3.5-4 3 2.5 4.5-6" />
  </svg>
);

export const Heart = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 20.5S4 15.5 4 9.8C4 7 6.2 5 8.7 5c1.4 0 2.6.7 3.3 1.7C12.7 5.7 13.9 5 15.3 5 17.8 5 20 7 20 9.8c0 5.7-8 10.7-8 10.7Z" />
  </svg>
);

export const Pause = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
    <path d="M9 5.5v13M15 5.5v13" />
  </svg>
);

/* ---- social ---- */
export const LinkedIn = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 22 10.6 22 14v7h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V21H9V9Z" />
  </svg>
);
export const XLogo = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.5 3h3l-7 8 8.2 10h-6.4l-5-6.1L8 21H5l7.4-8.5L4.5 3H11l4.5 5.6L17.5 3Zm-1.1 16h1.7L7.7 4.8H5.9L16.4 19Z" />
  </svg>
);
export const TikTok = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M16.5 3c.3 2 1.6 3.6 3.5 4v2.3c-1.3 0-2.6-.4-3.6-1.1v6.1c0 3.2-2.6 5.7-5.8 5.4-2.7-.2-4.8-2.5-4.7-5.2.1-2.8 2.6-5 5.4-4.7v2.5c-1.4-.4-2.8.6-2.9 2-.1 1.3 1 2.5 2.3 2.4 1.2 0 2.2-1 2.2-2.3V3h3.6Z" />
  </svg>
);
export const Instagram = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.6" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
