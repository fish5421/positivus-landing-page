import React, { ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'white' | 'light' | 'dark' | 'primary';
  animate?: boolean;
  sectionName?: string; // Added prop for tracking
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  className = '',
  id,
  background = 'white',
  animate = true,
  sectionName,
}) => {
  const getBgColor = () => {
    switch (background) {
      case 'light':
        return 'bg-[#F3F3F3]';
      case 'dark':
        return 'bg-[#191A23]';
      case 'primary':
        return 'bg-[#B9FF66]';
      default:
        return 'bg-white';
    }
  };

  return (
    <section 
      id={id}
      className={`py-16 md:py-24 ${getBgColor()} ${className}`}
      data-section-name={sectionName || id} // Add data attribute for section tracking
    >
      <div className={`container mx-auto px-4 md:px-6 lg:px-[100px] ${animate ? 'fade-in-up' : ''}`}>
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
