"use client";

import { useState } from "react";
import Image from "next/image";

interface TributeCardProps {
  name: string;
  date: string;
  message: string;
  photoUrl?: string;
  isAnonymous?: boolean;
}

const PREVIEW_LENGTH = 250; // Characters to show before "Read more"

export default function TributeCard({ name, date, message, photoUrl, isAnonymous }: TributeCardProps) {
  const displayName = isAnonymous ? "Anonymous" : name;
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if message is long enough to need truncation
  const needsTruncation = message.length > PREVIEW_LENGTH;
  
  // Get preview text (truncate at word boundary)
  const getPreviewText = (text: string) => {
    if (text.length <= PREVIEW_LENGTH) return text;
    
    // Find the last space before PREVIEW_LENGTH
    const truncated = text.substring(0, PREVIEW_LENGTH);
    const lastSpace = truncated.lastIndexOf(' ');
    const lastNewline = truncated.lastIndexOf('\n');
    const breakPoint = Math.max(lastSpace, lastNewline);
    
    // If we found a good break point, use it; otherwise just truncate
    return breakPoint > PREVIEW_LENGTH * 0.7 
      ? text.substring(0, breakPoint)
      : truncated;
  };
  
  const previewText = getPreviewText(message);
  const displayText = isExpanded || !needsTruncation ? message : previewText;

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* {photoUrl && (
          <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden">
            <Image
              src={photoUrl}
              alt={`${displayName}'s profile photo`}
              fill
              className="object-cover"
            />
          </div>
        )} */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 font-sans">{displayName}</h3>
            <time className="text-sm text-gray-500 font-sans">{date}</time>
          </div>
          <div className="text-gray-700 font-sans leading-relaxed">
            <p className="whitespace-pre-line">{displayText}</p>
            {needsTruncation && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 rounded underline"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Show less" : "Show more"}
                >
                  {isExpanded ? "Read less" : "Read more..."}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
