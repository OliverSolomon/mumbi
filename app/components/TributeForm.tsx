"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface TributeFormProps {
  onTributeSubmitted?: () => void;
}

export default function TributeForm({ onTributeSubmitted }: TributeFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    isAnonymous: false,
  });
  const [user, setUser] = useState<any>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      
      if (currentUser) {
        // Get user's photo from Google
        const photoUrl = currentUser.user_metadata?.avatar_url || 
                        currentUser.user_metadata?.picture || 
                        null;
        setUserPhoto(photoUrl);
        // Pre-fill name if authenticated
        if (!formData.name) {
          setFormData(prev => ({
            ...prev,
            name: currentUser.user_metadata?.full_name || 
                  currentUser.user_metadata?.name || 
                  currentUser.email?.split('@')[0] || '',
          }));
        }
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const photoUrl = session.user.user_metadata?.avatar_url || 
                        session.user.user_metadata?.picture || 
                        null;
        setUserPhoto(photoUrl);
        if (!formData.name) {
          setFormData(prev => ({
            ...prev,
            name: session.user.user_metadata?.full_name || 
                  session.user.user_metadata?.name || 
                  session.user.email?.split('@')[0] || '',
          }));
        }
      } else {
        setUserPhoto(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/#tributes`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Validate name if not anonymous
    if (!formData.isAnonymous && !formData.name.trim()) {
      setError('Please enter your name or select "Publish anonymously"');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/tributes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.isAnonymous ? null : formData.name.trim(),
          message: formData.message,
          isAnonymous: formData.isAnonymous,
          photoUrl: userPhoto,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit tribute');
      }

      setSuccess(true);
      setFormData({ name: user ? (user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "") : "", message: "", isAnonymous: false });
      
      // Notify parent to refresh tributes list
      if (onTributeSubmitted) {
        onTributeSubmitted();
      }
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit tribute');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="tributes" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Leave a Tribute
          </h2>
          <p className="text-lg text-gray-600 font-sans max-w-2xl mx-auto">
            Share your memories, thoughts, or condolences. Your tribute will be published immediately.
          </p>
        </div>

        {success && (
          <div className="mb-6 p-5 bg-green-50 border-l-4 border-green-500 rounded-r-lg shadow-sm">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-semibold text-green-900 font-sans">Tribute submitted successfully!</p>
                <p className="text-sm text-green-700 font-sans mt-1">Your tribute is now live and visible to all visitors.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-red-800 font-sans">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* User Info Section */}
          {user && (
            <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {userPhoto && (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-200">
                    <Image
                      src={userPhoto}
                      alt="Your profile photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 font-sans text-lg">
                    {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
                  </p>
                  <p className="text-sm text-gray-600 font-sans">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => supabase.auth.signOut()}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-md"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}

          {!user && (
            <div className="bg-blue-50 px-8 py-5 border-b border-blue-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 font-sans mb-1">
                    Sign in for a verified profile
                  </p>
                  <p className="text-xs text-gray-600 font-sans">
                    Optional: Sign in with Google to use your verified profile photo and name.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm whitespace-nowrap"
                >
                  {loading ? "Signing in..." : "Sign in with Google"}
                </button>
              </div>
            </div>
          )}

          <div className="p-8 space-y-8">
            {/* Name Field */}
            {!formData.isAnonymous && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-3 font-sans">
                  Your Name
                  <span className="ml-2 text-xs font-normal text-gray-500">(required)</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required={!formData.isAnonymous}
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!!user}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all font-sans text-gray-900"
                  placeholder="Enter your name"
                />
              </div>
            )}

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-3 font-sans">
                Your Tribute
                <span className="ml-2 text-xs font-normal text-gray-500">(required)</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={8}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none transition-all font-sans text-gray-900 leading-relaxed"
                placeholder="Share your memories, thoughts, or condolences..."
              />
              <p className="mt-2 text-xs text-gray-500 font-sans">
                {formData.message.length} / 5000 characters
              </p>
            </div>

            {/* Anonymous Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
                className="mt-0.5 w-5 h-5 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-400 cursor-pointer"
              />
              <label htmlFor="isAnonymous" className="flex-1 text-sm text-gray-700 font-sans cursor-pointer">
                <span className="font-medium">Publish anonymously</span>
                <span className="block mt-1 text-gray-600 text-xs">
                  Your name will not be displayed with your tribute
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !formData.message.trim() || (!formData.isAnonymous && !formData.name.trim())}
              className="w-full py-4 px-6 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-[1.01] disabled:transform-none"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting...
                </span>
              ) : (
                "Submit Tribute"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
