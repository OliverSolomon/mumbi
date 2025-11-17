# Setup Instructions

## 1. Run the SQL Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `supabase/schema.sql`
4. Copy and paste the entire SQL code into the SQL Editor
5. Click **Run** to execute

This will create:
- `tributes` table (no approval needed - all tributes go live immediately)
- `gallery_images` table (optional)
- Indexes for performance
- Row Level Security (RLS) policies
- Storage policies

## 2. Set Up Google OAuth

1. Go to **Authentication > Providers** in Supabase Dashboard
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - **Client ID**: Get from [Google Cloud Console](https://console.cloud.google.com/)
   - **Client Secret**: Get from Google Cloud Console
4. Set redirect URLs in Supabase:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`

### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - (Get this from Supabase Dashboard → Authentication → URL Configuration)
7. Copy **Client ID** and **Client Secret** to Supabase

## 3. Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from:
- Supabase Dashboard → Settings → API
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Create Storage Bucket (Optional)

If you want to use the gallery feature:

1. Go to **Storage** in Supabase Dashboard
2. Click **Create Bucket**
3. Name: `gallery-photos`
4. Public: **Yes**
5. File size limit: 10MB
6. Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

## 5. Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Try leaving a tribute:
   - Click the floating button or scroll to "Leave a Tribute"
   - Click "Sign in with Google"
   - Complete Google OAuth flow
   - Your Google profile photo will be used automatically
   - Submit a tribute
   - **It will appear immediately** (no approval needed)

## Features

✅ **Authentication**: Google OAuth required for tributes  
✅ **User Photos**: Automatically uses Google profile photo  
✅ **Tribute Submission**: Full API integration with Supabase  
✅ **Tribute Display**: Fetches all tributes from database  
✅ **No Approval Needed**: All tributes go live immediately  
✅ **Floating Action Button**: Chat-like icon to leave tribute  
✅ **Mumbi's Story**: Story section  
✅ **Contribute Section**: Contribution details  

## Google Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. User authorizes the application
4. Google redirects back to `/auth/callback`
5. Supabase exchanges code for session
6. User is redirected back to the site
7. User's Google profile photo is automatically used

## Troubleshooting

### Google OAuth Not Working

1. **Check redirect URI**: Must match exactly in both Google Cloud Console and Supabase
2. **Check credentials**: Ensure Client ID and Secret are correct
3. **Check API enabled**: Google+ API must be enabled in Google Cloud Console
4. **Check browser console**: Look for error messages

### Tributes Not Appearing

1. **Check RLS policies**: Ensure policies are set correctly in Supabase
2. **Check API route**: Verify `/api/tributes` is working
3. **Check browser console**: Look for fetch errors
4. **Check Supabase logs**: Go to Logs in Supabase Dashboard

### User Photo Not Showing

1. **Check user metadata**: Google OAuth should provide `avatar_url` or `picture`
2. **Check image URL**: Verify the URL is accessible
3. **Check CORS**: Google images should be accessible

## Next Steps

- Customize the content in `MumbisStory.tsx` and `Contribute.tsx`
- Add more photos to the gallery
- Configure additional OAuth providers if needed
- Deploy to production (Vercel, Netlify, etc.)
