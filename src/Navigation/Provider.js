import React, { useCallback } from "react";
import {
  configureFonts,
  DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { StatusBar, View } from "react-native";
import { AppProvider } from "../Contexts/AppContext";
import Route from "./Route";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    primary: "rgb(0, 99, 152)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(205, 229, 255)",
    onPrimaryContainer: "rgb(0, 29, 50)",
    secondary: "rgb(110, 94, 0)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(255, 226, 92)",
    onSecondaryContainer: "rgb(34, 27, 0)",
    tertiary: "rgb(81, 86, 169)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(225, 224, 255)",
    onTertiaryContainer: "rgb(7, 7, 100)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(252, 252, 255)",
    onBackground: "rgb(26, 28, 30)",
    surface: "rgb(252, 252, 255)",
    onSurface: "rgb(26, 28, 30)",
    surfaceVariant: "rgb(222, 227, 235)",
    onSurfaceVariant: "rgb(66, 71, 78)",
    outline: "rgb(114, 120, 126)",
    outlineVariant: "rgb(194, 199, 207)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(47, 48, 51)",
    inverseOnSurface: "rgb(240, 240, 244)",
    inversePrimary: "rgb(148, 204, 255)",
    elevation: {
      level0: "transparent",
      level1: "rgb(239, 244, 250)",
      level2: "rgb(232, 240, 247)",
      level3: "rgb(224, 235, 244)",
      level4: "rgb(222, 234, 243)",
      level5: "rgb(217, 231, 241)",
    },
    surfaceDisabled: "rgba(26, 28, 30, 0.12)",
    onSurfaceDisabled: "rgba(26, 28, 30, 0.38)",
    backdrop: "rgba(43, 49, 55, 0.4)",
  },
};

const Providers = () => {
  const [fontsLoaded, fontError] = useFonts({
    "Montserrat-Regular": require("../../assets/fonts/Jacquard12-Regular.ttf"),
    "CabinSketch-Bold": require("../../assets/fonts/CabinSketch-Bold.ttf"),
    "CabinSketch-Regular": require("../../assets/fonts/CabinSketch-Regular.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Italic": require("../../assets/fonts/Poppins-Italic.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AppProvider>
        <StatusBar translucent backgroundColor={"rgba(255,255,255,0.1)"} />
        <PaperProvider theme={theme}>
          <Route />
        </PaperProvider>
      </AppProvider>
    </View>
  );
};

export default Providers;
