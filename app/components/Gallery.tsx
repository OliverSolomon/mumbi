"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PhotoUploadModal from "./PhotoUploadModal";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  public_url?: string;
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

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
        setImages(data.images);
      } else {
        // Use fallback images if API fails
        setImages(fallbackImages);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      // Use fallback images on error
      setImages(fallbackImages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const handleUploadSuccess = () => {
    fetchGalleryImages();
  };

  const getImageSrc = (image: GalleryImage) => {
    return image.public_url || image.src;
  };

  return (
    <>
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
              Gallery
            </h2>
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

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image.id)}
                  className="relative aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 shadow-sm hover:shadow-md"
                >
                  <Image
                    src={getImageSrc(image)}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded z-10"
            onClick={() => setSelectedImage(null)}
            aria-label="Close lightbox"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={getImageSrc(images.find((img) => img.id === selectedImage) || images[0])}
              alt={images.find((img) => img.id === selectedImage)?.alt || "Gallery image"}
              fill
              className="object-contain"
              sizes="100vw"
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
