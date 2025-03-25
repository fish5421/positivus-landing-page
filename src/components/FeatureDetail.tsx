'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Feature {
  title: string;
  description: string;
  icon?: string;
  illustration?: string;
  illustrationAlt?: string;
  animationUrl?: string;
}

interface FeatureGroupProps {
  title: string;
  description?: string;
  features: Feature[];
}

interface FeatureDetailProps {
  groups: FeatureGroupProps[];
  className?: string;
}

const FeatureGroup: React.FC<FeatureGroupProps> = ({ title, description, features }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="rounded-3xl border border-gray-200 overflow-hidden bg-white">
      <div className="bg-[#F3F3F3] p-6">
        <h3 className="text-2xl font-medium mb-2">{title}</h3>
        {description && <p className="text-gray-700">{description}</p>}
      </div>
      
      <div className="grid md:grid-cols-3 h-full">
        <div className="bg-[#F9F9F9] p-4">
          <div className="space-y-2">
            {features.map((feature, index) => (
              <button
                key={index}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  activeFeature === index 
                    ? 'bg-[#B9FF66] font-medium' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                {feature.title}
              </button>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2 p-6">
          <div className="h-full flex flex-col">
            <h4 className="text-xl font-medium mb-4">{features[activeFeature].title}</h4>
            <p className="mb-6 text-gray-700">{features[activeFeature].description}</p>
            
            <div className="flex-grow flex items-center justify-center mt-4">
              {features[activeFeature].animationUrl ? (
                <div className="w-full aspect-video relative rounded-lg overflow-hidden">
                  <iframe
                    src={features[activeFeature].animationUrl}
                    title={features[activeFeature].title}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : features[activeFeature].illustration ? (
                <div className="relative w-full aspect-video">
                  <Image
                    src={features[activeFeature].illustration}
                    alt={features[activeFeature].illustrationAlt || features[activeFeature].title}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  Feature illustration
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureDetail: React.FC<FeatureDetailProps> = ({ groups, className = '' }) => {
  return (
    <div className={`space-y-12 ${className}`}>
      {groups.map((group, index) => (
        <FeatureGroup 
          key={index} 
          title={group.title} 
          description={group.description}
          features={group.features} 
        />
      ))}
    </div>
  );
};

export default FeatureDetail;
