import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

import { ChatStackParamList } from '@/navigation/types';
import { useChatStore } from '@/store/chatStore';
import { useCurrentUser } from '@/store/authStore';
import { Avatar } from '@/components/Avatar';
import { Empty } from '@/components/Empty';
import { colors, radii, spacing, typography } from '@/theme';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatList'>;

export default function ChatListScreen({ navigation }: Props) {
  const user = useCurrentUser();
  const threads = useChatStore((s) => (user ? s.getThreadsByUser(user.id) : []));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={typography.h1}>Messages</Text>
          <Text style={[typography.caption, { marginTop: 4 }]}>
            Chat with shops and mobile mechanics.
          </Text>
        </View>
      </View>

      <FlatList
        data={threads}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('Chat', { threadId: item.id })}
            style={styles.row}
            android_ripple={{ color: colors.gray100 }}
          >
            <Avatar name={item.shopName} size={52} />
            <View style={{ flex: 1, marginLeft: spacing.m }}>
              <View style={styles.rowTop}>
                <Text style={typography.title} numberOfLines={1}>
                  {item.shopName}
                </Text>
                <Text style={[typography.caption, { marginLeft: spacing.s }]}>
                  {item.lastMessageAt ? dayjs(item.lastMessageAt).format('h:mm A') : ''}
                </Text>
              </View>
              <View style={styles.rowBottom}>
                <Text
                  style={[
                    typography.body,
                    { flex: 1, color: item.unread ? colors.ink : colors.gray700 },
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage ?? 'Say hello to get started'}
                </Text>
                {item.unread ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {item.unread > 9 ? '9+' : item.unread}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Empty
            icon="chatbubbles-outline"
            title="No messages yet"
            description="Start a conversation with a shop from the discovery page."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.m,
    paddingBottom: spacing.l,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
    flexGrow: 1,
  },
  row: {
    paddingVertical: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  sep: {
    height: 1,
    backgroundColor: colors.divider,
  },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.s,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
});
