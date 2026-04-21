# AutoRepair

A production-grade React Native mobile marketplace that connects drivers in the U.S. and Canada with trusted auto repair shops and mobile mechanics.

The app is built with **Expo + TypeScript**, uses **local storage (AsyncStorage)** via Zustand — no backend required — and ships with a clean, professional UI in white, orange, and black.

## Features

- Secure, local-first authentication (register, login, logout, persistent session)
- Vehicle profile management (multiple vehicles, primary selection, rich metadata)
- Service catalog with 12 categories (oil change, brakes, tires, diagnostics, A/C, body work, etc.)
- Shop discovery with **Map + List** views, filter by type (repair shop vs. mobile mechanic)
- Multi-step booking flow (services → vehicle → shop → schedule → review & pay)
- Real-time chat with simulated shop replies and unread badges
- Stripe-style payment method vault with card validation, brand detection, and Luhn checking
- Simulated Stripe payment authorization during booking
- Push notifications via `expo-notifications` (permissions, local notifications, booking alerts)
- Notification center with read/unread state
- Profile, edit profile, settings, and notification preferences

## Tech Stack

- **Expo SDK 51** + React Native 0.74
- **TypeScript** (strict mode)
- **React Navigation** (native-stack + bottom-tabs)
- **Zustand** + persist middleware for local state
- **AsyncStorage** for persistence
- **react-native-maps** for the Discover map (with a built-in fallback on web)
- **expo-notifications** for push
- **@expo/vector-icons** (Ionicons) — icons only, no emoji
- **dayjs** for date handling

## Getting Started

```bash
npm install
npm start
```

Then press `i` for iOS, `a` for Android, or `w` for web. Alternatively, scan the QR code with the **Expo Go** app.

> The app requires no backend. All data is stored locally on device. First launch drops you on the **Welcome** screen — create an account and the tabs (Home, Discover, Bookings, Chat, Profile) become available.

## Project Structure

```
src/
  components/       Reusable UI kit (Button, Card, Input, Badge, ShopCard, BookingCard, VehicleCard, Header, Screen, ...)
  data/             Seed data (shops across US/CA, services catalog, car makes)
  navigation/       Auth + Main tab navigators + per-tab stacks
  screens/
    auth/           Welcome, Login, Register
    home/           Home, Services, ServiceDetail, ShopDetail, BookingFlow, Notifications
    discover/       Map + list discovery
    bookings/       Bookings list, BookingDetail
    chat/           Chat list, Chat thread
    profile/        Profile, Vehicles, VehicleEditor, PaymentMethods, AddPaymentMethod, Settings, EditProfile
  store/            Zustand stores (auth, vehicles, bookings, chats, payments, notifications)
  theme/            Colors, typography, spacing, radii, shadows
  types/            Shared TypeScript types
  utils/            Formatting, ID helpers, payment helpers, notification helpers
App.tsx             Root component with SafeAreaProvider + GestureHandlerRootView
```

## Design System

- **Primary:** `#1E3A8A` (Deep Blue — trust, reliability)
- **Secondary:** `#F97316` (Electric Orange — action, urgency)
- **Accent Light Gray:** `#F3F4F6`
- **Dark Gray / Ink:** `#111827`
- **Background:** `#FFFFFF`
- **Neutrals:** 10-step Tailwind-aligned gray scale
- **No gradients** — flat, accessible surfaces only
- **Icons only** (Ionicons) — no emojis anywhere
- **Typography:** Platform-native stack with a 9-step scale (display → overline)

## Swapping in a Real Backend

The stores in `src/store/*` expose pure, testable selectors and mutators. To attach a backend, replace the `persist(...)` middleware with async calls to your API (or wrap the stores with an RTK-Query/TanStack-Query layer). Stripe can be wired up by swapping `src/utils/payment.ts#confirmPaymentLocally` with a call to your PaymentIntent endpoint + `@stripe/stripe-react-native`.

## Scripts

- `npm start` — start Metro
- `npm run android` / `npm run ios` / `npm run web`
- `npx tsc --noEmit` — TypeScript check
