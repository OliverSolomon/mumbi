"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import PhotoUploadModal from "../components/PhotoUploadModal";
import Link from "next/link";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  public_url?: string;
}

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  // Fallback images from public folder
  const fallbackImages: GalleryImage[] = [
    { id: "1", src: "/mumbi.jpg", alt: "Mumbi Judy Jacqueline Kimaru" },
    { id: "2", src: "/judy.jpg", alt: "Mumbi Judy Jacqueline Kimaru" },
    { id: "3", src: "/WhatsApp Image 2025-11-17 at 01.16.51_345d5761.jpg", alt: "Memorial photo" },
    { id: "4", src: "/WhatsApp Image 2025-11-17 at 01.16.52_683526f5.jpg", alt: "Memorial photo" },
    { id: "5", src: "/WhatsApp Image 2025-11-17 at 01.16.53_6a9c3e23.jpg", alt: "Memorial photo" },
    { id: "6", src: "/WhatsApp Image 2025-11-17 at 01.16.54_6b4b01b0.jpg", alt: "Memorial photo" },
    { id: "7", src: "/WhatsApp Image 2025-11-17 at 01.16.54_93d399d4.jpg", alt: "Memorial photo" },
  ];

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery');
      const data = await response.json();

      if (response.ok && data.images && data.images.length > 0) {
        // Ensure images are sorted by created_at DESC (latest first)
        // API already does this, but we ensure it client-side
        setImages(data.images);
      } else {
        // Use fallback images if API fails
        setImages(fallbackImages);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setImages(fallbackImages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
    
    // Handle URL hash for direct image navigation
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      if (hash) {
        // Find image by ID after images are loaded
        setTimeout(() => {
          const index = images.findIndex(img => img.id === hash);
          if (index >= 0) {
            setSelectedImageIndex(index);
            setSelectedImage(hash);
          }
        }, 500);
      }
    }
  }, []);

  // Update selected image when images change
  useEffect(() => {
    if (selectedImage && images.length > 0) {
      const index = images.findIndex(img => img.id === selectedImage);
      if (index >= 0) {
        setSelectedImageIndex(index);
      }
    }
  }, [images, selectedImage]);

  const handleUploadSuccess = () => {
    fetchGalleryImages();
  };

  const getImageSrc = (image: GalleryImage) => {
    return image.public_url || image.src;
  };

  const handleImageClick = (imageId: string) => {
    const index = images.findIndex(img => img.id === imageId);
    if (index >= 0) {
      setSelectedImageIndex(index);
      setSelectedImage(imageId);
      // Update URL hash
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${imageId}`);
      }
    }
  };

  const handleNext = () => {
    const nextIndex = (selectedImageIndex + 1) % images.length;
    setSelectedImageIndex(nextIndex);
    setSelectedImage(images[nextIndex].id);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${images[nextIndex].id}`);
    }
  };

  const handlePrevious = () => {
    const prevIndex = (selectedImageIndex - 1 + images.length) % images.length;
    setSelectedImageIndex(prevIndex);
    setSelectedImage(images[prevIndex].id);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${images[prevIndex].id}`);
    }
  };

  const closeModal = useCallback(() => {
    setSelectedImage(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!selectedImage || images.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (selectedImageIndex + 1) % images.length;
        setSelectedImageIndex(nextIndex);
        setSelectedImage(images[nextIndex].id);
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `#${images[nextIndex].id}`);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (selectedImageIndex - 1 + images.length) % images.length;
        setSelectedImageIndex(prevIndex);
        setSelectedImage(images[prevIndex].id);
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `#${images[prevIndex].id}`);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedImageIndex, images, closeModal]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Back to home"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <h1 className="text-2xl md:text-3xl font-serif text-gray-900">
                  Gallery
                </h1>
                <span className="text-sm text-gray-500 font-sans">
                  ({images.length} {images.length === 1 ? 'photo' : 'photos'})
                </span>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Photo
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 font-sans text-lg mb-4">No photos in the gallery yet.</p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Add First Photo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => handleImageClick(image.id)}
                  className="relative aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 shadow-sm hover:shadow-lg group"
                >
                  <Image
                    src={getImageSrc(image)}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">{image.alt}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal with Navigation */}
      {selectedImage && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded z-20 p-2 bg-black/50 hover:bg-black/70 transition-colors"
            onClick={closeModal}
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded z-20 p-3 bg-black/50 hover:bg-black/70 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded z-20 p-3 bg-black/50 hover:bg-black/70 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-lg text-sm z-20">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Image Info */}
          <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded-lg text-sm z-20 max-w-md">
            <p className="font-medium">{images[selectedImageIndex]?.alt || "Gallery image"}</p>
          </div>

          {/* Image Container */}
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full h-full" 
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getImageSrc(images[selectedImageIndex])}
              alt={images[selectedImageIndex]?.alt || "Gallery image"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
}

