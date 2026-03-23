interface ImageRowProps {
  children: React.ReactNode;
  maxItemWidth?: string;
}

export function ImageRow({
  children,
  maxItemWidth = "200px",
}: ImageRowProps) {
  return (
    <div
      className="flex justify-center gap-4 my-6"
      style={{ maxWidth: "100%" }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div key={i} style={{ width: maxItemWidth, flexShrink: 0 }}>
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
