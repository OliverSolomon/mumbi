import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'Missing `url` query parameter' }, { status: 400 });
    }

    // Basic validation: only allow https URLs to avoid accidental SSRF to internal hosts
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    if (parsed.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only https URLs are allowed' }, { status: 400 });
    }

    // Fetch the remote PDF
    const remoteRes = await fetch(parsed.toString(), {
      method: 'GET',
      // do not forward cookies by default
      credentials: 'omit',
    });

    if (!remoteRes.ok) {
      return NextResponse.json({ error: `Remote server returned ${remoteRes.status}` }, { status: 502 });
    }

    const contentType = remoteRes.headers.get('content-type') || 'application/pdf';

    // Stream the response back with headers suitable for iframe embedding
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      // Allow embedding since this is same-origin now
      // Do not set X-Frame-Options here; Next.js default won't add one for API routes
      'Cache-Control': 'public, max-age=3600',
      // Suggest filename for downloads
      'Content-Disposition': 'inline; filename="eulogy.pdf"',
    };

    const body = remoteRes.body;
    return new NextResponse(body, { status: 200, headers });
  } catch (err) {
    console.error('Eulogy proxy error:', err);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}
