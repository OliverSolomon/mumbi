import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Fetch all gallery images
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Try to fetch from database first
    const { data: dbImages, error: dbError } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (!dbError && dbImages && dbImages.length > 0) {
      const images = dbImages.map((img) => ({
        id: img.id,
        src: img.public_url,
        alt: img.alt_text || 'Gallery photo',
        public_url: img.public_url,
      }));

      return NextResponse.json({
        images,
      });
    }

    // If no database images, return empty array (fallback handled in component)
    return NextResponse.json({
      images: [],
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}

