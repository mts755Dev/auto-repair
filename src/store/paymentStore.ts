import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jsonStorage } from './storage';
import { PaymentMethod } from '@/types';
import { uid } from '@/utils/id';

type PaymentState = {
  methods: Record<string, PaymentMethod[]>;
  addMethod: (userId: string, method: Omit<PaymentMethod, 'id'>) => PaymentMethod;
  removeMethod: (userId: string, id: string) => void;
  setDefault: (userId: string, id: string) => void;
  getByUser: (userId: string) => PaymentMethod[];
  getDefault: (userId: string) => PaymentMethod | undefined;
};

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      methods: {},

      addMethod: (userId, method) => {
        const list = get().methods[userId] ?? [];
        const id = uid('pm');
        const record: PaymentMethod = { ...method, id };
        if (record.isDefault || list.length === 0) {
          record.isDefault = true;
          list.forEach((m) => (m.isDefault = false));
        }
        set({ methods: { ...get().methods, [userId]: [...list, record] } });
        return record;
      },

      removeMethod: (userId, id) => {
        const list = (get().methods[userId] ?? []).filter((m) => m.id !== id);
        if (list.length && !list.some((m) => m.isDefault)) {
          list[0].isDefault = true;
        }
        set({ methods: { ...get().methods, [userId]: list } });
      },

      setDefault: (userId, id) => {
        const list = (get().methods[userId] ?? []).map((m) => ({
          ...m,
          isDefault: m.id === id,
        }));
        set({ methods: { ...get().methods, [userId]: list } });
      },

      getByUser: (userId) => get().methods[userId] ?? [],
      getDefault: (userId) =>
        (get().methods[userId] ?? []).find((m) => m.isDefault) ??
        (get().methods[userId] ?? [])[0],
    }),
    {
      name: 'autorepair.payments',
      storage: jsonStorage(),
    },
  ),
);
