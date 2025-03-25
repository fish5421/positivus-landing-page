'use client';

import React, { useRef, useEffect } from 'react';
import { OnboardingProvider, PricingTier, BillingCycle } from './OnboardingContext';
import OnboardingForm from './OnboardingForm';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier?: PricingTier;
  billingCycle?: BillingCycle;
  source: string;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  selectedTier = 'Growth',
  billingCycle = 'monthly',
  source = 'pricing'
}) => {
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

  return (
    <div className="modal-container bg-black/60">
      <div 
        ref={modalRef} 
        className="modal-content animate-fadeIn bg-white p-6 md:p-8 rounded-[24px] shadow-lg"
        style={{
          animationDuration: '0.3s',
          animationFillMode: 'forwards'
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium">Get Started with Precision Data</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close onboarding"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <OnboardingProvider
          initialData={{ 
            selectedTier,
            billingCycle,
            source
          }}
        >
          <OnboardingForm />
        </OnboardingProvider>
      </div>
    </div>
  );
};

export default OnboardingModal;
