import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { useAppContext } from "../Contexts/AppContext";
import { Button, TextInput } from "react-native-paper";
import Animated, { FadeInRight } from "react-native-reanimated";

const dummyChats = [
  {
    id: 1,
    name: "John",
    chat: "Hello!",
  },
  { id: 2, name: "Alice", chat: "Hi there!" },
];
/* 
{ id: 3, name: "Bob", chat: "How are you?" },
  { id: 4, name: "Emma", chat: "Nice to meet you!" },
  { id: 5, name: "Mike", chat: "What's up?" }, */

const ChatScreen = ({ chatData }) => {
  const scrollViewRef = useRef();

  return (
    <ScrollView
      nestedScrollEnabled
      ref={scrollViewRef}
      onContentSizeChange={() =>
        scrollViewRef.current.scrollToEnd({ animated: true })
      }
    >
      {chatData.map((chat, index) => (
        <View
          key={chat?.id + index}
          style={{
            alignItems: "flex-end",
            flexShrink: 1,
          }}
        >
          <Animated.View
            entering={FadeInRight.duration(500).delay(100)}
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
              margin: 2.5,
              backgroundColor: chat?.isCorrect
                ? "rgba(40, 138, 40, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
              alignItems: "flex-end",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {chat.name.length > 20
                ? chat.name.slice(0, 20) + "..."
                : chat.name}
            </Text>
            <Text>
              {chat.message.length > 20
                ? chat.message.slice(0, 50) + "..."
                : chat.message}
            </Text>
          </Animated.View>
        </View>
      ))}
    </ScrollView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
