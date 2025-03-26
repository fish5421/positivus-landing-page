'use client'

import { useEffect, useRef } from 'react'
import posthog from 'posthog-js'

export function ScrollTracker() {
  const maxScrollRef = useRef<number>(0)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleScroll = () => {
      // Calculate scroll depth percentage
      const currentScroll = window.scrollY + window.innerHeight
      const pageHeight = document.body.offsetHeight
      const scrollPercentage = Math.min(1, currentScroll / pageHeight)
      
      // Update max scroll if current is greater
      if (scrollPercentage > maxScrollRef.current) {
        maxScrollRef.current = scrollPercentage
        
        // Trigger scroll depth events at 25%, 50%, 75% and 100%
        if (scrollPercentage >= 0.25 && maxScrollRef.current < 0.5) {
          posthog.capture('scroll_depth_reached', { 
            depth_percentage: 25,
            path: window.location.pathname
          })
        } else if (scrollPercentage >= 0.5 && maxScrollRef.current < 0.75) {
          posthog.capture('scroll_depth_reached', { 
            depth_percentage: 50,
            path: window.location.pathname
          })
        } else if (scrollPercentage >= 0.75 && maxScrollRef.current < 1) {
          posthog.capture('scroll_depth_reached', { 
            depth_percentage: 75,
            path: window.location.pathname
          })
        } else if (scrollPercentage >= 0.99) {
          posthog.capture('scroll_depth_reached', { 
            depth_percentage: 100,
            path: window.location.pathname
          })
        }
      }
    }
    
    // Capture scroll on page leave or route change
    const handlePageLeave = () => {
      posthog.capture('page_leave', {
        last_scroll_percentage: maxScrollRef.current,
        last_scroll_pixels: window.scrollY + window.innerHeight,
        path: window.location.pathname
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('beforeunload', handlePageLeave)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handlePageLeave)
    }
  }, [])
  
  return null
}
