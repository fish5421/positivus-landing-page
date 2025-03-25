'use client';

import React from 'react';
import Image from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio?: string;
}

interface AboutSectionProps {
  heading: string;
  story: string;
  mission?: string;
  founderImage?: string;
  founderName?: string;
  founderRole?: string;
  differentiators?: {
    title: string;
    description: string;
  }[];
  team?: TeamMember[];
}

const AboutSection: React.FC<AboutSectionProps> = ({
  heading,
  story,
  mission,
  founderImage,
  founderName,
  founderRole,
  differentiators = [],
  team = [],
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h2 className="heading-lg mb-6">{heading}</h2>
        <div className="prose prose-lg">
          <p className="text-lg mb-6">{story}</p>
          {mission && <p className="text-lg font-medium">{mission}</p>}
        </div>
        
        {differentiators.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-medium mb-6">Why We're Different</h3>
            <div className="space-y-4">
              {differentiators.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#B9FF66] rounded-full flex items-center justify-center text-black">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{item.title}</h4>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div>
        {founderImage && (
          <div className="mb-8 relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden relative">
              <Image
                src={founderImage}
                alt={founderName || "Founder"}
                fill
                className="object-contain"
              />
            </div>
            {(founderName || founderRole) && (
              <div className="bg-white px-6 py-4 rounded-xl shadow-md absolute bottom-6 left-6">
                {founderName && <p className="font-medium text-lg">{founderName}</p>}
                {founderRole && <p className="text-gray-600">{founderRole}</p>}
              </div>
            )}
          </div>
        )}
        
        {team.length > 0 && (
          <div>
            <h3 className="text-2xl font-medium mb-6">Our Team</h3>
            <div className="grid grid-cols-2 gap-4">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="aspect-square rounded-full overflow-hidden relative mb-4 mx-auto w-24 h-24">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                  {member.bio && <p className="text-sm mt-2">{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutSection;
