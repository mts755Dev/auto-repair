import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from '@/navigation/RootNavigator';
import { useAuthStore } from '@/store/authStore';
import { colors, typography } from '@/theme';

export default function App() {
  const hydrated = useAuthStore((s) => s.hydrated);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {hydrated ? (
          <RootNavigator />
        ) : (
          <View style={styles.loading}>
            <View style={styles.logo} />
            <Text style={[typography.title, { marginTop: 16 }]}>AutoRepair</Text>
          </View>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
});
