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

// POST: Create a new tribute (authentication optional)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication (optional)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const isAuthenticated = !authError && user;

    const body = await request.json();
    const { name, message, isAnonymous, photoUrl } = body;

    // Validate input
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Validate name if not anonymous
    if (!isAnonymous && (!name || name.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Name is required unless publishing anonymously' },
        { status: 400 }
      );
    }

    // Sanitize message (basic - consider using DOMPurify)
    const sanitizedMessage = message.trim().slice(0, 5000);

    let userName: string;
    let userEmail: string | null = null;
    let userPhotoUrl: string | null = null;

    if (isAuthenticated) {
      // Use authenticated user info
      userEmail = user.email || null;
      userName = isAnonymous ? 'Anonymous' : (name?.trim() || user.user_metadata?.full_name || user.user_metadata?.name || userEmail?.split('@')[0] || 'Anonymous');
      userPhotoUrl = photoUrl || user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
    } else {
      // Use provided name for anonymous/unauthenticated users
      userName = isAnonymous ? 'Anonymous' : (name?.trim() || 'Anonymous');
      userEmail = null;
      userPhotoUrl = null;
    }

    // Create tribute record (goes live immediately)
    const { data: tribute, error: tributeError } = await supabase
      .from('tributes')
      .insert({
        user_id: isAuthenticated ? user.id : null,
        name: userName,
        email: userEmail,
        message: sanitizedMessage,
        photo_url: userPhotoUrl,
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
