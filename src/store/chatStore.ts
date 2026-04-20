import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jsonStorage } from './storage';
import { ChatMessage, ChatThread } from '@/types';
import { uid } from '@/utils/id';
import { SHOPS } from '@/data/shops';

type ChatState = {
  threads: ChatThread[];
  messages: Record<string, ChatMessage[]>;

  ensureThread: (userId: string, shopId: string, bookingId?: string) => ChatThread;
  sendMessage: (
    threadId: string,
    senderId: string,
    senderName: string,
    body: string,
  ) => ChatMessage;
  simulateShopReply: (threadId: string, shopId: string) => void;
  markRead: (threadId: string) => void;
  getMessages: (threadId: string) => ChatMessage[];
  getThread: (threadId: string) => ChatThread | undefined;
  getThreadsByUser: (userId: string) => ChatThread[];
  totalUnread: (userId: string) => number;
};

const SHOP_REPLIES = [
  "Hi! Thanks for reaching out. How can we help today?",
  "We can fit you in this week. What day works best?",
  "Sounds good. We'll send a confirmation shortly.",
  "No problem. Our technician will take care of it.",
  "Please share your vehicle info and we'll prepare an estimate.",
  "Your car is in great hands with our team.",
  "We recommend a quick inspection while you're here.",
  "Thank you for choosing us. We appreciate your business!",
];

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      threads: [],
      messages: {},

      ensureThread: (userId, shopId, bookingId) => {
        const existing = get().threads.find(
          (t) => t.userId === userId && t.shopId === shopId,
        );
        if (existing) {
          if (bookingId && existing.bookingId !== bookingId) {
            const updated = { ...existing, bookingId };
            set({
              threads: get().threads.map((t) => (t.id === existing.id ? updated : t)),
            });
            return updated;
          }
          return existing;
        }
        const shop = SHOPS.find((s) => s.id === shopId);
        const thread: ChatThread = {
          id: uid('thr'),
          userId,
          shopId,
          shopName: shop?.name ?? 'Shop',
          bookingId,
          unread: 0,
        };
        set({ threads: [thread, ...get().threads], messages: { ...get().messages, [thread.id]: [] } });
        return thread;
      },

      sendMessage: (threadId, senderId, senderName, body) => {
        const message: ChatMessage = {
          id: uid('msg'),
          threadId,
          senderId,
          senderName,
          body,
          createdAt: new Date().toISOString(),
          read: true,
        };
        const msgs = get().messages[threadId] ?? [];
        set({
          messages: { ...get().messages, [threadId]: [...msgs, message] },
          threads: get().threads.map((t) =>
            t.id === threadId
              ? { ...t, lastMessage: body, lastMessageAt: message.createdAt }
              : t,
          ),
        });
        return message;
      },

      simulateShopReply: (threadId, shopId) => {
        const thread = get().threads.find((t) => t.id === threadId);
        if (!thread) return;
        const shop = SHOPS.find((s) => s.id === shopId);
        const reply = SHOP_REPLIES[Math.floor(Math.random() * SHOP_REPLIES.length)];
        const message: ChatMessage = {
          id: uid('msg'),
          threadId,
          senderId: shopId,
          senderName: shop?.name ?? 'Shop',
          body: reply,
          createdAt: new Date().toISOString(),
          read: false,
        };
        const msgs = get().messages[threadId] ?? [];
        set({
          messages: { ...get().messages, [threadId]: [...msgs, message] },
          threads: get().threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  lastMessage: reply,
                  lastMessageAt: message.createdAt,
                  unread: (t.unread ?? 0) + 1,
                }
              : t,
          ),
        });
      },

      markRead: (threadId) => {
        const msgs = get().messages[threadId] ?? [];
        set({
          messages: {
            ...get().messages,
            [threadId]: msgs.map((m) => ({ ...m, read: true })),
          },
          threads: get().threads.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t)),
        });
      },

      getMessages: (threadId) => get().messages[threadId] ?? [],
      getThread: (threadId) => get().threads.find((t) => t.id === threadId),
      getThreadsByUser: (userId) =>
        get()
          .threads.filter((t) => t.userId === userId)
          .sort((a, b) =>
            (b.lastMessageAt ?? '').localeCompare(a.lastMessageAt ?? ''),
          ),
      totalUnread: (userId) =>
        get()
          .threads.filter((t) => t.userId === userId)
          .reduce((s, t) => s + (t.unread ?? 0), 0),
    }),
    {
      name: 'autorepair.chat',
      storage: jsonStorage(),
    },
  ),
);
