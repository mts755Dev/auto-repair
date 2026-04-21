import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Shop } from '@/types';
import { Card } from './Card';
import { Badge } from './Badge';
import { colors, spacing, typography } from '@/theme';

type Props = {
  shop: Shop;
  distance?: number;
  onPress?: () => void;
  compact?: boolean;
};

export const ShopCard: React.FC<Props> = ({ shop, distance, onPress, compact }) => {
  return (
    <Card onPress={onPress} padded={false} style={styles.card} elevated>
      <View style={[styles.hero, { backgroundColor: shop.heroColor ?? colors.black }]}>
        {shop.bannerUrl ? (
          <Image
            source={{ uri: shop.bannerUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : null}
        <View style={styles.scrim} />
        <View style={styles.scrimTop} />
        <View style={styles.heroTopRow}>
          <Badge
            label={shop.type === 'mobile' ? 'Mobile mechanic' : 'Repair shop'}
            tone="dark"
            icon={shop.type === 'mobile' ? 'car-sport-outline' : 'business-outline'}
          />
          {shop.openNow ? (
            <Badge label="Open now" tone="success" icon="time-outline" />
          ) : (
            <Badge label="Closed" tone="neutral" icon="time-outline" />
          )}
        </View>
        <View style={styles.heroInitial}>
          <Text style={styles.heroLetter}>{shop.name.charAt(0)}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={typography.h3} numberOfLines={1}>
            {shop.name}
          </Text>
          {shop.priceLevel >= 3 ? (
            <Text style={[typography.captionStrong, { color: colors.gray500, marginLeft: 6 }]}>
              {'$$$'}
            </Text>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="star" size={14} color={colors.primary} />
          <Text style={[typography.captionStrong, { marginLeft: 4, color: colors.ink }]}>
            {shop.rating.toFixed(1)}
          </Text>
          <Text style={[typography.caption, { marginLeft: 4 }]}>({shop.reviews})</Text>
          <Text style={[typography.caption, { marginHorizontal: 6 }]}>·</Text>
          <Ionicons name="location-outline" size={14} color={colors.gray500} />
          <Text style={[typography.caption, { marginLeft: 4, flex: 1 }]} numberOfLines={1}>
            {shop.city}, {shop.state}
            {typeof distance === 'number' ? ` · ${distance.toFixed(1)} mi` : ''}
          </Text>
        </View>
        {!compact ? (
          <Text
            style={[typography.caption, { marginTop: spacing.s, color: colors.gray700 }]}
            numberOfLines={2}
          >
            {shop.description}
          </Text>
        ) : null}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.m,
  },
  hero: {
    height: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,11,11,0.28)',
  },
  scrimTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  heroTopRow: {
    position: 'absolute',
    top: spacing.m,
    left: spacing.m,
    right: spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  heroInitial: {
    position: 'absolute',
    bottom: spacing.m,
    left: spacing.l,
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    zIndex: 2,
  },
  heroLetter: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  body: {
    padding: spacing.l,
  },
});
