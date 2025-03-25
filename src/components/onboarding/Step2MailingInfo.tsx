'use client';

import React, { useState } from 'react';
import { useOnboarding } from './OnboardingContext';

const Step2MailingInfo: React.FC = () => {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Input validation
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.currentMailingVolume.trim()) {
      newErrors.currentMailingVolume = 'Mailing volume is required';
    }
    
    if (!data.targetAudience.trim()) {
      newErrors.targetAudience = 'Target audience is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      nextStep();
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Mailing volume options
  const mailingVolumeOptions = [
    { value: '', label: 'Select your current mailing volume' },
    { value: 'none', label: 'Not currently mailing' },
    { value: '1-1000', label: '1-1,000 pieces per month' },
    { value: '1001-5000', label: '1,001-5,000 pieces per month' },
    { value: '5001-20000', label: '5,001-20,000 pieces per month' },
    { value: '20001-50000', label: '20,001-50,000 pieces per month' },
    { value: '50001+', label: '50,001+ pieces per month' }
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-medium mb-2">Your Direct Mail Information</h2>
      <p className="text-gray-600 mb-6">
        Tell us about your current direct mail activities and target audience.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentMailingVolume" className="block text-sm font-medium text-gray-700 mb-1">
            Current Direct Mail Volume <span className="text-red-500">*</span>
          </label>
          <select
            id="currentMailingVolume"
            name="currentMailingVolume"
            value={data.currentMailingVolume}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${errors.currentMailingVolume ? 'border-red-500' : 'border-gray-300'} rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white`}
          >
            {mailingVolumeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.currentMailingVolume && (
            <p className="mt-1 text-sm text-red-500">{errors.currentMailingVolume}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
            Who is your target audience? <span className="text-red-500">*</span>
          </label>
          <textarea
            id="targetAudience"
            name="targetAudience"
            value={data.targetAudience}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-3 border ${errors.targetAudience ? 'border-red-500' : 'border-gray-300'} rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent`}
            placeholder="Describe your ideal customers or direct mail recipients"
          />
          {errors.targetAudience && (
            <p className="mt-1 text-sm text-red-500">{errors.targetAudience}</p>
          )}
        </div>
        
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="w-1/3 btn btn-outline border border-gray-300 text-gray-700 rounded-[14px] py-4 px-6 font-medium hover:bg-gray-100 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-2/3 btn btn-primary bg-[#B9FF66] text-black rounded-[14px] py-4 px-6 font-medium hover:bg-opacity-90 transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2MailingInfo;
