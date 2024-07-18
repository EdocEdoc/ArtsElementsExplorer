import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const ImagePreview = ({ imageBase64 }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
        style={{ width: "100%", height: "100%", resizeMode: "contain" }}
      />
    </View>
  );
};

export default ImagePreview;

const styles = StyleSheet.create({});
