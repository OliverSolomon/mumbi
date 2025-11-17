# Photo Upload Setup

## Storage Bucket Setup

1. Go to **Storage** in your Supabase Dashboard
2. Click **Create Bucket**
3. Configure the bucket:
   - **Name**: `tribute-photos`
   - **Public**: **Yes** (photos are public once uploaded)
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

4. The storage policies from `supabase/schema.sql` will automatically apply:
   - Authenticated users can upload photos
   - Public can read all photos
   - Users can delete their own photos

## Database Schema Update

Run the updated `supabase/schema.sql` which includes:
- `tribute_photo_url` column in the `tributes` table
- Storage policies for the `tribute-photos` bucket

## Features

✅ **Photo Upload**: Users can upload photos when submitting tributes  
✅ **File Validation**: Only JPEG, PNG, and WebP allowed (max 5MB)  
✅ **Preview**: Photo preview before submission  
✅ **Storage**: Photos stored in Supabase Storage bucket  
✅ **Display**: Photos displayed in tribute cards  
✅ **Public Access**: All uploaded photos are publicly accessible  

## How It Works

1. User selects a photo in the tribute form
2. Photo is validated (type and size)
3. Photo is uploaded to Supabase Storage immediately
4. Public URL is returned and stored with the tribute
5. Photo is displayed in the tribute card

## API Endpoints

### POST `/api/upload`
- Uploads a photo to Supabase Storage
- Requires authentication
- Returns public URL

### POST `/api/tributes`
- Creates a tribute with optional photo URL
- Accepts `tributePhotoUrl` parameter

## File Limits

- **Maximum file size**: 5MB
- **Allowed formats**: JPEG, PNG, WebP
- **Storage**: Supabase Storage bucket `tribute-photos`

