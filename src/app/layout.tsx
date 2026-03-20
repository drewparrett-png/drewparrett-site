import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drew Parrett",
  description: "Engineering leader, photographer, maker of things.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
