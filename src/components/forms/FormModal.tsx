'use client';

import React, { useEffect, useRef } from 'react';
import ContactForm from './ContactForm';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: 'contact' | 'strategy';
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, formType }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // We're not preventing scrolling anymore to allow background content to be scrolled
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formConfig = {
    contact: {
      title: 'Contact Us',
      description: 'Have questions about our services? Send us a message and we\'ll get back to you promptly.',
      buttonText: 'Send Message',
    },
    strategy: {
      title: 'Book a Strategy Call',
      description: 'Schedule a free strategy call to learn how our data enrichment services can boost your campaign results.',
      buttonText: 'Book My Call',
    }
  };

  return (
    <div className="modal-container bg-black/60">
      <div 
        ref={modalRef} 
        className="modal-content animate-fadeIn"
        style={{
          animationDuration: '0.3s',
          animationFillMode: 'forwards'
        }}
      >
        <ContactForm 
          formTitle={formConfig[formType].title}
          formDescription={formConfig[formType].description}
          buttonText={formConfig[formType].buttonText}
          onClose={onClose}
          formType={formType}
        />
      </div>
    </div>
  );
};

export default FormModal;