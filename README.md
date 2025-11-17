# Memorial Site for Mumbi Judy Jacqueline Kimaru

A respectful, solemn, and deeply-felt memorial webpage honoring the life and memory of Mumbi Judy Jacqueline Kimaru (1986–2025).

## Current Status: Wireframe Phase

This is a **UI-first wireframe implementation** built with Next.js. All features are visually represented but not yet functional. The site includes:

- ✅ Complete visual wireframe with all planned sections
- ✅ Under construction banner (visible)
- ✅ Hero section with memorial information
- ✅ About/Life summary section
- ✅ Photo gallery with lightbox
- ✅ Tributes list (mock data)
- ✅ Leave a Tribute form (UI only)
- ✅ Moderation panel wireframe
- ✅ Admin panel wireframe
- ✅ Responsive, accessible design

## Project Structure

```
mumbi/
├── app/
│   ├── components/          # React components
│   │   ├── UnderConstructionBanner.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Gallery.tsx
│   │   ├── TributeCard.tsx
│   │   ├── TributesList.tsx
│   │   ├── TributeForm.tsx
│   │   ├── ModerationPanel.tsx
│   │   ├── AdminPanel.tsx
│   │   └── Footer.tsx
│   ├── admin/
│   │   └── page.tsx          # Admin panel page
│   ├── page.tsx              # Main memorial page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── data/
│   ├── mockTributes.json     # Mock tribute data
│   └── mockGallery.json      # Mock gallery data
└── docs/
    ├── DESIGN_SYSTEM.md      # Design system documentation
    ├── SUPABASE_INTEGRATION.md  # Supabase schema & code examples
    ├── INTERACTION_UX.md     # UX flow documentation
    └── HANDOFF_CHECKLIST.md  # Implementation guide
```

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

## Design System

### Color Palette
- **Primary Background**: `#FFFFFF` (White)
- **Secondary Background**: `#F9FAFB` (Gray-50)
- **Text Primary**: `#1A1A1A` (Gray-900)
- **Text Secondary**: `#4B5563` (Gray-600)
- **Footer Background**: `#111827` (Gray-900)

### Typography
- **Headings**: Playfair Display (serif) - Elegant, reverent
- **Body**: Inter (sans-serif) - Readable, modern

### Tone
Quiet, reverent, contemplative with generous spacing and minimal animations.

See `docs/DESIGN_SYSTEM.md` for complete design documentation.

## Features (Wireframe)

### Main Page (`/`)
- **Hero Section**: Memorial title, name, dates, and tribute excerpt
- **About Section**: Life summary and biography
- **Gallery**: Photo grid with lightbox view
- **Tributes List**: Scrollable list of tribute cards
- **Leave a Tribute Form**: Submission form (disabled in wireframe)
- **Moderation Panel**: Visible wireframe for admin controls

### Admin Panel (`/admin`)
- Pending tributes list
- Approve/Reject/Delete actions (wireframe only)
- Gallery management (wireframe only)

## Next Steps: Supabase Integration

The wireframe is complete. The next phase involves:

1. **Database Setup**: Create Supabase tables and storage buckets
2. **API Routes**: Implement tribute submission and retrieval
3. **Authentication**: Set up admin authentication
4. **Image Upload**: Connect photo uploads to Supabase Storage
5. **Moderation**: Make admin panel functional

See `docs/HANDOFF_CHECKLIST.md` for detailed step-by-step instructions.

## Documentation

- **Design System**: `docs/DESIGN_SYSTEM.md`
- **Supabase Integration**: `docs/SUPABASE_INTEGRATION.md`
- **UX & Interactions**: `docs/INTERACTION_UX.md`
- **Handoff Checklist**: `docs/HANDOFF_CHECKLIST.md`

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Typography**: Google Fonts (Playfair Display, Inter)
- **Language**: TypeScript
- **Future Backend**: Supabase (PostgreSQL + Storage)

## Accessibility

- WCAG AA compliant color contrast
- Keyboard navigation support
- Focus indicators on all interactive elements
- Semantic HTML structure
- Screen reader friendly

## License

Private memorial site.

---

**Note**: This is a wireframe. All form submissions and admin actions are disabled. See documentation for integration steps.
