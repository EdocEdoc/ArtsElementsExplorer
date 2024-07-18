import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Headline, Surface, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Spacer from "../components/Spacer";
import { useAppContext } from "../Contexts/AppContext";
import { logRoomEntry } from "../Data/rooms";
import { colors } from "../Utils/colors";
import { Svg } from "react-native-svg";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { translate } from "../Utils/translation";
import { FONTS } from "../Utils/constants";

const LoginScreen = ({ navigation }) => {
  const [selecetedLanguage, setSelecetedLanguage] = useState("en");
  const [username, setUsername] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settingUp, setSettingUp] = useState(true);

  const appContext = useAppContext();
  const { t, setUserLanguage } = appContext;

  const onPressStart = async () => {
    if (!username || !roomCode) {
      alert(translate("str-fill-fields", t));
      return;
    }
    setIsLoading(true);
    const userData = {
      name: username,
      isLogin: true,
    };

    console.log("🚀 ~ onPressStart ~ userData", userData, roomCode);
    const entryData = await logRoomEntry(userData, roomCode);
    console.log("🚀 ~ onPressStart ~ entryData", entryData);
    if (entryData) {
      appContext.setUser({ ...entryData });
    } else {
      alert(translate("str-error-login", t));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selecetedLanguage) {
      setUserLanguage(selecetedLanguage);
    }
  }, [selecetedLanguage]);

  useEffect(() => {
    if (t) {
      setSettingUp(false);
    } else {
      setSettingUp(true);
    }
  }, [t]);

  return (
    <ImageBackground
      source={require("../../assets/bg-image.png")}
      style={{
        flex: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.ligthBlue,
        reziseMode: "cover",
      }}
    >
      <Animated.View entering={FadeInUp.duration(1000)}>
        <Headline
          style={{
            fontSize: 80,
            lineHeight: 80,
            textShadowColor: colors.darkBlue,
            textShadowOffset: { width: -2, height: 2 },
            textShadowRadius: 5,
            fontFamily: FONTS.CabinSketchBold,
            color: colors.yellow,
          }}
        >
          {translate("str-sketch", t)}
        </Headline>
      </Animated.View>
      <Animated.View
        entering={FadeInDown.duration(300).delay(100)}
        style={{ width: "70%" }}
      >
        <Surface
          style={{
            width: "100%",
            padding: 20,
            borderRadius: 10,
            backgroundColor: colors.blue,
          }}
        >
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TextInput
              style={{
                flex: 1,
                marginRight: 20,
                backgroundColor: colors.white,
              }}
              mode="outlined"
              placeholder={translate("str-enter-name", t)}
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
            <Picker
              style={{
                backgroundColor: colors.white,
                borderWidth: 2,
                borderColor: "black",
                borderRadius: 10,
                flex: 1,
              }}
              selectedValue={selecetedLanguage}
              onValueChange={(itemValue, itemIndex) =>
                setSelecetedLanguage(itemValue)
              }
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Bisaya" value="cb" />
              <Picker.Item label="Filipino" value="fl" />
            </Picker>
          </Animated.View>
          <Spacer size={10} />
          <Animated.View entering={FadeInDown.duration(500).delay(500)}>
            <TextInput
              style={{ textAlign: "center", backgroundColor: colors.white }}
              mode="outlined"
              placeholder={translate("str-room-code", t)}
              value={roomCode}
              onChangeText={(text) => setRoomCode(text)}
              autoCapitalize="characters"
            />
            <Spacer size={10} />
            <Button
              mode="contained"
              disabled={isLoading}
              loading={isLoading}
              onPress={onPressStart}
              style={{
                backgroundColor: colors.darkBlue,
                borderWidth: 3,
                borderColor: colors.yellow,
                padding: 0,
              }}
              compact
              contentStyle={{
                padding: 0,
                margin: 0,
              }}
              uppercase
              labelStyle={{
                fontFamily: FONTS.PoppinsBold,
                fontSize: 24,
                marginBottom: 0,
                padding: 5,
                paddingTop: 10,
              }}
            >
              {translate("str-start", t)}
            </Button>
          </Animated.View>
        </Surface>
      </Animated.View>

      {settingUp && (
        <View
          style={{
            width: "110%",
            height: "110%",
            backgroundColor: colors.darkBlue,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
          }}
        >
          <Headline
            style={{
              fontSize: 80,
              lineHeight: 80,
              textShadowColor: colors.darkBlue,
              textShadowOffset: { width: -2, height: 2 },
              textShadowRadius: 5,
              fontFamily: FONTS.CabinSketchBold,
              color: colors.yellow,
            }}
          >
            SKETCH CLASH
          </Headline>
          <ActivityIndicator size={100} color={colors.yellow} />
        </View>
      )}
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
