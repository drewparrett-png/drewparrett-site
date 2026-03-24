"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface ImageRowProps {
  srcs: string;
  alts?: string;
  maxItemWidth?: number;
}

export function ImageRow({ srcs, alts, maxItemWidth = 200 }: ImageRowProps) {
  const srcList = srcs.split(",").map((s) => s.trim());
  const altList = alts ? alts.split(",").map((s) => s.trim()) : srcList.map(() => "");

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = srcList.map((src, i) => ({ src, alt: altList[i] || "" }));

  return (
    <>
      <div className="flex justify-center gap-4 my-6">
        {srcList.map((src, i) => (
          <button
            key={i}
            style={{ width: maxItemWidth, flexShrink: 0 }}
            className="cursor-zoom-in"
            onClick={() => { setIndex(i); setOpen(true); }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={altList[i] || ""} className="w-full rounded-lg" />
          </button>
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        styles={{
          container: { backgroundColor: "rgba(10, 10, 10, 0.95)" },
        }}
      />
    </>
  );
}
