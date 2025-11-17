export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-serif text-lg mb-4">Contribute</h3>
            <p className="text-sm font-sans">
              Learn how you can contribute to this memorial site.
            </p>
            <a 
              href="#contribute" 
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors mt-2 inline-block focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
            >
              View details →
            </a>
          </div>
          <div>
            <h3 className="text-white font-serif text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm font-sans">
              <li>
                <a href="#tributes" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded">
                  Leave a Tribute
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded">
                  View Gallery
                </a>
              </li>
              <li>
                <a href="#story" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded">
                  Mumbi's Story
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-serif text-lg mb-4">About This Site</h3>
            <p className="text-sm font-sans">
              This memorial site honors the life and memory of Mumbi Judy Jacqueline Kimaru.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm font-sans">
          <p>&copy; {new Date().getFullYear()} Memorial Site. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
