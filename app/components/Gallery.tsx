"use client";

import { useState } from "react";
import Image from "next/image";

// Mock gallery images - replace with actual images from public folder
const galleryImages = [
  { id: 1, src: "/mumbi.jpg", alt: "Mumbi Judy Jacqueline Kimaru" },
  { id: 2, src: "/judy.jpg", alt: "Mumbi Judy Jacqueline Kimaru" },
  { id: 3, src: "/WhatsApp Image 2025-11-17 at 01.16.51_345d5761.jpg", alt: "Memorial photo" },
  { id: 4, src: "/WhatsApp Image 2025-11-17 at 01.16.52_683526f5.jpg", alt: "Memorial photo" },
  { id: 5, src: "/WhatsApp Image 2025-11-17 at 01.16.53_6a9c3e23.jpg", alt: "Memorial photo" },
  { id: 6, src: "/WhatsApp Image 2025-11-17 at 01.16.54_6b4b01b0.jpg", alt: "Memorial photo" },
  { id: 7, src: "/WhatsApp Image 2025-11-17 at 01.16.54_93d399d4.jpg", alt: "Memorial photo" },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-12 text-center">
            Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image.id)}
                className="relative aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded"
            onClick={() => setSelectedImage(null)}
            aria-label="Close lightbox"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              src={galleryImages.find((img) => img.id === selectedImage)?.src || ""}
              alt={galleryImages.find((img) => img.id === selectedImage)?.alt || ""}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}

