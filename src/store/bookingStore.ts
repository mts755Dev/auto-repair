import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jsonStorage } from './storage';
import { Booking, BookingStatus } from '@/types';
import { uid } from '@/utils/id';

type BookingState = {
  bookings: Booking[];
  createBooking: (b: Omit<Booking, 'id' | 'createdAt' | 'status' | 'paymentStatus'> & {
    status?: BookingStatus;
    paymentStatus?: Booking['paymentStatus'];
  }) => Booking;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  getByUser: (userId: string) => Booking[];
  getById: (id: string) => Booking | undefined;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],

      createBooking: (b) => {
        const booking: Booking = {
          ...b,
          id: uid('bkg'),
          createdAt: new Date().toISOString(),
          status: b.status ?? 'pending',
          paymentStatus: b.paymentStatus ?? 'unpaid',
        };
        set({ bookings: [booking, ...get().bookings] });
        return booking;
      },

      updateBooking: (id, patch) => {
        set({
          bookings: get().bookings.map((bk) => (bk.id === id ? { ...bk, ...patch } : bk)),
        });
      },

      cancelBooking: (id) => {
        set({
          bookings: get().bookings.map((bk) =>
            bk.id === id ? { ...bk, status: 'cancelled' as BookingStatus } : bk,
          ),
        });
      },

      getByUser: (userId) =>
        get()
          .bookings.filter((b) => b.userId === userId)
          .sort((a, b) => (a.scheduledAt < b.scheduledAt ? 1 : -1)),
      getById: (id) => get().bookings.find((b) => b.id === id),
    }),
    {
      name: 'autorepair.bookings',
      storage: jsonStorage(),
    },
  ),
);
