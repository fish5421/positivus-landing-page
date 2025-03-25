'use client';

import React, { useState } from 'react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0 py-2">
      <button
        className="flex justify-between items-center w-full py-6 px-4 sm:px-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-base sm:text-xl font-medium pr-3 sm:pr-4">{title}</h3>
        <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#B9FF66] text-black flex-shrink-0 text-lg sm:text-xl font-medium">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}
      >
        <div className="text-gray-700 px-4 sm:px-6">
          <div className="prose prose-gray max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AccordionProps {
  items: {
    title: string;
    content: React.ReactNode;
  }[];
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ items, className = '' }) => {
  return (
    <div className={`rounded-3xl border border-gray-200 overflow-hidden ${className}`}>
      <div className="space-y-1">
        {items.map((item, index) => (
          <AccordionItem key={index} title={item.title}>
            {item.content}
          </AccordionItem>
        ))}
      </div>
    </div>
  );
};

export default Accordion;
