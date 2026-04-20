import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors } from '@/theme';

export const Divider: React.FC<{ style?: ViewStyle; inset?: number }> = ({ style, inset = 0 }) => (
  <View
    style={[
      { height: 1, backgroundColor: colors.divider, marginLeft: inset, marginRight: inset },
      style,
    ]}
  />
);
