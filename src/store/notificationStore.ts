import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jsonStorage } from './storage';
import { Notification } from '@/types';
import { uid } from '@/utils/id';

type NotificationState = {
  items: Record<string, Notification[]>;
  push: (userId: string, n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Notification;
  markAllRead: (userId: string) => void;
  markRead: (userId: string, id: string) => void;
  remove: (userId: string, id: string) => void;
  clear: (userId: string) => void;
  getByUser: (userId: string) => Notification[];
  unreadCount: (userId: string) => number;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      items: {},
      push: (userId, n) => {
        const note: Notification = {
          ...n,
          id: uid('ntf'),
          createdAt: new Date().toISOString(),
          read: false,
        };
        const list = get().items[userId] ?? [];
        set({ items: { ...get().items, [userId]: [note, ...list] } });
        return note;
      },
      markAllRead: (userId) => {
        const list = (get().items[userId] ?? []).map((n) => ({ ...n, read: true }));
        set({ items: { ...get().items, [userId]: list } });
      },
      markRead: (userId, id) => {
        const list = (get().items[userId] ?? []).map((n) =>
          n.id === id ? { ...n, read: true } : n,
        );
        set({ items: { ...get().items, [userId]: list } });
      },
      remove: (userId, id) => {
        const list = (get().items[userId] ?? []).filter((n) => n.id !== id);
        set({ items: { ...get().items, [userId]: list } });
      },
      clear: (userId) => set({ items: { ...get().items, [userId]: [] } }),
      getByUser: (userId) => get().items[userId] ?? [],
      unreadCount: (userId) => (get().items[userId] ?? []).filter((n) => !n.read).length,
    }),
    {
      name: 'autorepair.notifications',
      storage: jsonStorage(),
    },
  ),
);
