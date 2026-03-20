"use client";

interface MasonryGridProps {
  images: { src: string; alt: string }[];
  onImageClick: (index: number) => void;
}

export function MasonryGrid({ images, onImageClick }: MasonryGridProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
      {images.map((img, i) => (
        <button
          key={img.src}
          onClick={() => onImageClick(i)}
          className="block w-full break-inside-avoid cursor-pointer group"
        >
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </button>
      ))}
    </div>
  );
}
