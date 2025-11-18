-- ============================================
-- Update Storage Policies to Allow Anonymous Uploads
-- Run this in Supabase SQL Editor
-- ============================================
-- 
-- This script changes the RLS policies for uploading items to buckets
-- from authenticated/anyone to anonymous-only (allowing anonymous users to upload)
-- ============================================

-- Drop existing upload policies (matching schema.sql policy names)
DROP POLICY IF EXISTS "Anyone can upload tribute photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tribute photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload gallery photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload gallery photos" ON storage.objects;

-- ============================================
-- STORAGE POLICIES: TRIBUTE PHOTOS
-- ============================================

-- Policy: Anonymous users can upload tribute photos
-- Changed from "Anyone can upload tribute photos" (anon, authenticated)
-- to anonymous-only
CREATE POLICY "Anonymous users can upload tribute photos"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'tribute-photos');

-- ============================================
-- STORAGE POLICIES: GALLERY PHOTOS
-- ============================================

-- Policy: Anonymous users can upload gallery photos
-- Changed from "Anyone can upload gallery photos" (anon, authenticated)
-- to anonymous-only
CREATE POLICY "Anonymous users can upload gallery photos"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'gallery-photos');

