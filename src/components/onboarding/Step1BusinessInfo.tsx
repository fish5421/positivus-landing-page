'use client';

import React, { useState } from 'react';
import { useOnboarding } from './OnboardingContext';

const Step1BusinessInfo: React.FC = () => {
  const { data, updateData, nextStep } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Input validation
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!data.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    
    if (!data.companySize.trim()) {
      newErrors.companySize = 'Company size is required';
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Industry options
  const industryOptions = [
    { value: '', label: 'Select your industry' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'financial_services', label: 'Financial Services' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'non_profit', label: 'Non-Profit' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'home_services', label: 'Home Services' },
    { value: 'education', label: 'Education' },
    { value: 'legal', label: 'Legal' },
    { value: 'retail', label: 'Retail' },
    { value: 'other', label: 'Other' }
  ];

  // Company size options
  const companySizeOptions = [
    { value: '', label: 'Select company size' },
    { value: 'solo', label: 'Solo / Freelancer' },
    { value: '2-10', label: '2-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '500+', label: '500+ employees' }
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-medium mb-2">Tell us about your business</h2>
      <p className="text-gray-600 mb-6">
        This helps us understand your business needs better.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            value={data.businessName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${errors.businessName ? 'border-red-500' : 'border-gray-300'} rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent`}
            placeholder="Your business name"
          />
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            Industry <span className="text-red-500">*</span>
          </label>
          <select
            id="industry"
            name="industry"
            value={data.industry}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${errors.industry ? 'border-red-500' : 'border-gray-300'} rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white`}
          >
            {industryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.industry && (
            <p className="mt-1 text-sm text-red-500">{errors.industry}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
            Company Size <span className="text-red-500">*</span>
          </label>
          <select
            id="companySize"
            name="companySize"
            value={data.companySize}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${errors.companySize ? 'border-red-500' : 'border-gray-300'} rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white`}
          >
            {companySizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.companySize && (
            <p className="mt-1 text-sm text-red-500">{errors.companySize}</p>
          )}
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full btn btn-primary bg-[#B9FF66] text-black rounded-[14px] py-4 px-6 font-medium hover:bg-opacity-90 transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1BusinessInfo;
