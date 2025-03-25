'use client';

import React, { useState, useEffect } from 'react';
import ContactButton from './ContactButton';

interface NavigationItem {
  label: string;
  href: string;
  isContact?: boolean;
}

interface NavigationProps {
  items: NavigationItem[];
}

const Navigation: React.FC<NavigationProps> = ({ items }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled state based on scroll position
      setIsScrolled(window.scrollY > 10);
      
      const scrollPosition = window.scrollY + 100;
      
      // Find the current active section based on scroll position
      const currentSection = items
        .map(item => item.href.substring(1)) // Remove '#' from href
        .filter(id => id && document.getElementById(id))
        .find(id => {
          const element = document.getElementById(id);
          if (!element) return false;
          
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom > 0;
        });
      
      if (currentSection) {
        setActiveSection(`#${currentSection}`);
      } else if (scrollPosition < 200) {
        // Near the top of the page, highlight Home
        setActiveSection('#');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-8">
        {items.map((item, index) => (
          item.isContact ? (
            <ContactButton 
              key={index}
              className={`nav-link hover:text-primary transition-colors ${activeSection === item.href ? 'text-primary font-medium active' : ''}`}
            >
              {item.label}
            </ContactButton>
          ) : (
            <a 
              key={index} 
              href={item.href} 
              className={`nav-link hover:text-primary transition-colors ${activeSection === item.href ? 'text-primary font-medium active' : ''}`}
              onClick={(e) => {
                if (item.href === '#') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              {item.label}
            </a>
          )
        ))}
      </nav>
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden flex items-center z-50"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        {!isMenuOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
          </svg>
        )}
      </button>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
        aria-hidden="true"
      ></div>
      
      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white z-50 p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Mobile navigation menu"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end mb-8">
            <button 
              onClick={toggleMenu}
              aria-label="Close menu"
              className="p-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col space-y-6">
            {items.map((item, index) => (
              item.isContact ? (
                <ContactButton 
                  key={index}
                  className={`text-xl py-2 border-b border-gray-100 text-left ${activeSection === item.href ? 'text-primary font-medium' : ''}`}
                >
                  {item.label}
                </ContactButton>
              ) : (
                <a 
                  key={index} 
                  href={item.href} 
                  className={`text-xl py-2 border-b border-gray-100 ${activeSection === item.href ? 'text-primary font-medium' : ''}`}
                  onClick={(e) => {
                    if (item.href === '#') {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              )
            ))}
          </div>
          
          <div className="mt-auto pt-8">
            <a href="#pricing" className="btn btn-primary w-full text-center" onClick={() => setIsMenuOpen(false)}>Get Started</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
