import Image from "next/image";
import Link from "next/link";

interface ContentCardProps {
  href: string;
  title: string;
  subtitle?: string;
  cover: string;
  label: string;
  labelColor: string;
  large?: boolean;
}

export function ContentCard({
  href,
  title,
  subtitle,
  cover,
  label,
  labelColor,
  large = false,
}: ContentCardProps) {
  return (
    <Link href={href} className="group block">
      <div
        className={`relative overflow-hidden rounded-lg bg-[var(--card)] ${
          large ? "aspect-[16/10]" : "aspect-[3/2]"
        }`}
      >
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={large ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <span
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: labelColor }}
          >
            {label}
          </span>
          <h3 className="text-white text-sm mt-1 font-medium">{title}</h3>
          {subtitle && (
            <p className="text-white/60 text-xs mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
