import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { BookingsStackParamList } from '@/navigation/types';
import { useCurrentUser } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { BookingCard } from '@/components/BookingCard';
import { Empty } from '@/components/Empty';
import { Chip } from '@/components/Chip';
import { colors, spacing, typography } from '@/theme';

type Props = NativeStackScreenProps<BookingsStackParamList, 'Bookings'>;

type FilterKey = 'all' | 'upcoming' | 'completed' | 'cancelled';

export default function BookingsScreen({ navigation }: Props) {
  const user = useCurrentUser();
  const bookings = useBookingStore((s) => (user ? s.getByUser(user.id) : []));
  const vehicles = useVehicleStore((s) => (user ? s.getByUser(user.id) : []));
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    switch (filter) {
      case 'upcoming':
        return bookings.filter((b) =>
          ['pending', 'confirmed', 'in_progress'].includes(b.status),
        );
      case 'completed':
        return bookings.filter((b) => b.status === 'completed');
      case 'cancelled':
        return bookings.filter((b) => b.status === 'cancelled');
      case 'all':
      default:
        return bookings;
    }
  }, [bookings, filter]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={typography.h1}>Bookings</Text>
        <Text style={[typography.caption, { marginTop: 4 }]}>
          {bookings.length} total · {bookings.filter((b) => ['confirmed', 'pending', 'in_progress'].includes(b.status)).length} upcoming
        </Text>
      </View>

      <View style={styles.chipsRow}>
        <Chip label="All" selected={filter === 'all'} onPress={() => setFilter('all')} />
        <Chip
          label="Upcoming"
          selected={filter === 'upcoming'}
          onPress={() => setFilter('upcoming')}
        />
        <Chip
          label="Completed"
          selected={filter === 'completed'}
          onPress={() => setFilter('completed')}
        />
        <Chip
          label="Cancelled"
          selected={filter === 'cancelled'}
          onPress={() => setFilter('cancelled')}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            vehicle={vehicles.find((v) => v.id === item.vehicleId)}
            onPress={() => navigation.navigate('BookingDetail', { bookingId: item.id })}
          />
        )}
        ListEmptyComponent={
          <Empty
            icon="calendar-outline"
            title="No bookings yet"
            description="Your upcoming and past bookings will appear here."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.m,
    paddingBottom: spacing.l,
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.m,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
    flexGrow: 1,
  },
});
