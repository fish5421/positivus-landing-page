'use client';

import React, { useEffect } from 'react';

const IntersectionObserver: React.FC = () => {
  useEffect(() => {
    // Function to handle intersection observations
    const handleIntersections = (entries: IntersectionObserverEntry[], observer: globalThis.IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once the animation is complete, we can stop observing this element
          observer.unobserve(entry.target);
        }
      });
    };

    // Create the observer
    const observer = new globalThis.IntersectionObserver(handleIntersections, {
      root: null, // Use viewport as root
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Get all elements with the fade-in-up class
    const fadeElements = document.querySelectorAll('.fade-in-up');
    
    // Start observing each element
    fadeElements.forEach(el => {
      observer.observe(el);
    });

    // Cleanup function to remove the observer when component unmounts
    return () => {
      fadeElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default IntersectionObserver;
