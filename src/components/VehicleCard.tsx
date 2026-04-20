import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Vehicle } from '@/types';
import { Card } from './Card';
import { Badge } from './Badge';
import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  vehicle: Vehicle;
  onPress?: () => void;
  selected?: boolean;
  selectable?: boolean;
};

export const VehicleCard: React.FC<Props> = ({ vehicle, onPress, selected, selectable }) => {
  return (
    <Card
      onPress={onPress}
      padded={false}
      bordered
      style={[
        styles.card,
        selected ? { borderColor: colors.primary, borderWidth: 1.5 } : undefined,
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.iconWrap, selected ? styles.iconOn : null]}>
          <Ionicons
            name="car-sport"
            size={22}
            color={selected ? colors.white : colors.black}
          />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.m }}>
          <View style={styles.titleRow}>
            <Text style={typography.title} numberOfLines={1}>
              {vehicle.nickname ?? `${vehicle.make} ${vehicle.model}`}
            </Text>
            {vehicle.isPrimary ? (
              <Badge label="Primary" tone="primary" style={{ marginLeft: spacing.s }} />
            ) : null}
          </View>
          <Text style={[typography.caption, { marginTop: 2 }]} numberOfLines={1}>
            {vehicle.year} · {vehicle.make} {vehicle.model}
            {vehicle.trim ? ` · ${vehicle.trim}` : ''}
          </Text>
          <View style={styles.metaRow}>
            {vehicle.licensePlate ? (
              <View style={styles.meta}>
                <Ionicons name="pricetag-outline" size={12} color={colors.gray500} />
                <Text style={[typography.caption, { marginLeft: 4 }]}>
                  {vehicle.licensePlate}
                </Text>
              </View>
            ) : null}
            {typeof vehicle.mileage === 'number' ? (
              <View style={[styles.meta, { marginLeft: spacing.m }]}>
                <Ionicons name="speedometer-outline" size={12} color={colors.gray500} />
                <Text style={[typography.caption, { marginLeft: 4 }]}>
                  {vehicle.mileage.toLocaleString()} mi
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        {selectable ? (
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
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOn: {
    backgroundColor: colors.primary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  meta: {
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
