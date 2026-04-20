import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

import { HomeStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { colors, radii, spacing, typography } from '@/theme';
import { SERVICES, findService } from '@/data/services';
import { SHOPS } from '@/data/shops';
import { useCurrentUser } from '@/store/authStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useBookingStore } from '@/store/bookingStore';
import { usePaymentStore } from '@/store/paymentStore';
import { useChatStore } from '@/store/chatStore';
import { useNotificationStore } from '@/store/notificationStore';
import { VehicleCard } from '@/components/VehicleCard';
import { ServiceCard } from '@/components/ServiceCard';
import { combineDateTime, formatCurrency } from '@/utils/format';
import { confirmPaymentLocally } from '@/utils/payment';
import { scheduleLocalNotification } from '@/utils/notifications';

type Props = NativeStackScreenProps<HomeStackParamList, 'BookingFlow'>;

type Step = 'services' | 'vehicle' | 'shop' | 'schedule' | 'review';
const STEPS: Step[] = ['services', 'vehicle', 'shop', 'schedule', 'review'];

export default function BookingFlowScreen({ navigation, route }: Props) {
  const user = useCurrentUser();
  const vehicles = useVehicleStore((s) => (user ? s.getByUser(user.id) : []));
  const paymentMethods = usePaymentStore((s) => (user ? s.getByUser(user.id) : []));
  const defaultMethod = paymentMethods.find((m) => m.isDefault) ?? paymentMethods[0];

  const [step, setStep] = useState<Step>(route.params?.serviceIds?.length ? 'vehicle' : 'services');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    route.params?.serviceIds ?? [],
  );
  const [vehicleId, setVehicleId] = useState<string | undefined>(
    vehicles.find((v) => v.isPrimary)?.id ?? vehicles[0]?.id,
  );
  const [shopId, setShopId] = useState<string | undefined>(route.params?.shopId);
  const [date, setDate] = useState<string>(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [time, setTime] = useState<string>('10:00');
  const [notes, setNotes] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const createBooking = useBookingStore((s) => s.createBooking);
  const ensureThread = useChatStore((s) => s.ensureThread);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const pushNotification = useNotificationStore((s) => s.push);

  const selectedServices = useMemo(
    () => selectedServiceIds.map(findService).filter(Boolean) as typeof SERVICES,
    [selectedServiceIds],
  );

  const availableShops = useMemo(() => {
    if (!selectedServices.length) return SHOPS;
    return SHOPS.filter((s) =>
      selectedServices.every((svc) => s.services.includes(svc!.category)),
    );
  }, [selectedServices]);

  const estimatedTotal = selectedServices.reduce((s, svc) => s + (svc?.priceFrom ?? 0), 0);
  const estimatedDuration = selectedServices.reduce(
    (s, svc) => s + (svc?.durationMin ?? 0),
    0,
  );
  const selectedShop = shopId ? SHOPS.find((s) => s.id === shopId) : undefined;
  const selectedVehicle = vehicleId ? vehicles.find((v) => v.id === vehicleId) : undefined;

  const stepIndex = STEPS.indexOf(step);

  const canContinue = (() => {
    switch (step) {
      case 'services':
        return selectedServiceIds.length > 0;
      case 'vehicle':
        return !!vehicleId;
      case 'shop':
        return !!shopId;
      case 'schedule':
        return !!date && !!time;
      case 'review':
        return true;
    }
  })();

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  };
  const goBack = () => {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1]);
    else navigation.goBack();
  };

  const onConfirm = async () => {
    if (!user || !selectedVehicle || !selectedShop) return;

    if (!defaultMethod) {
      Alert.alert('Add a payment method', 'Please add a payment method before booking.', [
        {
          text: 'Add now',
          onPress: () =>
            navigation
              .getParent()
              ?.navigate('ProfileTab', { screen: 'AddPaymentMethod' } as any),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    setProcessing(true);
    const result = await confirmPaymentLocally(estimatedTotal * 100);
    if (!result.ok) {
      setProcessing(false);
      Alert.alert('Payment failed', result.error ?? 'Please try again.');
      return;
    }

    const scheduledAt = combineDateTime(date, time);

    const booking = createBooking({
      userId: user.id,
      vehicleId: selectedVehicle.id,
      shopId: selectedShop.id,
      serviceIds: selectedServiceIds,
      scheduledAt,
      estimatedTotal,
      notes,
      status: 'confirmed',
      paymentStatus: 'authorized',
      paymentMethodLast4: defaultMethod.last4,
      isMobileService: selectedShop.type === 'mobile',
      location: selectedShop.type === 'mobile'
        ? {
            address: 'Your saved address',
            latitude: selectedShop.latitude,
            longitude: selectedShop.longitude,
          }
        : null,
    });

    const thread = ensureThread(user.id, selectedShop.id, booking.id);
    sendMessage(
      thread.id,
      user.id,
      `${user.firstName} ${user.lastName}`,
      `Hi! I just booked ${selectedServices.map((s) => s!.title).join(', ')} for ${dayjs(scheduledAt).format('MMM D, h:mm A')}.`,
    );

    pushNotification(user.id, {
      title: 'Booking confirmed',
      body: `${selectedShop.name} confirmed your appointment on ${dayjs(scheduledAt).format('MMM D, h:mm A')}.`,
      type: 'booking',
      referenceId: booking.id,
    });

    await scheduleLocalNotification(
      'Booking confirmed',
      `${selectedShop.name} · ${dayjs(scheduledAt).format('MMM D, h:mm A')}`,
      { bookingId: booking.id },
    );

    setProcessing(false);
    navigation.replace('BookingDetail', { bookingId: booking.id });
  };

  return (
    <Screen background={colors.white}>
      <Header title="Book service" onBack={goBack} />
      <View style={styles.stepper}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepWrap}>
            <View
              style={[
                styles.stepDot,
                i <= stepIndex ? styles.stepDotActive : null,
              ]}
            >
              {i < stepIndex ? (
                <Ionicons name="checkmark" size={12} color={colors.white} />
              ) : (
                <Text style={[styles.stepDotText, i <= stepIndex && { color: colors.white }]}>
                  {i + 1}
                </Text>
              )}
            </View>
            {i < STEPS.length - 1 ? (
              <View style={[styles.stepLine, i < stepIndex ? styles.stepLineActive : null]} />
            ) : null}
          </View>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {step === 'services' && (
          <ServicesStep
            selected={selectedServiceIds}
            onToggle={(id) =>
              setSelectedServiceIds((prev) =>
                prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
              )
            }
          />
        )}

        {step === 'vehicle' && (
          <VehicleStep
            vehicles={vehicles}
            selected={vehicleId}
            onSelect={setVehicleId}
            onAdd={() =>
              navigation
                .getParent()
                ?.navigate('ProfileTab', { screen: 'VehicleEditor' } as any)
            }
          />
        )}

        {step === 'shop' && (
          <ShopStep
            shops={availableShops}
            selected={shopId}
            onSelect={setShopId}
          />
        )}

        {step === 'schedule' && (
          <ScheduleStep
            date={date}
            time={time}
            onChange={(d, t) => {
              setDate(d);
              setTime(t);
            }}
            notes={notes}
            onNotes={setNotes}
          />
        )}

        {step === 'review' && (
          <ReviewStep
            services={selectedServices as any}
            vehicle={selectedVehicle}
            shop={selectedShop}
            date={date}
            time={time}
            notes={notes}
            paymentLast4={defaultMethod?.last4}
            estimatedDuration={estimatedDuration}
            estimatedTotal={estimatedTotal}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step !== 'review' ? (
          <>
            <View>
              <Text style={[typography.caption, { color: colors.gray500 }]}>
                {step === 'services' ? 'Selected' : 'Estimated total'}
              </Text>
              <Text style={typography.h2}>
                {step === 'services'
                  ? `${selectedServices.length} service${selectedServices.length === 1 ? '' : 's'}`
                  : formatCurrency(estimatedTotal)}
              </Text>
            </View>
            <Button
              title="Continue"
              rightIcon="arrow-forward"
              disabled={!canContinue}
              fullWidth={false}
              onPress={goNext}
            />
          </>
        ) : (
          <>
            <View style={{ flex: 1 }}>
              <Text style={[typography.caption, { color: colors.gray500 }]}>Total</Text>
              <Text style={typography.h2}>{formatCurrency(estimatedTotal)}</Text>
            </View>
            <Button
              title="Confirm & pay"
              loading={processing}
              fullWidth={false}
              onPress={onConfirm}
              rightIcon="lock-closed"
            />
          </>
        )}
      </View>
    </Screen>
  );
}

const ServicesStep: React.FC<{
  selected: string[];
  onToggle: (id: string) => void;
}> = ({ selected, onToggle }) => (
  <View>
    <Text style={typography.h2}>Pick one or more services</Text>
    <Text style={[typography.body, { color: colors.gray700, marginTop: spacing.xs }]}>
      Add everything you need in one visit.
    </Text>
    <View style={{ marginTop: spacing.l }}>
      {SERVICES.map((s) => (
        <ServiceCard
          key={s.id}
          service={s}
          showSelect
          selected={selected.includes(s.id)}
          onPress={() => onToggle(s.id)}
        />
      ))}
    </View>
  </View>
);

const VehicleStep: React.FC<{
  vehicles: any[];
  selected?: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}> = ({ vehicles, selected, onSelect, onAdd }) => (
  <View>
    <Text style={typography.h2}>Choose your vehicle</Text>
    <Text style={[typography.body, { color: colors.gray700, marginTop: spacing.xs }]}>
      We'll match you with compatible mechanics.
    </Text>
    <View style={{ marginTop: spacing.l }}>
      {vehicles.length === 0 ? (
        <Card padded style={{ alignItems: 'center' }}>
          <View style={styles.emptyIcon}>
            <Ionicons name="car-sport-outline" size={22} color={colors.primaryDark} />
          </View>
          <Text style={[typography.h3, { marginTop: spacing.m }]}>No vehicles yet</Text>
          <Text style={[typography.caption, { textAlign: 'center', marginTop: 4 }]}>
            Add one to continue with your booking.
          </Text>
          <Button title="Add vehicle" onPress={onAdd} style={{ marginTop: spacing.l }} fullWidth={false} />
        </Card>
      ) : (
        <>
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              selectable
              selected={selected === v.id}
              onPress={() => onSelect(v.id)}
            />
          ))}
          <Pressable onPress={onAdd} style={styles.addRow}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={[typography.bodyStrong, { color: colors.primary, marginLeft: 6 }]}>
              Add another vehicle
            </Text>
          </Pressable>
        </>
      )}
    </View>
  </View>
);

const ShopStep: React.FC<{
  shops: any[];
  selected?: string;
  onSelect: (id: string) => void;
}> = ({ shops, selected, onSelect }) => (
  <View>
    <Text style={typography.h2}>Choose a shop</Text>
    <Text style={[typography.body, { color: colors.gray700, marginTop: spacing.xs }]}>
      Select a trusted shop or mobile mechanic near you.
    </Text>
    <View style={{ marginTop: spacing.l }}>
      {shops.map((shop) => (
        <Pressable
          key={shop.id}
          onPress={() => onSelect(shop.id)}
          style={[
            styles.shopRow,
            selected === shop.id ? { borderColor: colors.primary, borderWidth: 1.5 } : null,
          ]}
        >
          <View style={styles.shopMark}>
            <Text style={styles.shopMarkText}>{shop.name.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: spacing.m }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={typography.title} numberOfLines={1}>
                {shop.name}
              </Text>
              {shop.type === 'mobile' ? (
                <Badge label="Mobile" tone="dark" style={{ marginLeft: spacing.s }} />
              ) : null}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Ionicons name="star" size={12} color={colors.primary} />
              <Text style={[typography.caption, { marginLeft: 4 }]}>
                {shop.rating.toFixed(1)} · {shop.city}, {shop.state}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.check,
              selected === shop.id ? { backgroundColor: colors.primary, borderColor: colors.primary } : null,
            ]}
          >
            {selected === shop.id ? (
              <Ionicons name="checkmark" size={14} color={colors.white} />
            ) : null}
          </View>
        </Pressable>
      ))}
    </View>
  </View>
);

const TIMES = ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00', '17:30'];

const ScheduleStep: React.FC<{
  date: string;
  time: string;
  notes: string;
  onChange: (d: string, t: string) => void;
  onNotes: (v: string) => void;
}> = ({ date, time, notes, onChange, onNotes }) => {
  const days = Array.from({ length: 14 }).map((_, i) => dayjs().add(i, 'day'));

  return (
    <View>
      <Text style={typography.h2}>When works for you?</Text>
      <Text style={[typography.body, { color: colors.gray700, marginTop: spacing.xs }]}>
        Pick a date and time. You can reschedule anytime.
      </Text>

      <Text style={[typography.overline, { marginTop: spacing.xl }]}>Select date</Text>
      <FlatList
        horizontal
        data={days}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: spacing.m, gap: spacing.s }}
        keyExtractor={(d) => d.format('YYYY-MM-DD')}
        renderItem={({ item }) => {
          const iso = item.format('YYYY-MM-DD');
          const active = date === iso;
          return (
            <Pressable
              onPress={() => onChange(iso, time)}
              style={[styles.dayCard, active ? styles.dayCardActive : null]}
            >
              <Text style={[typography.overline, { color: active ? colors.white : colors.gray500 }]}>
                {item.format('ddd')}
              </Text>
              <Text
                style={[
                  typography.h2,
                  { color: active ? colors.white : colors.ink, marginTop: 2 },
                ]}
              >
                {item.format('D')}
              </Text>
              <Text
                style={[
                  typography.caption,
                  { color: active ? colors.white : colors.gray500 },
                ]}
              >
                {item.format('MMM')}
              </Text>
            </Pressable>
          );
        }}
      />

      <Text style={[typography.overline, { marginTop: spacing.l }]}>Available times</Text>
      <View style={styles.timeGrid}>
        {TIMES.map((t) => {
          const active = t === time;
          return (
            <Pressable
              key={t}
              onPress={() => onChange(date, t)}
              style={[styles.timePill, active ? styles.timePillActive : null]}
            >
              <Text
                style={[
                  typography.captionStrong,
                  { color: active ? colors.white : colors.ink },
                ]}
              >
                {dayjs(`2000-01-01 ${t}`).format('h:mm A')}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[typography.overline, { marginTop: spacing.xl }]}>Notes for the shop</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Describe the issue or any special requests"
        placeholderTextColor={colors.gray400}
        multiline
        value={notes}
        onChangeText={onNotes}
      />
    </View>
  );
};

const ReviewStep: React.FC<{
  services: Array<{ id: string; title: string; priceFrom: number; durationMin: number }>;
  vehicle?: any;
  shop?: any;
  date: string;
  time: string;
  notes: string;
  paymentLast4?: string;
  estimatedDuration: number;
  estimatedTotal: number;
}> = ({ services, vehicle, shop, date, time, notes, paymentLast4, estimatedDuration, estimatedTotal }) => (
  <View>
    <Text style={typography.h2}>Review & confirm</Text>
    <Text style={[typography.body, { color: colors.gray700, marginTop: spacing.xs }]}>
      You'll only be charged when the service is completed.
    </Text>

    <Card padded style={{ marginTop: spacing.l }}>
      <Text style={typography.overline}>Services</Text>
      <View style={{ marginTop: spacing.s }}>
        {services.map((s, i) => (
          <View
            key={s.id}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: spacing.s,
              borderBottomWidth: i === services.length - 1 ? 0 : 1,
              borderBottomColor: colors.divider,
            }}
          >
            <Text style={typography.bodyStrong}>{s.title}</Text>
            <Text style={typography.bodyStrong}>{formatCurrency(s.priceFrom)}</Text>
          </View>
        ))}
      </View>
    </Card>

    <Card padded style={{ marginTop: spacing.m }}>
      <ReviewRow
        icon="car-sport-outline"
        label="Vehicle"
        value={
          vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Not selected'
        }
      />
      <ReviewRow
        icon="business-outline"
        label="Shop"
        value={shop ? `${shop.name} · ${shop.city}, ${shop.state}` : 'Not selected'}
      />
      <ReviewRow
        icon="calendar-outline"
        label="Date & time"
        value={dayjs(combineDateTime(date, time)).format('ddd, MMM D · h:mm A')}
      />
      <ReviewRow
        icon="hourglass-outline"
        label="Estimated duration"
        value={`~ ${Math.round(estimatedDuration / 15) * 15} minutes`}
      />
      {notes ? <ReviewRow icon="document-text-outline" label="Notes" value={notes} last /> : null}
    </Card>

    <Card padded style={{ marginTop: spacing.m }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.payIcon}>
          <Ionicons name="card-outline" size={18} color={colors.white} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.m }}>
          <Text style={typography.overline}>Payment method</Text>
          <Text style={typography.title}>
            {paymentLast4 ? `Card ending in ${paymentLast4}` : 'No card on file'}
          </Text>
          <Text style={typography.caption}>Payments are secured by Stripe</Text>
        </View>
      </View>
    </Card>

    <Card padded style={{ marginTop: spacing.m }}>
      <View style={styles.totalRow}>
        <Text style={typography.body}>Subtotal</Text>
        <Text style={typography.body}>{formatCurrency(estimatedTotal)}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={typography.body}>Platform fee</Text>
        <Text style={typography.body}>Included</Text>
      </View>
      <View style={[styles.totalRow, { marginTop: spacing.s }]}>
        <Text style={typography.title}>Estimated total</Text>
        <Text style={typography.h3}>{formatCurrency(estimatedTotal)}</Text>
      </View>
    </Card>
  </View>
);

const ReviewRow: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}> = ({ icon, label, value, last }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
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
      <Text style={[typography.bodyStrong, { marginTop: 2 }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
  },
  stepWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray500,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.gray200,
    marginHorizontal: 6,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.m,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.gray300,
    borderRadius: radii.m,
    marginTop: spacing.s,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderRadius: radii.m,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: spacing.s,
  },
  shopMark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopMarkText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCard: {
    width: 64,
    height: 80,
    borderRadius: radii.m,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  dayCardActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
    marginTop: spacing.m,
  },
  timePill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
  },
  timePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  notesInput: {
    minHeight: 96,
    borderRadius: radii.m,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: spacing.m,
    textAlignVertical: 'top',
    marginTop: spacing.s,
    color: colors.ink,
    fontSize: 15,
  },
  payIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.m,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
