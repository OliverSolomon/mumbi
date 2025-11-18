-- ============================================
-- Fix Email Column to Allow NULL Values
-- Run this in Supabase SQL Editor
-- ============================================
-- 
-- This script makes the email column nullable in the tributes table
-- to allow anonymous users to submit tributes without an email
-- ============================================

-- Alter the email column to allow NULL values
ALTER TABLE tributes 
  ALTER COLUMN email DROP NOT NULL;

-- Verify the change
-- You can run this to check: SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'tributes' AND column_name = 'email';

