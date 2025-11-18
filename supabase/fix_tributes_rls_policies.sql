-- ============================================
-- Fix RLS Policies for Tributes Table
-- Run this in Supabase SQL Editor
-- ============================================
-- 
-- This script fixes the RLS policies to allow anonymous users
-- to insert tributes without restrictions
-- ============================================

-- Drop all existing INSERT policies on tributes
DROP POLICY IF EXISTS "Authenticated users can insert tributes" ON tributes;
DROP POLICY IF EXISTS "Anyone can insert tributes" ON tributes;
DROP POLICY IF EXISTS "Allow seed data insertion" ON tributes;

-- ============================================
-- INSERT POLICIES: TRIBUTES
-- ============================================

-- Policy: Anyone (including anonymous) can insert tributes
-- This allows both anonymous and authenticated users to insert
-- No restrictions on user_id or email for anonymous users
CREATE POLICY "Anyone can insert tributes"
  ON tributes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow service role to insert (for seed data/admin operations)
CREATE POLICY "Allow seed data insertion"
  ON tributes
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================
-- Fix Email Column to Allow NULL
-- ============================================
-- Make email column nullable to allow anonymous submissions
ALTER TABLE tributes 
  ALTER COLUMN email DROP NOT NULL;

-- ============================================
-- Verify RLS is enabled
-- ============================================
ALTER TABLE tributes ENABLE ROW LEVEL SECURITY;

