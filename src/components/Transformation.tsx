'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Benefit {
  title: string;
  description: string;
  icon?: string;
}

interface TransformationProps {
  heading: string;
  subheading?: string;
  benefits: Benefit[];
  illustration?: string;
  illustrationAlt?: string;
  illustrationTitle?: string; // Title displayed over the illustration
  illustrationCaption?: string; // Caption displayed below the illustration
  animationUrl?: string;
}

const Transformation: React.FC<TransformationProps> = ({
  heading,
  subheading,
  benefits,
  illustration,
  illustrationAlt = "How it works",
  illustrationTitle,
  illustrationCaption,
  animationUrl,
}) => {
  // Video player container reference
  const videoContainerRef = useRef<HTMLDivElement>(null);
  // State to track if the video should be loaded
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  // State to track viewport size
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  // Video player URL with optimized parameters - including autoplay and no letterboxing
  const videoPlayerUrl = "https://customer-cajhg5znip2cupqy.cloudflarestream.com/a854f0a3a3dcd4e9fc2e04e2c5fed836/iframe?loop=true&preload=metadata&autoplay=true&muted=true&poster=https%3A%2F%2Fcustomer-cajhg5znip2cupqy.cloudflarestream.com%2Fa854f0a3a3dcd4e9fc2e04e2c5fed836%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600&letterboxColor=transparent&controls=false&backgroundMode=fill&autosize=false&fitMode=cover";

  // Setup Intersection Observer for lazy loading and check for mobile view
  useEffect(() => {
    if (!videoContainerRef.current) return;
    
    // Check viewport size more granularly
    const checkViewportSize = () => {
      if (window.innerWidth < 768) {
        setViewportSize('mobile');
      } else if (window.innerWidth < 1280) {
        setViewportSize('tablet');
      } else {
        setViewportSize('desktop');
      }
    };
    
    // Initial check
    checkViewportSize();
    
    // Add resize listener
    window.addEventListener('resize', checkViewportSize);
    
    const options = {
      root: null,
      rootMargin: '100px', // Load when within 100px of viewport
      threshold: 0.1 // 10% of the element is visible
    };

    // Create observer to detect when video container is near viewport
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setShouldLoadVideo(true);
        observer.disconnect(); // Stop observing once loaded
      }
    }, options);

    // Start observing the container
    observer.observe(videoContainerRef.current);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkViewportSize);
    };
  }, []);
  return (
    <div className="flex flex-col xl:flex-row xl:gap-24 items-start">
      {/* Video/GIF container - ordered second on mobile/tablet (below text), first on desktop (left side) */}
      <div className="w-full xl:w-2/5 order-2 xl:order-1 mt-10 xl:mt-0">
        <div ref={videoContainerRef} className="relative h-[300px] sm:h-[350px] md:h-[500px] rounded-3xl overflow-hidden border border-gray-200 bg-white p-0">
          {illustrationTitle && (
            <div className="absolute top-0 left-0 right-0 z-10 bg-[#B9FF66] py-4 px-4 text-black flex items-center justify-center">
              <h3 className="text-xl font-semibold">{illustrationTitle}</h3>
            </div>
          )}

          {/* Cloudflare Stream Video with Lazy Loading */}
          <div className="relative w-full h-full">
            {/* Placeholder shown until video is in viewport */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-8 z-10"
                 style={{ opacity: shouldLoadVideo ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}>
              <div className="flex items-center justify-center mb-8">
                {/* Cube icon matching the screenshot */}
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M95 75V25C95 20.2975 91.0971 16.5183 86.4357 16.4346L86.25 16.4333L13.75 16.4333C8.9275 16.4333 5 20.361 5 25.1833V74.8167C5 79.639 8.9275 83.5667 13.75 83.5667H86.25C91.0725 83.5667 95 79.639 95 74.8167V75Z" stroke="#B9FF66" strokeWidth="2" />
                  <path d="M13.75 83.5667L50 50L86.25 83.5667" stroke="#B9FF66" strokeWidth="2" />
                  <path d="M13.75 16.4333L50 50L86.25 16.4333" stroke="#B9FF66" strokeWidth="2" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-black">Real Estate Valuation Data Enrichment Process</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  This animation demonstrates how we transform basic address lists into targeted campaigns by enriching them with real estate valuation data
                </p>
              </div>
              <div className="flex space-x-3 mt-2">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-300"></div>
              </div>
            </div>

            {/* Actual Cloudflare Stream video - only loaded when in viewport */}
            <div className="w-full h-full absolute inset-0 z-0 overflow-hidden m-0 p-0 bg-black"
                 style={{ opacity: shouldLoadVideo ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
              {shouldLoadVideo && (
                <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden', margin: 0, padding: 0, backgroundColor: '#000' }}>
                  <iframe
                    src={videoPlayerUrl}
                    style={{ 
                      border: 'none', 
                      position: 'absolute',
                      top: viewportSize === 'desktop' ? '45%' : '50%',
                      left: '50%',
                      width: viewportSize === 'mobile' ? '110%' : viewportSize === 'tablet' ? '115%' : '150%',
                      height: viewportSize === 'mobile' ? '110%' : viewportSize === 'tablet' ? '115%' : '150%',
                      transform: 'translate(-50%, -50%)',
                      objectFit: viewportSize === 'desktop' ? 'cover' : 'contain'
                    }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen={true}
                    title="Real Estate Valuation Data Enrichment Process"
                  />
                </div>
              )}
            </div>
          </div>

          {illustrationCaption && (
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-80 py-4 px-4 text-white border-t border-gray-800">
              <p className="text-center text-sm">{illustrationCaption}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Text container - ordered first on mobile/tablet (above GIF), second on desktop (right side) */}
      <div className="w-full xl:w-3/5 order-1 xl:order-2">
        <h2 className="text-5xl font-bold mb-6">{heading}</h2>
        {subheading && <p className="text-lg mb-8 text-gray-700 max-w-3xl">{subheading}</p>}
        
        <div className="space-y-8 max-w-3xl">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-[#B9FF66] rounded-full flex items-center justify-center text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-xl mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transformation;
