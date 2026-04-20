import React, { useMemo } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { HomeStackParamList } from '@/navigation/types';
import { useCurrentUser } from '@/store/authStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useBookingStore } from '@/store/bookingStore';
import { useNotificationStore } from '@/store/notificationStore';
import { SERVICES } from '@/data/services';
import { SHOPS } from '@/data/shops';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import { IconTile } from '@/components/IconTile';
import { SectionHeader } from '@/components/SectionHeader';
import { ShopCard } from '@/components/ShopCard';
import { BookingCard } from '@/components/BookingCard';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const QUICK_ACTIONS: Array<{
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  serviceId?: string;
}> = [
  { key: 'oil', label: 'Oil change', icon: 'color-fill-outline', serviceId: 'svc_oil' },
  { key: 'brakes', label: 'Brakes', icon: 'disc-outline', serviceId: 'svc_brakes' },
  { key: 'tires', label: 'Tires', icon: 'ellipse-outline', serviceId: 'svc_tires' },
  { key: 'diag', label: 'Diagnostics', icon: 'pulse-outline', serviceId: 'svc_diag' },
];

export default function HomeScreen({ navigation }: Props) {
  const user = useCurrentUser();
  const vehicles = useVehicleStore((s) => (user ? s.getByUser(user.id) : []));
  const bookings = useBookingStore((s) => (user ? s.getByUser(user.id) : []));
  const unread = useNotificationStore((s) => (user ? s.unreadCount(user.id) : 0));

  const upcoming = useMemo(
    () =>
      bookings
        .filter((b) => ['pending', 'confirmed', 'in_progress'].includes(b.status))
        .slice(0, 2),
    [bookings],
  );
  const featured = useMemo(() => [...SHOPS].sort((a, b) => b.rating - a.rating).slice(0, 4), []);
  const primaryVehicle = vehicles.find((v) => v.isPrimary) ?? vehicles[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={['top']}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.huge }}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={[typography.caption, { color: 'rgba(255,255,255,0.7)' }]}>
                Welcome back
              </Text>
              <Text style={[typography.h1, { color: colors.white, marginTop: 2 }]}>
                {user ? `Hi, ${user.firstName}` : 'Hello'}
              </Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate('Notifications')}
              style={styles.bellBtn}
              hitSlop={8}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.white} />
              {unread > 0 ? (
                <View style={styles.bellDot}>
                  <Text style={styles.bellDotText}>{unread > 9 ? '9+' : unread}</Text>
                </View>
              ) : null}
            </Pressable>
          </View>

          <Pressable
            onPress={() => navigation.navigate('Services')}
            style={styles.searchBar}
          >
            <Ionicons name="search-outline" size={18} color={colors.gray500} />
            <Text style={[typography.body, { color: colors.gray500, marginLeft: spacing.s, flex: 1 }]}>
              Find a service or shop
            </Text>
            <View style={styles.searchBtn}>
              <Ionicons name="options-outline" size={16} color={colors.white} />
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Quick book"
            action="See all"
            onAction={() => navigation.navigate('Services')}
          />
          <View style={{ flexDirection: 'row', gap: spacing.m }}>
            {QUICK_ACTIONS.map((q, i) => (
              <IconTile
                key={q.key}
                icon={q.icon}
                label={q.label}
                tone={i === 0 ? 'primary' : i === 1 ? 'dark' : 'neutral'}
                onPress={() =>
                  q.serviceId
                    ? navigation.navigate('BookingFlow', { serviceIds: [q.serviceId] })
                    : navigation.navigate('Services')
                }
              />
            ))}
          </View>
        </View>

        {primaryVehicle ? (
          <View style={styles.section}>
            <SectionHeader title="Your vehicle" />
            <Card padded elevated>
              <View style={styles.vehicleRow}>
                <View style={styles.vehicleIcon}>
                  <Ionicons name="car-sport" size={22} color={colors.white} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.m }}>
                  <Text style={typography.title}>
                    {primaryVehicle.year} {primaryVehicle.make} {primaryVehicle.model}
                  </Text>
                  <Text style={[typography.caption, { marginTop: 2 }]}>
                    {primaryVehicle.licensePlate
                      ? `Plate ${primaryVehicle.licensePlate}`
                      : 'Primary vehicle'}
                    {typeof primaryVehicle.mileage === 'number'
                      ? ` · ${primaryVehicle.mileage.toLocaleString()} mi`
                      : ''}
                  </Text>
                </View>
                <Button
                  title="Book service"
                  size="sm"
                  fullWidth={false}
                  onPress={() => navigation.navigate('BookingFlow')}
                />
              </View>
            </Card>
          </View>
        ) : (
          <View style={styles.section}>
            <Card padded elevated>
              <View style={styles.vehicleRow}>
                <View style={[styles.vehicleIcon, { backgroundColor: colors.primary }]}>
                  <Ionicons name="add" size={22} color={colors.white} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.m }}>
                  <Text style={typography.title}>Add your vehicle</Text>
                  <Text style={[typography.caption, { marginTop: 2 }]}>
                    Save your car details for faster bookings.
                  </Text>
                </View>
                <Button
                  title="Add"
                  size="sm"
                  fullWidth={false}
                  onPress={() =>
                    navigation
                      .getParent()
                      ?.navigate('ProfileTab', { screen: 'VehicleEditor' } as any)
                  }
                />
              </View>
            </Card>
          </View>
        )}

        {upcoming.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader
              title="Upcoming bookings"
              action="View all"
              onAction={() =>
                navigation.getParent()?.navigate('BookingsTab' as never)
              }
            />
            {upcoming.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                vehicle={vehicles.find((v) => v.id === b.vehicleId)}
                onPress={() => navigation.navigate('BookingDetail', { bookingId: b.id })}
              />
            ))}
          </View>
        ) : null}

        <View style={styles.section}>
          <SectionHeader
            title="Popular services"
            action="Browse"
            onAction={() => navigation.navigate('Services')}
          />
          <FlatList
            data={SERVICES.slice(0, 6)}
            keyExtractor={(s) => s.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: spacing.m }} />}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => navigation.navigate('BookingFlow', { serviceIds: [item.id] })}
                style={styles.servicePill}
              >
                <View style={styles.servicePillIcon}>
                  <Ionicons name={item.icon as any} size={22} color={colors.primaryDark} />
                </View>
                <Text style={[typography.captionStrong, { marginTop: spacing.s, color: colors.ink }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[typography.caption, { color: colors.gray500 }]} numberOfLines={1}>
                  from ${item.priceFrom}
                </Text>
              </Pressable>
            )}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Top rated shops"
            action="Map view"
            onAction={() =>
              navigation.getParent()?.navigate('DiscoverTab' as never)
            }
          />
          {featured.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onPress={() => navigation.navigate('ShopDetail', { shopId: shop.id })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.black,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.m,
    paddingBottom: 28,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.primary,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDotText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  searchBar: {
    marginTop: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: radii.m,
    height: 52,
    paddingHorizontal: spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    ...(shadows.md as any),
  },
  searchBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.m,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servicePill: {
    width: 128,
    padding: spacing.m,
    borderRadius: radii.l,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'flex-start',
  },
  servicePillIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
