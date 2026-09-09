import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
}

export const Emblem: React.FC<EmblemProps> = ({ className = 'h-11 w-11', size = 48 }) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="96" stroke="#1E293B" strokeWidth="3" fill="#FFFFFF" />
        <path id="topTextArc" d="M 28 92 A 78 78 0 0 1 172 92" fill="none" />
        <text
          fill="#0F172A"
          fontSize="15"
          fontWeight="900"
          fontFamily="'Tajawal', sans-serif"
          textAnchor="middle"
        >
          <textPath href="#topTextArc" startOffset="50%" textAnchor="middle">
            مركز التوحد والصعوبات التعليمية
          </textPath>
        </text>
        <g transform="translate(68, 62) scale(0.65)">
          <path
            d="M50 0 C54 0 57 4 57 9 L57 45 C57 47 60 48 62 46 L69 32 C71 28 76 27 80 30 C83 33 83 38 80 42 L68 62 C70 60 74 58 77 59 C81 60 83 65 81 69 L67 92 C65 96 61 98 56 98 L36 98 C26 98 18 90 18 80 L18 42 C18 37 21 33 26 33 C30 33 33 37 33 42 L33 46 C34 44 37 43 38 45 L38 22 C38 17 41 13 46 13 C50 13 50 18 50 22 Z"
            fill="#628286"
          />
          <g transform="translate(23, 44) scale(0.55)">
            <path
              d="M 50 30 C 50 10 20 10 20 35 C 20 50 35 65 50 80 C 45 75 40 70 35 60 Z"
              fill="#E11D48"
            />
            <path
              d="M 24 38 C 24 22 42 22 48 34 C 48 38 44 42 48 46 C 52 46 54 44 54 48 L 50 62 C 40 52 24 48 24 38 Z"
              fill="#E11D48"
            />
            <path
              d="M 48 34 C 54 22 72 22 72 38 C 72 48 56 52 46 62 L 44 48 C 44 44 46 46 50 46 C 54 42 50 38 48 34 Z"
              fill="#EAB308"
            />
            <path
              d="M 28 42 C 34 50 42 56 48 64 C 44 68 44 72 48 76 C 44 72 38 68 34 60 C 28 52 28 46 28 42 Z"
              fill="#0EA5E9"
            />
            <path
              d="M 68 42 C 62 50 54 56 48 64 C 52 68 52 72 48 76 C 52 72 58 68 62 60 C 68 52 68 46 68 42 Z"
              fill="#22C55E"
            />
          </g>
          <text
            x="48"
            y="114"
            fill="#1E293B"
            fontSize="18"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
            textAnchor="middle"
            letterSpacing="1"
          >
            CALD
          </text>
        </g>
        <text
          x="100"
          y="176"
          fill="#0F172A"
          fontSize="24"
          fontWeight="900"
          fontFamily="'Arial Black', sans-serif"
          textAnchor="middle"
          letterSpacing="4"
        >
          C.A.L.D
        </text>
      </svg>
    </div>
  );
};
