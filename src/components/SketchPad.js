/* import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { Canvas, Path } from "@shopify/react-native-skia";
import { Button } from "react-native-paper";

export default function Draw() {
  const [paths, setPaths] = useState([]);

  const pan = Gesture.Pan()
    .onStart((g) => {
      const newPaths = [...paths];
      console.log("🚀 ~ .onStart ~ newPaths:", newPaths);
      newPaths[paths.length] = {
        segments: [],
        color: "#06d6a0",
      };
      newPaths[paths.length].segments.push(`M ${g.x} ${g.y}`);
      setPaths(newPaths);
    })
    .onUpdate((g) => {
      const index = paths.length - 1;
      console.log("🚀 ~ .onUpdate ~ index:", index);
      const newPaths = [...paths];
      if (newPaths?.[index]?.segments) {
        newPaths[index].segments.push(`L ${g.x} ${g.y}`);
        setPaths(newPaths);
      }
    })
    .minDistance(1);

  useEffect(() => {
    console.log("🚀 ~ Draw ~ paths:", paths);
  }, [paths]);

  return (
    <PanGestureHandler gesture={pan}>
      <View collapsable={false} style={{ flex: 1, backgroundColor: "black" }}>
        <Canvas collapsable={false} style={{ flex: 8 }}>
          {paths.map((p, index) => (
            <Path
              key={index}
              path={p.segments.join(" ")}
              strokeWidth={5}
              style="stroke"
              color={p.color}
            />
          ))}
        </Canvas>
        <Button mode="contained" onPress={() => console.log("btn pressed")}>
          asd
        </Button>
      </View>
    </PanGestureHandler>
  );
}
 */
