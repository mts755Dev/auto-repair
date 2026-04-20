import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { findService, SERVICES } from '@/data/services';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { colors, radii, spacing, typography } from '@/theme';
import { formatCurrency } from '@/utils/format';
import { SHOPS } from '@/data/shops';
import { ShopCard } from '@/components/ShopCard';

type Props = NativeStackScreenProps<HomeStackParamList, 'ServiceDetail'>;

export default function ServiceDetailScreen({ navigation, route }: Props) {
  const service = findService(route.params.serviceId);

  if (!service) {
    return (
      <Screen>
        <Header title="Service" />
        <View style={styles.center}>
          <Text style={typography.body}>Service not found.</Text>
        </View>
      </Screen>
    );
  }

  const offeredBy = SHOPS.filter((s) => s.services.includes(service.category)).slice(0, 5);

  const INCLUDES = [
    'Factory-recommended parts and fluids',
    'Multi-point safety inspection',
    'Written estimate with upfront pricing',
    '90-day service warranty',
  ];

  return (
    <Screen background={colors.white}>
      <Header title="" showBack />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name={service.icon as any} size={28} color={colors.white} />
          </View>
          <Text style={[typography.h1, { marginTop: spacing.l }]}>{service.title}</Text>
          <Text style={[typography.body, { marginTop: spacing.s }]}>{service.description}</Text>

          <View style={styles.metaRow}>
            <Badge label={`~ ${service.durationMin} min`} tone="neutral" icon="time-outline" />
            <Badge
              label={`From ${formatCurrency(service.priceFrom)}`}
              tone="primary"
              icon="pricetag-outline"
              style={{ marginLeft: spacing.s }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={typography.h3}>What's included</Text>
          <Card padded style={{ marginTop: spacing.m }}>
            {INCLUDES.map((item, i) => (
              <View
                key={item}
                style={[styles.includeRow, i === 0 ? null : { marginTop: spacing.m }]}
              >
                <View style={styles.checkMark}>
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                </View>
                <Text style={[typography.body, { marginLeft: spacing.m, flex: 1 }]}>
                  {item}
                </Text>
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={typography.h3}>Often paired with</Text>
          <View style={styles.pairs}>
            {SERVICES.filter((s) => s.id !== service.id)
              .slice(0, 4)
              .map((s) => (
                <View key={s.id} style={styles.pairChip}>
                  <Ionicons name={s.icon as any} size={14} color={colors.primaryDark} />
                  <Text style={[typography.captionStrong, { marginLeft: 6 }]}>{s.title}</Text>
                </View>
              ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={typography.h3}>Top providers</Text>
          <Text style={[typography.caption, { marginBottom: spacing.m, marginTop: 4 }]}>
            Vetted shops that specialize in this service.
          </Text>
          {offeredBy.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onPress={() => navigation.navigate('ShopDetail', { shopId: shop.id })}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={[typography.caption, { color: colors.gray500 }]}>Starting at</Text>
          <Text style={typography.h2}>{formatCurrency(service.priceFrom)}</Text>
        </View>
        <Button
          title="Book this service"
          fullWidth={false}
          onPress={() => navigation.navigate('BookingFlow', { serviceIds: [service.id] })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: radii.m,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: spacing.l,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
  },
  includeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkMark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pairs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.m,
    gap: spacing.s,
  },
  pairChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
