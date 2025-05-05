'use client';

import React from 'react';
import { useOnboarding } from './OnboardingContext';

const SuccessStep: React.FC = () => {
  const { data, resetForm } = useOnboarding();
  
  return (
    <div className="w-full text-center py-6">
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 bg-[#B9FF66] rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#191A23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-medium mb-4">Registration Complete!</h2>
      
      <div className="mb-6 text-left p-6 bg-gray-50 rounded-lg border border-gray-100">
        <h3 className="font-medium mb-2">What happens next?</h3>
        
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>You'll receive a confirmation email at <span className="font-medium">{data.email}</span> within the next few minutes.</li>
          <li>Peter will review your information and contact you within 1-2 business days to discuss your specific needs.</li>
          <li>He'll guide you through the setup process and answer any questions you have about getting started with our real estate valuation data enrichment service.</li>
          <li>You'll receive a personalized implementation plan based on your business requirements and goals.</li>
        </ol>
      </div>
      
      <div className="mb-6 p-6 rounded-lg border border-[#B9FF66] bg-[#F8FFF0]">
        <p className="text-gray-700">
          "Thank you for your interest in our real estate valuation data enrichment services. I'm looking forward to helping you transform your direct mail campaigns with precise targeting. Expect to hear from me soon!"
        </p>
        <p className="font-medium mt-2">— Peter Correia, Founder</p>
      </div>
      
      <button
        onClick={() => {
          resetForm();
          // Redirect to homepage or close modal
          window.location.href = '#';
        }}
        className="btn btn-primary bg-[#191A23] text-white rounded-[14px] py-4 px-8 font-medium hover:bg-gray-800 transition-colors"
      >
        Return to Homepage
      </button>
    </div>
  );
};

export default SuccessStep;
