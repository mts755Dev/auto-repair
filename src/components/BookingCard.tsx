import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking, Vehicle } from '@/types';
import { Card } from './Card';
import { Badge } from './Badge';
import { colors, radii, spacing, typography } from '@/theme';
import { findService } from '@/data/services';
import { SHOPS } from '@/data/shops';
import { formatCurrency, formatDateTime } from '@/utils/format';

type Props = {
  booking: Booking;
  vehicle?: Vehicle;
  onPress?: () => void;
};

export const BookingCard: React.FC<Props> = ({ booking, vehicle, onPress }) => {
  const shop = SHOPS.find((s) => s.id === booking.shopId);
  const services = booking.serviceIds.map(findService).filter(Boolean);

  const tone = statusTone(booking.status);

  return (
    <Card onPress={onPress} padded style={styles.card} elevated>
      <View style={styles.topRow}>
        <View style={styles.icon}>
          <Ionicons name="calendar" size={20} color={colors.white} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.m }}>
          <Text style={typography.title} numberOfLines={1}>
            {services.map((s) => s!.title).join(' · ') || 'Service'}
          </Text>
          <Text style={[typography.caption, { marginTop: 2 }]} numberOfLines={1}>
            {shop?.name ?? 'Shop'} · {formatDateTime(booking.scheduledAt)}
          </Text>
        </View>
        <Badge label={labelForStatus(booking.status)} tone={tone} />
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="car-outline" size={14} color={colors.gray500} />
          <Text style={[typography.caption, { marginLeft: 6 }]} numberOfLines={1}>
            {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle'}
          </Text>
        </View>
        <Text style={[typography.captionStrong, { color: colors.ink }]}>
          {formatCurrency(booking.estimatedTotal)}
        </Text>
      </View>
    </Card>
  );
};

function labelForStatus(s: Booking['status']) {
  switch (s) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'in_progress':
      return 'In progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
  }
}

function statusTone(s: Booking['status']) {
  switch (s) {
    case 'pending':
      return 'warning' as const;
    case 'confirmed':
      return 'primary' as const;
    case 'in_progress':
      return 'info' as const;
    case 'completed':
      return 'success' as const;
    case 'cancelled':
      return 'danger' as const;
  }
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.m },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radii.m,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
