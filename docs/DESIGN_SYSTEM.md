# Design System & Visual/UX Summary

## Design Direction

### Color Palette

- **Primary Background**: `#FFFFFF` (White)
- **Secondary Background**: `#F9FAFB` (Gray-50)
- **Text Primary**: `#1A1A1A` (Gray-900)
- **Text Secondary**: `#4B5563` (Gray-600)
- **Text Tertiary**: `#6B7280` (Gray-500)
- **Border**: `#E5E7EB` (Gray-200)
- **Accent (Construction Banner)**: `#FEF3C7` (Amber-50) / `#FCD34D` (Amber-300)
- **Footer Background**: `#111827` (Gray-900)
- **Footer Text**: `#D1D5DB` (Gray-300)

### Typography

- **Heading Font**: Playfair Display (serif)
  - Weights: 400 (regular), 600 (semi-bold), 700 (bold)
  - Usage: Hero titles, section headings, memorial name
  
- **Body Font**: Inter (sans-serif)
  - Weights: 400 (regular), 500 (medium), 600 (semi-bold)
  - Usage: Body text, navigation, forms, buttons

### Tone

**Quiet, Reverent, Contemplative**

The design emphasizes:
- Generous white space for breathing room
- Muted, neutral color palette
- Elegant serif typography for memorial content
- Minimal animations (subtle hover states only)
- Clear visual hierarchy through typography scale and spacing
- Understated elegance that honors the subject

## Accessibility Notes

### Contrast
- All text meets WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text)
- Primary text (#1A1A1A) on white (#FFFFFF) = 16.6:1
- Secondary text (#4B5563) on white = 7.1:1

### Focus States
- All interactive elements have visible focus indicators
- Focus rings use 2px solid outline with 2px offset
- Color: #6B7280 (Gray-500) for sufficient contrast

### Alt Text
- All images must have descriptive alt text
- Hero image: "Mumbi Judy Jacqueline Kimaru"
- Gallery images: Descriptive captions or context
- Tribute photos: "[Name]'s tribute photo" or similar

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Skip links recommended for main content
- Logical tab order throughout

### Screen Readers
- Semantic HTML structure (header, main, section, footer, article)
- ARIA labels for icon-only buttons
- Form labels properly associated with inputs

