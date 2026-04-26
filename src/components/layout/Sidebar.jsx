const items = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'mindmap', label: 'Mindmap' },
  { id: 'habits', label: 'Habits' },
];

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="glass w-full rounded-2xl p-3 shadow-glow md:w-64 md:p-4">
      <h1 className="mb-4 text-xl font-semibold text-indigo-300">Future Self 2066</h1>
      <nav className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full rounded-lg px-4 py-3 text-left transition ${
              activeView === item.id
                ? 'bg-indigo-500/40 text-white'
                : 'bg-slate-900/40 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
