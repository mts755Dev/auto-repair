import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '@/theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  background?: string;
  edges?: Edge[];
  contentStyle?: ViewStyle;
  keyboardAvoiding?: boolean;
};

export const Screen: React.FC<Props> = ({
  children,
  scroll = false,
  padded = false,
  background = colors.background,
  edges = ['top', 'bottom'],
  contentStyle,
  keyboardAvoiding = false,
}) => {
  const Content = scroll ? ScrollView : View;

  const content = (
    <Content
      style={{ flex: 1 }}
      contentContainerStyle={[
        scroll ? { flexGrow: 1 } : null,
        padded ? styles.padded : null,
        contentStyle,
      ] as ViewStyle[]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </Content>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: background }]}>
      <StatusBar style="dark" />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  padded: { paddingHorizontal: 20, paddingVertical: 16 },
});
