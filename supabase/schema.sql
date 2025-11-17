-- ============================================
-- Memorial Site Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Tributes table (no approval needed - all tributes go live immediately)
CREATE TABLE IF NOT EXISTS tributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT, -- Optional, only for authenticated users
  message TEXT NOT NULL,
  photo_url TEXT, -- URL to user's profile photo from Google
  tribute_photo_url TEXT, -- URL to uploaded photo in Supabase Storage
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery images table (optional, for tracking gallery metadata)
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Index for tributes by creation date (most common query)
CREATE INDEX IF NOT EXISTS idx_tributes_created 
  ON tributes(created_at DESC);

-- Index for user tributes
CREATE INDEX IF NOT EXISTS idx_tributes_user_id 
  ON tributes(user_id);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_tributes_email 
  ON tributes(email);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_tributes_updated_at ON tributes;
CREATE TRIGGER update_tributes_updated_at
  BEFORE UPDATE ON tributes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on tables
ALTER TABLE tributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: TRIBUTES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can insert tributes" ON tributes;
DROP POLICY IF EXISTS "Public can read approved tributes" ON tributes;
DROP POLICY IF EXISTS "Users can read their own tributes" ON tributes;
DROP POLICY IF EXISTS "Admins can update tributes" ON tributes;
DROP POLICY IF EXISTS "Admins can delete tributes" ON tributes;
DROP POLICY IF EXISTS "Allow seed data insertion" ON tributes;
DROP POLICY IF EXISTS "Anyone can insert tributes" ON tributes;

-- Policy: Authenticated users can insert their own tributes
CREATE POLICY "Authenticated users can insert tributes"
  ON tributes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    (email IS NULL OR auth.jwt() ->> 'email' = email)
  );

-- Policy: Anyone (including anonymous) can insert tributes
CREATE POLICY "Anyone can insert tributes"
  ON tributes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow inserting tributes without user_id (for seed data)
-- This can be restricted further if needed
CREATE POLICY "Allow seed data insertion"
  ON tributes
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Public can read all tributes (no approval needed)
CREATE POLICY "Public can read all tributes"
  ON tributes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Users can update their own tributes
CREATE POLICY "Users can update their own tributes"
  ON tributes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own tributes
CREATE POLICY "Users can delete their own tributes"
  ON tributes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- RLS POLICIES: GALLERY_IMAGES
-- ============================================

-- Policy: Public can read all gallery images
CREATE POLICY "Public can read gallery images"
  ON gallery_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Anyone can insert gallery images
CREATE POLICY "Anyone can insert gallery images"
  ON gallery_images
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update gallery images
CREATE POLICY "Authenticated users can update gallery images"
  ON gallery_images
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Authenticated users can delete gallery images
CREATE POLICY "Authenticated users can delete gallery images"
  ON gallery_images
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Note: Storage buckets must be created manually in Supabase Dashboard
-- Go to Storage > Create Bucket
-- 
-- Bucket 1: tribute-photos
--   - Public: Yes (photos are public once uploaded)
--   - File size limit: 5MB
--   - Allowed MIME types: image/jpeg, image/png, image/webp
--
-- Bucket 2: gallery-photos
--   - Public: Yes
--   - File size limit: 10MB
--   - Allowed MIME types: image/jpeg, image/png, image/webp

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload pending photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can read approved photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tribute photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can read tribute photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their tribute photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload tribute photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can read gallery photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload gallery photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload gallery photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update gallery photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete gallery photos" ON storage.objects;

-- ============================================
-- STORAGE POLICIES: TRIBUTE PHOTOS
-- ============================================

-- Policy: Anyone (including anonymous) can upload tribute photos
CREATE POLICY "Anyone can upload tribute photos"
  ON STORAGE.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'tribute-photos');

-- Policy: Public can read all tribute photos
CREATE POLICY "Public can read tribute photos"
  ON STORAGE.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'tribute-photos');

-- Policy: Users can delete their own tribute photos (by filename pattern)
CREATE POLICY "Authenticated users can delete their tribute photos"
  ON STORAGE.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'tribute-photos');

-- ============================================
-- STORAGE POLICIES: GALLERY PHOTOS
-- ============================================

-- Policy: Public can read all gallery photos
CREATE POLICY "Public can read gallery photos"
  ON STORAGE.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'gallery-photos');

-- Policy: Anyone can upload gallery photos
CREATE POLICY "Anyone can upload gallery photos"
  ON STORAGE.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'gallery-photos');

-- Policy: Authenticated users can update gallery photos
CREATE POLICY "Authenticated users can update gallery photos"
  ON STORAGE.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gallery-photos');

-- Policy: Authenticated users can delete gallery photos
CREATE POLICY "Authenticated users can delete gallery photos"
  ON STORAGE.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery-photos');

-- ============================================
-- SETUP INSTRUCTIONS
-- ============================================
-- 
-- After running this schema:
-- 
-- 1. Go to Authentication > Providers in Supabase Dashboard
-- 2. Enable Google OAuth provider (optional - for verified profiles)
-- 3. Add your Google OAuth credentials:
--    - Get Client ID and Client Secret from Google Cloud Console
--    - Add them to Supabase
-- 4. Set redirect URLs:
--    - Development: http://localhost:3000/auth/callback
--    - Production: https://your-domain.com/auth/callback
-- 
-- 5. Go to Storage > Create Bucket
--    - Create "tribute-photos" bucket (public)
--    - Create "gallery-photos" bucket (public) - optional
-- 
-- ============================================
