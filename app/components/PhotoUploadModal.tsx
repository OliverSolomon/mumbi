"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
  uploading?: boolean;
  error?: string;
}

export default function PhotoUploadModal({ isOpen, onClose, onUploadSuccess }: PhotoUploadModalProps) {
  const supabase = createClient();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const validateFile = (file: File): string | null => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, and WebP are allowed.';
    }

    // Validate file size (10MB max for gallery)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return `File "${file.name}" is too large. Maximum size is 10MB.`;
    }

    return null;
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFilesSelect = async (selectedFiles: File[]) => {
    setError(null);
    const validFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    for (const file of selectedFiles) {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
        continue;
      }

      try {
        const preview = await createPreview(file);
        validFiles.push({
          file,
          preview,
          id: `${Date.now()}-${Math.random()}`,
        });
      } catch (err) {
        errors.push(`Failed to create preview for "${file.name}"`);
      }
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      await handleFilesSelect(selectedFiles);
    }
    // Reset input to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length > 0) {
      await handleFilesSelect(droppedFiles);
    }
  };



  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    setUploadProgress({});

    const uploadPromises = files.map(async (fileWithPreview) => {
      const fileId = fileWithPreview.id;
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Update file state to show uploading
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, uploading: true, error: undefined } : f
      ));

      try {
        const formData = new FormData();
        formData.append('file', fileWithPreview.file);

        const response = await fetch('/api/gallery/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload photo');
        }

        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        
        // Mark as successfully uploaded
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, uploading: false } : f
        ));

        return { success: true, fileId };
      } catch (err: any) {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, uploading: false, error: err.message || 'Upload failed' } : f
        ));
        return { success: false, fileId, error: err.message };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    if (failedCount > 0) {
      setError(`${failedCount} photo(s) failed to upload. ${successCount} photo(s) uploaded successfully.`);
    }

    if (successCount > 0) {
      // Reset form after successful uploads
      setFiles([]);
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent and close
      onUploadSuccess();
      if (failedCount === 0) {
        onClose();
      }
    }

    setUploading(false);
  };

  const handleClose = () => {
    if (!uploading) {
      setFiles([]);
      setUploadProgress({});
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-2xl font-serif text-gray-900">Add Photo to Gallery</h3>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-red-800 font-sans text-sm">{error}</p>
            </div>
          )}

          {files.length === 0 ? (
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                fileInputRef.current?.click();
              }}
              className={`
                relative w-full px-6 py-16 border-2 border-dashed rounded-xl cursor-pointer transition-all
                ${isDragging 
                  ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileInputChange}
                disabled={uploading}
                multiple
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                    <p className="text-gray-700 font-medium font-sans">Uploading photos...</p>
                  </>
                ) : (
                  <>
                    <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <svg className={`w-12 h-12 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold font-sans text-lg mb-2">
                        {isDragging ? 'Drop your photos here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-gray-500 font-sans">
                        JPEG, PNG, or WebP (max 10MB each). You can select multiple photos.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-2">
                {files.map((fileWithPreview) => (
                  <div key={fileWithPreview.id} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm bg-gray-100">
                      <Image
                        src={fileWithPreview.preview}
                        alt={fileWithPreview.file.name}
                        fill
                        className="object-cover"
                      />
                      {fileWithPreview.uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <p className="text-white text-xs">
                              {uploadProgress[fileWithPreview.id] || 0}%
                            </p>
                          </div>
                        </div>
                      )}
                      {fileWithPreview.error && (
                        <div className="absolute inset-0 bg-red-500/90 flex items-center justify-center p-2">
                          <p className="text-white text-xs text-center">{fileWithPreview.error}</p>
                        </div>
                      )}
                      {!fileWithPreview.uploading && (
                        <button
                          type="button"
                          onClick={() => removeFile(fileWithPreview.id)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg opacity-0 group-hover:opacity-100"
                          aria-label="Remove photo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-600 truncate" title={fileWithPreview.file.name}>
                      {fileWithPreview.file.name}
                    </p>
                  </div>
                ))}
              </div>
              {files.length > 0 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  + Add More Photos
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={uploading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading {files.filter(f => f.uploading).length} of {files.length}...
                </span>
              ) : (
                `Upload ${files.length} Photo${files.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

