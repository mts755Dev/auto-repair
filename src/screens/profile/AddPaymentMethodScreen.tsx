import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { ProfileStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useCurrentUser } from '@/store/authStore';
import { usePaymentStore } from '@/store/paymentStore';
import { detectBrand, formatCardNumber, formatExpiry, luhnCheck } from '@/utils/payment';
import { colors, radii, spacing, typography } from '@/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AddPaymentMethod'>;

export default function AddPaymentMethodScreen({ navigation }: Props) {
  const user = useCurrentUser();
  const addMethod = usePaymentStore((s) => s.addMethod);

  const [name, setName] = useState(
    user ? `${user.firstName} ${user.lastName}`.trim() : '',
  );
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [setDefault, setSetDefault] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const brand = useMemo(() => detectBrand(number), [number]);

  const onSave = async () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Cardholder name is required.';
    const digits = number.replace(/\s+/g, '');
    if (digits.length < 12 || !luhnCheck(digits)) next.number = 'Enter a valid card number.';
    const [mm, yy] = expiry.split('/');
    const mo = parseInt(mm ?? '', 10);
    const yr = parseInt(yy ?? '', 10);
    if (!mo || mo < 1 || mo > 12 || !yr) next.expiry = 'MM/YY';
    if (cvc.length < 3) next.cvc = 'CVC';
    setErrors(next);
    if (Object.keys(next).length) return;

    if (!user) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    addMethod(user.id, {
      brand,
      last4: digits.slice(-4),
      expMonth: mo,
      expYear: 2000 + yr,
      holder: name.trim(),
      isDefault: setDefault,
    });
    setSaving(false);
    navigation.goBack();
  };

  return (
    <Screen background={colors.white} keyboardAvoiding>
      <Header title="Add payment method" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.cardPreview}>
          <View style={styles.cardBrand}>
            <Ionicons name="card" size={18} color={colors.white} />
          </View>
          <Text style={styles.cardNumber}>
            {number || '•••• •••• •••• ••••'}
          </Text>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.cardLabel}>Cardholder</Text>
              <Text style={styles.cardValue}>
                {name || 'Your name'}
              </Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>Expires</Text>
              <Text style={styles.cardValue}>{expiry || 'MM/YY'}</Text>
            </View>
          </View>
        </View>

        <Input
          label="Cardholder name"
          placeholder="Name on card"
          value={name}
          onChangeText={setName}
          error={errors.name}
          leftIcon="person-outline"
        />
        <Input
          label="Card number"
          placeholder="1234 5678 9012 3456"
          keyboardType="number-pad"
          value={number}
          onChangeText={(t) => setNumber(formatCardNumber(t))}
          error={errors.number}
          leftIcon="card-outline"
          maxLength={23}
        />
        <View style={{ flexDirection: 'row', gap: spacing.m }}>
          <View style={{ flex: 1 }}>
            <Input
              label="Expiry"
              placeholder="MM/YY"
              keyboardType="number-pad"
              value={expiry}
              onChangeText={(t) => setExpiry(formatExpiry(t))}
              error={errors.expiry}
              maxLength={5}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="CVC"
              placeholder="123"
              keyboardType="number-pad"
              value={cvc}
              onChangeText={(t) => setCvc(t.replace(/\D/g, '').slice(0, 4))}
              error={errors.cvc}
              secureTextEntry
              maxLength={4}
            />
          </View>
        </View>

        <Pressable onPress={() => setSetDefault((v) => !v)} style={styles.defaultRow}>
          <View style={[styles.checkbox, setDefault && styles.checkboxOn]}>
            {setDefault ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
          </View>
          <Text style={[typography.body, { marginLeft: spacing.m, flex: 1 }]}>
            Set as default payment method
          </Text>
        </Pressable>

        <View style={styles.secure}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.success} />
          <Text style={[typography.caption, { marginLeft: 6 }]}>
            Payments processed securely by Stripe. We never store your card details.
          </Text>
        </View>

        <Button
          title="Save card"
          loading={saving}
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
  cardPreview: {
    backgroundColor: colors.black,
    borderRadius: radii.l,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  cardBrand: {
    width: 44,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardNumber: {
    color: colors.white,
    fontSize: 22,
    letterSpacing: 2,
    marginTop: spacing.xl,
    fontWeight: '700',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.l,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.m,
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
  secure: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.l,
    padding: spacing.m,
    backgroundColor: colors.successSoft,
    borderRadius: radii.m,
  },
});
