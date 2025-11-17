# Handoff Checklist & Next Steps

## Files Provided

### Core Application Files
```
app/
  ├── page.tsx                    # Main memorial page
  ├── layout.tsx                   # Root layout with fonts
  ├── globals.css                  # Global styles
  ├── admin/
  │   └── page.tsx                # Admin panel page
  └── components/
      ├── UnderConstructionBanner.tsx
      ├── Header.tsx
      ├── Hero.tsx
      ├── About.tsx
      ├── Gallery.tsx
      ├── TributeCard.tsx
      ├── TributesList.tsx
      ├── TributeForm.tsx
      ├── ModerationPanel.tsx
      ├── AdminPanel.tsx
      └── Footer.tsx

data/
  ├── mockTributes.json           # Mock tribute data
  └── mockGallery.json            # Mock gallery data

docs/
  ├── DESIGN_SYSTEM.md            # Design system documentation
  ├── SUPABASE_INTEGRATION.md     # Supabase schema and code examples
  ├── INTERACTION_UX.md           # UX flow documentation
  └── HANDOFF_CHECKLIST.md        # This file
```

## Commands to Run Project Locally

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Steps

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

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Start production server**
   ```bash
   npm start
   ```

## Environment Variables

### Required for Supabase Integration (Next Phase)

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server-side key (for admin operations - keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: reCAPTCHA (if implementing)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing project
3. Go to Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Next Steps: Supabase Integration

### Phase 1: Database Setup

1. **Create Supabase Project**
   - Sign up/login to Supabase
   - Create new project
   - Wait for database to initialize

2. **Run SQL Schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy and execute SQL from `docs/SUPABASE_INTEGRATION.md`
   - Verify tables are created: `tributes`, `admin_users`, `gallery_images`

3. **Set Up Storage**
   - Go to Storage in Supabase dashboard
   - Create bucket: `tribute-photos` (private)
   - Create bucket: `gallery-photos` (public)
   - Apply storage policies from `docs/SUPABASE_INTEGRATION.md`

### Phase 2: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install --save-dev @types/node
```

### Phase 3: Create Supabase Client Files

1. Create `lib/supabase/client.ts` (use code from `docs/SUPABASE_INTEGRATION.md`)
2. Create `lib/supabase/server.ts` (use code from `docs/SUPABASE_INTEGRATION.md`)
3. Create `lib/supabase/storage.ts` (use code from `docs/SUPABASE_INTEGRATION.md`)

### Phase 4: Create API Routes

1. **Tribute Submission**
   - Create `app/api/tributes/route.ts`
   - Implement POST handler (see `docs/SUPABASE_INTEGRATION.md`)

2. **Tribute Retrieval**
   - Add GET handler to `app/api/tributes/route.ts`
   - Implement pagination

3. **Admin Endpoints**
   - Create `app/api/admin/tributes/[id]/approve/route.ts`
   - Create `app/api/admin/tributes/[id]/reject/route.ts`
   - Create `app/api/admin/tributes/[id]/route.ts` (DELETE)

### Phase 5: Update Components

1. **TributeForm.tsx**
   - Replace mock submission with API call
   - Add loading states
   - Add error handling
   - Add success message

2. **TributesList.tsx**
   - Fetch from API instead of mock data
   - Add pagination
   - Add loading states

3. **AdminPanel.tsx**
   - Add authentication check
   - Fetch pending tributes from API
   - Implement approve/reject/delete actions

### Phase 6: Authentication Setup

1. **Set Up Supabase Auth**
   - Enable email/password auth in Supabase dashboard
   - (Optional) Enable OAuth providers

2. **Create Admin User**
   - Sign up first admin user via Supabase Auth
   - Insert into `admin_users` table manually:
     ```sql
     INSERT INTO admin_users (user_id, email)
     VALUES (
       'user-uuid-from-auth',
       'admin@example.com'
     );
     ```

3. **Create Auth Components**
   - Create `app/components/LoginForm.tsx`
   - Create `app/middleware.ts` for route protection
   - Protect `/admin` route

### Phase 7: Image Processing (Optional but Recommended)

1. **Install Image Processing Library**
   ```bash
   npm install sharp
   ```

2. **Create Image Processing Utility**
   - Create `lib/image-processing.ts`
   - Implement resize and thumbnail generation
   - Use in API route before uploading to Supabase

### Phase 8: Security Enhancements

1. **Add Input Sanitization**
   ```bash
   npm install dompurify
   npm install --save-dev @types/dompurify
   ```

2. **Add Rate Limiting**
   - Use Vercel Edge Config or Upstash Redis
   - Or implement simple in-memory rate limiting

3. **Add reCAPTCHA (Optional)**
   ```bash
   npm install react-google-recaptcha
   ```

### Phase 9: Testing

1. **Test Tribute Submission**
   - Submit tribute with photo
   - Verify it appears in pending list
   - Verify photo is uploaded to storage

2. **Test Admin Approval**
   - Log in as admin
   - Approve pending tribute
   - Verify it appears in public list
   - Verify photo is accessible

3. **Test Error Handling**
   - Submit invalid data
   - Test network errors
   - Test file upload errors

## Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Push code to GitHub/GitLab/Bitbucket
   - Import project in Vercel

2. **Configure Environment Variables**
   - Add all `.env.local` variables in Vercel dashboard
   - Settings → Environment Variables

3. **Deploy**
   - Vercel will auto-deploy on push
   - Or trigger manual deployment

### Netlify

1. **Connect Repository**
   - Push code to Git repository
   - Import project in Netlify

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Configure Environment Variables**
   - Site settings → Environment variables

4. **Deploy**
   - Netlify will auto-deploy on push

### Other Platforms

- **Railway**: Similar to Vercel, supports Next.js out of the box
- **AWS Amplify**: Supports Next.js with SSR
- **DigitalOcean App Platform**: Supports Next.js

## Post-Deployment Checklist

- [ ] Verify tribute submission works
- [ ] Verify admin authentication works
- [ ] Verify photo uploads work
- [ ] Verify moderation flow works
- [ ] Test on mobile devices
- [ ] Check accessibility (screen reader, keyboard navigation)
- [ ] Verify all images load correctly
- [ ] Test error states
- [ ] Set up monitoring (optional: Sentry, LogRocket, etc.)

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Accessibility**: https://www.w3.org/WAI/WCAG21/quickref/

## Notes

- The wireframe uses static images from the `public/` folder
- All form submissions are disabled in wireframe mode
- Admin panel is a visual wireframe only
- All Supabase integration code is provided in `docs/SUPABASE_INTEGRATION.md`
- Follow the step-by-step integration guide above for full functionality

