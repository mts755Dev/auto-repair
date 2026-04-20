import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { useAuthStore, useCurrentUser } from '@/store/authStore';
import { colors, spacing } from '@/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const user = useCurrentUser();
  const update = useAuthStore((s) => s.updateCurrentUser);

  const [firstName, setFirst] = useState(user?.firstName ?? '');
  const [lastName, setLast] = useState(user?.lastName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const onSave = () => {
    update({ firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim(), email: email.trim() });
    navigation.goBack();
  };

  return (
    <Screen background={colors.white} keyboardAvoiding>
      <Header title="Edit profile" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarWrap}>
          <Avatar name={`${firstName} ${lastName}`} size={88} />
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.m }}>
          <View style={{ flex: 1 }}>
            <Input label="First name" value={firstName} onChangeText={setFirst} />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Last name" value={lastName} onChangeText={setLast} />
          </View>
        </View>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          leftIcon="mail-outline"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          leftIcon="call-outline"
          keyboardType="phone-pad"
        />

        <Button title="Save" onPress={onSave} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.huge },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
});
