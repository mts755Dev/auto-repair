import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  title: string;
  onPress?: PressableProps['onPress'];
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Button: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  leftIcon,
  rightIcon,
  fullWidth = true,
  style,
}) => {
  const isDisabled = disabled || loading;
  const palette = getPalette(variant, isDisabled);
  const sizing = getSize(size);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth: palette.borderWidth,
          paddingVertical: sizing.paddingVertical,
          paddingHorizontal: sizing.paddingHorizontal,
          minHeight: sizing.minHeight,
          opacity: pressed && !isDisabled ? 0.92 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={palette.text} />
        ) : (
          <>
            {leftIcon ? (
              <Ionicons
                name={leftIcon}
                size={sizing.icon}
                color={palette.text}
                style={{ marginRight: spacing.s }}
              />
            ) : null}
            <Text style={[typography.button, { color: palette.text, fontSize: sizing.font }]}>
              {title}
            </Text>
            {rightIcon ? (
              <Ionicons
                name={rightIcon}
                size={sizing.icon}
                color={palette.text}
                style={{ marginLeft: spacing.s }}
              />
            ) : null}
          </>
        )}
      </View>
    </Pressable>
  );
};

function getPalette(variant: Variant, disabled?: boolean) {
  if (disabled) {
    return { bg: colors.gray200, text: colors.gray500, border: colors.gray200, borderWidth: 0 };
  }
  switch (variant) {
    case 'secondary':
      return {
        bg: colors.white,
        text: colors.ink,
        border: colors.gray300,
        borderWidth: 1,
      };
    case 'ghost':
      return { bg: 'transparent', text: colors.primary, border: 'transparent', borderWidth: 0 };
    case 'danger':
      return { bg: colors.danger, text: colors.white, border: colors.danger, borderWidth: 0 };
    case 'dark':
      return { bg: colors.black, text: colors.white, border: colors.black, borderWidth: 0 };
    case 'primary':
    default:
      return { bg: colors.primary, text: colors.white, border: colors.primary, borderWidth: 0 };
  }
}

function getSize(size: Size) {
  switch (size) {
    case 'sm':
      return { paddingVertical: 8, paddingHorizontal: 14, minHeight: 36, icon: 16, font: 13 };
    case 'lg':
      return { paddingVertical: 16, paddingHorizontal: 22, minHeight: 56, icon: 20, font: 16 };
    case 'md':
    default:
      return { paddingVertical: 12, paddingHorizontal: 18, minHeight: 48, icon: 18, font: 15 };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
