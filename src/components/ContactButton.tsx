'use client';

import React, { useState } from 'react';
import FormModal from './forms/FormModal';
import { trackCTA } from '../lib/trackCTA';

interface ContactButtonProps {
  className?: string;
  children: React.ReactNode;
}

const ContactButton: React.FC<ContactButtonProps> = ({ className, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    trackCTA('Open Contact Form', 'Navigation', { button_text: 'Contact' })();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className={className}
      >
        {children}
      </button>

      {/* Contact Form Modal */}
      <FormModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        formType="contact" 
      />
    </>
  );
};

export default ContactButton;