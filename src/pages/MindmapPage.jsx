import { useMemo } from 'react';
import MindmapCanvas from '../components/mindmap/MindmapCanvas';

export default function MindmapPage({ nodes, habits, selectedNodeId, setSelectedNodeId, createNode, updateNode, deleteNode, setNodes }) {
  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId), [nodes, selectedNodeId]);

  const exportData = () => {
    const json = JSON.stringify({ nodes, habits }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'future-self-2066.json';
    link.click();
  };

  const linkHabitToNode = (habitId) => {
    if (!selectedNode) return;
    const list = new Set(selectedNode.habitIds || []);
    list.has(habitId) ? list.delete(habitId) : list.add(habitId);
    updateNode(selectedNode.id, { habitIds: [...list] });
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <article className="glass rounded-xl p-3">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
          <span>Double-click empty canvas to create a node. Drag onto another node to re-parent.</span>
          <button onClick={exportData} className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700">
            Export JSON
          </button>
        </div>
        <MindmapCanvas
          nodes={nodes}
          setNodes={setNodes}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          createNode={createNode}
        />
      </article>

      <aside className="glass rounded-xl p-4">
        <h3 className="font-semibold text-indigo-300">Node Inspector</h3>
        {selectedNode ? (
          <div className="mt-3 space-y-3 text-sm">
            <input
              value={selectedNode.name}
              onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
              className="w-full rounded border border-slate-700 bg-slate-950/70 px-3 py-2"
            />
            <label className="flex items-center justify-between rounded bg-slate-900/70 px-3 py-2">
              <span>Collapsed</span>
              <input
                type="checkbox"
                checked={Boolean(selectedNode.collapsed)}
                onChange={(e) => updateNode(selectedNode.id, { collapsed: e.target.checked })}
              />
            </label>

            <div>
              <p className="mb-2 text-slate-400">Link habits</p>
              <div className="max-h-40 space-y-1 overflow-auto">
                {habits.map((habit) => (
                  <label key={habit.id} className="flex items-center gap-2 rounded bg-slate-900/60 px-2 py-1">
                    <input
                      type="checkbox"
                      checked={(selectedNode.habitIds || []).includes(habit.id)}
                      onChange={() => linkHabitToNode(habit.id)}
                    />
                    <span>{habit.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Delete node and all descendants?')) deleteNode(selectedNode.id);
              }}
              className="w-full rounded bg-rose-700/80 px-3 py-2"
            >
              Delete Node
            </button>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Select a node to edit, collapse, delete, or link habits.</p>
        )}
      </aside>
    </section>
  );
}
