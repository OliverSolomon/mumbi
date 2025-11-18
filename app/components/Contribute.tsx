export default function Contribute() {
  return (
    <section id="contribute" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 text-center">
          Contribute
        </h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="prose prose-lg max-w-none text-gray-700 font-sans leading-relaxed">
            <h3 className="text-2xl font-serif text-gray-900 mb-4">How You Can Contribute</h3>
            <p>
              This memorial site is a place to honor and remember Mumbi Judy Jacqueline Kimaru. 
              There are several ways you can contribute:
            </p>
            
            <h4 className="text-xl font-serif text-gray-900 mt-6 mb-3">Leave a Tribute</h4>
            <p>
              Share your memories, thoughts, or condolences by leaving a tribute. Your tribute 
              will be reviewed before being published to ensure a respectful and meaningful 
              memorial space.
            </p>

            <h4 className="text-xl font-serif text-gray-900 mt-6 mb-3">Share Photos</h4>
            <p>
              If you have photos of Mumbi that you'd like to share for the gallery, please contact 
              the site administrators. We welcome photos that celebrate her life and the moments 
              she shared with loved ones.
            </p>

            <h4 className="text-xl font-serif text-gray-900 mt-6 mb-3">Contact Information</h4>
            <p>
              For contributions to the family, please contact:
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-semibold text-gray-900 mb-1">Patricia</p>
              <a 
                href="tel:+254729552789" 
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                +254 729 552789
              </a>
            </div>
            <p className="mt-4">
              For questions, to submit photos, or for any other contributions, please reach out 
              through the contact information above.
            </p>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 italic">
                All contributions are subject to moderation to maintain the respectful and 
                reverent nature of this memorial site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
