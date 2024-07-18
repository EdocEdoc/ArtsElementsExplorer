import { GestureHandlerRootView } from "react-native-gesture-handler";

import { StyleSheet, Text, View } from "react-native";
import Providers from "./src/Navigation/Provider";
import CanvasScreen from "./src/components/Canvas";

export default function App() {
  return <Providers />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
