'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

export function ButtonTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleButtonClick = (e: MouseEvent) => {
      // Find the button that was clicked or a parent button
      let target = e.target as HTMLElement
      while (target && target !== document.body) {
        if (target.tagName === 'BUTTON' || (target.tagName === 'A' && target.getAttribute('href'))) {
          // Get information about the button
          const buttonText = target.innerText?.trim() || 'No text'
          const buttonId = target.id || 'No ID'
          const buttonClass = target.className || 'No class'
          const buttonHref = target.tagName === 'A' ? target.getAttribute('href') : null
          const buttonSection = findParentSection(target)
          
          // Capture the button click event
          posthog.capture('button_clicked', {
            button_text: buttonText,
            button_id: buttonId,
            button_class: buttonClass,
            button_href: buttonHref,
            button_section: buttonSection,
            path: window.location.pathname
          })
          
          break
        }
        target = target.parentElement as HTMLElement
      }
    }
    
    // Helper to find the parent section of an element
    const findParentSection = (element: HTMLElement): string => {
      let current = element
      while (current && current !== document.body) {
        if (current.tagName === 'SECTION' && current.id) {
          return current.id
        }
        current = current.parentElement as HTMLElement
      }
      return 'Unknown section'
    }
    
    // Add click listener to the document to capture all button clicks
    document.addEventListener('click', handleButtonClick as EventListener)
    
    return () => {
      document.removeEventListener('click', handleButtonClick as EventListener)
    }
  }, [])
  
  return null
}
