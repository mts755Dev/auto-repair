import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { ServiceCard } from '@/components/ServiceCard';
import { SERVICES } from '@/data/services';
import { colors, radii, spacing, typography } from '@/theme';
import { Chip } from '@/components/Chip';

type Props = NativeStackScreenProps<HomeStackParamList, 'Services'>;

const CATEGORIES: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'oil-change', label: 'Oil' },
  { key: 'brakes', label: 'Brakes' },
  { key: 'tires', label: 'Tires' },
  { key: 'diagnostics', label: 'Diagnostics' },
  { key: 'ac', label: 'A/C' },
  { key: 'battery', label: 'Battery' },
  { key: 'alignment', label: 'Alignment' },
  { key: 'engine', label: 'Engine' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'inspection', label: 'Inspection' },
  { key: 'detailing', label: 'Detailing' },
  { key: 'body', label: 'Body' },
];

export default function ServicesScreen({ navigation, route }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(route.params?.initialCategory ?? 'all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES.filter((s) => {
      const catOk = category === 'all' || s.category === category;
      const qOk =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [category, query]);

  return (
    <Screen background={colors.white}>
      <Header title="Browse services" />
      <View style={styles.searchWrap}>
        <View style={styles.search}>
          <Ionicons name="search-outline" size={18} color={colors.gray500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services"
            placeholderTextColor={colors.gray400}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c.key}
        showsHorizontalScrollIndicator={false}
        style={styles.chips}
        contentContainerStyle={styles.chipsRow}
        renderItem={({ item }) => (
          <Chip
            label={item.label}
            selected={category === item.key}
            onPress={() => setCategory(item.key)}
          />
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        style={styles.listFill}
        contentContainerStyle={[
          styles.list,
          filtered.length === 0 ? styles.listEmpty : null,
        ]}
        renderItem={({ item }) => (
          <ServiceCard
            service={item}
            onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search" size={28} color={colors.gray400} />
            <Text style={[typography.title, { marginTop: spacing.s }]}>No services found</Text>
            <Text style={[typography.caption, { textAlign: 'center' }]}>
              Try a different keyword or category.
            </Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.m,
  },
  search: {
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
  chips: {
    flexGrow: 0,
    flexShrink: 0,
  },
  chipsRow: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.s,
  },
  listFill: {
    flex: 1,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.m,
    paddingBottom: spacing.huge,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  empty: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
});
