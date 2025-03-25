'use client';

import React from 'react';
import Image from 'next/image';

interface PainPoint {
  title: string;
  description: string;
  icon?: string;
}

interface ProblemAgitationProps {
  heading: string;
  subheading?: string;
  painPoints: PainPoint[];
  comparisonImage?: string;
  svgAlt?: string;
}

const ProblemAgitation: React.FC<ProblemAgitationProps> = ({
  heading,
  subheading,
  painPoints,
  comparisonImage,
  svgAlt = "Direct Mail Marketing Cycle",
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="heading-lg mb-4">{heading}</h2>
        {subheading && <p className="text-lg mb-8 text-gray-700">{subheading}</p>}
        
        <div className="space-y-6">
          {painPoints.map((point, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#191A23] rounded-full flex items-center justify-center text-white">
                {point.icon ? (
                  <span className="text-xl">{point.icon}</span>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div>
                <h3 className="font-medium text-xl mb-2">{point.title}</h3>
                <p className="text-gray-700">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative h-[600px] rounded-3xl overflow-hidden">
        {comparisonImage ? (
          <Image
            src={comparisonImage}
            alt="Before and after comparison"
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <Image
              src="/direct-mail-marketing-cycle.svg"
              alt={svgAlt}
              width={800}
              height={600}
              className="w-full h-auto max-h-full object-contain"
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemAgitation;
