import Image from "next/image";
import Link from "next/link";

interface CollectionCardProps {
  href: string;
  title: string;
  count: number;
  cover: string;
}

export function CollectionCard({ href, title, count, cover }: CollectionCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          <p className="text-white/60 text-sm">{count} photos</p>
        </div>
      </div>
    </Link>
  );
}
