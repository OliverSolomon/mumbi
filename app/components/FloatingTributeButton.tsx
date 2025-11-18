"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function FloatingTributeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    isAnonymous: false,
  });
  const [user, setUser] = useState<any>(null);
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
        setFormData(prev => {
          // Only set name if it's empty
          if (!prev.name) {
            return {
              ...prev,
              name: currentUser.user_metadata?.full_name || 
                    currentUser.user_metadata?.name || 
                    currentUser.email?.split('@')[0] || '',
            };
          }
          return prev;
        });
      }
    };

    checkUser();
  }, [supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
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

    if (!formData.message.trim()) {
      setError('Please enter a tribute message');
      setSubmitting(false);
      return;
    }

    try {
      const userPhoto = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
      
      const response = await fetch('/api/tributes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.isAnonymous ? null : formData.name.trim(),
          message: formData.message.trim(),
          isAnonymous: formData.isAnonymous,
          photoUrl: userPhoto,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit tribute');
      }

      setSuccess(true);
      setFormData({ 
        name: user ? (user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "") : "", 
        message: "", 
        isAnonymous: false 
      });
      
      // Refresh tributes list
      if (typeof window !== 'undefined' && (window as any).refreshTributes) {
        (window as any).refreshTributes();
      }
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit tribute');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setIsOpen(false);
      setError(null);
      setSuccess(false);
    }
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) {
        setIsOpen(false);
        setError(null);
        setSuccess(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, submitting]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 flex items-center gap-3 px-5 py-3"
        aria-label="Add Tribute"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="font-medium text-sm">Add Tribute</span>
      </button>

      {/* Floating Modal from Right */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 transition-opacity"
            onClick={handleClose}
          />

          {/* Modal Panel */}
          <div
            className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-serif text-gray-900">Add Tribute</h2>
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <p className="font-semibold text-green-900 font-sans">Tribute submitted successfully!</p>
                        <p className="text-sm text-green-700 font-sans mt-1">Your tribute is now live.</p>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <p className="text-red-800 font-sans text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  {!formData.isAnonymous && (
                    <div>
                      <label htmlFor="modal-name" className="block text-sm font-semibold text-gray-900 mb-2 font-sans">
                        Your Name
                        <span className="ml-2 text-xs font-normal text-gray-500">(required)</span>
                      </label>
                      <input
                        type="text"
                        id="modal-name"
                        name="name"
                        required={!formData.isAnonymous}
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!!user || submitting}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all font-sans text-gray-900"
                        placeholder="Enter your name"
                      />
                    </div>
                  )}

                  {/* Message Field */}
                  <div>
                    <label htmlFor="modal-message" className="block text-sm font-semibold text-gray-900 mb-2 font-sans">
                      Your Tribute
                      <span className="ml-2 text-xs font-normal text-gray-500">(required)</span>
                    </label>
                    <textarea
                      id="modal-message"
                      name="message"
                      required
                      rows={6}
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
                      id="modal-isAnonymous"
                      name="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={handleInputChange}
                      className="mt-0.5 w-5 h-5 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-400 cursor-pointer"
                    />
                    <label htmlFor="modal-isAnonymous" className="flex-1 text-sm text-gray-700 font-sans cursor-pointer">
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
                    className="w-full py-4 px-6 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg"
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
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

