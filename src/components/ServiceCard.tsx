import React, { ReactNode } from 'react';
import Image from 'next/image';

interface ServiceCardProps {
  // Common props
  title1: string;
  title2?: string; // Optional for style 2
  description?: string; // For style 2
  linkText: string;
  href?: string;
  
  // Style specific props
  cardStyle?: 'style1' | 'style2' | 'featured' | 'dark'; // Default is style1 (green background labels), featured is for cards 2 and 5, dark is for cards 3 and 6
  cardNumber?: string; // For style 2 (e.g., "02")
  icon?: ReactNode; // For style 2
  iconSrc?: string; // For style 2 when using Image
  iconAlt?: string; // For style 2 when using Image
  
  // Default props
  illustration?: ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title1,
  title2,
  description,
  linkText,
  href = "#",
  cardStyle = 'style1',
  cardNumber,
  icon,
  iconSrc,
  iconAlt,
  illustration,
}) => {
  if (cardStyle === 'featured') {
    return (
      <div className="flex flex-row justify-between items-center p-[50px] gap-[77px] w-[600px] h-[310px] bg-[#B9FF66] border border-[#191A23] shadow-[0px_5px_0px_#191A23] rounded-[45px]">
        {/* Heading and link container */}
        <div className="flex flex-col items-start p-0 gap-[93px] w-[209px] h-[210px]">
          {/* Heading container */}
          <div className="flex flex-col items-start p-0 w-[209px] h-[76px]">
            {/* First label */}
            <div className="flex flex-col items-start p-0 px-[7px] gap-[10px] w-[209px] h-[38px] bg-white rounded-[7px]">
              <span className="w-[195px] h-[38px] font-['Space_Grotesk'] font-medium text-[30px] leading-[38px] text-black">
                {title1}
              </span>
            </div>
            
            {/* Second label */}
            {title2 && (
              <div className="flex flex-col items-start p-0 px-[7px] gap-[10px] w-[178px] h-[38px] bg-white rounded-[7px] order-1">
                <span className="w-[164px] h-[38px] font-['Space_Grotesk'] font-medium text-[30px] leading-[38px] text-black">
                  {title2}
                </span>
              </div>
            )}
          </div>
          
          {/* Link container */}
          <a href={href} className="flex flex-row items-center p-0 gap-[15px] w-[164px] h-[41px]">
            {/* Icon container */}
            <div className="relative w-[41px] h-[41px]">
              {/* Circle background */}
              <div className="absolute w-[41px] h-[41px] left-0 top-0 bg-[#191A23] rounded-full"></div>
              {/* Arrow */}
              <svg className="absolute left-[8px] top-[8px] transform -rotate-45" width="25" height="25" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10.5H16M16 10.5L11 5.5M16 10.5L11 15.5" stroke="#B9FF66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* Learn more text */}
            <span className="w-[108px] h-[28px] font-['Space_Grotesk'] font-normal text-[20px] leading-[28px] text-black">
              {linkText}
            </span>
          </a>
        </div>
        
        {/* Illustration */}
        <div className="w-[210px] h-[147.62px]">
          {illustration ? (
            illustration
          ) : (
            <div className="relative w-[210px] h-[147.62px]">
              <svg width="210" height="147.62" viewBox="0 0 210 147.62" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Simple placeholder illustration */}
                <rect x="25" y="25" width="160" height="97.62" rx="10" stroke="#191A23" strokeWidth="2" fill="none" />
                <circle cx="105" cy="73.81" r="35" stroke="#191A23" strokeWidth="2" fill="none" />
                <path d="M85 73.81 L125 73.81 M105 53.81 L105 93.81" stroke="#191A23" strokeWidth="2" />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  } else if (cardStyle === 'dark') {
    return (
      <div className="flex flex-row justify-between items-center p-[50px] gap-[77px] w-full bg-[#191A23] border border-[#191A23] shadow-[0px_5px_0px_#191A23] rounded-[45px]">
        {/* Heading and link container */}
        <div className="flex flex-col justify-center items-start p-0 gap-[93px] w-[197px] m-auto">
          {/* Heading container */}
          <div className="flex flex-col items-start p-0 w-[197px] h-[76px]">
            {/* First label */}
            <div className="flex flex-col items-start p-0 px-[7px] gap-[10px] w-[197px] h-[38px] bg-white rounded-[7px]">
              <span className="w-[183px] h-[38px] font-['Space_Grotesk'] font-medium text-[30px] leading-[38px] text-black">
                {title1}
              </span>
            </div>
            
            {/* Second label */}
            {title2 && (
              <div className="flex flex-col items-start p-0 px-[7px] gap-[10px] w-[161px] h-[38px] bg-white rounded-[7px] order-1">
                <span className="w-[147px] h-[38px] font-['Space_Grotesk'] font-medium text-[30px] leading-[38px] text-black">
                  {title2}
                </span>
              </div>
            )}
          </div>
          
          {/* Link container */}
          <a href={href} className="flex flex-row items-center p-0 gap-[15px] w-[164px] h-[41px] order-1">
            {/* Icon container */}
            <div className="relative w-[41px] h-[41px] order-0">
              {/* Circle background */}
              <div className="absolute w-[41px] h-[41px] left-0 top-0 bg-white rounded-full"></div>
              {/* Arrow */}
              <svg className="absolute left-[8px] top-[8px] transform -rotate-45" width="25" height="25" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10.5H16M16 10.5L11 5.5M16 10.5L11 15.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* Learn more text */}
            <span className="w-[108px] h-[28px] font-['Space_Grotesk'] font-normal text-[20px] leading-[28px] text-white order-1">
              {linkText}
            </span>
          </a>
        </div>
      
        {/* Illustration */}
        <div className="w-[210px] h-[210px] m-auto order-1">
          {illustration ? (
            illustration
          ) : (
            <svg width="210" height="210" viewBox="0 0 210 210" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Simple placeholder illustration */}
              <rect x="25" y="25" width="160" height="160" rx="10" stroke="#FFFFFF" strokeWidth="2" fill="none" />
              <circle cx="105" cy="105" r="35" stroke="#FFFFFF" strokeWidth="2" fill="none" />
              <path d="M85 105 L125 105 M105 85 L105 125" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          )}
        </div>
      </div>
    );
  } else if (cardStyle === 'style1') {
    return (
      <div className="flex flex-row justify-between items-center p-[50px] gap-[77px] w-full bg-[#F3F3F3] border border-[#191A23] shadow-[0px_5px_0px_#191A23] rounded-[45px]">
        {/* Heading and link container */}
        <div className="flex flex-col justify-center items-start p-0 gap-[93px] w-[221px]">
          {/* Heading container */}
          <div className="flex flex-col items-start p-0 w-[221px]">
            {/* First label */}
            <div className="flex flex-col items-start p-0 px-[7px] gap-[10px] w-[221px] h-[38px] bg-[#B9FF66] rounded-[7px]">
              <span className="w-[207px] h-[38px] font-['Space_Grotesk'] font-medium text-[30px] leading-[38px] text-black">
                {title1}
              </span>
            </div>
            
            {/* Second label */}
            {title2 && (
              <div className="flex flex-col items-start p-0 px-[7px] gap-[10px] w-[197px] h-[38px] bg-[#B9FF66] rounded-[7px] order-1">
                <span className="w-[183px] h-[38px] font-['Space_Grotesk'] font-medium text-[30px] leading-[38px] text-black">
                  {title2}
                </span>
              </div>
            )}
          </div>
          
          {/* Link container */}
          <a href={href} className="flex flex-row items-center p-0 gap-[15px] w-[164px] h-[41px] order-1">
            {/* Icon container */}
            <div className="relative w-[41px] h-[41px] order-0">
              {/* Circle background */}
              <div className="absolute w-[41px] h-[41px] left-0 top-0 bg-[#191A23] rounded-full"></div>
              {/* Arrow */}
              <svg className="absolute left-[8px] top-[8px] transform -rotate-45" width="25" height="25" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10.5H16M16 10.5L11 5.5M16 10.5L11 15.5" stroke="#B9FF66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* Learn more text */}
            <span className="w-[108px] h-[28px] font-['Space_Grotesk'] font-normal text-[20px] leading-[28px] text-black order-1">
              {linkText}
            </span>
          </a>
        </div>
        
        {/* Illustration */}
        <div className="relative w-[210px] h-[170px] order-1">
          {illustration ? (
            illustration
          ) : (
            <Image 
              src="/images/search-illustration.png" 
              alt="Search Engine Optimization Illustration" 
              width={250} 
              height={200} 
              className="object-contain" 
            />
          )}
        </div>
      </div>
    );
  } else { 
    // Style 2
    return (
      <div className="w-full border-3 border-black rounded-[45px] p-10 hover:bg-primary transition-colors group">
        <div className="flex justify-between items-start mb-12">
          <div className="bg-primary p-2 rounded-xl group-hover:bg-white">
            {icon ? (
              icon
            ) : iconSrc ? (
              <Image src={iconSrc} alt={iconAlt || title1} width={30} height={30} />
            ) : (
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor" />
              </svg>
            )}
          </div>
          {cardNumber && (
            <span className="text-sm font-medium border-2 border-black rounded-full px-4 py-1 group-hover:bg-white">{cardNumber}</span>
          )}
        </div>
        <h3 className="text-2xl font-bold mb-6">{title1}</h3>
        {description && <p className="mb-8">{description}</p>}
        <a href={href} className="inline-flex items-center font-medium hover:underline">
          {linkText}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 transform -rotate-45" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    );
  }
};

export default ServiceCard;
