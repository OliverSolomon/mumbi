"use client";

import { useState, useEffect, useCallback } from "react";
import TributeCard from "./TributeCard";

// Fallback seed data if API fails
const seedTributes = [
  {
    name: "ANGELLINE MWANIKI",
    email: "angelline@example.com",
    message: "Though words fall short, I'll honor the memory of my vibrant cousin, Mumbi, who always knew she was destined for greatness. Despite life's hurdles, she walked her own path to the top, unwavering in her belief that she deserved the finest things. Her spirit chased dreams, and she proudly bought her dream car, She wore her heels every day because every day was special, and her beautiful short dresses showcased legs that truly deserved to be seen.\n\nShe owned the room whenever she walked in.\n\nMumbi, you left an indelible mark in our lives. Thank you for being a trendsetter, showing us what confidence and fearless living looks like.\n\nRest in peace, dear cousin.",
    photo_url: null,
    is_anonymous: false,
    created_at: "2025-11-15T00:00:00Z",
  },
  {
    name: "Lynda Sungu",
    email: "lynda@example.com",
    message: "My dear sister\n\nThank you for embracing me and taking me under your wing. Thank you for always opening the doors to your home for me. Thank you for the night outs, the wine, the company, the vibes, the food we shared, the gifts.\n\nThank you for sharing your wisdom and challenging me to be better, to grow, to be inspiring, to give back, to grow others. Thank you for loving me. Thank you for choosing me. God knew I needed you and He placed you in your life to elevate it. I hope you are in His arms resting, because you loved all, inspired all, helped all, challenged all. Rest now my love. I pray that I will make you proud and keep your memory alive. I'll miss you Mumbi. I really miss you already...but God's will...not mine.",
    photo_url: null,
    is_anonymous: false,
    created_at: "2025-11-15T00:00:00Z",
  },
  {
    name: "Stella Wanjohi",
    email: "stella@example.com",
    message: "✨ Goodbye Message for Cousin Mumbi ✨\n\nThis is incredibly hard for all of us. We will always remember you as hardworking, funny, stylish, and truly the life of every gathering. You lit up every room with your laughter, your charm, and your unstoppable energy. Your dedication inspired us, your humor kept us smiling, and your bold, beautiful style reminded us to live fully and confidently.\n\nWe will miss you deeply, but your spark stays with us. You continue to shine in our hearts, in our stories, and in the joy you brought into our lives.\n\nGoodbye, Mumbi — you will forever be our jewel.",
    photo_url: null,
    is_anonymous: false,
    created_at: "2025-11-14T00:00:00Z",
  },
  {
    name: "jacinta mwikali",
    email: "jacinta@example.com",
    message: "My Forever living Champion, saying Goodbye to you is the hardest thing to do my Mumbi..\n\nI first met Mumbi in 2014, in the simplest of moments—when she was selling shoes to me. Neither of us knew then that this encounter would mark the beginning of a remarkable journey. It was during that meeting that I introduced her to the Forever Business, and from that moment on, everything changed. Mumbi embraced the opportunity with a passion and dedication that transformed our business a full 360°.\n\nTogether, we worked hand in hand, growing, learning, empowering, and celebrating. Through her unwavering commitment, we qualified for all incentives, not by luck, but through teamwork, resilience, and the stability she helped build within our structure. Mumbi's impact went far beyond our team—she contributed immensely to Forever Living Products as a whole, becoming a source of inspiration and an example of what belief, hard work, and consistency can achieve.\n\nHer energy was contagious, her attitude always positive, and her presence filled every space with good vibes. She was not only a downline, but a sister, a leader, and a pillar in the Champions Team. Losing her on Tuesday, 11th November 2025, has left a void that words can hardly express. As Champions Team, we will deeply miss her strength, her laughter, and her unwavering spirit.\n\nMumbi, thank you for the light you brought into our lives and the legacy you leave behind. You changed our journeys forever, and your impact will continue to live on in the hearts and successes of everyone you touched.\n\nMay your beautiful soul rest in eternal peace.",
    photo_url: null,
    is_anonymous: false,
    created_at: "2025-11-14T00:00:00Z",
  },
  {
    name: "Sheilla Andanje",
    email: "sheilla@example.com",
    message: "Mumbi, Gal… I don't even know how to say goodbye.\n\nYou were pure sunshine radiant, bubbly, beautiful to your very core. Stylish beyond measure, open-hearted, generous, kind, giving, and honorable in all the ways that mattered.\n\nYou were every good thing wrapped in one dazzling soul.You were light ,the kind that made people feel seen, safe, and alive. You lived, truly lived, and I am endlessly grateful that I got to meet you, laugh with you, share stories with you, and feel the magic of your energy.\n\nThank you for all the stories, the unfiltered talks, the inside jokes, the endless plugs, the laughter that still echoes. You gave of yourself so freely, and in doing so, you lit fires in all of us.\n\nMay all you ever wanted for the people you loved CRYSTALLIZE may your light continue to ripple through us, softly, powerfully, eternally.\n\nPetitioning Angels Gabriel and Peter to let you rock your heels because those drab white robes just won't cut it ❤️\n\nYou were love, Mumbi.\nYou are love.\nForever light. ✨",
    photo_url: null,
    is_anonymous: false,
    created_at: "2025-11-13T00:00:00Z",
  },
];

interface Tribute {
  id: string;
  name: string;
  message: string;
  photo_url: string | null;
  is_anonymous: boolean;
  created_at: string;
}

export default function TributesList() {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchTributes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/tributes');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tributes');
      }

      setTributes(data.tributes || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching tributes:', err);
      setError(err.message || 'Failed to load tributes');
      // Fallback to seed data if API fails
      if (retryCount === 0) {
        const fallbackTributes: Tribute[] = seedTributes.map((tribute, index) => ({
          id: `seed-${index}`,
          name: tribute.name,
          message: tribute.message,
          photo_url: tribute.photo_url,
          is_anonymous: tribute.is_anonymous,
          created_at: tribute.created_at,
        }));
        setTributes(fallbackTributes);
        setError(null); // Clear error since we have fallback data
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchTributes();
  }, [fetchTributes]);

  // Expose refresh function to parent via window (for TributeForm callback)
  useEffect(() => {
    (window as any).refreshTributes = fetchTributes;
    return () => {
      delete (window as any).refreshTributes;
    };
  }, [fetchTributes]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchTributes();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && tributes.length === 0) {
    return (
      <section id="tributes" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-12 text-center">
            Tributes
          </h2>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600 font-sans">Loading tributes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && tributes.length === 0) {
    return (
      <section id="tributes" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-12 text-center">
            Tributes
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
              Unable to Load Tributes
            </h3>
            <p className="text-gray-600 mb-6 font-sans">
              We're having trouble connecting to the server. Please check your internet connection and try again.
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tributes" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-12 text-center">
          Tributes
        </h2>
        {error && tributes.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm font-sans">
            <p className="font-semibold mb-1">Note: Showing cached tributes</p>
            <p>Unable to fetch latest tributes. Some may be missing.</p>
            <button
              onClick={handleRetry}
              className="mt-2 text-amber-900 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}
        {tributes.length === 0 ? (
          <div className="text-center text-gray-600 font-sans py-12">
            <p className="mb-4">No tributes yet.</p>
            <p>Be the first to leave a tribute.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tributes.map((tribute) => (
              <TributeCard
                key={tribute.id}
                name={tribute.name}
                date={formatDate(tribute.created_at)}
                message={tribute.message}
                photoUrl={tribute.photo_url || undefined}
                isAnonymous={tribute.is_anonymous}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
