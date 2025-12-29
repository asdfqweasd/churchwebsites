'use client';

import { useState } from 'react';

export function EventImage({ 
  src, 
  alt, 
  className 
}: { 
  src: string | null; 
  alt: string; 
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className={`bg-gray-200 rounded-3xl flex items-center justify-center ${className || ''}`}>
        <div className="text-center p-4">
          <p className="text-sm text-gray-600">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        console.error('Image failed to load:', src);
        setImageError(true);
      }}
    />
  );
}
