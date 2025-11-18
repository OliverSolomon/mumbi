"use client";

interface Props {
  initialUrl?: string | null;
}

export default function EulogyViewer({ initialUrl }: Props) {
  // Default to a PDF placed in `public/eulogy.pdf` if no initialUrl provided.
  const url = initialUrl ?? "/eulogy.pdf";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <a
          href={url}
          download="eulogy.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l4-4m-4 4l-4-4M21 21H3" />
          </svg>
          Download Eulogy
        </a>
      </div>
      {url ? (
        <div className="w-full border rounded-lg overflow-hidden">
          <iframe
            src={url}
            title="Eulogy PDF"
            className="w-full h-[80vh]"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700">No eulogy PDF available.</p>
        </div>
      )}
    </div>
  );
}
