import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export const Chip: React.FC<Props> = ({ label, selected, onPress, icon }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        {
          backgroundColor: selected ? colors.primary : colors.white,
          borderColor: selected ? colors.primary : colors.gray300,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={14}
          color={selected ? colors.white : colors.ink}
          style={{ marginRight: 6 }}
        />
      ) : null}
      <Text
        style={[
          typography.captionStrong,
          { color: selected ? colors.white : colors.ink },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    height: 34,
    paddingHorizontal: spacing.l,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: spacing.s,
  },
});
