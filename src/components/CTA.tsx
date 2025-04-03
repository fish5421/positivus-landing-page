'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { trackCTA } from '../lib/trackCTA';
import FormModal from './forms/FormModal';

interface CTAProps {
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

const CTA: React.FC<CTAProps> = ({
  title,
  description,
  buttonText,
  imageSrc,
  imageAlt
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    trackCTA('Open Form', 'CTA Section', { button_text: buttonText })();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-[1240px] bg-[#F3F3F3] rounded-[45px] flex flex-col md:flex-row items-center justify-between p-6 md:p-[60px] gap-8 md:gap-[275px] md:h-[347px] mx-auto">
        <div className="flex flex-col gap-[26px] w-full md:w-[500px] items-start">
          <h3 className="text-2xl md:text-[30px] leading-[38px] font-medium">
            {title}
          </h3>
          <p className="text-base md:text-[18px] leading-relaxed text-gray-700">
            {description}
          </p>
          <button 
            onClick={openModal}
            className="btn btn-primary bg-[#191A23] text-white rounded-[14px] py-4 md:py-[20px] px-4 md:px-[35px] w-full md:w-[288px] flex items-center justify-center hover:bg-gray-800 transition-colors"
            data-cta-name={`CTA-${title.replace(/\s+/g, '-')}`}
          >
            {buttonText}
          </button>
        </div>
        <div className="relative w-full md:w-[445px] h-[250px] md:h-[347px] flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={445}
            height={347}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Form Modal */}
      <FormModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        formType="strategy" 
      />
    </>
  );
};

export default CTA;
