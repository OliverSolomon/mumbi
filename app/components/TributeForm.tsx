"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface TributeFormProps {
  onTributeSubmitted?: () => void;
}

export default function TributeForm({ onTributeSubmitted }: TributeFormProps) {
  const [formData, setFormData] = useState({
    message: "",
    isAnonymous: false,
  });
  const [user, setUser] = useState<any>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [tributePhoto, setTributePhoto] = useState<File | null>(null);
  const [tributePhotoPreview, setTributePhotoPreview] = useState<string | null>(null);
  const [tributePhotoUrl, setTributePhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size too large. Maximum size is 5MB.');
      return;
    }

    setTributePhoto(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setTributePhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload photo immediately
    await uploadPhoto(file);
  };

  const uploadPhoto = async (file: File) => {
    setUploadingPhoto(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      setTributePhotoUrl(data.url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo');
      setTributePhoto(null);
      setTributePhotoPreview(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = () => {
    setTributePhoto(null);
    setTributePhotoPreview(null);
    setTributePhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    // If successful, user will be redirected, so we don't need to set loading to false
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/tributes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: formData.message,
          isAnonymous: formData.isAnonymous,
          photoUrl: userPhoto,
          tributePhotoUrl: tributePhotoUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit tribute');
      }

      setSuccess(true);
      setFormData({ message: "", isAnonymous: false });
      setTributePhoto(null);
      setTributePhotoPreview(null);
      setTributePhotoUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
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

  if (!user) {
    return (
      <section id="tributes" className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 text-center">
            Leave a Tribute
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-700 mb-6 font-sans">
              Please sign in with Google to leave a tribute. Your Google profile photo will be displayed with your tribute.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm font-sans">
                {error}
              </div>
            )}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? "Signing in..." : "Sign in with Google"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tributes" className="py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 text-center">
          Leave a Tribute
        </h2>
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-800 text-center font-sans">
            Tribute submitted successfully and is now live!
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-center font-sans">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            {userPhoto && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={userPhoto}
                  alt="Your profile photo"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900 font-sans">
                {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
              </p>
              <p className="text-sm text-gray-600 font-sans">{user.email}</p>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Your Tribute <span className="text-gray-500">(required)</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
              placeholder="Share your memories, thoughts, or condolences..."
            />
          </div>

          <div>
            <label htmlFor="tributePhoto" className="block text-sm font-medium text-gray-700 mb-2">
              Add a Photo <span className="text-gray-500">(optional)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="tributePhoto"
              name="tributePhoto"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handlePhotoChange}
              disabled={uploadingPhoto}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500 font-sans">
              Maximum file size: 5MB. Allowed formats: JPEG, PNG, WebP
            </p>
            {uploadingPhoto && (
              <p className="mt-2 text-sm text-gray-600 font-sans">Uploading photo...</p>
            )}
            {tributePhotoPreview && (
              <div className="mt-4 relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={tributePhotoPreview}
                  alt="Photo preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Remove photo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleInputChange}
              className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-400"
            />
            <label htmlFor="isAnonymous" className="ml-2 text-sm text-gray-700">
              Publish anonymously
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting || !formData.message.trim() || uploadingPhoto}
            className="w-full py-3 px-6 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {submitting ? "Submitting..." : uploadingPhoto ? "Uploading photo..." : "Submit Tribute"}
          </button>
        </form>
      </div>
    </section>
  );
}
