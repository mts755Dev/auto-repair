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
import { colors, radii, spacing, typography } from '@/theme';
import { SectionHeader } from '@/components/SectionHeader';
import { ShopCard } from '@/components/ShopCard';
import { BookingCard } from '@/components/BookingCard';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const user = useCurrentUser();
  const vehicles = useVehicleStore((s) => (user ? s.getByUser(user.id) : []));
  const bookings = useBookingStore((s) => (user ? s.getByUser(user.id) : []));
  const unread = useNotificationStore((s) => (user ? s.unreadCount(user.id) : 0));

  const upcomingAll = useMemo(
    () => bookings.filter((b) => ['pending', 'confirmed', 'in_progress'].includes(b.status)),
    [bookings],
  );
  const upcoming = useMemo(() => upcomingAll.slice(0, 2), [upcomingAll]);
  const completedCount = useMemo(
    () => bookings.filter((b) => b.status === 'completed').length,
    [bookings],
  );
  const featured = useMemo(() => [...SHOPS].sort((a, b) => b.rating - a.rating).slice(0, 4), []);
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.huge }}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <Ionicons name="construct" size={18} color={colors.white} />
              </View>
              <View style={{ marginLeft: spacing.s, flex: 1 }}>
                <Text style={styles.welcomeCaption}>{greeting}</Text>
                <Text style={styles.welcomeName} numberOfLines={1}>
                  {user ? user.firstName : 'Welcome'}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => navigation.navigate('Notifications')}
              style={styles.bellBtn}
              hitSlop={8}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.ink} />
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
            <Text
              style={[typography.body, { color: colors.gray700, marginLeft: spacing.s, flex: 1 }]}
              numberOfLines={1}
            >
              Find a service or shop
            </Text>
            <View style={styles.searchBtn}>
              <Ionicons name="options-outline" size={16} color={colors.white} />
            </View>
          </Pressable>

          <View style={styles.heroStats}>
            <HeroStat icon="car-sport-outline" value={vehicles.length} label="Vehicles" />
            <HeroStat icon="calendar-outline" value={upcomingAll.length} label="Upcoming" />
            <HeroStat
              icon="checkmark-done-outline"
              value={completedCount}
              label="Completed"
            />
          </View>
        </View>

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

const HeroStat: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
}> = ({ icon, value, label }) => (
  <View style={styles.heroStatItem}>
    <View style={styles.heroStatIcon}>
      <Ionicons name={icon} size={16} color={colors.primaryDark} />
    </View>
    <Text style={styles.heroStatValue}>{value}</Text>
    <Text style={styles.heroStatLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.s,
    paddingBottom: spacing.l,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.s,
  },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeCaption: {
    color: colors.gray500,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  welcomeName: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginTop: 1,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStats: {
    flexDirection: 'row',
    marginTop: spacing.l,
    gap: spacing.s,
  },
  heroStatItem: {
    flex: 1,
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: radii.l,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.s,
    alignItems: 'flex-start',
  },
  heroStatIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.s,
  },
  heroStatValue: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 22,
  },
  heroStatLabel: {
    color: colors.gray500,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginTop: 2,
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
    borderWidth: 2,
    borderColor: colors.white,
  },
  bellDotText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  searchBar: {
    marginTop: spacing.l,
    backgroundColor: colors.gray50,
    borderRadius: radii.l,
    height: 52,
    paddingLeft: spacing.l,
    paddingRight: spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
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
