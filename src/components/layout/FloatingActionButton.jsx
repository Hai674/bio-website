export default function FloatingActionButton({ onClick, label = '+' }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-neon text-3xl text-white shadow-glow transition hover:scale-105 active:scale-95"
      aria-label="Quick action"
    >
      {label}
    </button>
  );
}
