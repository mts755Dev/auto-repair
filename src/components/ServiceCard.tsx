import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '@/types';
import { Card } from './Card';
import { colors, radii, spacing, typography } from '@/theme';
import { formatCurrency } from '@/utils/format';

type Props = {
  service: Service;
  onPress?: () => void;
  selected?: boolean;
  showSelect?: boolean;
  style?: ViewStyle;
};

export const ServiceCard: React.FC<Props> = ({ service, onPress, selected, showSelect, style }) => {
  return (
    <Card
      onPress={onPress}
      padded={false}
      bordered
      style={[
        styles.card,
        selected ? { borderColor: colors.primary, borderWidth: 1.5 } : undefined,
        style,
      ] as ViewStyle[]}
    >
      <View style={styles.row}>
        <View style={[styles.iconWrap, selected ? styles.iconOn : null]}>
          <Ionicons
            name={service.icon as any}
            size={22}
            color={selected ? colors.white : colors.primaryDark}
          />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.m }}>
          <Text style={typography.title} numberOfLines={1}>
            {service.title}
          </Text>
          <Text style={[typography.caption, { marginTop: 2 }]} numberOfLines={2}>
            {service.description}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={12} color={colors.gray500} />
              <Text style={[typography.caption, { marginLeft: 4 }]}>
                {service.durationMin} min
              </Text>
            </View>
            <View style={[styles.metaItem, { marginLeft: spacing.m }]}>
              <Ionicons name="pricetag-outline" size={12} color={colors.gray500} />
              <Text style={[typography.caption, { marginLeft: 4 }]}>
                from {formatCurrency(service.priceFrom)}
              </Text>
            </View>
          </View>
        </View>
        {showSelect ? (
          <View style={[styles.checkbox, selected ? styles.checkboxOn : null]}>
            {selected ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.l,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radii.m,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOn: {
    backgroundColor: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
