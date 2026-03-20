"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { MasonryGrid } from "./masonry-grid";

interface LightboxWrapperProps {
  images: { src: string; alt: string }[];
}

export function LightboxWrapper({ images }: LightboxWrapperProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((img) => ({ src: img.src, alt: img.alt }));

  return (
    <>
      <MasonryGrid
        images={images}
        onImageClick={(i) => {
          setIndex(i);
          setOpen(true);
        }}
      />
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
