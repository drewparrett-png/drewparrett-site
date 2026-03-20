import Image from "next/image";

interface ImageGalleryProps {
  images: { src: string; alt: string }[];
  columns?: 2 | 3;
}

export function ImageGallery({ images, columns = 2 }: ImageGalleryProps) {
  return (
    <div
      className={`grid gap-3 my-6 ${
        columns === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2"
      }`}
    >
      {images.map((img) => (
        <div key={img.src} className="relative aspect-[4/3] rounded-lg overflow-hidden">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  );
}
