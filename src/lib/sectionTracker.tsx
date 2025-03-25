'use client'

import { useEffect, useRef, useState } from 'react'
import posthog from 'posthog-js'

export function SectionTracker() {
  const [visibleSections, setVisibleSections] = useState({})
  const observerRef = useRef(null)
  
  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) return
    
    // Create a map to track which sections have already been seen
    const sectionsTracked = {}
    
    // Setup the observer
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.id
        
        if (entry.isIntersecting && !sectionsTracked[sectionId]) {
          // Mark this section as seen
          sectionsTracked[sectionId] = true
          
          // Track the section view in PostHog
          posthog.capture('section_viewed', {
            section_id: sectionId,
            section_name: entry.target.dataset.sectionName || sectionId,
            path: window.location.pathname
          })
          
          // Update state to keep track of visible sections
          setVisibleSections(prev => ({
            ...prev,
            [sectionId]: true
          }))
        }
      })
    }, {
      threshold: 0.3 // Trigger when 30% of the section is visible
    })
    
    // Find all sections that have an ID (important sections in your landing page)
    const sections = document.querySelectorAll('section[id]')
    sections.forEach(section => {
      observerRef.current.observe(section)
    })
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])
  
  return null
}
