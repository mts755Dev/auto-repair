import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '@/theme';

type Props = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  transparent?: boolean;
  style?: ViewStyle;
};

export const Header: React.FC<Props> = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightIcon,
  onRightPress,
  transparent,
  style,
}) => {
  const nav = useNavigation();

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: transparent ? 'transparent' : colors.white },
        transparent ? null : styles.bordered,
        style,
      ]}
    >
      <View style={styles.side}>
        {showBack ? (
          <Pressable
            onPress={() => (onBack ? onBack() : nav.canGoBack() && nav.goBack())}
            hitSlop={10}
            style={styles.iconBtn}
          >
            <Ionicons name="chevron-back" size={24} color={colors.ink} />
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
      <View style={styles.center}>
        {title ? (
          <Text style={typography.h3} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text style={[typography.caption, { marginTop: 2 }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, { alignItems: 'flex-end' }]}>
        {rightIcon ? (
          <Pressable onPress={onRightPress} hitSlop={10} style={styles.iconBtn}>
            <Ionicons name={rightIcon} size={22} color={colors.ink} />
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s,
  },
  bordered: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  side: {
    width: 48,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
