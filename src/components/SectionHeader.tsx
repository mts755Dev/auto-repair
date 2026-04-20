import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

type Props = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export const SectionHeader: React.FC<Props> = ({ title, action, onAction }) => (
  <View style={styles.wrap}>
    <Text style={typography.h3}>{title}</Text>
    {action ? (
      <Pressable onPress={onAction} hitSlop={8}>
        <Text style={[typography.captionStrong, { color: colors.primary }]}>{action}</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
});
