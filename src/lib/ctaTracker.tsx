'use client'

import { useEffect, useRef, useState } from 'react'
import posthog from 'posthog-js'

export function CTATracker() {
  const [visibleCTAs, setVisibleCTAs] = useState<Record<string, boolean>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  
  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) return
    
    // Create a map to track which CTAs have already been seen
    const ctasTracked: Record<string, boolean> = {}
    
    // Setup the observer
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const ctaElement = entry.target as HTMLElement;
        const ctaName = ctaElement.dataset.ctaName; // Get name from data-cta-name attribute
        
        if (ctaName && entry.isIntersecting && !ctasTracked[ctaName]) {
          // Mark this CTA as seen
          ctasTracked[ctaName] = true
          
          // Track the CTA view in PostHog
          posthog.capture('cta_viewed', {
            cta_name: ctaName,
            path: window.location.pathname
          })
          
          // Update state (optional, mainly for debugging or potential future use)
          setVisibleCTAs(prev => ({
            ...prev,
            [ctaName]: true
          }))
        }
      })
    }, {
      threshold: 0.3 // Trigger when 30% of the CTA is visible
    })
    
    // Find all elements that have a 'data-cta-name' attribute
    const ctas = document.querySelectorAll('[data-cta-name]')
    ctas.forEach(cta => {
      if (observerRef.current) {
        observerRef.current.observe(cta)
      }
    })
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])
  
  return null
}
