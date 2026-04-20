export type ID = string;

export type User = {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  passwordHash?: string;
  createdAt: string;
  notificationsEnabled: boolean;
  pushToken?: string | null;
};

export type Vehicle = {
  id: ID;
  userId: ID;
  nickname?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  vin?: string;
  licensePlate?: string;
  mileage?: number;
  fuelType?: 'Gasoline' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission?: 'Automatic' | 'Manual';
  color?: string;
  isPrimary?: boolean;
  createdAt: string;
};

export type ServiceCategory =
  | 'oil-change'
  | 'brakes'
  | 'tires'
  | 'battery'
  | 'diagnostics'
  | 'ac'
  | 'engine'
  | 'transmission'
  | 'detailing'
  | 'inspection'
  | 'alignment'
  | 'body';

export type Service = {
  id: ID;
  category: ServiceCategory;
  title: string;
  description: string;
  durationMin: number;
  priceFrom: number;
  icon: string;
};

export type Shop = {
  id: ID;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  priceLevel: 1 | 2 | 3;
  type: 'shop' | 'mobile';
  address: string;
  city: string;
  state: string;
  country: 'US' | 'CA';
  zipcode: string;
  latitude: number;
  longitude: number;
  phone: string;
  openNow: boolean;
  hours: string;
  services: ServiceCategory[];
  offersMobile: boolean;
  certifications?: string[];
  yearsInBusiness?: number;
  heroColor?: string;
};

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type Booking = {
  id: ID;
  userId: ID;
  vehicleId: ID;
  shopId: ID;
  serviceIds: ID[];
  scheduledAt: string;
  status: BookingStatus;
  notes?: string;
  estimatedTotal: number;
  paymentStatus: 'unpaid' | 'authorized' | 'paid' | 'refunded';
  paymentMethodLast4?: string;
  createdAt: string;
  location?: { address: string; latitude: number; longitude: number } | null;
  isMobileService: boolean;
};

export type ChatMessage = {
  id: ID;
  threadId: ID;
  senderId: ID;
  senderName: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type ChatThread = {
  id: ID;
  userId: ID;
  shopId: ID;
  shopName: string;
  bookingId?: ID;
  lastMessage?: string;
  lastMessageAt?: string;
  unread: number;
};

export type PaymentMethod = {
  id: ID;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4: string;
  expMonth: number;
  expYear: number;
  holder: string;
  isDefault?: boolean;
};

export type Notification = {
  id: ID;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  type: 'booking' | 'chat' | 'payment' | 'system';
  referenceId?: string;
};
