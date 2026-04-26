import { create } from 'zustand';
import {
  fetchCollection,
  removeDocument,
  replaceCollection,
  upsertDocument,
} from '../firebase/firestore';
import { calculateStreak, todayKey } from '../utils/date';

const uid = (prefix) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;

const seedNodes = [
  { id: 'node-root', name: 'Future Self 2066', x: 420, y: 260, parentId: null, collapsed: false, habitIds: [] },
];

export const useAppStore = create((set, get) => ({
  activeView: 'dashboard',
  habits: [],
  nodes: seedNodes,
  loading: false,
  selectedNodeId: null,

  setActiveView: (activeView) => set({ activeView }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),

  loadData: async () => {
    set({ loading: true });
    const [habits, nodes] = await Promise.all([
      fetchCollection('habits'),
      fetchCollection('mindmap'),
    ]);

    set({
      habits: habits.length ? habits : [],
      nodes: nodes.length ? nodes : seedNodes,
      loading: false,
    });
  },

  createHabit: async (name, linkedNodeId) => {
    const item = {
      id: uid('habit'),
      name,
      completions: {},
      createdAt: new Date().toISOString(),
      linkedNodeId: linkedNodeId || null,
    };

    set((state) => ({ habits: [item, ...state.habits] }));
    await upsertDocument('habits', item.id, item);
  },

  toggleHabit: async (habitId, day = todayKey()) => {
    const habit = get().habits.find((item) => item.id === habitId);
    if (!habit) return;

    const completions = { ...habit.completions };
    completions[day] = !completions[day];

    const next = { ...habit, completions };
    set((state) => ({
      habits: state.habits.map((item) => (item.id === habitId ? next : item)),
    }));

    await upsertDocument('habits', habitId, next);
  },

  updateHabit: async (habitId, patch) => {
    const habit = get().habits.find((item) => item.id === habitId);
    if (!habit) return;

    const next = { ...habit, ...patch };
    set((state) => ({
      habits: state.habits.map((item) => (item.id === habitId ? next : item)),
    }));

    await upsertDocument('habits', habitId, next);
  },

  deleteHabit: async (habitId) => {
    set((state) => ({
      habits: state.habits.filter((item) => item.id !== habitId),
      nodes: state.nodes.map((node) => ({
        ...node,
        habitIds: (node.habitIds || []).filter((id) => id !== habitId),
      })),
    }));

    await Promise.all([
      removeDocument('habits', habitId),
      replaceCollection('mindmap', get().nodes),
    ]);
  },

  createNode: async ({ name, x, y, parentId = 'node-root' }) => {
    const node = {
      id: uid('node'),
      name,
      x,
      y,
      parentId,
      collapsed: false,
      habitIds: [],
    };

    const nextNodes = [...get().nodes, node];
    set({ nodes: nextNodes, selectedNodeId: node.id });
    await replaceCollection('mindmap', nextNodes);
  },

  updateNode: async (nodeId, patch) => {
    const next = get().nodes.map((item) => (item.id === nodeId ? { ...item, ...patch } : item));
    set({ nodes: next });
    await replaceCollection('mindmap', next);
  },

  deleteNode: async (nodeId) => {
    const toDelete = new Set([nodeId]);

    let changed = true;
    while (changed) {
      changed = false;
      get().nodes.forEach((node) => {
        if (toDelete.has(node.parentId) && !toDelete.has(node.id)) {
          toDelete.add(node.id);
          changed = true;
        }
      });
    }

    const next = get().nodes.filter((item) => !toDelete.has(item.id));
    set({ nodes: next, selectedNodeId: null });
    await replaceCollection('mindmap', next);
  },

  setNodes: async (nodes) => {
    set({ nodes });
    await replaceCollection('mindmap', nodes);
  },

  importState: async ({ habits = [], nodes = [] }) => {
    set({ habits, nodes: nodes.length ? nodes : seedNodes });
    await Promise.all([
      replaceCollection('habits', habits),
      replaceCollection('mindmap', nodes.length ? nodes : seedNodes),
    ]);
  },

  dashboardStats: () => {
    const habits = get().habits;
    const nodes = get().nodes;
    const totalCompleted = habits.reduce(
      (sum, habit) => sum + Object.values(habit.completions || {}).filter(Boolean).length,
      0,
    );

    const streakSummary = habits.reduce(
      (sum, habit) => sum + calculateStreak(habit.completions),
      0,
    );

    return {
      totalHabits: habits.length,
      totalCompleted,
      streakSummary,
      nodeCount: nodes.length,
      goals: nodes.filter((node) => node.parentId === 'node-root').map((node) => node.name).slice(0, 4),
    };
  },
}));
