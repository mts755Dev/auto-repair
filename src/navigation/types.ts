import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  DiscoverTab: NavigatorScreenParams<DiscoverStackParamList>;
  BookingsTab: NavigatorScreenParams<BookingsStackParamList>;
  ChatTab: NavigatorScreenParams<ChatStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type HomeStackParamList = {
  Home: undefined;
  Services: { initialCategory?: string } | undefined;
  ServiceDetail: { serviceId: string };
  BookingFlow: { serviceIds?: string[]; shopId?: string } | undefined;
  ShopDetail: { shopId: string };
  Chat: { threadId: string };
  BookingDetail: { bookingId: string };
  Notifications: undefined;
};

export type DiscoverStackParamList = {
  Discover: undefined;
  ShopDetail: { shopId: string };
  BookingFlow: { serviceIds?: string[]; shopId?: string } | undefined;
  Chat: { threadId: string };
};

export type BookingsStackParamList = {
  Bookings: undefined;
  BookingDetail: { bookingId: string };
  Chat: { threadId: string };
  ShopDetail: { shopId: string };
};

export type ChatStackParamList = {
  ChatList: undefined;
  Chat: { threadId: string };
  ShopDetail: { shopId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Vehicles: undefined;
  VehicleEditor: { vehicleId?: string } | undefined;
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;
  Settings: undefined;
  EditProfile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};
