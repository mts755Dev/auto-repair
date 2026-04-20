import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  BookingsStackParamList,
  ChatStackParamList,
  DiscoverStackParamList,
  HomeStackParamList,
  ProfileStackParamList,
} from './types';

import HomeScreen from '@/screens/home/HomeScreen';
import ServicesScreen from '@/screens/home/ServicesScreen';
import ServiceDetailScreen from '@/screens/home/ServiceDetailScreen';
import ShopDetailScreen from '@/screens/home/ShopDetailScreen';
import BookingFlowScreen from '@/screens/home/BookingFlowScreen';
import NotificationsScreen from '@/screens/home/NotificationsScreen';

import DiscoverScreen from '@/screens/discover/DiscoverScreen';

import BookingsScreen from '@/screens/bookings/BookingsScreen';
import BookingDetailScreen from '@/screens/bookings/BookingDetailScreen';

import ChatListScreen from '@/screens/chat/ChatListScreen';
import ChatScreen from '@/screens/chat/ChatScreen';

import ProfileScreen from '@/screens/profile/ProfileScreen';
import VehiclesScreen from '@/screens/profile/VehiclesScreen';
import VehicleEditorScreen from '@/screens/profile/VehicleEditorScreen';
import PaymentMethodsScreen from '@/screens/profile/PaymentMethodsScreen';
import AddPaymentMethodScreen from '@/screens/profile/AddPaymentMethodScreen';
import SettingsScreen from '@/screens/profile/SettingsScreen';
import EditProfileScreen from '@/screens/profile/EditProfileScreen';

const common = { headerShown: false, animation: 'slide_from_right' as const };

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
export function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={common}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Services" component={ServicesScreen} />
      <HomeStack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      <HomeStack.Screen name="ShopDetail" component={ShopDetailScreen} />
      <HomeStack.Screen name="BookingFlow" component={BookingFlowScreen} />
      <HomeStack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <HomeStack.Screen name="Chat" component={ChatScreen} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
    </HomeStack.Navigator>
  );
}

const DiscoverStack = createNativeStackNavigator<DiscoverStackParamList>();
export function DiscoverNavigator() {
  return (
    <DiscoverStack.Navigator screenOptions={common}>
      <DiscoverStack.Screen name="Discover" component={DiscoverScreen} />
      <DiscoverStack.Screen name="ShopDetail" component={ShopDetailScreen} />
      <DiscoverStack.Screen name="BookingFlow" component={BookingFlowScreen} />
      <DiscoverStack.Screen name="Chat" component={ChatScreen} />
    </DiscoverStack.Navigator>
  );
}

const BookingsStack = createNativeStackNavigator<BookingsStackParamList>();
export function BookingsNavigator() {
  return (
    <BookingsStack.Navigator screenOptions={common}>
      <BookingsStack.Screen name="Bookings" component={BookingsScreen} />
      <BookingsStack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <BookingsStack.Screen name="ShopDetail" component={ShopDetailScreen} />
      <BookingsStack.Screen name="Chat" component={ChatScreen} />
    </BookingsStack.Navigator>
  );
}

const ChatStack = createNativeStackNavigator<ChatStackParamList>();
export function ChatNavigator() {
  return (
    <ChatStack.Navigator screenOptions={common}>
      <ChatStack.Screen name="ChatList" component={ChatListScreen} />
      <ChatStack.Screen name="Chat" component={ChatScreen} />
      <ChatStack.Screen name="ShopDetail" component={ShopDetailScreen} />
    </ChatStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
export function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={common}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Vehicles" component={VehiclesScreen} />
      <ProfileStack.Screen name="VehicleEditor" component={VehicleEditorScreen} />
      <ProfileStack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <ProfileStack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
}
