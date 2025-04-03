# Service Card Component Extraction

## Task
Extract the hardcoded service card styles into a reusable Next.js component to improve code reusability.

## Current Issues
- Service card styles are hardcoded in a single `<div>` in page.tsx
- If multiple service cards are needed, code will be duplicated
- Makes updates more difficult as changes need to be made in multiple places

## Implementation Plan

### 1. Create a ServiceCard Component
- [X] Create components directory if it doesn't exist
- [X] Create ServiceCard.tsx component
- [X] Define props interface (title1, title2, linkText, etc.)
- [X] Extract styles from page.tsx
- [X] Make the SVG illustration customizable

### 2. Update page.tsx
- [X] Import the new ServiceCard component
- [X] Replace first hardcoded service card with component
- [X] Pass appropriate props

### 3. Complete Refactoring
- [X] Replace all remaining service cards with ServiceCard component
- [X] Support both card styles (style1 and style2)
- [X] Change grid layout from 3x2 to 2x3 (modify lg:grid-cols-3 to md:grid-cols-2)

## Progress
- Started implementation on: 2025-03-06
- Created ServiceCard.tsx component with a flexible interface
- Successfully replaced the first hardcoded service card in page.tsx
- Completed refactoring all service cards to use the new component
- Changed grid layout to 2x3 as requested
- Implementation complete on: 2025-03-06

## Final Results
- Created a reusable ServiceCard component that supports two different styles:
  - Style 1: Green-labeled cards with detailed layout (SEO card)
  - Style 2: Minimalist cards with icons (all other service cards)
- Converted all six service cards to use the new component
- Modified grid layout from 3 columns to 2 columns
- Significantly reduced code duplication
- Made future updates easier with centralized component logic

## Lessons
- Extracting repeated UI elements into reusable components improves maintainability
- Using props makes components flexible for different use cases
- Allowing for optional content (like custom illustrations) makes components more versatile
- TypeScript interfaces help maintain type safety with complex component props
- Using different card styles in a single component can be achieved with conditional rendering

## PostHog Scroll & CTA Tracking

**Goal:** Implement PostHog tracking for scroll depth and CTA visibility in the `positivus-landing-page` project.

**Plan:**

[X] 1. Review Project Files (`list_dir`)
[X] 2. Check for Existing PostHog (`grep_search`)
[X] 3. Locate Main Component/Layout (`src/app/layout.tsx`)
[X] 4. View Main Component (`view_file`)
[X] 5. Review Existing Trackers (`scrollTracker.tsx`, `sectionTracker.tsx`)
[X] 6. Plan Code Changes (Create `ctaTracker.tsx`, integrate into `layout.tsx`)
[X] 7. Implement Changes (`write_to_file`, `edit_file`)
[X] 8. Add `data-cta-name` attributes to main HTML elements (`grep_search`, `view_file`, `edit_file`)
[ ] 9. Review and add `data-cta-name` to remaining secondary CTAs (USER TASK)

**Summary:**
- Existing `scrollTracker.tsx` handles scroll depth (25%, 50%, 75%, 100%) and max depth on page leave.
- Created `ctaTracker.tsx` using IntersectionObserver, based on existing `sectionTracker.tsx`.
- `ctaTracker.tsx` looks for elements with `data-cta-name` attribute.
- When a CTA element is 30% visible, a `cta_viewed` event is sent to PostHog with `cta_name` and `path`.
- Integrated `CTATracker` into `src/app/layout.tsx`.
- Added `data-cta-name` attributes to primary CTA buttons in `page.tsx`, `ContactButton.tsx`, `CTA.tsx`, `PricingTable.tsx`, and `ContactForm.tsx`.

**Lessons:**

- Reuse existing patterns (like `sectionTracker.tsx`) for similar functionality.
- Use data attributes (`data-cta-name`) to declaratively mark elements for tracking.
- Make data attribute values dynamic and descriptive (e.g., using props like `title` or `tier.name`) for better event identification.
