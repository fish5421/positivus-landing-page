'use client';

import React from 'react';
import { useOnboarding } from './OnboardingContext';
import Step1BusinessInfo from './Step1BusinessInfo';
import Step2MailingInfo from './Step2MailingInfo';
import Step3Goals from './Step3Goals';
import Step4Contact from './Step4Contact';
import SuccessStep from './SuccessStep';

const OnboardingForm: React.FC = () => {
  const { currentStep, totalSteps, submitSuccess, submitError } = useOnboarding();
  
  // Calculate progress percentage
  const progress = Math.min((currentStep / totalSteps) * 100, 100);
  
  // Estimated time to complete (in minutes)
  const estimatedTime = 3;
  
  // If form is submitted successfully, show success step
  if (submitSuccess) {
    return <SuccessStep />;
  }
  
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </div>
          <div className="text-sm text-gray-500">
            ~{estimatedTime} min to complete
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#B9FF66] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Error message if submit failed */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error</p>
          <p className="text-sm">{submitError}</p>
        </div>
      )}
      
      {/* Current step content */}
      <div className="transition-all duration-300 ease-in-out">
        {currentStep === 1 && <Step1BusinessInfo />}
        {currentStep === 2 && <Step2MailingInfo />}
        {currentStep === 3 && <Step3Goals />}
        {currentStep === 4 && <Step4Contact />}
      </div>
    </div>
  );
};

export default OnboardingForm;
