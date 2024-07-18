import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useAppContext } from "../Contexts/AppContext";
import { colors } from "../Utils/colors";
import { Caption, Headline, Subheading, Title } from "react-native-paper";
import Spacer from "../components/Spacer";
import { ScrollView } from "react-native-gesture-handler";
import { translate } from "../Utils/translation";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { FONTS } from "../Utils/constants";

import Confetti from "react-native-confetti";

const ScoreScreen = () => {
  const { inRoom, room, user, t, logout } = useAppContext();
  const [userData, setuserData] = useState(null);
  const confettiRef = React.useRef(null);

  useEffect(() => {
    if (user?.id && Array.isArray(inRoom)) {
      const userInRoom = inRoom.find((item) => item.id === user.id);
      setuserData(userInRoom);
    }
  }, [inRoom, user]);

  useEffect(() => {
    if (confettiRef.current) {
      confettiRef.current.startConfetti();
    }

    return () => {
      if (confettiRef.current) {
        confettiRef.current.stopConfetti();
      }
    };
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.ligthBlue,
      }}
    >
      <ImageBackground
        source={require("../../assets/bg-image.png")}
        blurRadius={3}
      >
        <Confetti ref={confettiRef} untilStopped />
        <View
          style={{ marginBottom: -50, marginTop: 50, marginHorizontal: 20 }}
        >
          <Ionicons
            name={"close-circle"}
            size={40}
            color={colors.darkBlue}
            onPress={() => {
              logout();
            }}
          />
        </View>
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Title
            style={{
              fontSize: 50,
              lineHeight: 60,
              fontFamily: FONTS.PoppinsBold,
            }}
          >
            {translate("str-finished", t)}
          </Title>
          <Spacer height={50} />
          <Headline style={{ letterSpacing: 2, fontFamily: FONTS.PoppinsBold }}>
            {userData?.name}
          </Headline>
          <Caption style={{ marginTop: -10 }}>{userData?.id}</Caption>
          <Subheading
            style={{
              color: colors.darkBlue,
              fontFamily: FONTS.PoppinsSemiBold,
            }}
          >
            {translate("str-scored", t)}
          </Subheading>
          <View
            style={{
              borderRadius: 10,
              backgroundColor: colors.darkBlue,
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 10,
              paddingTop: 20,
              paddingHorizontal: 20,
              marginVertical: 15,
            }}
          >
            <Headline
              style={{
                fontWeight: "bold",
                fontSize: 50,
                lineHeight: 50,
                color: colors.yellow,
                fontFamily: FONTS.PoppinsBold,
              }}
            >
              {userData?.score || 0}
            </Headline>
          </View>
          <View style={{ margin: 100, alignSelf: "center" }}>
            <Text>ROOM DETAILS</Text>
            <Text>Room Code: {room?.code}</Text>
            <Text></Text>
            <Text>USER DETAILS</Text>
            <Text>User Id: {userData?.id}</Text>
            <Text>User Meta data: {JSON.stringify(userData)}</Text>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default ScoreScreen;

const styles = StyleSheet.create({});
