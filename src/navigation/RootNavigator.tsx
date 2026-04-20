import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import MainTabs from './MainTabs';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme';
import { registerForPushNotificationsAsync } from '@/utils/notifications';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
    card: colors.white,
    primary: colors.primary,
    text: colors.ink,
    border: colors.border,
  },
};

export default function RootNavigator() {
  const userId = useAuthStore((s) => s.currentUserId);
  const setPushToken = useAuthStore((s) => s.setPushToken);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const token = await registerForPushNotificationsAsync();
      setPushToken(token);
    })();
  }, [userId]);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {userId ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
