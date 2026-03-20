import { Callout } from "./callout";
import { SideBySide } from "./side-by-side";
import { ImageGallery } from "./image-gallery";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(): MDXComponents {
  return {
    h1: (props) => (
      <h1 className="text-3xl font-bold tracking-tight mt-8 mb-4" {...props} />
    ),
    h2: (props) => (
      <h2 className="text-2xl font-bold tracking-tight mt-8 mb-3" {...props} />
    ),
    h3: (props) => (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props} />
    ),
    p: (props) => (
      <p className="text-[var(--muted)] leading-relaxed my-3" {...props} />
    ),
    a: (props) => (
      <a className="text-white underline underline-offset-4 hover:text-[var(--label-project)]" {...props} />
    ),
    ul: (props) => (
      <ul className="list-disc list-inside text-[var(--muted)] my-3 space-y-1" {...props} />
    ),
    ol: (props) => (
      <ol className="list-decimal list-inside text-[var(--muted)] my-3 space-y-1" {...props} />
    ),
    blockquote: (props) => (
      <blockquote className="border-l-2 border-[var(--muted)] pl-4 my-6 italic text-[var(--muted)]" {...props} />
    ),
    code: (props) => (
      <code className="bg-[var(--card)] px-1.5 py-0.5 rounded text-sm" {...props} />
    ),
    pre: (props) => (
      <pre className="bg-[var(--card)] p-4 rounded-lg overflow-x-auto my-4 text-sm" {...props} />
    ),
    img: (props) => (
      <span className="block my-6 rounded-lg overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="w-full" alt={props.alt || ""} {...props} />
      </span>
    ),
    Callout,
    SideBySide,
    ImageGallery,
  };
}
