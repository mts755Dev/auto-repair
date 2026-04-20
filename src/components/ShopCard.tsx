import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
      <View style={styles.hero}>
        <View style={styles.heroPattern}>
          <View style={[styles.dot, { top: 20, left: 28, backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { top: 60, left: 120, backgroundColor: colors.white, opacity: 0.4 }]} />
          <View style={[styles.dot, { top: 40, right: 40, backgroundColor: colors.primaryDark, opacity: 0.5 }]} />
          <View style={[styles.dot, { bottom: 12, left: 60, backgroundColor: colors.white, opacity: 0.3 }]} />
        </View>
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
          <Text style={[typography.caption, { marginLeft: 4 }]}>
            ({shop.reviews})
          </Text>
          <Text style={[typography.caption, { marginHorizontal: 6 }]}>·</Text>
          <Ionicons name="location-outline" size={14} color={colors.gray500} />
          <Text style={[typography.caption, { marginLeft: 4, flex: 1 }]} numberOfLines={1}>
            {shop.city}, {shop.state}
            {typeof distance === 'number' ? ` · ${distance.toFixed(1)} mi` : ''}
          </Text>
        </View>
        {!compact ? (
          <Text style={[typography.caption, { marginTop: spacing.s, color: colors.gray700 }]} numberOfLines={2}>
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
    height: 128,
    backgroundColor: colors.black,
    position: 'relative',
  },
  heroPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 10,
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
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLetter: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  body: {
    padding: spacing.l,
  },
});
