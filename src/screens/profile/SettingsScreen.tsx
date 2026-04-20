import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { ProfileStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Divider } from '@/components/Divider';
import { colors, radii, spacing, typography } from '@/theme';
import { useAuthStore, useCurrentUser } from '@/store/authStore';
import {
  registerForPushNotificationsAsync,
  scheduleLocalNotification,
} from '@/utils/notifications';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const user = useCurrentUser();
  const update = useAuthStore((s) => s.updateCurrentUser);
  const setPushToken = useAuthStore((s) => s.setPushToken);

  const [emailUpdates, setEmailUpdates] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const enabled = user?.notificationsEnabled ?? true;

  const togglePush = async (v: boolean) => {
    update({ notificationsEnabled: v });
    if (v) {
      const token = await registerForPushNotificationsAsync();
      setPushToken(token);
      if (token) {
        scheduleLocalNotification('Notifications enabled', 'We will keep you posted about your bookings.');
      } else {
        Alert.alert(
          'Permission needed',
          'Enable notifications in your system settings to receive booking updates.',
        );
      }
    } else {
      setPushToken(null);
    }
  };

  return (
    <Screen background={colors.gray50}>
      <Header title="Settings" />
      <View style={styles.content}>
        <Card padded={false}>
          <SettingRow
            icon="notifications-outline"
            label="Push notifications"
            description="Booking updates, messages, and alerts"
            value={enabled}
            onValueChange={togglePush}
          />
          <Divider inset={60} />
          <SettingRow
            icon="mail-outline"
            label="Email updates"
            description="Receipts and booking summaries"
            value={emailUpdates}
            onValueChange={setEmailUpdates}
          />
          <Divider inset={60} />
          <SettingRow
            icon="chatbubble-outline"
            label="SMS updates"
            description="Short text reminders on your phone"
            value={smsUpdates}
            onValueChange={setSmsUpdates}
          />
          <Divider inset={60} />
          <SettingRow
            icon="megaphone-outline"
            label="Marketing offers"
            description="Occasional promos from partner shops"
            value={marketing}
            onValueChange={setMarketing}
          />
        </Card>

        <Text style={styles.sectionLabel}>About</Text>
        <Card padded={false}>
          <SettingStatic icon="shield-checkmark-outline" label="Privacy policy" />
          <Divider inset={60} />
          <SettingStatic icon="document-text-outline" label="Terms of service" />
          <Divider inset={60} />
          <SettingStatic icon="information-circle-outline" label="App version" value="1.0.0" />
        </Card>
      </View>
    </Screen>
  );
}

const SettingRow: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}> = ({ icon, label, description, value, onValueChange }) => (
  <View style={styles.row}>
    <View style={styles.rowIcon}>
      <Ionicons name={icon} size={18} color={colors.ink} />
    </View>
    <View style={{ flex: 1, marginRight: spacing.s }}>
      <Text style={typography.bodyStrong}>{label}</Text>
      {description ? <Text style={typography.caption}>{description}</Text> : null}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ true: colors.primary, false: colors.gray300 }}
      thumbColor={colors.white}
    />
  </View>
);

const SettingStatic: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
}> = ({ icon, label, value }) => (
  <View style={styles.row}>
    <View style={styles.rowIcon}>
      <Ionicons name={icon} size={18} color={colors.ink} />
    </View>
    <Text style={[typography.bodyStrong, { flex: 1 }]}>{label}</Text>
    {value ? <Text style={typography.caption}>{value}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
  },
  sectionLabel: {
    ...typography.overline,
    marginTop: spacing.xl,
    marginBottom: spacing.s,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
});
