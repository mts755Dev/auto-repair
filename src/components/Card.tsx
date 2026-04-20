import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { colors, radii, shadows, spacing } from '@/theme';

type Props = ViewProps & {
  onPress?: () => void;
  padded?: boolean;
  elevated?: boolean;
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Card: React.FC<Props> = ({
  children,
  onPress,
  padded = true,
  elevated = false,
  bordered = true,
  style,
  ...rest
}) => {
  const base: StyleProp<ViewStyle>[] = [
    styles.card,
    padded ? styles.padded : null,
    bordered ? styles.bordered : null,
    elevated ? (shadows.sm as ViewStyle) : null,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: colors.gray100 }}
        style={({ pressed }) => [base, { opacity: pressed ? 0.94 : 1 }, style]}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[base, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.l,
    overflow: 'hidden',
  },
  padded: {
    padding: spacing.l,
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});
