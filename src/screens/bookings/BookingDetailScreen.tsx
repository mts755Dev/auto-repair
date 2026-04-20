import React from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

import { BookingsStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { useBookingStore } from '@/store/bookingStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { SHOPS } from '@/data/shops';
import { findService } from '@/data/services';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { colors, radii, spacing, typography } from '@/theme';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { useChatStore } from '@/store/chatStore';
import { useCurrentUser } from '@/store/authStore';

type Props = NativeStackScreenProps<BookingsStackParamList, 'BookingDetail'>;

export default function BookingDetailScreen({ navigation, route }: Props) {
  const user = useCurrentUser();
  const booking = useBookingStore((s) => s.getById(route.params.bookingId));
  const cancel = useBookingStore((s) => s.cancelBooking);
  const vehicle = useVehicleStore((s) =>
    booking ? s.getById(booking.vehicleId) : undefined,
  );
  const ensureThread = useChatStore((s) => s.ensureThread);

  if (!booking) {
    return (
      <Screen>
        <Header title="Booking" />
        <View style={styles.center}>
          <Text style={typography.body}>Booking not found.</Text>
        </View>
      </Screen>
    );
  }
  const shop = SHOPS.find((s) => s.id === booking.shopId);
  const services = booking.serviceIds.map(findService).filter(Boolean);

  const STATUSES = ['confirmed', 'in_progress', 'completed'] as const;
  const activeIndex = booking.status === 'completed'
    ? 2
    : booking.status === 'in_progress'
      ? 1
      : booking.status === 'confirmed' || booking.status === 'pending'
        ? 0
        : -1;

  const onCancel = () => {
    Alert.alert(
      'Cancel booking?',
      'You can rebook later. Refunds (if any) are issued to your original payment method.',
      [
        { text: 'Keep booking', style: 'cancel' },
        {
          text: 'Cancel booking',
          style: 'destructive',
          onPress: () => cancel(booking.id),
        },
      ],
    );
  };

  const openChat = () => {
    if (!user || !shop) return;
    const thread = ensureThread(user.id, shop.id, booking.id);
    (navigation as any).navigate('Chat', { threadId: thread.id });
  };

  return (
    <Screen background={colors.gray50}>
      <Header title="Booking details" />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 140 }}>
        <Card padded elevated>
          <View style={styles.topRow}>
            <View>
              <Text style={typography.overline}>Booking ID</Text>
              <Text style={[typography.bodyStrong, { marginTop: 2 }]}>
                {booking.id.toUpperCase().slice(-10)}
              </Text>
            </View>
            <Badge
              label={statusLabel(booking.status)}
              tone={statusTone(booking.status)}
            />
          </View>
          <Text style={[typography.h2, { marginTop: spacing.l }]}>
            {services.map((s) => s!.title).join(' · ')}
          </Text>
          <Text style={[typography.body, { marginTop: spacing.xs, color: colors.gray700 }]}>
            {shop?.name} · {shop?.city}, {shop?.state}
          </Text>

          {booking.status !== 'cancelled' ? (
            <View style={styles.track}>
              {STATUSES.map((st, i) => {
                const reached = i <= activeIndex;
                return (
                  <View key={st} style={{ flex: 1 }}>
                    <View style={styles.trackRow}>
                      <View
                        style={[
                          styles.trackDot,
                          reached ? styles.trackDotActive : null,
                        ]}
                      >
                        {reached ? (
                          <Ionicons name="checkmark" size={12} color={colors.white} />
                        ) : null}
                      </View>
                      {i < STATUSES.length - 1 ? (
                        <View
                          style={[
                            styles.trackLine,
                            i < activeIndex ? styles.trackLineActive : null,
                          ]}
                        />
                      ) : null}
                    </View>
                    <Text
                      style={[
                        typography.caption,
                        { marginTop: 6 },
                        reached ? { color: colors.ink, fontWeight: '700' } : null,
                      ]}
                    >
                      {statusLabel(st)}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : null}
        </Card>

        <Card padded style={{ marginTop: spacing.m }}>
          <InfoRow
            icon="calendar-outline"
            label="Scheduled for"
            value={formatDateTime(booking.scheduledAt)}
          />
          <InfoRow
            icon="car-sport-outline"
            label="Vehicle"
            value={
              vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown'
            }
          />
          <InfoRow
            icon={booking.isMobileService ? 'car-outline' : 'business-outline'}
            label={booking.isMobileService ? 'Service location' : 'Shop location'}
            value={
              booking.isMobileService && booking.location
                ? booking.location.address
                : `${shop?.address}, ${shop?.city}, ${shop?.state}`
            }
            last={!booking.notes}
          />
          {booking.notes ? (
            <InfoRow
              icon="document-text-outline"
              label="Notes"
              value={booking.notes}
              last
            />
          ) : null}
        </Card>

        <Card padded style={{ marginTop: spacing.m }}>
          <Text style={typography.overline}>Services</Text>
          <View style={{ marginTop: spacing.s }}>
            {services.map((s, i) => (
              <View
                key={s!.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: spacing.m,
                  borderBottomWidth: i === services.length - 1 ? 0 : 1,
                  borderBottomColor: colors.divider,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={styles.sIcon}>
                    <Ionicons name={s!.icon as any} size={16} color={colors.primaryDark} />
                  </View>
                  <Text style={[typography.bodyStrong, { marginLeft: spacing.m, flex: 1 }]}>
                    {s!.title}
                  </Text>
                </View>
                <Text style={typography.bodyStrong}>{formatCurrency(s!.priceFrom)}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card padded style={{ marginTop: spacing.m }}>
          <View style={styles.payRow}>
            <Text style={typography.body}>Estimated total</Text>
            <Text style={typography.h3}>{formatCurrency(booking.estimatedTotal)}</Text>
          </View>
          <View style={[styles.payRow, { marginTop: 4 }]}>
            <Text style={typography.caption}>
              {booking.paymentMethodLast4
                ? `Card ending in ${booking.paymentMethodLast4}`
                : 'No payment method'}
            </Text>
            <Badge
              label={
                booking.paymentStatus === 'paid'
                  ? 'Paid'
                  : booking.paymentStatus === 'authorized'
                    ? 'Authorized'
                    : booking.paymentStatus === 'refunded'
                      ? 'Refunded'
                      : 'Unpaid'
              }
              tone={
                booking.paymentStatus === 'paid' || booking.paymentStatus === 'authorized'
                  ? 'success'
                  : booking.paymentStatus === 'refunded'
                    ? 'info'
                    : 'warning'
              }
            />
          </View>
        </Card>

        <Card padded style={{ marginTop: spacing.m }}>
          <Text style={typography.overline}>Contact shop</Text>
          <View style={styles.contactRow}>
            <Pressable
              style={styles.contactBtn}
              onPress={() => shop && Linking.openURL(`tel:${shop.phone}`)}
            >
              <Ionicons name="call-outline" size={18} color={colors.ink} />
              <Text style={[typography.captionStrong, { marginTop: 6 }]}>Call</Text>
            </Pressable>
            <Pressable style={styles.contactBtn} onPress={openChat}>
              <Ionicons name="chatbubble-outline" size={18} color={colors.ink} />
              <Text style={[typography.captionStrong, { marginTop: 6 }]}>Chat</Text>
            </Pressable>
            <Pressable
              style={styles.contactBtn}
              onPress={() =>
                shop &&
                Linking.openURL(
                  `https://maps.google.com/?q=${shop.latitude},${shop.longitude}`,
                )
              }
            >
              <Ionicons name="navigate-outline" size={18} color={colors.ink} />
              <Text style={[typography.captionStrong, { marginTop: 6 }]}>Directions</Text>
            </Pressable>
          </View>
        </Card>

        {booking.status !== 'cancelled' && booking.status !== 'completed' ? (
          <Button
            title="Cancel booking"
            variant="secondary"
            leftIcon="close-circle-outline"
            onPress={onCancel}
            style={{ marginTop: spacing.xl }}
          />
        ) : null}

        <View style={{ height: spacing.m }} />
        <Text style={[typography.caption, { textAlign: 'center', color: colors.gray500 }]}>
          Booked on {dayjs(booking.createdAt).format('MMM D, YYYY · h:mm A')}
        </Text>
      </ScrollView>
    </Screen>
  );
}

function statusLabel(s: string) {
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
    default:
      return s;
  }
}

function statusTone(s: string) {
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
    default:
      return 'neutral' as const;
  }
}

const InfoRow: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}> = ({ icon, label, value, last }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: spacing.m,
      borderBottomWidth: last ? 0 : 1,
      borderBottomColor: colors.divider,
    }}
  >
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={icon} size={16} color={colors.ink} />
    </View>
    <View style={{ flex: 1, marginLeft: spacing.m }}>
      <Text style={[typography.caption, { color: colors.gray500 }]}>{label}</Text>
      <Text style={[typography.bodyStrong, { marginTop: 2 }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  track: {
    flexDirection: 'row',
    marginTop: spacing.l,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackDotActive: {
    backgroundColor: colors.primary,
  },
  trackLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.gray200,
    marginHorizontal: 6,
  },
  trackLineActive: {
    backgroundColor: colors.primary,
  },
  sIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    marginTop: spacing.m,
    justifyContent: 'space-between',
  },
  contactBtn: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: radii.m,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.m,
    alignItems: 'center',
  },
});
