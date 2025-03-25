'use client';

import React from 'react';
import Image from 'next/image';

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  company: string;
  image?: string; // Made optional since we're not displaying it
  highlight?: string;
  rating?: number;
}

const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  name,
  title,
  company,
  image,
  highlight,
  rating,
}) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {rating && (
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <svg 
              key={index}
              width="20" 
              height="20" 
              viewBox="0 0 20 20"
              fill={index < rating ? "#FFD700" : "#E5E7EB"}
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path d="M9.99999 1.66667L12.575 6.88334L18.3333 7.725L14.1667 11.7833L15.15 17.5167L9.99999 14.8083L4.84999 17.5167L5.83332 11.7833L1.66666 7.725L7.42499 6.88334L9.99999 1.66667Z" />
            </svg>
          ))}
        </div>
      )}
      
      <blockquote className="mb-6 text-gray-700">
        "{quote}"
        {highlight && (
          <p className="mt-2 font-medium text-black">"{highlight}"</p>
        )}
      </blockquote>
      
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{title}, {company}</p>
      </div>
    </div>
  );
};

interface EndorsementProps {
  quote: string;
  name: string;
  title: string;
  company: string;
  image?: string; // Made optional since we're not displaying it
  logo?: string;
}

const Endorsement: React.FC<EndorsementProps> = ({
  quote,
  name,
  title,
  company,
  image,
  logo,
}) => {
  return (
    <div className="bg-[#191A23] text-white p-8 rounded-3xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-300">{title}, {company}</p>
        </div>
        {logo && (
          <div className="w-20 h-20 relative">
            <Image 
              src={logo} 
              alt={`${company} logo`} 
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>
      
      <blockquote className="text-lg">
        "{quote}"
      </blockquote>
    </div>
  );
};

interface TestimonialsProps {
  testimonials: TestimonialProps[];
  endorsements?: EndorsementProps[];
  heading: string;
  subheading?: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials,
  endorsements = [],
  heading,
  subheading,
}) => {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="heading-lg mb-4">{heading}</h2>
        {subheading && <p className="text-xl max-w-3xl mx-auto">{subheading}</p>}
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {testimonials.map((testimonial, index) => (
          <Testimonial key={index} {...testimonial} />
        ))}
      </div>
      
      {endorsements.length > 0 && (
        <div className="mt-16">
          <div className="grid md:grid-cols-2 gap-6">
            {endorsements.map((endorsement, index) => (
              <Endorsement key={index} {...endorsement} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
