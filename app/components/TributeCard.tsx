import Image from "next/image";

interface TributeCardProps {
  name: string;
  date: string;
  message: string;
  photoUrl?: string;
  tributePhotoUrl?: string;
  isAnonymous?: boolean;
}

export default function TributeCard({ name, date, message, photoUrl, tributePhotoUrl, isAnonymous }: TributeCardProps) {
  const displayName = isAnonymous ? "Anonymous" : name;

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {photoUrl && (
          <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden">
            <Image
              src={photoUrl}
              alt={`${displayName}'s profile photo`}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 font-sans">{displayName}</h3>
            <time className="text-sm text-gray-500 font-sans">{date}</time>
          </div>
          <p className="text-gray-700 font-sans leading-relaxed whitespace-pre-line">{message}</p>
          {tributePhotoUrl && (
            <div className="mt-4 relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={tributePhotoUrl}
                alt={`Photo shared by ${displayName}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
