import { useMemo, useState } from 'react';
import HabitCard from '../components/habits/HabitCard';

export default function HabitsPage({ habits, nodes, createHabit, toggleHabit, updateHabit, deleteHabit }) {
  const [newHabit, setNewHabit] = useState('');
  const [linkedNodeId, setLinkedNodeId] = useState('');

  const sortedNodes = useMemo(
    () => [...nodes].sort((a, b) => a.name.localeCompare(b.name)),
    [nodes],
  );

  return (
    <section className="space-y-4">
      <article className="glass rounded-xl p-4">
        <h2 className="text-xl font-semibold">Habit Tracking</h2>
        <p className="mt-1 text-sm text-slate-400">Track progress, streaks, and link each habit to mindmap goals.</p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a habit"
            className="rounded border border-slate-700 bg-slate-950/70 px-3 py-2 outline-none focus:border-indigo-400"
          />
          <select
            value={linkedNodeId}
            onChange={(e) => setLinkedNodeId(e.target.value)}
            className="rounded border border-slate-700 bg-slate-950/70 px-3 py-2"
          >
            <option value="">Optional mindmap link</option>
            {sortedNodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>
          <button
            className="rounded bg-indigo-500 px-3 py-2 font-medium hover:bg-indigo-400"
            onClick={() => {
              if (!newHabit.trim()) return;
              createHabit(newHabit.trim(), linkedNodeId || null);
              setNewHabit('');
              setLinkedNodeId('');
            }}
          >
            Create Habit
          </button>
        </div>
      </article>

      <div className="grid gap-3 lg:grid-cols-2">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onToggle={() => toggleHabit(habit.id)}
            onEdit={() => {
              const name = window.prompt('Habit name', habit.name);
              if (name) updateHabit(habit.id, { name });
            }}
            onDelete={() => {
              if (window.confirm('Delete this habit?')) deleteHabit(habit.id);
            }}
          />
        ))}
      </div>
    </section>
  );
}
