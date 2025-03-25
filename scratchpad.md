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
