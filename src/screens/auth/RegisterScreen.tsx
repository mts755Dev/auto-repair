import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { colors, radii, spacing, typography } from '@/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPw] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const register = useAuthStore((s) => s.register);

  const { width, height } = useWindowDimensions();
  const isCompact = height < 720;
  const isNarrow = width < 360;
  const isWide = width >= 600;
  const contentMaxWidth = isWide ? 460 : width;
  const titleSize = isCompact ? 26 : 32;

  const onSubmit = async () => {
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = 'Required';
    if (!lastName.trim()) next.lastName = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email.';
    if (password.length < 6) next.password = 'At least 6 characters.';
    if (!accepted) next.accepted = 'Please accept the terms to continue.';
    setErrors(next);
    if (Object.keys(next).length) {
      if (next.accepted) Alert.alert('Terms required', next.accepted);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const res = register({ firstName, lastName, email, phone, password });
    setLoading(false);
    if (!res.ok) Alert.alert('Unable to create account', res.error ?? 'Please try again.');
  };

  const NameFields = (
    <>
      <View style={{ flex: 1 }}>
        <Input
          label="First name"
          placeholder="Alex"
          value={firstName}
          onChangeText={setFirst}
          error={errors.firstName}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Input
          label="Last name"
          placeholder="Morgan"
          value={lastName}
          onChangeText={setLast}
          error={errors.lastName}
        />
      </View>
    </>
  );

  return (
    <Screen
      background={colors.white}
      keyboardAvoiding
      scroll
      contentStyle={{ flexGrow: 1, paddingBottom: spacing.xl }}
    >
      <Header showBack title="" transparent />
      <View style={styles.outer}>
        <View style={[styles.container, { maxWidth: contentMaxWidth }]}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Ionicons name="construct" size={16} color={colors.white} />
            </View>
            <Text style={styles.brandText}>AutoRepair</Text>
          </View>

          <Text
            style={[
              typography.display,
              { fontSize: titleSize, lineHeight: titleSize + 6, marginTop: spacing.xl },
            ]}
          >
            Create account
          </Text>
          <Text style={[typography.body, { marginTop: spacing.s, color: colors.gray700 }]}>
            Join thousands of drivers getting reliable auto service.
          </Text>

          <View style={styles.perks}>
            <Perk icon="shield-checkmark" label="Verified shops" />
            <Perk icon="flash" label="Instant booking" />
            <Perk icon="wallet" label="Upfront pricing" />
          </View>

          <View style={{ marginTop: spacing.xl }}>
            {isNarrow ? (
              <View>{NameFields}</View>
            ) : (
              <View style={{ flexDirection: 'row', gap: spacing.m }}>{NameFields}</View>
            )}

            <Input
              label="Email"
              leftIcon="mail-outline"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />
            <Input
              label="Phone (optional)"
              leftIcon="call-outline"
              keyboardType="phone-pad"
              placeholder="(555) 555-0199"
              value={phone}
              onChangeText={setPhone}
            />
            <Input
              label="Password"
              leftIcon="lock-closed-outline"
              secureTextEntry
              placeholder="Create a password"
              value={password}
              onChangeText={setPw}
              error={errors.password}
              hint="At least 6 characters."
            />

            <Pressable
              onPress={() => setAccepted((v) => !v)}
              style={styles.terms}
              hitSlop={6}
            >
              <View style={[styles.checkbox, accepted && styles.checkboxOn]}>
                {accepted ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
              </View>
              <Text style={[typography.caption, styles.termsText]}>
                I agree to the{' '}
                <Text style={{ color: colors.primary, fontWeight: '700' }}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={{ color: colors.primary, fontWeight: '700' }}>Privacy Policy</Text>.
              </Text>
            </Pressable>

            <Button
              title="Create account"
              onPress={onSubmit}
              loading={loading}
              rightIcon="arrow-forward"
              style={{ marginTop: spacing.xl }}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[typography.body, { color: colors.gray700 }]}>
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => navigation.replace('Login')} hitSlop={6}>
              <Text style={[typography.bodyStrong, { color: colors.primary }]}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  );
}

function Perk({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
}) {
  return (
    <View style={styles.perkItem}>
      <View style={styles.perkIcon}>
        <Ionicons name={icon} size={14} color={colors.primary} />
      </View>
      <Text style={styles.perkText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  container: {
    width: '100%',
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.s,
  },
  brandText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  perks: {
    flexDirection: 'row',
    gap: spacing.s,
    marginTop: spacing.l,
    flexWrap: 'wrap',
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: spacing.s,
    borderRadius: radii.pill,
    backgroundColor: colors.gray100,
  },
  perkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  perkText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ink,
  },
  terms: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.m,
  },
  termsText: {
    flex: 1,
    lineHeight: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.gray300,
    marginRight: spacing.m,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
});
