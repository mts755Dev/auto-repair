import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { Button } from './Button';

type Props = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const Empty: React.FC<Props> = ({
  icon = 'file-tray-outline',
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <View style={styles.wrap}>
    <View style={styles.iconWrap}>
      <Ionicons name={icon} size={28} color={colors.primaryDark} />
    </View>
    <Text style={[typography.h3, { marginTop: spacing.l, textAlign: 'center' }]}>{title}</Text>
    {description ? (
      <Text style={[typography.body, { marginTop: spacing.s, textAlign: 'center' }]}>
        {description}
      </Text>
    ) : null}
    {actionLabel && onAction ? (
      <Button
        title={actionLabel}
        onPress={onAction}
        fullWidth={false}
        style={{ marginTop: spacing.xl }}
      />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
