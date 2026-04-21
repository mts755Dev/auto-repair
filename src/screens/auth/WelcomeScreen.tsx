import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '@/navigation/types';
import { Button } from '@/components/Button';
import { colors, radii, spacing, typography } from '@/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const isCompact = height < 720;
  const isWide = width >= 600;
  const maxWidth = isWide ? 480 : width;
  const displaySize = isCompact ? 30 : 36;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.inner, { maxWidth }]}>
        <View style={styles.top}>
          <View style={styles.brandMark}>
            <Ionicons name="construct" size={28} color={colors.white} />
          </View>
          <Text style={styles.brandText}>AutoRepair</Text>
        </View>

        <View style={styles.middle}>
          <Text
            style={[
              styles.headline,
              { fontSize: displaySize, lineHeight: displaySize + 6 },
            ]}
          >
            Auto repair,{'\n'}
            <Text style={{ color: colors.primary }}>on demand.</Text>
          </Text>
          <Text style={styles.subline}>
            Trusted mechanics. Fair prices. Booked in a minute.
          </Text>

          <View style={styles.perks}>
            <Perk icon="shield-checkmark-outline" label="Vetted shops" />
            <Perk icon="flash-outline" label="Instant booking" />
            <Perk icon="card-outline" label="Secure pay" />
          </View>
        </View>

        <View style={styles.bottom}>
          <Button
            title="Get started"
            rightIcon="arrow-forward"
            onPress={() => navigation.navigate('Register')}
          />
          <Button
            title="I already have an account"
            variant="secondary"
            onPress={() => navigation.navigate('Login')}
            style={{ marginTop: spacing.s }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const Perk: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}> = ({ icon, label }) => (
  <View style={styles.perk}>
    <View style={styles.perkIcon}>
      <Ionicons name={icon} size={16} color={colors.primaryDark} />
    </View>
    <Text style={styles.perkLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  inner: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.l,
  },
  top: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  brandMark: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginTop: spacing.m,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    ...typography.display,
    color: colors.ink,
    textAlign: 'center',
  },
  subline: {
    ...typography.body,
    color: colors.gray700,
    marginTop: spacing.s,
    textAlign: 'center',
  },
  perks: {
    flexDirection: 'row',
    marginTop: spacing.xxl,
    gap: spacing.s,
  },
  perk: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.s,
    borderRadius: radii.m,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
  },
  perkIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkLabel: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginTop: spacing.s,
    textAlign: 'center',
  },
  bottom: {
    marginTop: spacing.l,
  },
});
