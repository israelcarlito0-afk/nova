import React from 'react';

export type LogoVariant = 'full' | 'horizontal' | 'emblem' | 'monochrome-white' | 'monochrome-black';

interface AfricanovaLogoProps {
  variant?: LogoVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customEmblemSize?: number;
  className?: string;
  onClick?: () => void;
}

/**
 * AFRICANOVA Official Logo Component
 * 
 * Rules from Graphic Charter:
 * - Hub central vert (#12B350 to #087A36) connected to 6 nodes (the 6 poles)
 * - Interconnecting gold pathways (#F5D67A -> #D4AF37 -> #A9791E)
 * - Serif classical wordmark: AFRICANOVA
 * - Official Slogan: "One Africa. Unlimited Opportunities."
 * - Protection zone respected
 * - 5 official variants: full, horizontal, emblem, monochrome-white, monochrome-black
 */
export const AfricanovaLogo: React.FC<AfricanovaLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  customEmblemSize,
  className = '',
  onClick,
}) => {
  // Size metrics
  const sizeConfig = {
    sm: {
      emblem: 36,
      wordmark: 'text-lg',
      slogan: 'text-[9px]',
      gap: 'gap-2.5',
    },
    md: {
      emblem: 48,
      wordmark: 'text-2xl',
      slogan: 'text-[11px]',
      gap: 'gap-3.5',
    },
    lg: {
      emblem: 64,
      wordmark: 'text-4xl',
      slogan: 'text-[14px]',
      gap: 'gap-4',
    },
    xl: {
      emblem: 88,
      wordmark: 'text-5xl md:text-6xl',
      slogan: 'text-[16px] md:text-[18px]',
      gap: 'gap-5',
    },
    custom: {
      emblem: customEmblemSize || 48,
      wordmark: 'text-2xl',
      slogan: 'text-xs',
      gap: 'gap-3',
    },
  }[size];

  const emblemSize = customEmblemSize || sizeConfig.emblem;
  const isMonochromeWhite = variant === 'monochrome-white';
  const isMonochromeBlack = variant === 'monochrome-black';

  // SVG emblem with the central green hub and 6 connected nodes
  const emblemSvg = (
    <svg
      viewBox="0 0 120 120"
      width={emblemSize}
      height={emblemSize}
      className="shrink-0 overflow-visible select-none drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Or Dégradé Logo: Or Clair (#F5D67A) -> Or Principal (#D4AF37) -> Or Foncé (#A9791E) */}
        <linearGradient id="anGoldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5D67A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A9791E" />
        </linearGradient>

        <linearGradient id="anGoldRays" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D67A" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#A9791E" stopOpacity="0.4" />
        </linearGradient>

        {/* Vert Dégradé Hub: Vert Clair (#12B350) -> Vert Foncé (#087A36) */}
        <linearGradient id="anGreenHub" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#12B350" />
          <stop offset="100%" stopColor="#087A36" />
        </linearGradient>

        {/* Outer Glow Filter */}
        <filter id="anHubGlow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Hexagonal Outer Perimeter Links connecting the 6 nodes */}
      <polygon
        points="60,18 96,39 96,81 60,102 24,81 24,39"
        stroke={isMonochromeWhite ? '#FFFFFF' : isMonochromeBlack ? '#0A0A0A' : 'url(#anGoldRays)'}
        strokeWidth="1.6"
        strokeDasharray="3 2"
        opacity={isMonochromeWhite ? '0.4' : '0.6'}
        fill="none"
      />

      {/* Radial Connectors from the 6 Nodes to Central Hub */}
      {/* Node 1 (Top): (60, 18) -> (60, 44) */}
      <line
        x1="60" y1="18" x2="60" y2="44"
        stroke={isMonochromeWhite ? '#FFFFFF' : isMonochromeBlack ? '#0A0A0A' : 'url(#anGoldGradient)'}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Node 2 (Top Right): (96, 39) -> (74, 52) */}
      <line
        x1="96" y1="39" x2="74" y2="52"
        stroke={isMonochromeWhite ? '#FFFFFF' : isMonochromeBlack ? '#0A0A0A' : 'url(#anGoldGradient)'}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Node 3 (Bottom Right): (96, 81) -> (74, 68) */}
      <line
        x1="96" y1="81" x2="74" y2="68"
        stroke={isMonochromeWhite ? '#FFFFFF' : isMonochromeBlack ? '#0A0A0A' : 'url(#anGoldGradient)'}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Node 4 (Bottom): (60, 102) -> (60, 76) */}
      <line
        x1="60" y1="102" x2="60" y2="76"
        stroke={isMonochromeWhite ? '#FFFFFF' : isMonochromeBlack ? '#0A0A0A' : 'url(#anGoldGradient)'}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Node 5 (Bottom Left): (24, 81) -> (46, 68) */}
      <line
        x1="24" y1="81" x2="46" y2="68"
        stroke={isMonochromeWhite ? '#FFFFFF' : isMonochromeBlack ? '#0A0A0A' : 'url(#anGoldGradient)'}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Node 6 (Top Left): (24, 39) -> (46, 52) */}
      <line
        x1="24" y1="39" x2="46" y2="52"
        stroke={isMonochromeWhite ? '#FFFFFF' : isMonochromeBlack ? '#0A0A0A' : 'url(#anGoldGradient)'}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* The 6 Nodes / Pastilles representing the 6 poles (Immobilier, Finance, Formation, Business, Emploi, Commerce) */}
      {[
        { cx: 60, cy: 18, label: 'Immobilier' },
        { cx: 96, cy: 39, label: 'Finance' },
        { cx: 96, cy: 81, label: 'Formation' },
        { cx: 60, cy: 102, label: 'Business' },
        { cx: 24, cy: 81, label: 'Emploi' },
        { cx: 24, cy: 39, label: 'Commerce' },
      ].map((node, i) => (
        <g key={i}>
          {/* Outer ring */}
          <circle
            cx={node.cx}
            cy={node.cy}
            r="8"
            fill={isMonochromeWhite ? '#FFFFFF' : isMonochromeBlack ? '#0A0A0A' : '#161616'}
            stroke={isMonochromeWhite ? '#FFFFFF' : isMonochromeBlack ? '#0A0A0A' : 'url(#anGoldGradient)'}
            strokeWidth="1.8"
          />
          {/* Inner core */}
          <circle
            cx={node.cx}
            cy={node.cy}
            r="3.5"
            fill={isMonochromeWhite ? '#0A0A0A' : isMonochromeBlack ? '#FFFFFF' : '#F5D67A'}
          />
        </g>
      ))}

      {/* HUB CENTRAL VERT (Le cercle du milieu de l'emblème) */}
      <g filter={isMonochromeWhite || isMonochromeBlack ? undefined : 'url(#anHubGlow)'}>
        {/* Outer golden halo around green hub */}
        <circle
          cx="60"
          cy="60"
          r="19"
          fill="none"
          stroke={isMonochromeWhite ? '#FFFFFF' : isMonochromeBlack ? '#0A0A0A' : 'url(#anGoldGradient)'}
          strokeWidth="1.4"
          opacity="0.85"
        />
        {/* Green Hub circle */}
        <circle
          cx="60"
          cy="60"
          r="16"
          fill={isMonochromeWhite ? '#FFFFFF' : isMonochromeBlack ? '#0A0A0A' : 'url(#anGreenHub)'}
          stroke={isMonochromeWhite ? '#FFFFFF' : isMonochromeBlack ? '#0A0A0A' : '#F5D67A'}
          strokeWidth="1.5"
        />
        {/* Stylized African Continental Compass Star inside Hub */}
        <path
          d="M 60 48 L 63 57 L 72 60 L 63 63 L 60 72 L 57 63 L 48 60 L 57 57 Z"
          fill={isMonochromeWhite ? '#0A0A0A' : isMonochromeBlack ? '#FFFFFF' : '#FFFFFF'}
          opacity="0.95"
        />
      </g>
    </svg>
  );

  // If emblem only, render just the emblem
  if (variant === 'emblem') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={{ minWidth: 40, minHeight: 40 }}
      >
        {emblemSvg}
      </div>
    );
  }

  // Text colors based on variant
  const getWordmarkClass = () => {
    if (isMonochromeWhite) return 'text-white';
    if (isMonochromeBlack) return 'text-[#0A0A0A]';
    return 'text-an-gold-gradient font-bold';
  };

  const getSloganClass = () => {
    if (isMonochromeWhite) return 'text-white/80';
    if (isMonochromeBlack) return 'text-[#0A0A0A]/75';
    return 'text-[#EDEDED]/90';
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${sizeConfig.gap} select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      style={{ minWidth: 120 }}
    >
      {/* Protective Zone Padding wrapper */}
      <div className="shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        {emblemSvg}
      </div>

      {/* Wordmark & Optional Slogan */}
      <div className="flex flex-col justify-center leading-none">
        {/* Wordmark in Classical Serif (Cinzel / Playfair Display / Georgia) */}
        <span
          className={`font-africanova-serif font-black tracking-[0.14em] uppercase ${sizeConfig.wordmark} ${getWordmarkClass()}`}
          style={{ letterSpacing: '0.12em' }}
        >
          AFRICANOVA
        </span>

        {/* Slogan: Only in 'full' variant */}
        {variant === 'full' && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`font-serif italic tracking-[0.03em] ${sizeConfig.slogan} ${getSloganClass()}`}
            >
              One Africa. Unlimited Opportunities.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AfricanovaLogo;

/**
 * Convenient standalone Emblem component
 */
export const AfricanovaEmblem: React.FC<{ 
  size?: number; 
  className?: string;
  onClick?: () => void;
}> = ({ size = 40, className = '', onClick }) => {
  return (
    <AfricanovaLogo
      variant="emblem"
      customEmblemSize={size}
      className={className}
      onClick={onClick}
    />
  );
};
