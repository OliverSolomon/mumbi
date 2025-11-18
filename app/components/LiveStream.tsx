"use client";

interface LiveStreamProps {
}

export default function LiveStream({  }: LiveStreamProps) {
  const raw = process.env.NEXT_PUBLIC_LIVESTREAM_URL ?? 'https://www.youtube.com/live/JQjfKX6Gsb8?si=z5VCLDRn6qo-Bpoz';
  const secondStreamUrl = 'https://www.youtube.com/live/OjXv9ZPawlk';

  const extractId = (v?: string | null) => {
    if (!v) return null;
    try {
      const u = new URL(v);
      if (u.hostname.includes('youtube.com')) {
        // handle watch?v=ID and /live/ID
        const vParam = u.searchParams.get('v');
        if (vParam) return vParam;
        const parts = u.pathname.split('/').filter(Boolean);
        return parts[parts.length - 1] || null;
      }
      if (u.hostname.includes('youtu.be')) {
        return u.pathname.slice(1);
      }
      return v;
    } catch {
      return v;
    }
  };

  const id1 = extractId(raw);
  const id2 = extractId(secondStreamUrl);
  const src1 = id1 ? `https://www.youtube.com/embed/${id1}?autoplay=0&rel=0` : null;
  const src2 = id2 ? `https://www.youtube.com/embed/${id2}?autoplay=0&rel=0` : null;

  const renderStream = (src: string | null, title: string, className?: string) => {
    if (src) {
      return (
        <div className={`aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm ${className || ''}`}>
          <iframe
            src={src}
            title={title}
            className="w-full h-full block"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      );
    }
    return (
      <div className={`aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center ${className || ''}`}>
        <div className="text-center px-6 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 text-white mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-4.586 2.885A1 1 0 018 13.885V8.115a1 1 0 011.166-.986l4.586 2.885a1 1 0 010 1.754z" />
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </div>
          <h3 className="text-white text-xl font-semibold mt-4">Live Stream Not Started</h3>
          <p className="mt-2 text-sm text-gray-300">The live stream will appear here when it begins. Please check back shortly.</p>
        </div>
      </div>
    );
  };

  return (
    <section id="livestream" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-gray-900">Live Stream</h2>
            <p className="text-sm text-gray-600">Watch the burial ceremony live below.</p>
          </div>
        </div>

        {/* Bento Box Layout: Main stream on left, smaller stream on right (large screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main stream - takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            {renderStream(src1, "Burial ceremony live stream")}
          </div>
          
          {/* Second stream - takes 1 column on large screens, full width on mobile */}
          <div className="lg:col-span-1">
            {renderStream(src2, "Additional live stream")}
          </div>
        </div>
      </div>
    </section>
  );
}
