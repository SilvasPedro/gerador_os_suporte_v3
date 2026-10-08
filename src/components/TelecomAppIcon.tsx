import React from 'react';

interface Props {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const TelecomAppIcon: React.FC<Props> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const containerSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative rounded-xl bg-gradient-to-br from-[#ff1744] via-[#e4022c] to-[#990017] p-1 flex items-center justify-center text-white shadow-md shadow-red-500/20 shrink-0 select-none overflow-hidden ${containerSize} ${className}`}
    >
      {/* Subtle background tech grid glow */}
      <div className="absolute inset-0 bg-radial from-white/20 to-transparent pointer-events-none" />

      {/* Bespoke Telecom Fiber & Transmission Order SVG */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-white drop-shadow-xs"
      >
        {/* Optical Pulse / Radio Waves */}
        <path
          d="M13 22C18 16 25 13 32 13C39 13 46 16 51 22"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />
        <path
          d="M19 28C22.5 24 27 22 32 22C37 22 41.5 24 45 28"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Central Telecom Mast / Tower & Fiber Node */}
        <circle cx="32" cy="32" r="4.5" fill="white" />
        <path
          d="M32 32L24 53"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M32 32L40 53"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M26 44H38"
          stroke="white"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Vertical Optical Core Pulse / Lightning Line */}
        <path
          d="M32 7V13"
          stroke="#ffeb3b"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Checkmark Badge for Service Order completion */}
        <circle cx="48" cy="46" r="9" fill="#10b981" stroke="#990017" strokeWidth="2" />
        <path
          d="M44.5 46L47 48.5L51.5 44"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
