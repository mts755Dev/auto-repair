import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jsonStorage } from './storage';
import { Vehicle } from '@/types';
import { uid } from '@/utils/id';

type VehicleState = {
  vehicles: Vehicle[];
  addVehicle: (v: Omit<Vehicle, 'id' | 'createdAt'>) => Vehicle;
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  removeVehicle: (id: string) => void;
  setPrimary: (id: string, userId: string) => void;
  getByUser: (userId: string) => Vehicle[];
  getById: (id: string) => Vehicle | undefined;
};

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: [],

      addVehicle: (v) => {
        const vehicle: Vehicle = {
          ...v,
          id: uid('veh'),
          createdAt: new Date().toISOString(),
        };
        const current = get().vehicles;
        const userVehicles = current.filter((x) => x.userId === v.userId);
        if (userVehicles.length === 0) {
          vehicle.isPrimary = true;
        } else if (vehicle.isPrimary) {
          current.forEach((x) => {
            if (x.userId === v.userId) x.isPrimary = false;
          });
        }
        set({ vehicles: [...current, vehicle] });
        return vehicle;
      },

      updateVehicle: (id, patch) => {
        set({
          vehicles: get().vehicles.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        });
      },

      removeVehicle: (id) => {
        const target = get().vehicles.find((v) => v.id === id);
        if (!target) return;
        const remaining = get().vehicles.filter((v) => v.id !== id);
        if (target.isPrimary) {
          const next = remaining.find((v) => v.userId === target.userId);
          if (next) next.isPrimary = true;
        }
        set({ vehicles: remaining });
      },

      setPrimary: (id, userId) => {
        set({
          vehicles: get().vehicles.map((v) =>
            v.userId === userId ? { ...v, isPrimary: v.id === id } : v,
          ),
        });
      },

      getByUser: (userId) => get().vehicles.filter((v) => v.userId === userId),
      getById: (id) => get().vehicles.find((v) => v.id === id),
    }),
    {
      name: 'autorepair.vehicles',
      storage: jsonStorage(),
    },
  ),
);
