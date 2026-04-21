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
import { DEMO_CREDENTIALS, useAuthStore } from '@/store/authStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import { Header } from '@/components/Header';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const login = useAuthStore((s) => s.login);
  const loginAsDemo = useAuthStore((s) => s.loginAsDemo);
  const seedDemoVehicles = useVehicleStore((s) => s.seedDemoVehicles);

  const { width, height } = useWindowDimensions();
  const isCompact = height < 720;
  const isWide = width >= 600;
  const contentMaxWidth = isWide ? 460 : width;
  const titleSize = isCompact ? 26 : 32;

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

  const onUseDemo = async () => {
    setErrors({});
    setDemoLoading(true);
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    await new Promise((r) => setTimeout(r, 450));
    loginAsDemo();
    const userId = useAuthStore.getState().currentUserId;
    if (userId) seedDemoVehicles(userId);
  };

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
            Welcome back
          </Text>
          <Text style={[typography.body, { marginTop: spacing.s, color: colors.gray700 }]}>
            Sign in to manage your vehicles and bookings.
          </Text>

          <Pressable
            onPress={onUseDemo}
            style={({ pressed }) => [
              styles.demoCard,
              { marginTop: spacing.xl, opacity: pressed ? 0.94 : 1 },
            ]}
          >
            <View style={styles.demoAccent} />
            <View style={styles.demoIcon}>
              <Ionicons name="sparkles" size={18} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.demoTitle}>Try the demo account</Text>
              <Text style={styles.demoMeta} numberOfLines={1}>
                {DEMO_CREDENTIALS.email}
              </Text>
              <Text style={styles.demoMeta} numberOfLines={1}>
                Password: {DEMO_CREDENTIALS.password}
              </Text>
            </View>
            <View style={styles.demoCta}>
              <Ionicons name="arrow-forward" size={16} color={colors.white} />
            </View>
          </Pressable>

          <View style={{ marginTop: spacing.xl }}>
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
              returnKeyType="next"
            />
            <Input
              label="Password"
              leftIcon="lock-closed-outline"
              secureTextEntry
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              returnKeyType="go"
              onSubmitEditing={onSubmit}
            />

            <Pressable hitSlop={6} style={styles.forgot}>
              <Text style={[typography.captionStrong, { color: colors.primary }]}>
                Forgot password?
              </Text>
            </Pressable>

            <Button
              title="Sign in"
              onPress={onSubmit}
              loading={loading}
              disabled={demoLoading}
              style={{ marginTop: spacing.l }}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Continue with demo account"
              variant="secondary"
              leftIcon="flash-outline"
              onPress={onUseDemo}
              loading={demoLoading}
              disabled={loading}
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
      </View>
    </Screen>
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
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    paddingLeft: spacing.l,
    borderRadius: radii.l,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    backgroundColor: colors.primarySoft,
    overflow: 'hidden',
    ...shadows.sm,
  },
  demoAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
  },
  demoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.1,
  },
  demoMeta: {
    fontSize: 12,
    color: colors.gray700,
    marginTop: 2,
  },
  demoCta: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: -4,
    paddingVertical: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.l,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.m,
    color: colors.gray500,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
});
