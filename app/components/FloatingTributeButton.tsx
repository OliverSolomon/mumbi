"use client";

export default function FloatingTributeButton() {

  const handleClick = () => {
    // Scroll to tribute form
    const element = document.getElementById('tributes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 flex items-center justify-center"
      aria-label="Leave a Tribute"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </button>
  );
}

