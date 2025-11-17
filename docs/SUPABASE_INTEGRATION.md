# Supabase Integration Plan & Schema

## Database Schema

### Table: `tributes`

```sql
-- Create tributes table
CREATE TABLE tributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT, -- Optional, for moderation contact only
  message TEXT NOT NULL,
  photo_url TEXT, -- URL to Supabase Storage
  is_anonymous BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for approved tributes (most common query)
CREATE INDEX idx_tributes_approved_created ON tributes(approved, created_at DESC);

-- Create index for moderation queries
CREATE INDEX idx_tributes_approved ON tributes(approved) WHERE approved = false;

-- Enable Row Level Security
ALTER TABLE tributes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert tributes (they start as unapproved)
CREATE POLICY "Anyone can insert tributes"
  ON tributes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Public can read approved tributes only
CREATE POLICY "Public can read approved tributes"
  ON tributes
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

-- Policy: Only authenticated admins can update (approve/reject)
CREATE POLICY "Admins can update tributes"
  ON tributes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Policy: Only authenticated admins can delete
CREATE POLICY "Admins can delete tributes"
  ON tributes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_tributes_updated_at
  BEFORE UPDATE ON tributes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Table: `admin_users` (for admin authentication)

```sql
-- Create admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read admin list
CREATE POLICY "Admins can read admin list"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
```

### Table: `gallery_images` (optional, if you want to track gallery separately)

```sql
-- Create gallery_images table (optional)
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read all gallery images
CREATE POLICY "Public can read gallery images"
  ON gallery_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Only admins can insert/update/delete
CREATE POLICY "Admins can manage gallery images"
  ON gallery_images
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );
```

## Supabase Storage

### Bucket: `tribute-photos`

**Configuration:**
- **Public**: No (initially private)
- **File size limit**: 5MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

**Storage Policies:**

```sql
-- Policy: Anyone can upload to pending/ folder (private until approved)
CREATE POLICY "Anyone can upload pending photos"
  ON STORAGE.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'tribute-photos' AND
    (storage.foldername(name))[1] = 'pending'
  );

-- Policy: Public can read approved photos (in approved/ folder)
CREATE POLICY "Public can read approved photos"
  ON STORAGE.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'tribute-photos' AND
    (storage.foldername(name))[1] = 'approved'
  );

-- Policy: Admins can read all photos (for moderation)
CREATE POLICY "Admins can read all photos"
  ON STORAGE.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'tribute-photos' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Policy: Admins can move/delete photos
CREATE POLICY "Admins can manage photos"
  ON STORAGE.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'tribute-photos' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );
```

### Bucket: `gallery-photos` (for main gallery)

**Configuration:**
- **Public**: Yes
- **File size limit**: 10MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

**Storage Policies:**

```sql
-- Policy: Public can read all gallery photos
CREATE POLICY "Public can read gallery photos"
  ON STORAGE.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'gallery-photos');

-- Policy: Only admins can upload/manage
CREATE POLICY "Admins can manage gallery photos"
  ON STORAGE.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'gallery-photos' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );
```

## TypeScript Code Examples

### 1. Initialize Supabase Client

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

```typescript
// lib/supabase/server.ts (for server-side operations)
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function createServerClient() {
  const cookieStore = await cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
```

### 2. Upload Image to Storage

```typescript
// lib/supabase/storage.ts
import { supabase } from './client';

export async function uploadTributePhoto(
  file: File,
  tributeId: string
): Promise<{ path: string; publicUrl: string | null }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${tributeId}-${Date.now()}.${fileExt}`;
  const filePath = `pending/${fileName}`;

  // Upload to pending folder (private)
  const { data, error } = await supabase.storage
    .from('tribute-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // Get signed URL for preview (expires in 1 hour)
  const { data: signedUrlData } = await supabase.storage
    .from('tribute-photos')
    .createSignedUrl(filePath, 3600);

  return {
    path: filePath,
    publicUrl: signedUrlData?.signedUrl || null,
  };
}

// Move photo from pending to approved (admin only)
export async function approveTributePhoto(
  oldPath: string,
  newPath: string
): Promise<void> {
  const { error } = await supabase.storage
    .from('tribute-photos')
    .move(oldPath, newPath);

  if (error) throw error;
}
```

### 3. Insert New Tribute

```typescript
// app/api/tributes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { uploadTributePhoto } from '@/lib/supabase/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string | null;
    const message = formData.get('message') as string;
    const isAnonymous = formData.get('isAnonymous') === 'true';
    const photo = formData.get('photo') as File | null;

    // Validate input
    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      );
    }

    // Sanitize message (basic example - use DOMPurify or similar)
    const sanitizedMessage = message.trim().slice(0, 5000);

    // Create tribute record first
    const { data: tribute, error: tributeError } = await supabase
      .from('tributes')
      .insert({
        name: isAnonymous ? 'Anonymous' : name.trim(),
        email: email?.trim() || null,
        message: sanitizedMessage,
        is_anonymous: isAnonymous,
        approved: false,
      })
      .select()
      .single();

    if (tributeError) throw tributeError;

    // Upload photo if provided
    let photoUrl: string | null = null;
    if (photo && tribute) {
      try {
        const { path } = await uploadTributePhoto(photo, tribute.id);
        photoUrl = path;

        // Update tribute with photo URL
        await supabase
          .from('tributes')
          .update({ photo_url: photoUrl })
          .eq('id', tribute.id);
      } catch (photoError) {
        console.error('Photo upload failed:', photoError);
        // Continue without photo
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Tribute submitted successfully. It will be reviewed before being published.',
      tributeId: tribute.id,
    });
  } catch (error) {
    console.error('Error creating tribute:', error);
    return NextResponse.json(
      { error: 'Failed to submit tribute' },
      { status: 500 }
    );
  }
}
```

### 4. Query Approved Tributes

```typescript
// app/api/tributes/route.ts (GET)
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('tributes')
      .select('*', { count: 'exact' })
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Get public URLs for photos
    const tributesWithPhotos = await Promise.all(
      (data || []).map(async (tribute) => {
        if (tribute.photo_url) {
          const { data: signedUrlData } = await supabase.storage
            .from('tribute-photos')
            .createSignedUrl(tribute.photo_url, 3600);

          return {
            ...tribute,
            photo_url: signedUrlData?.signedUrl || null,
          };
        }
        return tribute;
      })
    );

    return NextResponse.json({
      tributes: tributesWithPhotos,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching tributes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tributes' },
      { status: 500 }
    );
  }
}
```

### 5. Approve Tribute (Admin)

```typescript
// app/api/admin/tributes/[id]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseServer = await createServerClient();
    
    // Check if user is admin
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: admin } = await supabaseServer
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get tribute
    const { data: tribute, error: tributeError } = await supabaseServer
      .from('tributes')
      .select('*')
      .eq('id', params.id)
      .single();

    if (tributeError || !tribute) {
      return NextResponse.json(
        { error: 'Tribute not found' },
        { status: 404 }
      );
    }

    // If tribute has a photo, move it from pending to approved
    if (tribute.photo_url && tribute.photo_url.startsWith('pending/')) {
      const newPath = tribute.photo_url.replace('pending/', 'approved/');
      await supabase.storage
        .from('tribute-photos')
        .move(tribute.photo_url, newPath);

      // Update tribute with new photo path
      await supabaseServer
        .from('tributes')
        .update({ photo_url: newPath, approved: true })
        .eq('id', params.id);
    } else {
      // Just approve the tribute
      await supabaseServer
        .from('tributes')
        .update({ approved: true })
        .eq('id', params.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error approving tribute:', error);
    return NextResponse.json(
      { error: 'Failed to approve tribute' },
      { status: 500 }
    );
  }
}
```

## Security Recommendations

### 1. Input Sanitization
- Use DOMPurify or similar to sanitize user messages
- Validate email format
- Limit message length (e.g., 5000 characters)

### 2. File Upload Validation
- Validate file types (only images: JPEG, PNG, WebP)
- Enforce file size limits (5MB for tribute photos, 10MB for gallery)
- Scan for malicious content (optional but recommended)
- Generate unique filenames to prevent overwrites

### 3. Rate Limiting
- Implement rate limiting on tribute submission endpoint
- Consider using reCAPTCHA v3 for form submissions
- Limit submissions per IP/email (e.g., 5 per day)

### 4. Email Privacy
- Store emails in a separate table if needed for moderation
- Never expose emails in public API responses
- Use email only for moderation contact, not for public display

### 5. Image Processing
- Resize images on upload to reasonable dimensions (e.g., max 1920px width)
- Generate thumbnails for gallery grid
- Use WebP format for better compression
- Store original and processed versions

### 6. Authentication
- Use Supabase Auth for admin panel
- Implement role-based access control (RBAC)
- Use server-side session validation
- Consider 2FA for admin accounts

