import React from 'react';

/**
 * NIRBHOY Health Official Brand Monogram
 * Engineered with:
 * - Midnight Violet (#21183B)
 * - Deep Electric Lavender (#7c3aed)
 * - Heartbeat Crimson (#ff1753)
 * Symbolism:
 * - Letter 'N' Monogram
 * - Dynamic ECG Lifeline & Crimson Pulse Node
 * - Fearless Care Loop
 */
export default function Logo({ size = 'md', showText = false, textClassName = '' }) {
  const sizeMap = {
    xs: { box: 'h-7 w-7', svg: 'h-7 w-7' },
    sm: { box: 'h-9 w-9', svg: 'h-9 w-9' },
    md: { box: 'h-10 w-10', svg: 'h-10 w-10' },
    lg: { box: 'h-12 w-12', svg: 'h-12 w-12' },
    xl: { box: 'h-16 w-16', svg: 'h-16 w-16' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="inline-flex items-center gap-3">
      <div className={`${currentSize.box} rounded-xl bg-[#21183B] border border-[#7c3aed]/50 flex items-center justify-center p-1.5 shadow-md shadow-[#21183B]/20 flex-shrink-0 group-hover:border-[#7c3aed] transition-colors`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Left Pillar of 'N' (Deep Electric Lavender) */}
          <path d="M30 26 V74" stroke="#7c3aed" strokeWidth="8.5" strokeLinecap="round" />
          {/* Dynamic Diagonal Pulse Wave crossing 'N' (White with crisp clinical geometry) */}
          <path d="M30 38 L44 62 L50 32 L56 50 L70 64" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          {/* Right Pillar of 'N' (Light Lavender Accent) */}
          <path d="M70 26 V74" stroke="#a78bfa" strokeWidth="8.5" strokeLinecap="round" />
          {/* Heartbeat Crimson Life Node */}
          <circle cx="50" cy="32" r="5" fill="#ff1753" />
          <circle cx="50" cy="32" r="9" stroke="#ff1753" strokeWidth="1.5" strokeOpacity="0.45" />
        </svg>
      </div>

      {showText && (
        <div className={textClassName}>
          <span className="text-xl sm:text-2xl font-black tracking-normal text-[#21183B]">
            NIRBHOY<span className="font-bold ml-0.5 text-[#7c3aed]">Health</span>
          </span>
          <p className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">
            নির্ভয় ডিজিটাল স্বাস্থ্যসেবা
          </p>
        </div>
      )}
    </div>
  );
}
