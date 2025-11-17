# Interaction & UX Notes

## Add Tribute Flow

### Step-by-Step Process

1. **User fills out form**
   - Name (required)
   - Email (optional, for moderation contact)
   - Message (required, max 5000 characters)
   - Photo upload (optional)
   - Privacy checkbox (publish anonymously)

2. **Client-side validation**
   - Validate required fields
   - Check file type (images only)
   - Check file size (max 5MB)
   - Show photo preview if uploaded

3. **Photo preview (client-side)**
   - Display uploaded image immediately
   - Show file name and size
   - Allow user to remove and re-upload

4. **Form submission**
   - Disable submit button during upload
   - Show loading state
   - Upload photo to Supabase Storage (`tribute-photos/pending/` folder)
   - Create tribute record with `approved: false`
   - Store photo path in tribute record

5. **Success state**
   - Show success message: "Thank you for your tribute. It will be reviewed before being published."
   - Clear form
   - Optionally redirect to tributes section

6. **Admin review**
   - Admin sees pending tribute in moderation panel
   - Admin can view full message and photo
   - Admin can approve, reject, or delete

7. **After approval**
   - Photo moved from `pending/` to `approved/` folder
   - Tribute `approved` field set to `true`
   - Tribute becomes visible in public tributes list
   - Photo URL becomes publicly accessible

## Photo Gallery

### Current Implementation
- Photos are served from the `public/` folder
- Static images displayed in masonry/grid layout
- Clicking opens lightbox view

### Future Implementation (Optional)
- If using Supabase Storage for gallery:
  - Store gallery images in `gallery-photos` bucket (public)
  - Use `gallery_images` table to track metadata
  - Admin can upload/manage gallery images
  - Public can view all approved gallery images

## Error States

### Form Submission Errors

1. **Network Error**
   - Display: "Unable to submit tribute. Please check your connection and try again."
   - Allow retry

2. **Validation Error**
   - Display field-specific error messages
   - Highlight invalid fields
   - Prevent submission until fixed

3. **File Upload Error**
   - Display: "Photo upload failed. Please try again or submit without a photo."
   - Allow user to retry upload or submit without photo

4. **Server Error**
   - Display: "Something went wrong. Please try again later."
   - Log error for admin review

### Success States

1. **Successful Submission**
   - Green success banner
   - Clear confirmation message
   - Form reset
   - Optional: Show "View your tribute" link (after approval)

## Image Handling

### Recommended Specifications

- **Formats**: JPEG, PNG, WebP
- **Maximum file size**: 5MB per tribute photo, 10MB per gallery photo
- **Recommended dimensions**:
  - Tribute photos: Max 1920px width, maintain aspect ratio
  - Gallery thumbnails: 400x400px (square crop or maintain aspect)
  - Gallery full-size: Max 2560px width

### Processing Steps

1. **Client-side (before upload)**
   - Validate file type
   - Check file size
   - Optional: Compress/resize using browser APIs (e.g., `browser-image-compression`)

2. **Server-side (on upload)**
   - Validate file type again
   - Generate unique filename (UUID + timestamp)
   - Resize if needed (using Sharp or similar)
   - Generate thumbnail (for gallery grid)
   - Upload to Supabase Storage

3. **Storage Structure**
   ```
   tribute-photos/
     pending/
       {tribute-id}-{timestamp}.jpg
     approved/
       {tribute-id}-{timestamp}.jpg
   gallery-photos/
     {image-id}-{timestamp}.jpg
     thumbnails/
       {image-id}-{timestamp}-thumb.jpg
   ```

### Image Optimization

- Use Next.js Image component for automatic optimization
- Serve WebP format when supported
- Lazy load images below the fold
- Use appropriate `sizes` attribute for responsive images

## User Experience Enhancements

### Loading States
- Skeleton loaders for tribute list
- Spinner during photo upload
- Progressive image loading

### Accessibility
- Keyboard navigation for lightbox
- Screen reader announcements for form submissions
- Focus management (return focus after modal close)

### Performance
- Pagination for tributes list (10-20 per page)
- Infinite scroll option (optional)
- Image lazy loading
- Code splitting for admin panel

### Mobile Considerations
- Touch-friendly form inputs
- Swipe gestures for lightbox navigation
- Responsive image sizes
- Optimized file upload on mobile networks

