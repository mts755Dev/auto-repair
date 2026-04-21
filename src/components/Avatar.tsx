import React from 'react';
import { Image, Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '@/theme';

type Props = {
  name?: string;
  uri?: string;
  size?: number;
  style?: ViewStyle;
  backgroundColor?: string;
};

export const Avatar: React.FC<Props> = ({
  name = '',
  uri,
  size = 44,
  style,
  backgroundColor,
}) => {
  const initials = getInitials(name);
  const bg = backgroundColor ?? pickColor(name);
  const fontSize = Math.max(12, Math.round(size * 0.4));

  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
        style,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={[
            styles.initials,
            {
              fontSize,
              lineHeight: Math.round(fontSize * 1.15),
            },
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
};

function getInitials(name: string) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const palette = [colors.black, colors.primaryDark, colors.charcoal, colors.primary, colors.slate];

function pickColor(name: string) {
  if (!name) return colors.gray500;
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return palette[sum % palette.length];
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    color: colors.white,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    letterSpacing: 0.2,
    ...Platform.select({
      android: { includeFontPadding: false },
      default: {},
    }),
  },
});
