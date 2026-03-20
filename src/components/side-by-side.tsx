interface SideBySideProps {
  children: React.ReactNode;
}

export function SideBySide({ children }: SideBySideProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {children}
    </div>
  );
}
