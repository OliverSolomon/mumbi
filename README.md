# Memorial Site for Mumbi Judy Jacqueline Kimaru

A respectful, solemn, and deeply-felt memorial webpage honoring the life and memory of Mumbi Judy Jacqueline Kimaru (1986–2025).

## Features

- ✅ **Google Authentication**: Sign in with Google to leave tributes
- ✅ **Photo Uploads**: Upload photos with tributes (stored in Supabase Storage)
- ✅ **Tribute Display**: View all tributes with photos and messages
- ✅ **Real-time Updates**: Tributes appear immediately after submission
- ✅ **Responsive Design**: Beautiful, accessible design for all devices
- ✅ **Floating Action Button**: Easy access to leave a tribute

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth (Google OAuth)
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account ([supabase.com](https://supabase.com))
- Google Cloud Console account (for OAuth)

## Quick Start

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Set Up Supabase

#### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **New Project**
3. Fill in project details:
   - **Name**: Your project name
   - **Database Password**: Choose a strong password
   - **Region**: Select closest region
4. Wait for project to initialize (2-3 minutes)

#### Get Supabase Credentials

1. Go to **Settings** → **API** in your Supabase project
2. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Run Database Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Open `supabase/schema.sql` from this project
3. Copy and paste the entire SQL code
4. Click **Run** to execute

This creates:
- `tributes` table
- `gallery_images` table (optional)
- Row Level Security (RLS) policies
- Storage policies

#### Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **Create Bucket**
3. Configure:
   - **Name**: `tribute-photos`
   - **Public**: **Yes** ✅
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`
4. Click **Create**

### 3. Set Up Google OAuth

#### Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: Your app name
   - Authorized redirect URIs:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     - Replace `YOUR_PROJECT_REF` with your Supabase project reference
     - Find it in Supabase Dashboard → Settings → API → Project URL
     - Example: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
5. Copy **Client ID** and **Client Secret**

#### Configure Google OAuth in Supabase

1. Go to **Authentication** → **Providers** in Supabase Dashboard
2. Find **Google** and click to enable
3. Paste your credentials:
   - **Client ID (for OAuth)**: Your Google Client ID
   - **Client Secret (for OAuth)**: Your Google Client Secret
4. Click **Save**

#### Set Redirect URLs

In Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: 
  - Development: `http://localhost:3000`
  - Production: `https://your-domain.com`
- **Redirect URLs**:
  - Development: `http://localhost:3000/auth/callback`
  - Production: `https://your-domain.com/auth/callback`

### 4. Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**
- Supabase Dashboard → Settings → API
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Run the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Seed Data (Optional)

To add initial tributes to the database:

1. Go to **SQL Editor** in Supabase Dashboard
2. Open `supabase/seedTributes.sql`
3. Copy and paste the SQL
4. Click **Run**

Or use the fallback data in `app/components/TributesList.tsx` which displays automatically if the API fails.

## Project Structure

```
mumbi/
├── app/
│   ├── components/          # React components
│   │   ├── TributeForm.tsx  # Form with photo upload
│   │   ├── TributesList.tsx # List of tributes
│   │   ├── TributeCard.tsx  # Individual tribute card
│   │   └── ...
│   ├── api/
│   │   ├── tributes/        # Tribute CRUD API
│   │   ├── upload/          # Photo upload API
│   │   └── auth/            # Authentication callbacks
│   └── page.tsx             # Main page
├── lib/
│   └── supabase/            # Supabase client utilities
├── supabase/
│   ├── schema.sql           # Database schema
│   └── seedTributes.sql    # Seed data
└── data/
    └── seedTributes.json    # Fallback tribute data
```

## Features in Detail

### Authentication

- **Google OAuth**: Users must sign in with Google to leave tributes
- **Profile Photos**: Automatically uses Google profile photo
- **Session Management**: Handled by Supabase Auth

### Photo Uploads

- **File Types**: JPEG, PNG, WebP
- **Max Size**: 5MB
- **Storage**: Supabase Storage bucket `tribute-photos`
- **Public Access**: All uploaded photos are publicly viewable
- **Preview**: See photo before submitting

### Tributes

- **No Approval**: All tributes go live immediately
- **Full Messages**: Complete messages displayed (not truncated)
- **Photos**: Display uploaded photos in tribute cards
- **Anonymous Option**: Users can publish anonymously

## Troubleshooting

### Google OAuth Not Working

1. **Check Redirect URI**: Must match exactly in both Google Cloud Console and Supabase
   - Google: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Supabase: Set in Authentication → URL Configuration
2. **Check Credentials**: Ensure Client ID and Secret are correct
3. **Check API Enabled**: Google+ API must be enabled in Google Cloud Console
4. **Check Browser Console**: Look for error messages

### Photos Not Uploading

1. **Check Storage Bucket**: Ensure `tribute-photos` bucket exists and is public
2. **Check Storage Policies**: Run `supabase/schema.sql` to ensure policies are set
3. **Check File Size**: Must be under 5MB
4. **Check File Type**: Only JPEG, PNG, WebP allowed

### Database Errors

1. **Check Schema**: Ensure `supabase/schema.sql` has been run
2. **Check RLS Policies**: Verify Row Level Security policies are correct
3. **Check Supabase Logs**: Go to Logs in Supabase Dashboard

### Environment Variables

1. **Check `.env.local`**: File must exist in project root
2. **Check Values**: Ensure URLs and keys are correct
3. **Restart Dev Server**: After changing `.env.local`, restart `npm run dev`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Other Platforms

- **Netlify**: Similar to Vercel
- **Railway**: Supports Next.js with SSR
- **AWS Amplify**: Supports Next.js

**Important**: Update redirect URLs in Supabase after deployment!

## Support

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2

## License

Private memorial site.

---

**Note**: This is a production-ready memorial site. All features are functional and ready to use.
