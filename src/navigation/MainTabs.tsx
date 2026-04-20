import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { MainTabParamList } from './types';
import {
  BookingsNavigator,
  ChatNavigator,
  DiscoverNavigator,
  HomeNavigator,
  ProfileNavigator,
} from './stacks';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { colors, typography } from '@/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<
  keyof MainTabParamList,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap; label: string }
> = {
  HomeTab: { active: 'home', inactive: 'home-outline', label: 'Home' },
  DiscoverTab: { active: 'map', inactive: 'map-outline', label: 'Discover' },
  BookingsTab: { active: 'calendar', inactive: 'calendar-outline', label: 'Bookings' },
  ChatTab: { active: 'chatbubbles', inactive: 'chatbubbles-outline', label: 'Chat' },
  ProfileTab: { active: 'person', inactive: 'person-outline', label: 'Profile' },
};

export default function MainTabs() {
  const userId = useAuthStore((s) => s.currentUserId);
  const unread = useChatStore((s) => (userId ? s.totalUnread(userId) : 0));

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.bar,
        tabBarItemStyle: { paddingVertical: 4 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        tabBarIcon: ({ focused, color }) => {
          const def = ICONS[route.name as keyof MainTabParamList];
          const name = focused ? def.active : def.inactive;
          const showBadge = route.name === 'ChatTab' && unread > 0;
          return (
            <View>
              <Ionicons name={name} size={22} color={color} />
              {showBadge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
                </View>
              ) : null}
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={{
              ...typography.caption,
              color,
              fontWeight: focused ? '700' : '500',
              marginBottom: Platform.OS === 'ios' ? 0 : 2,
            }}
          >
            {ICONS[route.name as keyof MainTabParamList].label}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeNavigator} />
      <Tab.Screen name="DiscoverTab" component={DiscoverNavigator} />
      <Tab.Screen name="BookingsTab" component={BookingsNavigator} />
      <Tab.Screen name="ChatTab" component={ChatNavigator} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: Platform.OS === 'ios' ? 84 : 68,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.white,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -4,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
});
