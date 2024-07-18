import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CountDown = ({ trigger, returnData, setTimerStatus, currentRound }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(5000); // 5 seconds in milliseconds initially
  const [currentStatus, setCurrentStatus] = useState("standby");
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (!isRunning) {
      returnData({
        round: 1,
        status: "standby",
      });
      intervalRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setRemainingTime(5000); // Reset to 5 seconds
    setCurrentStatus("standby");
    setIsRunning(false);
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  useEffect(() => {
    if (trigger === "start") startTimer();
    if (trigger === "reset") resetTimer();
  }, [trigger]);

  useEffect(() => {
    if (remainingTime === 0) {
      if (currentStatus == "drawing") {
        returnData({
          round: 2,
          status: "timeout",
        });
        resetTimer();
      } else {
        returnData({
          round: 3,
          status: "drawing",
        });
        setRemainingTime(60000); // 120 seconds
        setCurrentStatus("drawing");
      }
    }
  }, [remainingTime]);

  /* useEffect(() => {
    const curData = {
      round: currentStatus == "drawing" ? round / 2 : (round + 1) / 2,
      status: currentStatus,
    };
    returnData(curData);
  }, [round]); */

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name={"alarm"} size={30} color="black" />
        <Text style={styles.timer}>{formatTime(remainingTime)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  timer: {
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default CountDown;
