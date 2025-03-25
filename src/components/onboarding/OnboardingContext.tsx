'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for pricing tiers
export type PricingTier = 'Starter' | 'Growth' | 'Enterprise';
export type BillingCycle = 'monthly' | 'annually';

// Define form data structure
export interface OnboardingData {
  // Step 1 - Initial info
  businessName: string;
  industry: string;
  companySize: string;
  
  // Step 2 - Mailing details
  currentMailingVolume: string;
  targetAudience: string;
  
  // Step 3 - Goals and timeline
  primaryGoal: string;
  timeframe: string;
  additionalInfo: string;
  
  // Contact info
  name: string;
  email: string;
  phone: string;
  
  // Metadata
  selectedTier: PricingTier;
  billingCycle: BillingCycle;
  source: string; // Where they clicked "Get Started" from
}

// Default values for the form
const defaultData: OnboardingData = {
  businessName: '',
  industry: '',
  companySize: '',
  currentMailingVolume: '',
  targetAudience: '',
  primaryGoal: '',
  timeframe: '',
  additionalInfo: '',
  name: '',
  email: '',
  phone: '',
  selectedTier: 'Growth',
  billingCycle: 'monthly',
  source: 'pricing'
};

// Define context type
interface OnboardingContextType {
  data: OnboardingData;
  currentStep: number;
  totalSteps: number;
  updateData: (newData: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  submitSuccess: boolean;
  setSubmitSuccess: (value: boolean) => void;
  submitError: string;
  setSubmitError: (error: string) => void;
}

// Create the context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Provider component
export const OnboardingProvider: React.FC<{
  children: ReactNode;
  initialData?: Partial<OnboardingData>;
  initialStep?: number;
}> = ({ children, initialData = {}, initialStep = 1 }) => {
  const [data, setData] = useState<OnboardingData>({ ...defaultData, ...initialData });
  const [currentStep, setCurrentStep] = useState(initialStep);
  const totalSteps = 4; // Total number of steps in our onboarding process
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Update form data
  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  // Reset the form
  const resetForm = () => {
    setData(defaultData);
    setCurrentStep(1);
    setIsSubmitting(false);
    setSubmitSuccess(false);
    setSubmitError('');
  };

  // Context value
  const value = {
    data,
    currentStep,
    totalSteps,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    isSubmitting,
    setIsSubmitting,
    submitSuccess,
    setSubmitSuccess,
    submitError,
    setSubmitError
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Custom hook to use the onboarding context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
