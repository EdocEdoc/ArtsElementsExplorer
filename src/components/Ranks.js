import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Headline, Subheading, Surface } from "react-native-paper";
import { useAppContext } from "../Contexts/AppContext";
import Animated, { FadeInDown } from "react-native-reanimated";

const rankData = [
  { id: 1, name: "John", score: Math.floor(Math.random() * 100) },
  { id: 2, name: "Jane", score: Math.floor(Math.random() * 100) },
  { id: 3, name: "Bob", score: Math.floor(Math.random() * 100) },
  { id: 4, name: "Alice", score: Math.floor(Math.random() * 100) },
];

const Ranks = () => {
  const { inRoom } = useAppContext();

  const [rankList, setRankList] = useState([]);

  useEffect(() => {
    // check if inroom is not null and is array
    // then set the rankList to inRoom sorted by score, descending
    if (inRoom && Array.isArray(inRoom)) {
      setRankList(
        [...inRoom].sort((a, b) => {
          const aScore = a?.score || 0;
          const bScore = b?.score || 0;
          return bScore - aScore;
        })
      );
    }
  }, [inRoom]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ margin: 20 }}>
        <Headline style={{ fontWeight: "bold" }}>RANKS</Headline>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          minWidth: "50%",
          paddingHorizontal: 20,
        }}
      >
        <Subheading>Name</Subheading>
        <Subheading>Score</Subheading>
      </View>
      {rankList.map((rank, index) => (
        <Animated.View
          key={rank.id}
          entering={FadeInDown.duration(1000).delay(10 * index)}
        >
          <Surface
            key={rank.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              minWidth: "50%",
              padding: 10,
              paddingHorizontal: 20,
              margin: 5,
              borderRadius: 5,
            }}
          >
            <Text>{rank.name}</Text>
            <Text>{rank.score}</Text>
          </Surface>
        </Animated.View>
      ))}
    </View>
  );
};

export default Ranks;

const styles = StyleSheet.create({});
