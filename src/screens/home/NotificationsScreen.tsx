import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackParamList } from '@/navigation/types';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { useCurrentUser } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Empty } from '@/components/Empty';
import { colors, radii, spacing, typography } from '@/theme';
import { formatRelative } from '@/utils/format';

type Props = NativeStackScreenProps<HomeStackParamList, 'Notifications'>;

export default function NotificationsScreen({ navigation }: Props) {
  const user = useCurrentUser();
  const items = useNotificationStore((s) => (user ? s.getByUser(user.id) : []));
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  return (
    <Screen background={colors.white}>
      <Header
        title="Notifications"
        rightIcon={items.some((n) => !n.read) ? 'checkmark-done-outline' : undefined}
        onRightPress={() => user && markAllRead(user.id)}
      />
      <FlatList
        data={items}
        keyExtractor={(n) => n.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (user) markRead(user.id, item.id);
              if (item.type === 'booking' && item.referenceId) {
                navigation.navigate('BookingDetail', { bookingId: item.referenceId });
              }
            }}
            style={styles.row}
          >
            <View
              style={[
                styles.icon,
                { backgroundColor: toneBg(item.type), opacity: item.read ? 0.6 : 1 },
              ]}
            >
              <Ionicons name={toneIcon(item.type)} size={18} color={colors.white} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.m }}>
              <View style={styles.rowTop}>
                <Text
                  style={[
                    typography.title,
                    { flex: 1 },
                    item.read ? { color: colors.gray700, fontWeight: '600' } : null,
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                {!item.read ? <View style={styles.unread} /> : null}
              </View>
              <Text
                style={[typography.body, { color: colors.gray700, marginTop: 2 }]}
                numberOfLines={2}
              >
                {item.body}
              </Text>
              <Text style={[typography.caption, { marginTop: 4 }]}>
                {formatRelative(item.createdAt)}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Empty
            icon="notifications-outline"
            title="You're all caught up"
            description="Notifications about your bookings and messages will appear here."
          />
        }
      />
    </Screen>
  );
}

function toneIcon(t: string): keyof typeof Ionicons.glyphMap {
  switch (t) {
    case 'booking':
      return 'calendar-outline';
    case 'chat':
      return 'chatbubble-outline';
    case 'payment':
      return 'card-outline';
    default:
      return 'notifications-outline';
  }
}
function toneBg(t: string) {
  switch (t) {
    case 'booking':
      return colors.primary;
    case 'chat':
      return colors.black;
    case 'payment':
      return colors.success;
    default:
      return colors.charcoal;
  }
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.m,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radii.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unread: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.s,
  },
  sep: {
    height: 1,
    backgroundColor: colors.divider,
  },
});
