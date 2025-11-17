import Link from "next/link";

export default function Header() {
  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#gallery", label: "Gallery" },
    { href: "#story", label: "Mumbi's Story" },
    { href: "#contribute", label: "Contribute" },
  ];

  return (
    <header className="sticky top-12 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="#home" className="text-xl font-serif text-gray-900 hover:text-gray-700 transition-colors">
            Mumbi Judy Jacqueline Kimaru
          </Link>
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Mobile menu button placeholder */}
          <button
            className="md:hidden text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

