import React, { useMemo } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { SHOPS } from '@/data/shops';
import { SERVICES } from '@/data/services';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { colors, radii, spacing, typography } from '@/theme';
import { useCurrentUser } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';

type Props = NativeStackScreenProps<HomeStackParamList, 'ShopDetail'>;

export default function ShopDetailScreen({ navigation, route }: Props) {
  const shop = SHOPS.find((s) => s.id === route.params.shopId);
  const user = useCurrentUser();
  const ensureThread = useChatStore((s) => s.ensureThread);

  const offered = useMemo(
    () => (shop ? SERVICES.filter((s) => shop.services.includes(s.category)) : []),
    [shop],
  );

  if (!shop) {
    return (
      <Screen>
        <Header title="Shop" />
        <View style={styles.center}>
          <Text style={typography.body}>Shop not found.</Text>
        </View>
      </Screen>
    );
  }

  const openChat = () => {
    if (!user) return;
    const thread = ensureThread(user.id, shop.id);
    navigation.navigate('Chat', { threadId: thread.id });
  };

  return (
    <Screen background={colors.white}>
      <Header title="" showBack rightIcon="heart-outline" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroPattern}>
            <View style={[styles.dot, { top: 32, left: 32, backgroundColor: colors.primary }]} />
            <View style={[styles.dot, { top: 100, right: 40, backgroundColor: colors.white, opacity: 0.3 }]} />
            <View style={[styles.dot, { bottom: 40, left: 60, backgroundColor: colors.primaryDark, opacity: 0.5 }]} />
          </View>
          <View style={styles.heroBadges}>
            <Badge
              label={shop.type === 'mobile' ? 'Mobile mechanic' : 'Repair shop'}
              tone="dark"
              icon={shop.type === 'mobile' ? 'car-sport-outline' : 'business-outline'}
            />
            {shop.openNow ? (
              <Badge label="Open now" tone="success" icon="time-outline" style={{ marginLeft: spacing.s }} />
            ) : (
              <Badge label="Closed" tone="neutral" icon="time-outline" style={{ marginLeft: spacing.s }} />
            )}
          </View>
          <View style={styles.heroLetter}>
            <Text style={styles.heroLetterText}>{shop.name.charAt(0)}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={typography.h1}>{shop.name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={16} color={colors.primary} />
            <Text style={[typography.bodyStrong, { marginLeft: 4 }]}>{shop.rating.toFixed(1)}</Text>
            <Text style={[typography.caption, { marginLeft: 4 }]}>({shop.reviews} reviews)</Text>
            <Text style={[typography.caption, { marginHorizontal: 6 }]}>·</Text>
            <Text style={typography.caption}>{'$'.repeat(shop.priceLevel)}</Text>
            {shop.yearsInBusiness ? (
              <>
                <Text style={[typography.caption, { marginHorizontal: 6 }]}>·</Text>
                <Text style={typography.caption}>{shop.yearsInBusiness} yrs in business</Text>
              </>
            ) : null}
          </View>

          <Text style={[typography.body, { marginTop: spacing.m, color: colors.gray700 }]}>
            {shop.description}
          </Text>

          <View style={styles.quickActions}>
            <QuickAction icon="call-outline" label="Call" onPress={() => Linking.openURL(`tel:${shop.phone}`)} />
            <QuickAction icon="chatbubble-outline" label="Message" onPress={openChat} />
            <QuickAction
              icon="navigate-outline"
              label="Directions"
              onPress={() =>
                Linking.openURL(
                  `https://maps.google.com/?q=${shop.latitude},${shop.longitude}`,
                )
              }
            />
            <QuickAction icon="share-social-outline" label="Share" onPress={() => {}} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={typography.h3}>About this shop</Text>
          <Card padded style={{ marginTop: spacing.m }}>
            <InfoRow icon="location-outline" label="Address" value={`${shop.address}, ${shop.city}, ${shop.state} ${shop.zipcode}`} />
            <InfoRow icon="time-outline" label="Hours" value={shop.hours} />
            <InfoRow icon="call-outline" label="Phone" value={shop.phone} last />
          </Card>
        </View>

        {shop.certifications && shop.certifications.length ? (
          <View style={styles.section}>
            <Text style={typography.h3}>Certifications</Text>
            <View style={styles.chips}>
              {shop.certifications.map((c) => (
                <View key={c} style={styles.chip}>
                  <Ionicons name="shield-checkmark-outline" size={14} color={colors.primaryDark} />
                  <Text style={[typography.captionStrong, { marginLeft: 6 }]}>{c}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={typography.h3}>Services offered</Text>
          <View style={{ marginTop: spacing.m }}>
            {offered.slice(0, 6).map((s) => (
              <Pressable
                key={s.id}
                onPress={() =>
                  navigation.navigate('BookingFlow', {
                    serviceIds: [s.id],
                    shopId: shop.id,
                  })
                }
                style={styles.serviceRow}
              >
                <View style={styles.serviceIcon}>
                  <Ionicons name={s.icon as any} size={18} color={colors.primaryDark} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.m }}>
                  <Text style={typography.title}>{s.title}</Text>
                  <Text style={typography.caption}>
                    {s.durationMin} min · from ${s.priceFrom}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Message"
          variant="secondary"
          leftIcon="chatbubble-outline"
          onPress={openChat}
          style={{ flex: 1, marginRight: spacing.m }}
        />
        <Button
          title="Book now"
          onPress={() => navigation.navigate('BookingFlow', { shopId: shop.id })}
          style={{ flex: 1 }}
        />
      </View>
    </Screen>
  );
}

const QuickAction: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}> = ({ icon, label, onPress }) => (
  <Pressable onPress={onPress} style={styles.quickAction}>
    <View style={styles.quickIcon}>
      <Ionicons name={icon} size={18} color={colors.ink} />
    </View>
    <Text style={[typography.captionStrong, { marginTop: 6 }]}>{label}</Text>
  </Pressable>
);

const InfoRow: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}> = ({ icon, label, value, last }) => (
  <View style={[styles.infoRow, last ? null : { borderBottomWidth: 1, borderBottomColor: colors.divider, paddingBottom: spacing.m, marginBottom: spacing.m }]}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={16} color={colors.ink} />
    </View>
    <View style={{ flex: 1, marginLeft: spacing.m }}>
      <Text style={[typography.caption, { color: colors.gray500 }]}>{label}</Text>
      <Text style={[typography.bodyStrong, { marginTop: 2 }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  hero: {
    height: 180,
    backgroundColor: colors.black,
    position: 'relative',
  },
  heroPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 14,
  },
  heroBadges: {
    position: 'absolute',
    top: spacing.l,
    left: spacing.xl,
    flexDirection: 'row',
  },
  heroLetter: {
    position: 'absolute',
    bottom: spacing.l,
    left: spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLetterText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '800',
  },
  body: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.s,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.m,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.m,
    gap: spacing.s,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderRadius: radii.m,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.s,
    backgroundColor: colors.white,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});
