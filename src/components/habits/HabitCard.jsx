import { calculateStreak, todayKey } from '../../utils/date';

export default function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  const streak = calculateStreak(habit.completions);
  const entries = Object.values(habit.completions || {});
  const completed = entries.filter(Boolean).length;
  const progress = entries.length ? Math.round((completed / entries.length) * 100) : 0;

  return (
    <article className="glass rounded-xl p-4 transition hover:border-indigo-400/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium">{habit.name}</h3>
          <p className="text-sm text-slate-400">Streak: {streak} day(s)</p>
        </div>
        <div className="flex gap-2 text-xs">
          <button className="rounded bg-slate-700 px-2 py-1" onClick={onEdit}>
            Edit
          </button>
          <button className="rounded bg-rose-700/70 px-2 py-1" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <label className="flex items-center justify-between rounded bg-slate-900/50 px-3 py-2">
          <span>Done today ({todayKey()})</span>
          <input
            type="checkbox"
            checked={Boolean(habit.completions?.[todayKey()])}
            onChange={onToggle}
            className="h-5 w-5 accent-indigo-500"
          />
        </label>

        <div>
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded bg-slate-800">
            <div className="h-full rounded bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </article>
  );
}
