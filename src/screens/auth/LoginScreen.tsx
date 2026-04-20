import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, typography } from '@/theme';
import { Header } from '@/components/Header';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const login = useAuthStore((s) => s.login);

  const onSubmit = async () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Please enter your email.';
    if (!password) next.password = 'Please enter your password.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const res = login(email, password);
    setLoading(false);
    if (!res.ok) {
      Alert.alert('Unable to sign in', res.error ?? 'Please try again.');
    }
  };

  return (
    <Screen background={colors.white} keyboardAvoiding scroll contentStyle={{ flexGrow: 1 }}>
      <Header showBack title="" transparent />
      <View style={styles.container}>
        <Text style={typography.display}>Welcome back</Text>
        <Text style={[typography.body, { marginTop: spacing.s, color: colors.gray700 }]}>
          Sign in to manage your vehicles and bookings.
        </Text>

        <View style={{ marginTop: spacing.xxl }}>
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
            label="Password"
            leftIcon="lock-closed-outline"
            secureTextEntry
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          <Pressable hitSlop={6} style={{ alignSelf: 'flex-end', marginTop: -4 }}>
            <Text style={[typography.captionStrong, { color: colors.primary }]}>
              Forgot password?
            </Text>
          </Pressable>

          <Button
            title="Sign in"
            onPress={onSubmit}
            loading={loading}
            style={{ marginTop: spacing.xl }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[typography.body, { color: colors.gray700 }]}>
            Don’t have an account?{' '}
          </Text>
          <Pressable onPress={() => navigation.replace('Register')} hitSlop={6}>
            <Text style={[typography.bodyStrong, { color: colors.primary }]}>Create one</Text>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
});
