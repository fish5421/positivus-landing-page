'use client';

import React, { useState } from 'react';
import posthog from 'posthog-js';
import { trackCTA } from '../lib/trackCTA';
import FormModal from './forms/FormModal';
import OnboardingModal from './onboarding/OnboardingModal';
import { PricingTier, BillingCycle } from './onboarding/OnboardingContext';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  description: string;
  price: {
    monthly: number;
    annually: number;
  };
  features: PricingFeature[];
  buttonText: string;
  highlighted?: boolean;
  popular?: boolean;
}

interface PricingTableProps {
  heading: string;
  subheading?: string;
  tiers: PricingTier[];
  guaranteeText?: string;
  className?: string;
}

const PricingTable: React.FC<PricingTableProps> = ({
  heading,
  subheading,
  tiers,
  guaranteeText,
  className = '',
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier>('Growth');

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };
  
  const openOnboardingModal = (tier: PricingTier) => {
    setSelectedTier(tier);
    setIsOnboardingModalOpen(true);
  };
  
  const closeOnboardingModal = () => {
    setIsOnboardingModalOpen(false);
  };

  return (
    <div className={className}>
      <div className="text-center mb-12">
        <h2 className="heading-lg mb-4">{heading}</h2>
        {subheading && <p className="text-xl max-w-3xl mx-auto">{subheading}</p>}
        
        <div className="flex items-center justify-center mt-8">
          <div className="bg-[#F3F3F3] p-1 rounded-full inline-flex">
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-[#B9FF66] text-black' 
                  : 'text-gray-700 hover:text-black'
              }`}
              onClick={() => {
                setBillingCycle('monthly');
                posthog.capture('billing_cycle_changed', {
                  new_cycle: 'monthly',
                  location: 'Pricing Table'
                });
              }}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === 'annually' 
                  ? 'bg-[#B9FF66] text-black' 
                  : 'text-gray-700 hover:text-black'
              }`}
              onClick={() => {
                setBillingCycle('annually');
                posthog.capture('billing_cycle_changed', {
                  new_cycle: 'annually',
                  location: 'Pricing Table'
                });
              }}
            >
              Annually <span className="text-xs font-normal">Save 20%</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier, index) => {
          const price = billingCycle === 'monthly' ? tier.price.monthly : tier.price.annually;
          const priceString = price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
          
          return (
            <div 
              key={index} 
              className={`
                rounded-3xl overflow-hidden 
                ${tier.highlighted 
                  ? 'border-2 border-[#B9FF66] shadow-lg relative' 
                  : 'border border-gray-200'
                }
              `}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-[#B9FF66] px-4 py-1 text-sm font-medium transform translate-x-[30%] translate-y-[30%] rotate-45">
                  Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-medium mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-6">{tier.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{priceString}</span>
                    <span className="text-gray-500 ml-2">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                </div>
                
                <button 
                  className={`
                    w-full py-3 px-4 rounded-lg font-medium mb-8
                    ${tier.highlighted 
                      ? 'bg-[#B9FF66] text-black hover:bg-opacity-90' 
                      : 'bg-[#191A23] text-white hover:bg-opacity-90'
                    }
                    transition-colors
                  `}
                  onClick={(e) => {
                    if (tier.name === 'Enterprise') {
                      e.preventDefault();
                      openContactModal();
                    } else {
                      e.preventDefault();
                      openOnboardingModal(tier.name as PricingTier);
                    }
                    trackCTA('Plan Selection', 'Pricing Table', {
                      tier_name: tier.name,
                      tier_price: price,
                      billing_cycle: billingCycle,
                      button_text: tier.buttonText
                    })();
                  }}
                >
                  {tier.buttonText}
                </button>
                
                <div className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                        {feature.included ? (
                          <svg className="text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <span className={`ml-3 ${feature.included ? 'text-gray-900' : 'text-gray-500 line-through'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {guaranteeText && (
        <div className="mt-10 text-center">
          <div className="inline-flex items-center bg-[#F3F3F3] px-6 py-3 rounded-full">
            <div className="w-8 h-8 bg-[#B9FF66] rounded-full flex items-center justify-center mr-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-medium">{guaranteeText}</span>
          </div>
        </div>
      )}
      
      {/* Contact Form Modal */}
      <FormModal 
        isOpen={isContactModalOpen} 
        onClose={closeContactModal} 
        formType="contact" 
      />
      
      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={closeOnboardingModal}
        selectedTier={selectedTier}
        billingCycle={billingCycle}
        source="pricing"
      />
    </div>
  );
};

export default PricingTable;
