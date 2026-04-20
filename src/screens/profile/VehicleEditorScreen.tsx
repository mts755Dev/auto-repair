import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { ProfileStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useCurrentUser } from '@/store/authStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { CAR_MAKES } from '@/data/carMakes';
import { colors, radii, spacing, typography } from '@/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'VehicleEditor'>;

export default function VehicleEditorScreen({ navigation, route }: Props) {
  const user = useCurrentUser();
  const existing = useVehicleStore((s) =>
    route.params?.vehicleId ? s.getById(route.params.vehicleId) : undefined,
  );
  const addVehicle = useVehicleStore((s) => s.addVehicle);
  const updateVehicle = useVehicleStore((s) => s.updateVehicle);

  const [nickname, setNickname] = useState(existing?.nickname ?? '');
  const [make, setMake] = useState(existing?.make ?? '');
  const [makeOpen, setMakeOpen] = useState(false);
  const [model, setModel] = useState(existing?.model ?? '');
  const [year, setYear] = useState(existing?.year ? String(existing.year) : '');
  const [trim, setTrim] = useState(existing?.trim ?? '');
  const [vin, setVin] = useState(existing?.vin ?? '');
  const [plate, setPlate] = useState(existing?.licensePlate ?? '');
  const [mileage, setMileage] = useState(
    existing?.mileage ? String(existing.mileage) : '',
  );
  const [color, setColor] = useState(existing?.color ?? '');
  const [fuel, setFuel] = useState<'Gasoline' | 'Diesel' | 'Hybrid' | 'Electric'>(
    existing?.fuelType ?? 'Gasoline',
  );
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual'>(
    existing?.transmission ?? 'Automatic',
  );
  const [isPrimary, setIsPrimary] = useState(Boolean(existing?.isPrimary));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSave = () => {
    if (!user) return;
    const next: Record<string, string> = {};
    if (!make) next.make = 'Please select a make.';
    if (!model.trim()) next.model = 'Please enter a model.';
    const y = parseInt(year, 10);
    if (!y || y < 1900 || y > 2100) next.year = 'Enter a valid year.';
    setErrors(next);
    if (Object.keys(next).length) return;

    if (existing) {
      updateVehicle(existing.id, {
        nickname: nickname.trim() || undefined,
        make,
        model: model.trim(),
        year: y,
        trim: trim.trim() || undefined,
        vin: vin.trim() || undefined,
        licensePlate: plate.trim() || undefined,
        mileage: mileage ? parseInt(mileage, 10) : undefined,
        color: color.trim() || undefined,
        fuelType: fuel,
        transmission,
        isPrimary,
      });
    } else {
      addVehicle({
        userId: user.id,
        nickname: nickname.trim() || undefined,
        make,
        model: model.trim(),
        year: y,
        trim: trim.trim() || undefined,
        vin: vin.trim() || undefined,
        licensePlate: plate.trim() || undefined,
        mileage: mileage ? parseInt(mileage, 10) : undefined,
        color: color.trim() || undefined,
        fuelType: fuel,
        transmission,
        isPrimary,
      });
    }
    navigation.goBack();
  };

  return (
    <Screen background={colors.white} keyboardAvoiding>
      <Header title={existing ? 'Edit vehicle' : 'Add vehicle'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input
          label="Nickname (optional)"
          placeholder="Weekend ride"
          value={nickname}
          onChangeText={setNickname}
          leftIcon="sparkles-outline"
        />

        <Text style={[typography.captionStrong, { marginBottom: 6 }]}>Make</Text>
        <Pressable
          onPress={() => setMakeOpen((v) => !v)}
          style={[styles.selector, errors.make ? { borderColor: colors.danger } : null]}
        >
          <Ionicons name="car-outline" size={18} color={colors.gray500} />
          <Text style={[typography.body, { flex: 1, marginLeft: spacing.s, color: make ? colors.ink : colors.gray400 }]}>
            {make || 'Select make'}
          </Text>
          <Ionicons
            name={makeOpen ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.gray500}
          />
        </Pressable>
        {errors.make ? (
          <Text style={[typography.caption, { color: colors.danger, marginTop: 4 }]}>
            {errors.make}
          </Text>
        ) : null}
        {makeOpen ? (
          <View style={styles.makeGrid}>
            {CAR_MAKES.map((m) => {
              const active = m === make;
              return (
                <Pressable
                  key={m}
                  onPress={() => {
                    setMake(m);
                    setMakeOpen(false);
                  }}
                  style={[styles.makeChip, active ? styles.makeChipActive : null]}
                >
                  <Text
                    style={[
                      typography.captionStrong,
                      { color: active ? colors.white : colors.ink },
                    ]}
                  >
                    {m}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', gap: spacing.m, marginTop: spacing.m }}>
          <View style={{ flex: 1 }}>
            <Input
              label="Model"
              placeholder="Camry"
              value={model}
              onChangeText={setModel}
              error={errors.model}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Year"
              placeholder="2022"
              keyboardType="number-pad"
              value={year}
              onChangeText={setYear}
              error={errors.year}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.m }}>
          <View style={{ flex: 1 }}>
            <Input label="Trim (optional)" placeholder="XSE" value={trim} onChangeText={setTrim} />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Color (optional)"
              placeholder="Pearl white"
              value={color}
              onChangeText={setColor}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.m }}>
          <View style={{ flex: 1 }}>
            <Input
              label="License plate"
              placeholder="ABC-1234"
              autoCapitalize="characters"
              value={plate}
              onChangeText={setPlate}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Mileage"
              placeholder="45000"
              keyboardType="number-pad"
              value={mileage}
              onChangeText={setMileage}
            />
          </View>
        </View>

        <Input
          label="VIN (optional)"
          placeholder="17-character VIN"
          autoCapitalize="characters"
          value={vin}
          onChangeText={setVin}
          leftIcon="barcode-outline"
        />

        <Text style={[typography.captionStrong, { marginTop: spacing.s }]}>Fuel type</Text>
        <View style={styles.segmentRow}>
          {(['Gasoline', 'Diesel', 'Hybrid', 'Electric'] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFuel(f)}
              style={[styles.segment, fuel === f ? styles.segmentOn : null]}
            >
              <Text
                style={[
                  typography.captionStrong,
                  { color: fuel === f ? colors.white : colors.ink },
                ]}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[typography.captionStrong, { marginTop: spacing.m }]}>Transmission</Text>
        <View style={styles.segmentRow}>
          {(['Automatic', 'Manual'] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTransmission(t)}
              style={[styles.segment, transmission === t ? styles.segmentOn : null]}
            >
              <Text
                style={[
                  typography.captionStrong,
                  { color: transmission === t ? colors.white : colors.ink },
                ]}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => setIsPrimary((v) => !v)} style={styles.primaryRow}>
          <View style={[styles.checkbox, isPrimary && styles.checkboxOn]}>
            {isPrimary ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
          </View>
          <View style={{ flex: 1, marginLeft: spacing.m }}>
            <Text style={typography.bodyStrong}>Set as primary vehicle</Text>
            <Text style={typography.caption}>
              Used by default when booking services.
            </Text>
          </View>
        </Pressable>

        <Button
          title={existing ? 'Save changes' : 'Add vehicle'}
          onPress={onSave}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
  },
  selector: {
    height: 52,
    borderRadius: radii.m,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
  },
  makeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
    marginTop: spacing.s,
  },
  makeChip: {
    paddingHorizontal: spacing.m,
    paddingVertical: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
  },
  makeChipActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.s,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radii.m,
    borderWidth: 1,
    borderColor: colors.gray300,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  segmentOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
