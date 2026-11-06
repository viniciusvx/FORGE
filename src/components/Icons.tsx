import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const icon = (path: string, viewBox = '0 0 24 24') =>
  ({ size = 20, className = '', style }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {path.split('|').map((d, i) => <path key={i} d={d} />)}
    </svg>
  );

export const HomeIcon = icon('M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10');
export const DumbbellIcon = icon('M6.5 6.5v11|M3.5 9v6|M17.5 6.5v11|M20.5 9v6|M6.5 12h11');
export const ClipboardIcon = icon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2|M9 5a2 2 0 000 4h6a2 2 0 000-4|M9 5a2 2 0 012-2h2a2 2 0 012 2');
export const TrendingUpIcon = icon('M23 6l-9.5 9.5-5-5L1 18|M17 6h6v6');
export const MenuIcon = icon('M3 12h18|M3 6h18|M3 18h18');
export const PlusIcon = icon('M12 5v14|M5 12h14');
export const ChevronRightIcon = icon('M9 18l6-6-6-6');
export const ChevronLeftIcon = icon('M15 18l-6-6 6-6');
export const ChevronDownIcon = icon('M6 9l6 6 6-6');
export const XIcon = icon('M18 6L6 18|M6 6l12 12');
export const CheckIcon = icon('M20 6L9 17l-5-5');
export const TrashIcon = icon('M3 6h18|M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6|M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2');
export const EditIcon = icon('M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7|M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z');
export const SearchIcon = icon('M11 19a8 8 0 100-16 8 8 0 000 16z|M21 21l-4.35-4.35');
export const TimerIcon = icon('M12 22a10 10 0 100-20 10 10 0 000 20z|M12 6v6l4 2');
export const PlayIcon = icon('M5 3l14 9-14 9V3z');
export const PauseIcon = icon('M6 4h4v16H6z|M14 4h4v16h-4z');
export const StopIcon = icon('M5 5h14v14H5z');
export const ArrowUpIcon = icon('M12 19V5|M5 12l7-7 7 7');
export const ArrowDownIcon = icon('M12 5v14|M19 12l-7 7-7-7');
export const BodyIcon = icon('M12 2a3 3 0 110 6 3 3 0 010-6z|M6.5 8.5C4 10 3 13 3 16l3 1 1 5h10l1-5 3-1c0-3-1-6-3.5-7.5');
export const FlameIcon = icon('M12 2c0 4-4 6-4 10a4 4 0 008 0c0-4-4-6-4-10z|M9 17.5A2.5 2.5 0 0012 20a2.5 2.5 0 002.5-2.5');
export const SettingsIcon = icon('M12 15a3 3 0 100-6 3 3 0 000 6z|M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z');
export const ShareIcon = icon('M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8|M16 6l-4-4-4 4|M12 2v13');
export const DownloadIcon = icon('M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4|M7 10l5 5 5-5|M12 15V3');
export const InfoIcon = icon('M12 22a10 10 0 100-20 10 10 0 000 20z|M12 8h.01|M11 12h1v4h1');
export const RepeatIcon = icon('M17 1l4 4-4 4|M3 11V9a4 4 0 014-4h14|M7 23l-4-4 4-4|M21 13v2a4 4 0 01-4 4H3');
export const ZapIcon = icon('M13 2L3 14h9l-1 8 10-12h-9l1-8z');
export const CopyIcon = icon('M9 9h11v11H9z|M5 15V4h11');
export const ChevronUpIcon = icon('M18 15l-6-6-6 6');
