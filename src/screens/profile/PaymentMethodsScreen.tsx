import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { ProfileStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { useCurrentUser } from '@/store/authStore';
import { usePaymentStore } from '@/store/paymentStore';
import { Empty } from '@/components/Empty';
import { Badge } from '@/components/Badge';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import { Button } from '@/components/Button';
import { brandLabel } from '@/utils/payment';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PaymentMethods'>;

export default function PaymentMethodsScreen({ navigation }: Props) {
  const user = useCurrentUser();
  const methods = usePaymentStore((s) => (user ? s.getByUser(user.id) : []));
  const setDefault = usePaymentStore((s) => s.setDefault);
  const remove = usePaymentStore((s) => s.removeMethod);

  return (
    <Screen background={colors.white}>
      <Header
        title="Payment methods"
        rightIcon="add"
        onRightPress={() => navigation.navigate('AddPaymentMethod')}
      />
      <FlatList
        data={methods}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              Alert.alert(
                `Card ending in ${item.last4}`,
                undefined,
                [
                  ...(item.isDefault
                    ? []
                    : [
                        {
                          text: 'Set as default',
                          onPress: () => user && setDefault(user.id, item.id),
                        },
                      ]),
                  {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () =>
                      Alert.alert('Remove card?', '', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Remove',
                          style: 'destructive',
                          onPress: () => user && remove(user.id, item.id),
                        },
                      ]),
                  },
                  { text: 'Close', style: 'cancel' },
                ],
              )
            }
          >
            <View style={styles.cardTop}>
              <View style={styles.brand}>
                <Ionicons name="card" size={18} color={colors.white} />
              </View>
              {item.isDefault ? <Badge label="Default" tone="primary" /> : null}
            </View>
            <Text style={styles.cardNumber}>
              •••• •••• •••• {item.last4}
            </Text>
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.cardLabel}>Cardholder</Text>
                <Text style={styles.cardValue}>{item.holder}</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>Expires</Text>
                <Text style={styles.cardValue}>
                  {String(item.expMonth).padStart(2, '0')}/{String(item.expYear).slice(-2)}
                </Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>Brand</Text>
                <Text style={styles.cardValue}>{brandLabel(item.brand)}</Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Empty
            icon="card-outline"
            title="No payment methods"
            description="Add a card to pay securely with Stripe."
            actionLabel="Add card"
            onAction={() => navigation.navigate('AddPaymentMethod')}
          />
        }
        ListFooterComponent={
          methods.length > 0 ? (
            <View style={{ marginTop: spacing.m }}>
              <Button
                title="Add new card"
                variant="secondary"
                leftIcon="add"
                onPress={() => navigation.navigate('AddPaymentMethod')}
              />
            </View>
          ) : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.black,
    borderRadius: radii.l,
    padding: spacing.xl,
    marginBottom: spacing.m,
    ...(shadows.md as any),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    width: 44,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardNumber: {
    color: colors.white,
    fontSize: 22,
    letterSpacing: 2,
    marginTop: spacing.xl,
    fontWeight: '700',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.l,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
});
