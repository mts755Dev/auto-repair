import React from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '@/navigation/types';
import { Button } from '@/components/Button';
import { colors, radii, spacing, typography } from '@/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?auto=format&fit=crop&w=1080&q=75';

export default function WelcomeScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const isCompact = height < 720;
  const isWide = width >= 600;
  const maxWidth = isWide ? 520 : width;
  const displaySize = isCompact ? 30 : 36;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.heroWrap}>
        <Image
          source={{ uri: HERO_IMAGE }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <View style={styles.heroScrim} />
        <View style={styles.heroScrimBottom} />
        <View style={styles.heroGlow} />

        <SafeAreaView edges={['top']} style={{ flex: 1, width: '100%' }}>
          <View style={[styles.heroInner, { maxWidth }]}>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <Ionicons name="construct" size={18} color={colors.white} />
              </View>
              <Text style={styles.brandText}>AutoRepair</Text>
            </View>

            <View style={styles.spacer} />

            <View style={styles.overlayCard}>
              <View style={styles.overlayTop}>
                <View style={styles.ratingPill}>
                  <Ionicons name="star" size={12} color={colors.white} />
                  <Text style={styles.ratingPillText}>4.9</Text>
                </View>
                <Text style={styles.overlayMeta}>12,400+ drivers</Text>
              </View>
              <Text style={styles.overlayTitle}>
                Trusted mechanics,{'\n'}one tap away.
              </Text>
              <View style={styles.overlayAvatars}>
                <View style={[styles.overlayAvatar, { backgroundColor: colors.primary }]}>
                  <Ionicons name="person" size={12} color={colors.white} />
                </View>
                <View
                  style={[
                    styles.overlayAvatar,
                    { backgroundColor: colors.primaryDark, marginLeft: -8 },
                  ]}
                >
                  <Ionicons name="person" size={12} color={colors.white} />
                </View>
                <View
                  style={[
                    styles.overlayAvatar,
                    { backgroundColor: colors.charcoal, marginLeft: -8 },
                  ]}
                >
                  <Ionicons name="person" size={12} color={colors.white} />
                </View>
                <Text style={styles.overlayAvatarsText}>
                  Join drivers booking today
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <SafeAreaView edges={['bottom']} style={styles.footerWrap}>
        <View style={[styles.footerInner, { maxWidth }]}>
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
            Book trusted shops and mobile mechanics across the U.S. and Canada.
            Fast, transparent, and in your pocket.
          </Text>

          <View style={styles.actions}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  heroWrap: {
    flex: 1,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,15,25,0.45)',
  },
  heroScrimBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
    backgroundColor: 'rgba(11,15,25,0.55)',
  },
  heroGlow: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.primary,
    opacity: 0.18,
  },
  heroInner: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.m,
    paddingBottom: spacing.xl,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.s,
  },
  brandText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  spacer: {
    flex: 1,
  },
  overlayCard: {
    padding: spacing.l,
    borderRadius: radii.l,
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  overlayTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  ratingPillText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  overlayMeta: {
    marginLeft: spacing.s,
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '600',
  },
  overlayTitle: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginTop: spacing.m,
  },
  overlayAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.m,
  },
  overlayAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  overlayAvatarsText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: spacing.s,
    flex: 1,
  },
  footerWrap: {
    backgroundColor: colors.white,
  },
  footerInner: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.m,
  },
  headline: {
    ...typography.display,
    color: colors.black,
  },
  subline: {
    ...typography.body,
    color: colors.gray700,
    marginTop: spacing.s,
  },
  actions: {
    marginTop: spacing.xl,
  },
});
