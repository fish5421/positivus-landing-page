'use client';

import React, { useState } from 'react';
import { useOnboarding } from './OnboardingContext';

const Step4Contact: React.FC = () => {
  const { 
    data, 
    updateData, 
    prevStep,
    isSubmitting,
    setIsSubmitting,
    setSubmitSuccess,
    setSubmitError
  } = useOnboarding();
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Input validation
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Map internal pricing tier values to display names for the email
      const tierDisplayName = data.selectedTier;
      const billingDisplayName = data.billingCycle === 'monthly' ? 'Monthly Billing' : 'Annual Billing';
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Contact form fields
          name: data.name,
          email: data.email,
          phone: data.phone || 'Not provided',
          
          // Custom message with all onboarding details
          message: `New Onboarding Submission:\n\n` +
                  `Selected Plan: ${tierDisplayName}\n` +
                  `Billing Preference: ${billingDisplayName}\n\n` +
                  `Business Details:\n` +
                  `- Business Name: ${data.businessName}\n` +
                  `- Industry: ${data.industry}\n` +
                  `- Company Size: ${data.companySize}\n\n` +
                  `Direct Mail Information:\n` +
                  `- Current Mailing Volume: ${data.currentMailingVolume}\n` +
                  `- Target Audience: ${data.targetAudience}\n\n` +
                  `Goals & Timeline:\n` +
                  `- Primary Goal: ${data.primaryGoal}\n` +
                  `- Implementation Timeframe: ${data.timeframe}\n` +
                  `- Additional Info: ${data.additionalInfo || 'None provided'}\n\n` +
                  `Source: ${data.source}`,
          
          // Form type
          formType: 'onboarding'
        }),
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-medium mb-2">Your Contact Information</h2>
      <p className="text-gray-600 mb-6">
        Almost done! Just tell us how to reach you.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={data.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent`}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={data.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent"
            placeholder="Your phone number"
          />
        </div>
        
        <div className="pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="w-full md:w-1/3 btn btn-outline border border-gray-300 text-gray-700 rounded-[14px] py-4 px-6 font-medium hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-2/3 btn btn-primary bg-[#191A23] text-white rounded-[14px] py-4 px-6 font-medium hover:bg-gray-800 transition-colors flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Complete Your Registration'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Step4Contact;
