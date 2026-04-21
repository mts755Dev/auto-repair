import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jsonStorage } from './storage';
import { User } from '@/types';
import { uid } from '@/utils/id';
import { hashPassword } from '@/utils/format';

export const DEMO_CREDENTIALS = {
  email: 'demo@autorepair.app',
  password: 'demo1234',
  firstName: 'Demo',
  lastName: 'Driver',
  phone: '(555) 000-0123',
} as const;

type AuthState = {
  hydrated: boolean;
  currentUserId: string | null;
  users: Record<string, User>;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  loginAsDemo: () => { ok: true; email: string; password: string };
  register: (params: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }) => { ok: boolean; error?: string };
  logout: () => void;
  updateCurrentUser: (patch: Partial<User>) => void;
  setPushToken: (token: string | null) => void;
  _setHydrated: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      currentUserId: null,
      users: {},

      login: (email, password) => {
        const normalized = email.trim().toLowerCase();
        const user = Object.values(get().users).find(
          (u) => u.email.toLowerCase() === normalized,
        );
        if (!user) return { ok: false, error: 'No account found with that email.' };
        if (user.passwordHash !== hashPassword(password)) {
          return { ok: false, error: 'Incorrect password. Try again.' };
        }
        set({ currentUserId: user.id });
        return { ok: true };
      },

      loginAsDemo: () => {
        const normalized = DEMO_CREDENTIALS.email.toLowerCase();
        let user = Object.values(get().users).find(
          (u) => u.email.toLowerCase() === normalized,
        );
        if (!user) {
          const id = uid('usr');
          user = {
            id,
            firstName: DEMO_CREDENTIALS.firstName,
            lastName: DEMO_CREDENTIALS.lastName,
            email: normalized,
            phone: DEMO_CREDENTIALS.phone,
            passwordHash: hashPassword(DEMO_CREDENTIALS.password),
            createdAt: new Date().toISOString(),
            notificationsEnabled: true,
            pushToken: null,
          };
          set({ users: { ...get().users, [id]: user } });
        }
        set({ currentUserId: user.id });
        return {
          ok: true,
          email: DEMO_CREDENTIALS.email,
          password: DEMO_CREDENTIALS.password,
        };
      },

      register: ({ firstName, lastName, email, phone, password }) => {
        const normalized = email.trim().toLowerCase();
        const exists = Object.values(get().users).some(
          (u) => u.email.toLowerCase() === normalized,
        );
        if (exists) return { ok: false, error: 'An account with that email already exists.' };

        const id = uid('usr');
        const user: User = {
          id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normalized,
          phone: phone?.trim(),
          passwordHash: hashPassword(password),
          createdAt: new Date().toISOString(),
          notificationsEnabled: true,
          pushToken: null,
        };
        set({ users: { ...get().users, [id]: user }, currentUserId: id });
        return { ok: true };
      },

      logout: () => set({ currentUserId: null }),

      updateCurrentUser: (patch) => {
        const id = get().currentUserId;
        if (!id) return;
        const user = get().users[id];
        if (!user) return;
        set({ users: { ...get().users, [id]: { ...user, ...patch } } });
      },

      setPushToken: (token) => {
        const id = get().currentUserId;
        if (!id) return;
        const user = get().users[id];
        if (!user) return;
        set({ users: { ...get().users, [id]: { ...user, pushToken: token } } });
      },

      _setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: 'autorepair.auth',
      storage: jsonStorage(),
      partialize: (state) => ({ currentUserId: state.currentUserId, users: state.users }),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated(true);
      },
    },
  ),
);

export function useCurrentUser() {
  return useAuthStore((s) => (s.currentUserId ? s.users[s.currentUserId] : null));
}
