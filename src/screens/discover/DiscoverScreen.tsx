import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DiscoverStackParamList } from '@/navigation/types';
import { SHOPS } from '@/data/shops';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import { Chip } from '@/components/Chip';
import { ShopCard } from '@/components/ShopCard';
import { Badge } from '@/components/Badge';
import { distanceBetween } from '@/utils/format';
import { Shop } from '@/types';

type Props = NativeStackScreenProps<DiscoverStackParamList, 'Discover'>;

type Mode = 'map' | 'list';
type TypeFilter = 'all' | 'shop' | 'mobile';

let MapView: any = null;
let Marker: any = null;
let PROVIDER_DEFAULT: any = undefined;

if (Platform.OS !== 'web') {
  try {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
    PROVIDER_DEFAULT = maps.PROVIDER_DEFAULT;
  } catch {
    MapView = null;
  }
}

const { height: SCREEN_H } = Dimensions.get('window');

const DEFAULT_REGION = {
  latitude: 39.8283,
  longitude: -98.5795,
  latitudeDelta: 24,
  longitudeDelta: 24,
};

export default function DiscoverScreen({ navigation }: Props) {
  const [mode, setMode] = useState<Mode>('map');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [selected, setSelected] = useState<Shop | null>(null);
  const mapRef = useRef<any>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SHOPS.filter((s) => {
      if (typeFilter !== 'all' && s.type !== typeFilter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q)
      );
    });
  }, [query, typeFilter]);

  useEffect(() => {
    if (mode === 'map' && filtered.length && !selected) {
      setSelected(filtered[0]);
    }
  }, [mode, filtered, selected]);

  const focusShop = (shop: Shop) => {
    setSelected(shop);
    if (mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(
        {
          latitude: shop.latitude,
          longitude: shop.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        },
        600,
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={['top']}>
      <View style={styles.topBar}>
        <View style={styles.search}>
          <Ionicons name="search-outline" size={18} color={colors.gray500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search city or shop"
            placeholderTextColor={colors.gray400}
            value={query}
            onChangeText={setQuery}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.gray400} />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.segment}>
          <Pressable
            onPress={() => setMode('map')}
            style={[styles.segmentBtn, mode === 'map' ? styles.segmentActive : null]}
          >
            <Ionicons
              name="map-outline"
              size={16}
              color={mode === 'map' ? colors.white : colors.ink}
            />
          </Pressable>
          <Pressable
            onPress={() => setMode('list')}
            style={[styles.segmentBtn, mode === 'list' ? styles.segmentActive : null]}
          >
            <Ionicons
              name="list-outline"
              size={16}
              color={mode === 'list' ? colors.white : colors.ink}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.chipsRow}>
        <Chip
          label="All"
          selected={typeFilter === 'all'}
          onPress={() => setTypeFilter('all')}
        />
        <Chip
          label="Repair shops"
          icon="business-outline"
          selected={typeFilter === 'shop'}
          onPress={() => setTypeFilter('shop')}
        />
        <Chip
          label="Mobile mechanics"
          icon="car-sport-outline"
          selected={typeFilter === 'mobile'}
          onPress={() => setTypeFilter('mobile')}
        />
      </View>

      {mode === 'map' ? (
        <View style={styles.mapWrap}>
          {MapView ? (
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={DEFAULT_REGION}
              provider={PROVIDER_DEFAULT}
              showsUserLocation
              showsMyLocationButton={false}
            >
              {filtered.map((shop) => (
                <Marker
                  key={shop.id}
                  coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
                  onPress={() => focusShop(shop)}
                >
                  <View
                    style={[
                      styles.pin,
                      selected?.id === shop.id ? styles.pinActive : null,
                    ]}
                  >
                    <Ionicons
                      name={shop.type === 'mobile' ? 'car-sport' : 'business'}
                      size={14}
                      color={colors.white}
                    />
                  </View>
                </Marker>
              ))}
            </MapView>
          ) : (
            <MapFallback shops={filtered} onSelect={focusShop} selected={selected} />
          )}

          <View style={styles.mapOverlay}>
            <View style={styles.count}>
              <Ionicons name="pin" size={14} color={colors.primary} />
              <Text style={[typography.captionStrong, { marginLeft: 4 }]}>
                {filtered.length} shops
              </Text>
            </View>
          </View>

          <View style={styles.bottomSheet}>
            <FlatList
              data={filtered}
              horizontal
              keyExtractor={(s) => s.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: spacing.m }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    focusShop(item);
                  }}
                  onLongPress={() =>
                    navigation.navigate('ShopDetail', { shopId: item.id })
                  }
                  style={[
                    styles.sheetCard,
                    selected?.id === item.id ? styles.sheetCardActive : null,
                  ]}
                >
                  <View style={styles.sheetHead}>
                    <View style={styles.sheetMark}>
                      <Text style={styles.sheetMarkText}>{item.name.charAt(0)}</Text>
                    </View>
                    <Badge
                      label={item.type === 'mobile' ? 'Mobile' : 'Shop'}
                      tone="dark"
                    />
                  </View>
                  <Text style={[typography.title, { marginTop: spacing.s }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Ionicons name="star" size={12} color={colors.primary} />
                    <Text style={[typography.caption, { marginLeft: 4 }]}>
                      {item.rating.toFixed(1)} ({item.reviews})
                    </Text>
                  </View>
                  <Text
                    style={[typography.caption, { marginTop: 2 }]}
                    numberOfLines={1}
                  >
                    {item.city}, {item.state}
                  </Text>
                  <Pressable
                    style={styles.sheetBtn}
                    onPress={() => navigation.navigate('ShopDetail', { shopId: item.id })}
                  >
                    <Text style={[typography.captionStrong, { color: colors.white }]}>
                      View details
                    </Text>
                  </Pressable>
                </Pressable>
              )}
            />
          </View>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(s) => s.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ShopCard
              shop={item}
              onPress={() => navigation.navigate('ShopDetail', { shopId: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search" size={28} color={colors.gray400} />
              <Text style={[typography.title, { marginTop: spacing.s }]}>No shops found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const MapFallback: React.FC<{
  shops: Shop[];
  onSelect: (s: Shop) => void;
  selected: Shop | null;
}> = ({ shops, onSelect, selected }) => {
  const center = { latitude: 39.8283, longitude: -98.5795 };
  return (
    <View style={fallbackStyles.wrap}>
      <View style={fallbackStyles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={`h${i}`}
            style={[
              fallbackStyles.line,
              { top: (i * 100) / 8 + '%' as any, width: '100%', height: StyleSheet.hairlineWidth },
            ]}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={`v${i}`}
            style={[
              fallbackStyles.line,
              { left: (i * 100) / 8 + '%' as any, height: '100%', width: StyleSheet.hairlineWidth },
            ]}
          />
        ))}
      </View>
      {shops.map((shop) => {
        const dx = (shop.longitude - center.longitude) / 30;
        const dy = (shop.latitude - center.latitude) / 20;
        const left = `${Math.min(90, Math.max(5, 50 + dx * 100))}%`;
        const top = `${Math.min(85, Math.max(5, 50 - dy * 100))}%`;
        return (
          <Pressable
            key={shop.id}
            onPress={() => onSelect(shop)}
            style={[fallbackStyles.pinWrap, { left: left as any, top: top as any }]}
          >
            <View
              style={[
                styles.pin,
                selected?.id === shop.id ? styles.pinActive : null,
              ]}
            >
              <Ionicons
                name={shop.type === 'mobile' ? 'car-sport' : 'business'}
                size={14}
                color={colors.white}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  search: {
    flex: 1,
    height: 48,
    borderRadius: radii.m,
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.s,
    fontSize: 15,
    color: colors.ink,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.gray100,
    borderRadius: radii.m,
    padding: 4,
  },
  segmentBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.black,
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.m,
  },
  mapWrap: {
    flex: 1,
    backgroundColor: colors.gray100,
    position: 'relative',
  },
  mapOverlay: {
    position: 'absolute',
    top: spacing.m,
    right: spacing.xl,
  },
  count: {
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.m,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    ...(shadows.sm as any),
  },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  pinActive: {
    backgroundColor: colors.primary,
    transform: [{ scale: 1.15 }],
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: spacing.m,
  },
  sheetCard: {
    width: 240,
    padding: spacing.l,
    borderRadius: radii.l,
    backgroundColor: colors.white,
    ...(shadows.md as any),
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetCardActive: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetMarkText: {
    color: colors.white,
    fontWeight: '800',
  },
  sheetBtn: {
    marginTop: spacing.m,
    backgroundColor: colors.primary,
    borderRadius: radii.m,
    paddingVertical: 10,
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
  },
  empty: {
    padding: spacing.huge,
    alignItems: 'center',
  },
});

const fallbackStyles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
  },
  line: {
    position: 'absolute',
    backgroundColor: colors.gray300,
  },
  pinWrap: {
    position: 'absolute',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
});
