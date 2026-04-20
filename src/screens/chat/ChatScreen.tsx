import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

import { ChatStackParamList } from '@/navigation/types';
import { useChatStore } from '@/store/chatStore';
import { useCurrentUser } from '@/store/authStore';
import { SHOPS } from '@/data/shops';
import { colors, radii, spacing, typography } from '@/theme';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';

type Props = NativeStackScreenProps<ChatStackParamList, 'Chat'>;

export default function ChatScreen({ navigation, route }: Props) {
  const user = useCurrentUser();
  const thread = useChatStore((s) => s.getThread(route.params.threadId));
  const messages = useChatStore((s) => s.getMessages(route.params.threadId));
  const sendMessage = useChatStore((s) => s.sendMessage);
  const simulateReply = useChatStore((s) => s.simulateShopReply);
  const markRead = useChatStore((s) => s.markRead);

  const shop = thread ? SHOPS.find((s) => s.id === thread.shopId) : undefined;

  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (thread) markRead(thread.id);
  }, [thread?.id, markRead]);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages.length]);

  const onSend = () => {
    if (!text.trim() || !user || !thread) return;
    sendMessage(thread.id, user.id, `${user.firstName} ${user.lastName}`, text.trim());
    setText('');
    setTyping(true);
    const delay = 1400 + Math.random() * 1200;
    setTimeout(() => {
      setTyping(false);
      simulateReply(thread.id, thread.shopId);
      markRead(thread.id);
    }, delay);
  };

  if (!thread) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={typography.body}>Chat not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.ink} />
        </Pressable>
        <Pressable
          onPress={() => shop && navigation.navigate('ShopDetail', { shopId: shop.id })}
          style={styles.headInfo}
        >
          <Avatar name={thread.shopName} size={40} />
          <View style={{ marginLeft: spacing.s, flex: 1 }}>
            <Text style={typography.title} numberOfLines={1}>
              {thread.shopName}
            </Text>
            <Text style={[typography.caption, { color: colors.gray500 }]} numberOfLines={1}>
              {shop?.openNow ? 'Online now' : 'Offline'}
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => shop && navigation.navigate('ShopDetail', { shopId: shop.id })}
          hitSlop={10}
          style={styles.iconBtn}
        >
          <Ionicons name="information-circle-outline" size={22} color={colors.ink} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<ChatIntro shopName={thread.shopName} />}
          ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
          renderItem={({ item, index }) => {
            const mine = item.senderId === user?.id;
            const prev = messages[index - 1];
            const showAvatar =
              !mine && (!prev || prev.senderId !== item.senderId);
            const showDate =
              !prev ||
              dayjs(prev.createdAt).format('YYYY-MM-DD') !==
                dayjs(item.createdAt).format('YYYY-MM-DD');

            return (
              <View>
                {showDate ? (
                  <View style={styles.dateDivider}>
                    <Text style={[typography.caption, { color: colors.gray500 }]}>
                      {dayjs(item.createdAt).format('MMM D, YYYY')}
                    </Text>
                  </View>
                ) : null}
                <View
                  style={[
                    styles.msgRow,
                    { justifyContent: mine ? 'flex-end' : 'flex-start' },
                  ]}
                >
                  {!mine ? (
                    <View style={{ width: 36, marginRight: 6 }}>
                      {showAvatar ? <Avatar name={thread.shopName} size={32} /> : null}
                    </View>
                  ) : null}
                  <View
                    style={[
                      styles.bubble,
                      mine ? styles.bubbleMine : styles.bubbleTheirs,
                    ]}
                  >
                    <Text
                      style={[
                        typography.body,
                        { color: mine ? colors.white : colors.ink },
                      ]}
                    >
                      {item.body}
                    </Text>
                    <Text
                      style={[
                        styles.msgMeta,
                        { color: mine ? 'rgba(255,255,255,0.7)' : colors.gray500 },
                      ]}
                    >
                      {dayjs(item.createdAt).format('h:mm A')}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            typing ? (
              <View style={styles.typingRow}>
                <Avatar name={thread.shopName} size={24} />
                <View style={styles.typingBubble}>
                  <View style={styles.dotTyping} />
                  <View style={[styles.dotTyping, { marginHorizontal: 4 }]} />
                  <View style={styles.dotTyping} />
                </View>
              </View>
            ) : null
          }
        />

        <View style={styles.composer}>
          <View style={styles.inputWrap}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Write a message..."
              placeholderTextColor={colors.gray400}
              style={styles.input}
              multiline
            />
          </View>
          <Pressable
            onPress={onSend}
            disabled={!text.trim()}
            style={[
              styles.sendBtn,
              { backgroundColor: text.trim() ? colors.primary : colors.gray300 },
            ]}
          >
            <Ionicons name="arrow-up" size={18} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ChatIntro: React.FC<{ shopName: string }> = ({ shopName }) => (
  <View style={styles.intro}>
    <Badge label="End-to-end conversation" tone="neutral" icon="lock-closed-outline" />
    <Text style={[typography.caption, { marginTop: spacing.s, textAlign: 'center' }]}>
      You're chatting with {shopName}. Responses typically arrive within a few minutes
      during business hours.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
    backgroundColor: colors.white,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.m,
    paddingTop: spacing.l,
    flexGrow: 1,
  },
  intro: {
    alignItems: 'center',
    paddingVertical: spacing.m,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 20,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s + 2,
  },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  bubbleTheirs: {
    backgroundColor: colors.gray100,
    borderBottomLeftRadius: 6,
  },
  msgMeta: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  dateDivider: {
    alignItems: 'center',
    marginVertical: spacing.m,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.s,
  },
  typingBubble: {
    marginLeft: spacing.s,
    backgroundColor: colors.gray100,
    borderRadius: 20,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s + 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotTyping: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gray500,
  },
  composer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
  },
  inputWrap: {
    flex: 1,
    borderRadius: radii.l,
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.l,
    paddingVertical: 8,
    minHeight: 44,
    maxHeight: 120,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    color: colors.ink,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.s,
  },
});
