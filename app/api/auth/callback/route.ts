import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      // Redirect to home with error
      return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin));
    }
  }

  // URL to redirect to after sign in process completes
  // Remove hash from next if present, we'll handle scrolling client-side
  const redirectUrl = next.replace(/#.*$/, '');
  return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin));
}
