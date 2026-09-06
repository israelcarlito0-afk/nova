import React from 'react';
import { AfricanovaLogo, LogoVariant } from './AfricanovaLogo';

interface ImmoAILogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showSlogan?: boolean;
  className?: string;
  variant?: 'full' | 'icon-only' | 'horizontal';
  onClick?: () => void;
}

export const ImmoAILogo: React.FC<ImmoAILogoProps> = ({
  size = 'md',
  showSlogan = false,
  className = '',
  variant = 'horizontal',
  onClick,
}) => {
  const logoVariant: LogoVariant = 
    variant === 'icon-only' ? 'emblem' : 
    showSlogan ? 'full' : 'horizontal';

  return (
    <AfricanovaLogo
      variant={logoVariant}
      size={size}
      className={className}
      onClick={onClick}
    />
  );
};

export default ImmoAILogo;
