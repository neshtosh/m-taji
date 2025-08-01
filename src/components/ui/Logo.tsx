import React from 'react';

interface LogoProps {
  variant?: 'default' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'default', 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12'
  };

  // Using the actual uploaded logo file
  const logoSrc = '/Mtaji logo.png';

  return (
    <img
      src={logoSrc}
      alt="M-taji Logo"
      className={`${sizeClasses[size]} ${className} object-contain`}
    />
  );
};

export default Logo; 