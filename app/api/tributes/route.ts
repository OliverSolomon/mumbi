import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Fetch all tributes (no approval needed)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('tributes')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      tributes: data || [],
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

// POST: Create a new tribute (requires authentication)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in with Google.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, isAnonymous, photoUrl, tributePhotoUrl } = body;

    // Validate input
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Sanitize message (basic - consider using DOMPurify)
    const sanitizedMessage = message.trim().slice(0, 5000);

    // Get user's email from auth
    const userEmail = user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    // Get user's name from metadata or email
    const userName = user.user_metadata?.full_name || 
                     user.user_metadata?.name || 
                     userEmail.split('@')[0];

    // Get user's photo from Google (if available)
    const userPhotoUrl = photoUrl || user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

    // Create tribute record (goes live immediately)
    const { data: tribute, error: tributeError } = await supabase
      .from('tributes')
      .insert({
        user_id: user.id,
        name: isAnonymous ? 'Anonymous' : userName,
        email: userEmail,
        message: sanitizedMessage,
        photo_url: userPhotoUrl,
        tribute_photo_url: tributePhotoUrl || null,
        is_anonymous: isAnonymous || false,
      })
      .select()
      .single();

    if (tributeError) {
      console.error('Error creating tribute:', tributeError);
      return NextResponse.json(
        { error: 'Failed to submit tribute' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tribute submitted successfully and is now live.',
      tribute: tribute,
    });
  } catch (error) {
    console.error('Error creating tribute:', error);
    return NextResponse.json(
      { error: 'Failed to submit tribute' },
      { status: 500 }
    );
  }
}
