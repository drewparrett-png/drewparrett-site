interface ImageRowProps {
  images: Array<{ src: string; alt: string }>;
  maxItemWidth?: number;
}

export function ImageRow({ images, maxItemWidth = 200 }: ImageRowProps) {
  return (
    <div className="flex justify-center gap-4 my-6">
      {images.map((img, i) => (
        <div key={i} style={{ width: maxItemWidth, flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt={img.alt}
            className="w-full rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}
