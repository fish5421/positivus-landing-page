'use client'

import posthog from 'posthog-js'

export const trackCTA = (ctaName, ctaLocation, additionalProperties = {}) => {
  return (e) => {
    // Don't interfere with normal link behavior
    posthog.capture('cta_clicked', {
      cta_name: ctaName,
      cta_location: ctaLocation,
      path: window.location.pathname,
      ...additionalProperties
    })
  }
}
