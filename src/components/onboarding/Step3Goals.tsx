'use client';

import React, { useState } from 'react';
import { useOnboarding } from './OnboardingContext';

const Step3Goals: React.FC = () => {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Input validation
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.primaryGoal.trim()) {
      newErrors.primaryGoal = 'Primary goal is required';
    }
    
    if (!data.timeframe.trim()) {
      newErrors.timeframe = 'Timeframe is required';
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

  // Goal options
  const goalOptions = [
    { value: '', label: 'Select your primary goal' },
    { value: 'increase_response_rate', label: 'Increase response rates from current campaigns' },
    { value: 'target_high_value', label: 'Target high-value prospects with precision' },
    { value: 'reduce_mailing_costs', label: 'Reduce mailing costs by eliminating poor targets' },
    { value: 'personalize_messaging', label: 'Create more personalized messaging based on home values' },
    { value: 'new_markets', label: 'Expand into new markets or areas' },
    { value: 'improve_roi', label: 'Improve overall ROI on direct mail' },
    { value: 'other', label: 'Other goal (please specify in additional info)' }
  ];

  // Timeframe options
  const timeframeOptions = [
    { value: '', label: 'Select your implementation timeframe' },
    { value: 'immediate', label: 'Immediate (within days)' },
    { value: 'this_month', label: 'This month' },
    { value: 'next_30_days', label: 'Next 30 days' },
    { value: '1-3_months', label: 'Next 1-3 months' },
    { value: '3+_months', label: 'More than 3 months from now' },
    { value: 'just_exploring', label: 'Just exploring options for now' }
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-medium mb-2">Your Goals &amp; Timeline</h2>
      <p className="text-gray-600 mb-6">
        Tell us what you want to achieve and when you plan to start.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-700 mb-1">
            Primary Goal <span className="text-red-500">*</span>
          </label>
          <select
            id="primaryGoal"
            name="primaryGoal"
            value={data.primaryGoal}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${errors.primaryGoal ? 'border-red-500' : 'border-gray-300'} rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white`}
          >
            {goalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.primaryGoal && (
            <p className="mt-1 text-sm text-red-500">{errors.primaryGoal}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
            Implementation Timeframe <span className="text-red-500">*</span>
          </label>
          <select
            id="timeframe"
            name="timeframe"
            value={data.timeframe}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${errors.timeframe ? 'border-red-500' : 'border-gray-300'} rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white`}
          >
            {timeframeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.timeframe && (
            <p className="mt-1 text-sm text-red-500">{errors.timeframe}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Information (Optional)
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={data.additionalInfo}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent"
            placeholder="Any other details you'd like us to know about your goals or requirements"
          />
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

export default Step3Goals;
