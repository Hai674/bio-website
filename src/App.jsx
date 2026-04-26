import { useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import FloatingActionButton from './components/layout/FloatingActionButton';
import DashboardPage from './pages/DashboardPage';
import HabitsPage from './pages/HabitsPage';
import MindmapPage from './pages/MindmapPage';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const {
    activeView,
    habits,
    nodes,
    selectedNodeId,
    setSelectedNodeId,
    setActiveView,
    createHabit,
    toggleHabit,
    updateHabit,
    deleteHabit,
    createNode,
    updateNode,
    deleteNode,
    setNodes,
    loadData,
    dashboardStats,
  } = useAppStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = dashboardStats();

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid max-w-[1600px] gap-4 md:grid-cols-[250px_1fr]">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        <main className="space-y-4">
          {activeView === 'dashboard' && <DashboardPage habits={habits} stats={stats} />}
          {activeView === 'mindmap' && (
            <MindmapPage
              nodes={nodes}
              habits={habits}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
              createNode={createNode}
              updateNode={updateNode}
              deleteNode={deleteNode}
              setNodes={setNodes}
            />
          )}
          {activeView === 'habits' && (
            <HabitsPage
              habits={habits}
              nodes={nodes}
              createHabit={createHabit}
              toggleHabit={toggleHabit}
              updateHabit={updateHabit}
              deleteHabit={deleteHabit}
            />
          )}
        </main>
      </div>

      <FloatingActionButton
        onClick={() => {
          if (activeView === 'habits') {
            const name = window.prompt('New habit name');
            if (name) createHabit(name);
            return;
          }

          setActiveView('mindmap');
          createNode({ name: 'Quick Node', x: 300, y: 200, parentId: selectedNodeId || 'node-root' });
        }}
      />
    </div>
  );
}
