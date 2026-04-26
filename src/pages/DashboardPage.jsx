import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import SummaryCard from '../components/dashboard/SummaryCard';
import { formatLongDate, todayKey } from '../utils/date';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

export default function DashboardPage({ habits, stats }) {
  const last7Days = [...Array(7)].map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - index));
    return d.toISOString().slice(0, 10);
  });

  const chartData = {
    labels: last7Days.map((day) => day.slice(5)),
    datasets: [
      {
        label: 'Habits Completed',
        data: last7Days.map((day) => habits.filter((habit) => habit.completions?.[day]).length),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,.3)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <section className="space-y-5">
      <header className="glass rounded-xl p-5">
        <p className="text-slate-400">{formatLongDate()}</p>
        <h2 className="mt-2 text-2xl font-semibold">Dashboard Snapshot ({todayKey()})</h2>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Habits" value={stats.totalHabits} />
        <SummaryCard title="Completed Habits" value={stats.totalCompleted} />
        <SummaryCard title="Streak Summary" value={stats.streakSummary} hint="Combined active streaks" />
        <SummaryCard title="Mindmap Nodes" value={stats.nodeCount} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="glass rounded-xl p-4 lg:col-span-2">
          <h3 className="mb-3 text-sm uppercase tracking-wider text-slate-400">7-Day Analytics</h3>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: { legend: { labels: { color: '#cbd5e1' } } },
              scales: {
                y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,0.15)' } },
                x: { ticks: { color: '#64748b' }, grid: { display: false } },
              },
            }}
          />
        </article>

        <article className="glass rounded-xl p-4">
          <h3 className="text-sm uppercase tracking-wider text-slate-400">Main Goals</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {stats.goals.length ? (
              stats.goals.map((goal) => (
                <li key={goal} className="rounded bg-slate-900/50 px-3 py-2">
                  {goal}
                </li>
              ))
            ) : (
              <li className="text-slate-500">Create top-level nodes in the mindmap.</li>
            )}
          </ul>
        </article>
      </div>
    </section>
  );
}
