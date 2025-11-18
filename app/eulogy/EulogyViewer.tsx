"use client";

interface Props {
  initialUrl?: string | null;
}

export default function EulogyViewer({ initialUrl }: Props) {
  // Default to a PDF placed in `public/eulogy.pdf` if no initialUrl provided.
  const initial = initialUrl ?? "/eulogy.pdf";
  // If the URL is external (starts with http(s)), route it through our proxy so it's same-origin
  const isExternal = /^https?:\/\//i.test(initial);
  const url = isExternal ? `/api/eulogy/proxy?url=${encodeURIComponent(initial)}` : initial;

  return (
    <div className="space-y-6">
      {url ? (
        <div className="w-full border rounded-lg overflow-auto">
          <embed
            src={url}
            type="application/pdf"
            title="Eulogy PDF"
            className="w-full h-[100vh]"
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
