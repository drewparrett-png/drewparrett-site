export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-20">
      <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-[var(--muted)]">
        <span>&copy; {new Date().getFullYear()} Drew Parrett</span>
        <div className="flex gap-4">
          <a href="https://www.linkedin.com/in/andrewparrett/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
          <a href="mailto:drew.parrett@gmail.com" className="hover:text-white transition-colors">Email</a>
        </div>
      </div>
    </footer>
  );
}
