import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { ProfileStackParamList } from '@/navigation/types';
import { useAuthStore, useCurrentUser } from '@/store/authStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useBookingStore } from '@/store/bookingStore';
import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Divider } from '@/components/Divider';
import { colors, radii, spacing, typography } from '@/theme';
import { usePaymentStore } from '@/store/paymentStore';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const user = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);
  const vehiclesCount = useVehicleStore((s) =>
    user ? s.getByUser(user.id).length : 0,
  );
  const bookingsCount = useBookingStore((s) =>
    user ? s.getByUser(user.id).length : 0,
  );
  const methodsCount = usePaymentStore((s) =>
    user ? s.getByUser(user.id).length : 0,
  );

  const onLogout = () => {
    Alert.alert('Sign out?', 'You can sign back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray50 }} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.profileHead}>
          <Avatar name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`} size={72} />
          <View style={{ marginLeft: spacing.l, flex: 1 }}>
            <Text style={typography.h2}>
              {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
            </Text>
            <Text style={[typography.caption, { marginTop: 2 }]}>
              {user?.email}
              {user?.phone ? ` · ${user.phone}` : ''}
            </Text>
          </View>
          <Pressable
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
            hitSlop={6}
          >
            <Ionicons name="create-outline" size={18} color={colors.ink} />
          </Pressable>
        </View>

        <View style={styles.stats}>
          <Stat icon="car-sport-outline" label="Vehicles" value={vehiclesCount} />
          <Stat icon="calendar-outline" label="Bookings" value={bookingsCount} />
          <Stat icon="card-outline" label="Cards" value={methodsCount} />
        </View>

        <Card padded={false} style={{ marginTop: spacing.l }}>
          <Row
            icon="car-sport-outline"
            label="My vehicles"
            hint={`${vehiclesCount} saved`}
            onPress={() => navigation.navigate('Vehicles')}
          />
          <Divider inset={60} />
          <Row
            icon="card-outline"
            label="Payment methods"
            hint={`${methodsCount} saved`}
            onPress={() => navigation.navigate('PaymentMethods')}
          />
          <Divider inset={60} />
          <Row
            icon="person-outline"
            label="Edit profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <Divider inset={60} />
          <Row
            icon="settings-outline"
            label="Settings"
            onPress={() => navigation.navigate('Settings')}
          />
        </Card>

        <Card padded={false} style={{ marginTop: spacing.m }}>
          <Row icon="help-circle-outline" label="Help center" onPress={() => {}} />
          <Divider inset={60} />
          <Row icon="document-text-outline" label="Terms & privacy" onPress={() => {}} />
          <Divider inset={60} />
          <Row icon="information-circle-outline" label="About" hint="v1.0.0" onPress={() => {}} />
        </Card>

        <Pressable style={styles.logout} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={[typography.bodyStrong, { color: colors.danger, marginLeft: 8 }]}>
            Sign out
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const Stat: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
}> = ({ icon, label, value }) => (
  <View style={styles.statBox}>
    <View style={styles.statIcon}>
      <Ionicons name={icon} size={18} color={colors.primaryDark} />
    </View>
    <Text style={[typography.h2, { marginTop: spacing.s }]}>{value}</Text>
    <Text style={typography.caption}>{label}</Text>
  </View>
);

const Row: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint?: string;
  onPress?: () => void;
}> = ({ icon, label, hint, onPress }) => (
  <Pressable
    onPress={onPress}
    android_ripple={{ color: colors.gray100 }}
    style={({ pressed }) => [styles.row, pressed ? { opacity: 0.9 } : null]}
  >
    <View style={styles.rowIcon}>
      <Ionicons name={icon} size={18} color={colors.ink} />
    </View>
    <Text style={[typography.bodyStrong, { flex: 1 }]}>{label}</Text>
    {hint ? (
      <Text style={[typography.caption, { marginRight: spacing.s }]}>{hint}</Text>
    ) : null}
    <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
  </Pressable>
);

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
  },
  profileHead: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.l,
    backgroundColor: colors.white,
    borderRadius: radii.l,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.m,
    marginTop: spacing.m,
  },
  statBox: {
    flex: 1,
    padding: spacing.m,
    backgroundColor: colors.white,
    borderRadius: radii.l,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
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
  logout: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.m,
    borderRadius: radii.m,
    borderWidth: 1,
    borderColor: colors.dangerSoft,
    backgroundColor: colors.dangerSoft,
  },
});
