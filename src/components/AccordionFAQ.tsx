'use client';

import React from 'react';
import Accordion from './Accordion';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface AccordionFAQProps {
  heading: string;
  subheading?: string;
  faqs: FAQItem[];
  className?: string;
}

const AccordionFAQ: React.FC<AccordionFAQProps> = ({
  heading,
  subheading,
  faqs,
  className = '',
}) => {
  // Transform FAQs to match Accordion items format
  const accordionItems = faqs.map(faq => ({
    title: faq.question,
    content: faq.answer,
  }));

  return (
    <div className={`py-8 ${className}`}>
      <div className="text-center mb-16">
        <h2 className="heading-lg mb-6">{heading}</h2>
        {subheading && <p className="text-xl max-w-3xl mx-auto">{subheading}</p>}
      </div>
      
      <div className="max-w-3xl mx-auto px-4">
        <Accordion items={accordionItems} className="shadow-sm" />
      </div>
    </div>
  );
};

export default AccordionFAQ;
