import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { colors, radii, spacing, typography } from '@/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <Screen padded background={colors.white} edges={['top', 'bottom']}>
      <View style={styles.hero}>
        <View style={styles.brand}>
          <View style={styles.logoMark}>
            <Ionicons name="construct" size={22} color={colors.white} />
          </View>
          <Text style={[typography.h2, { color: colors.black }]}>AutoRepair</Text>
        </View>

        <View style={styles.illustration}>
          <View style={styles.illustrationCard}>
            <View style={styles.illRow}>
              <View style={[styles.illIconWrap, { backgroundColor: colors.primary }]}>
                <Ionicons name="car-sport" size={26} color={colors.white} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={typography.title}>Service booked</Text>
                <Text style={typography.caption}>Oil change · Tomorrow, 10:00 AM</Text>
              </View>
              <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            </View>
            <View style={styles.illRow}>
              <View style={[styles.illIconWrap, { backgroundColor: colors.black }]}>
                <Ionicons name="location" size={22} color={colors.white} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={typography.title}>Nearby shops</Text>
                <Text style={typography.caption}>142 verified pros in your area</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.gray500} />
            </View>
            <View style={styles.illRow}>
              <View style={[styles.illIconWrap, { backgroundColor: colors.primaryDark }]}>
                <Ionicons name="chatbubbles" size={22} color={colors.white} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={typography.title}>Real-time chat</Text>
                <Text style={typography.caption}>Talk to your mechanic any time</Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <Text style={[typography.display, { marginTop: spacing.xxl }]}>
            Auto repair,{"\n"}
            <Text style={{ color: colors.primary }}>on demand.</Text>
          </Text>
          <Text style={[typography.body, { marginTop: spacing.s, color: colors.gray700 }]}>
            Book trusted shops and mobile mechanics across the U.S. and Canada. Fast, transparent,
            and in your pocket.
          </Text>
        </View>
      </View>

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
          style={{ marginTop: spacing.m }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.s,
  },
  illustration: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  illustrationCard: {
    width: '100%',
    backgroundColor: colors.gray50,
    borderRadius: radii.xl,
    padding: spacing.l,
  },
  illRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.l,
    padding: spacing.m,
    marginBottom: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
  },
  illIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    marginTop: spacing.xl,
  },
});
