import React from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '@/navigation/types';
import { useCurrentUser } from '@/store/authStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { VehicleCard } from '@/components/VehicleCard';
import { Empty } from '@/components/Empty';
import { Button } from '@/components/Button';
import { colors, spacing } from '@/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Vehicles'>;

export default function VehiclesScreen({ navigation }: Props) {
  const user = useCurrentUser();
  const vehicles = useVehicleStore((s) => (user ? s.getByUser(user.id) : []));
  const setPrimary = useVehicleStore((s) => s.setPrimary);
  const remove = useVehicleStore((s) => s.removeVehicle);

  return (
    <Screen background={colors.white}>
      <Header
        title="My vehicles"
        rightIcon="add"
        onRightPress={() => navigation.navigate('VehicleEditor')}
      />
      <FlatList
        data={vehicles}
        keyExtractor={(v) => v.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            onPress={() =>
              Alert.alert(
                `${item.year} ${item.make} ${item.model}`,
                undefined,
                [
                  { text: 'Edit', onPress: () => navigation.navigate('VehicleEditor', { vehicleId: item.id }) },
                  ...(item.isPrimary
                    ? []
                    : [
                        {
                          text: 'Set as primary',
                          onPress: () => user && setPrimary(item.id, user.id),
                        },
                      ]),
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () =>
                      Alert.alert(
                        'Delete vehicle?',
                        'This will remove it from your saved vehicles.',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => remove(item.id),
                          },
                        ],
                      ),
                  },
                  { text: 'Close', style: 'cancel' },
                ],
              )
            }
          />
        )}
        ListEmptyComponent={
          <Empty
            icon="car-sport-outline"
            title="No vehicles saved"
            description="Add your vehicle to book services faster."
            actionLabel="Add vehicle"
            onAction={() => navigation.navigate('VehicleEditor')}
          />
        }
        ListFooterComponent={
          vehicles.length > 0 ? (
            <View style={{ marginTop: spacing.m }}>
              <Button
                title="Add another vehicle"
                variant="secondary"
                leftIcon="add"
                onPress={() => navigation.navigate('VehicleEditor')}
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
});
