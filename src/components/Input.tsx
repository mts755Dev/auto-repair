import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  hint?: string;
};

export const Input: React.FC<Props> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  hint,
  secureTextEntry,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [hide, setHide] = useState(Boolean(secureTextEntry));
  const showToggleSecure = Boolean(secureTextEntry);

  const borderColor = error
    ? colors.danger
    : focused
      ? colors.primary
      : colors.gray200;

  return (
    <View style={[{ marginBottom: spacing.m }, containerStyle]}>
      {label ? <Text style={[typography.captionStrong, styles.label]}>{label}</Text> : null}
      <View style={[styles.field, { borderColor, backgroundColor: colors.white }]}>
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={18}
            color={focused ? colors.primary : colors.gray500}
            style={{ marginRight: spacing.s }}
          />
        ) : null}
        <TextInput
          {...rest}
          secureTextEntry={showToggleSecure ? hide : false}
          placeholderTextColor={colors.gray400}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[styles.input, rest.style]}
        />
        {showToggleSecure ? (
          <Pressable onPress={() => setHide((h) => !h)} hitSlop={10}>
            <Ionicons
              name={hide ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={colors.gray500}
            />
          </Pressable>
        ) : rightIcon ? (
          <Pressable onPress={onRightIconPress} hitSlop={10}>
            <Ionicons name={rightIcon} size={18} color={colors.gray500} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text style={[typography.caption, { color: colors.danger, marginTop: 4 }]}>{error}</Text>
      ) : hint ? (
        <Text style={[typography.caption, { marginTop: 4 }]}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    color: colors.ink,
  },
  field: {
    minHeight: 52,
    borderRadius: radii.m,
    borderWidth: 1,
    paddingHorizontal: spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
  },
});
