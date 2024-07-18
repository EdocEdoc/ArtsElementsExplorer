import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Spacer = ({ size }) => {
  return (
    <View>
      {typeof size === "number" && size > 0 && (
        <View style={{ height: size }} />
      )}
    </View>
  );
};

export default Spacer;

const styles = StyleSheet.create({});
