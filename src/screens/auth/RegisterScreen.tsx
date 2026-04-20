import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, typography } from '@/theme';

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

  return (
    <Screen background={colors.white} keyboardAvoiding scroll contentStyle={{ flexGrow: 1 }}>
      <Header showBack title="" transparent />
      <View style={styles.container}>
        <Text style={typography.display}>Create account</Text>
        <Text style={[typography.body, { marginTop: spacing.s, color: colors.gray700 }]}>
          Join thousands of drivers getting reliable auto service.
        </Text>

        <View style={{ marginTop: spacing.xxl }}>
          <View style={{ flexDirection: 'row', gap: spacing.m }}>
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
          </View>
          <Input
            label="Email"
            leftIcon="mail-outline"
            autoCapitalize="none"
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
            <Text style={[typography.caption, { flex: 1 }]}>
              I agree to the <Text style={{ color: colors.primary, fontWeight: '700' }}>Terms of Service</Text>
              {' '}and <Text style={{ color: colors.primary, fontWeight: '700' }}>Privacy Policy</Text>.
            </Text>
          </Pressable>

          <Button
            title="Create account"
            onPress={onSubmit}
            loading={loading}
            style={{ marginTop: spacing.xl }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[typography.body, { color: colors.gray700 }]}>
            Already have an account?{' '}
          </Text>
          <Pressable onPress={() => navigation.replace('Login')}>
            <Text style={[typography.bodyStrong, { color: colors.primary }]}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  terms: {
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
    marginRight: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
});
