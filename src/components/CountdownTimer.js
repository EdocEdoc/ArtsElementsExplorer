import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { colors } from "../Utils/colors";

const CountdownTimer = ({ isoDate, returnData }) => {
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  function calculateRemainingTime() {
    const targetDate = new Date(isoDate);
    const now = new Date();
    const difference = targetDate - now;
    return Math.max(0, difference);
  }

  useEffect(() => {
    returnData({
      status: "playing",
    });
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [isoDate]);

  useEffect(() => {
    if (remainingTime <= 0) {
      // Handle timeout
      returnData({
        status: "timeout",
      });
    }
  }, [remainingTime]);

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.blue,
        justifyContent: "center",
        padding: 10,
        borderRadius: 10,
      }}
    >
      <Ionicons name={"alarm"} size={30} color={colors.yellow} />
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginLeft: 10,
          color: colors.white,
        }}
      >
        {formatTime(remainingTime)}
      </Text>
    </View>
  );
};

export default CountdownTimer;
