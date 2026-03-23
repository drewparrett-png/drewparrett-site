interface ImageRowProps {
  srcs: string;
  alts?: string;
  maxItemWidth?: number;
}

export function ImageRow({ srcs, alts, maxItemWidth = 200 }: ImageRowProps) {
  const srcList = srcs.split(",").map((s) => s.trim());
  const altList = alts ? alts.split(",").map((s) => s.trim()) : srcList.map(() => "");

  return (
    <div className="flex justify-center gap-4 my-6">
      {srcList.map((src, i) => (
        <div key={i} style={{ width: maxItemWidth, flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={altList[i] || ""} className="w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
