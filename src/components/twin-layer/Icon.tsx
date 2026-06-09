import type { ReactElement } from "react";

export type IconName =
  | "solar" | "utility" | "battery" | "panel" | "meter" | "ev" | "backup" | "generator"
  | "bell" | "gear" | "home" | "layers" | "users" | "arrow" | "search" | "shield"
  | "check" | "plus" | "chevron" | "passport" | "target" | "spark" | "link" | "clock" | "scale";

const ICON_PATHS: Record<IconName, ReactElement> = {
  solar: <g><rect x="4" y="5" width="16" height="11" rx="1" /><path d="M4 9h16M4 12.5h16M9.5 5v11M14.5 5v11" /><path d="M8 19h8M12 16v3" /></g>,
  utility: <g><path d="M7 21l2.2-16M17 21l-2.2-16" /><path d="M9.2 5h5.6M8.5 10h7M8 15h8" /><path d="M9 8l6 4M15 8l-6 4" /></g>,
  battery: <g><rect x="4" y="7" width="15" height="10" rx="2" /><path d="M21 10v4" /><path d="M11 9l-2 3.2h2.6L9.6 15" /></g>,
  panel: <g><rect x="6" y="3" width="12" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /></g>,
  meter: <g><circle cx="12" cy="11" r="7" /><path d="M12 11l3-2.5" /><circle cx="12" cy="11" r="1" /><path d="M9 21h6" /></g>,
  ev: <g><rect x="5" y="4" width="9" height="14" rx="1.5" /><path d="M14 8h2.5a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 1.5 1.5V10" /><path d="M10 8l-2 3h3l-2 3" /></g>,
  backup: <g><path d="M12 3l8 4v5c0 4.5-3.2 7.5-8 9-4.8-1.5-8-4.5-8-9V7z" /><path d="M9.5 12l1.8 1.8L15 9.8" /></g>,
  generator: <g><rect x="3" y="7" width="18" height="11" rx="2" /><path d="M7 7V5h10v2" /><path d="M8 12h3l-1 2.5M14 11.5l1 1.5h2" /></g>,
  bell: <g><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 20a2 2 0 0 0 4 0" /></g>,
  gear: <g><circle cx="12" cy="12" r="3.2" /><path d="M12 3v2.5M12 18.5V21M21 12h-2.5M5.5 12H3M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8M18.4 18.4l-1.8-1.8M7.4 7.4L5.6 5.6" /></g>,
  home: <g><path d="M4 11l8-6 8 6" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></g>,
  layers: <g><path d="M12 3l8 4.5-8 4.5-8-4.5z" /><path d="M4 12l8 4.5 8-4.5" /><path d="M4 16.5L12 21l8-4.5" /></g>,
  users: <g><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" /><path d="M16 5.2A3 3 0 0 1 18 11M21 20c0-2.6-1.6-4.2-4-4.8" /></g>,
  arrow: <g><path d="M5 12h14M13 6l6 6-6 6" /></g>,
  search: <g><circle cx="11" cy="11" r="6" /><path d="M20 20l-4-4" /></g>,
  shield: <g><path d="M12 3l8 4v5c0 4.5-3.2 7.5-8 9-4.8-1.5-8-4.5-8-9V7z" /></g>,
  check: <g><path d="M5 12.5l4.5 4.5L19 7" /></g>,
  plus: <g><path d="M12 5v14M5 12h14" /></g>,
  chevron: <g><path d="M9 6l6 6-6 6" /></g>,
  passport: <g><rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="10" r="2.6" /><path d="M8.5 16.5h7" /></g>,
  target: <g><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></g>,
  spark: <g><path d="M13 3l-1.5 7H16l-5 11 1.5-8H8z" /></g>,
  link: <g><path d="M9 12h6" /><path d="M10 8H7a4 4 0 0 0 0 8h3M14 8h3a4 4 0 0 1 0 8h-3" /></g>,
  clock: <g><circle cx="12" cy="12" r="8" /><path d="M12 8v4.5l3 2" /></g>,
  scale: <g><path d="M12 4v16M6 8h12" /><path d="M6 8l-2.5 6h5zM18 8l-2.5 6h5z" /></g>,
};

export function Icon({
  name, size = 22, stroke = 1.6, className = "",
}: { name: IconName; size?: number; stroke?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[name] || null}
    </svg>
  );
}
