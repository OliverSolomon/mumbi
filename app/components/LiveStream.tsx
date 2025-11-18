"use client";

interface LiveStreamProps {
}

export default function LiveStream({  }: LiveStreamProps) {
  
  const src =  process.env.LIVESTREAM_URL??'https://www.youtube.com/live/JQjfKX6Gsb8?si=z5VCLDRn6qo-Bpoz'

  return (
    <section id="livestream" className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-gray-900">Live Stream</h2>
            <p className="text-sm text-gray-600">Watch the burial ceremony live below.</p>
          </div>
        </div>

        {src ? (
          <div className="w-full aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <iframe
              src={src}
              title="Burial ceremony live stream"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
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
        )}
      </div>
    </section>
  );
}
