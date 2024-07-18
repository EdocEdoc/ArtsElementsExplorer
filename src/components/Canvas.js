/* import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SketchCanvas, SketchCanvasRef } from "rn-perfect-sketch-canvas";
import { Button, Subheading } from "react-native-paper";
import Svg, { Path } from "react-native-svg";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { updateRoomSVGContent } from "../Data/rooms";
import { useAppContext } from "../Contexts/AppContext";

const Canvas = ({ setIsDrawing, isDrawwing }) => {
  const canvasRef = useRef(SketchCanvasRef);
  const [theCanvas, setTheCanvas] = useState(null);
  const [drawSVG, setDrawSVG] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [theCurrentPath, setTheCurrentPath] = useState(null);

  const appContext = useAppContext();
  const { room } = appContext;

  useEffect(() => {
    //console.log("🚀 ~ Canvas ~ theCanvas:", theCanvas);
  }, [theCanvas]);

  useEffect(() => {
    //canvasRef.current?.addPoints([[[106.89488636363636, 379.6090198863636]]]);
    canvasRef.current = SketchCanvasRef;
  }, []);

  const onCLickToSVG = () => {
    const svg = canvasRef.current?.toSvg();
    //console.log("🚀 ~ onCLickToSVG ~ svg:", svg);
    setDrawSVG(svg);
  };

  const onCLickToBase64 = () => {
    const base64 = canvasRef.current?.toBase64();
    //console.log("🚀 ~ onCLickToBase64 ~ base64:", base64);
    setImageBase64(base64);
  };

  const currentCanvasRef = (currentCanvas) => {
    console.log("🚀 ~ currentCanvasRef ~ currentCanvas:", currentCanvas);
    canvasRef.current = currentCanvas;
  };

  const intervalRef = useRef(null);
  const pathRef = useRef(null);

  const previousPathsRef = useRef(null);

  useEffect(() => {
    if (isDrawwing) {
      intervalRef.current = setInterval(() => {
        const paths = canvasRef.current?.toPoints();
        if (
          paths &&
          JSON.stringify(paths) !== JSON.stringify(previousPathsRef.current)
        ) {
          previousPathsRef.current = paths;
          console.log(
            "🚀 ~ intervalRef.current=setInterval ~ paths:",
            paths.length
          );
          const base64 = canvasRef.current?.toBase64();
          if (room?.id) {
            new Promise(async (resolve, reject) => {
              resolve(await updateRoomBase46(room?.id, base64));
            }).then((res) => {
              console.log("🚀 ~ intervalRef.current=setInterval ~ res:", res);
            });
          }
        }
      }, 10);
    } else {
      canvasRef.current?.reset();
      clearInterval(intervalRef.current);
      updateRoomBase46(room?.id, null);
    }
  }, [isDrawwing]);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", marginTop: 15 }}>
        <View style={{ marginHorizontal: 20 }}>
          <FontAwesome5
            onPress={() => setIsDrawing(!isDrawwing)}
            name={"pen"}
            size={25}
            color={isDrawwing ? "blue" : "black"}
          />
        </View>

        {isDrawwing ? (
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginRight: 20 }}>
              <FontAwesome5
                onPress={canvasRef.current?.reset}
                name={"eraser"}
                size={25}
                color="black"
              />
            </View>
            <View style={{ marginRight: 20 }}>
              <FontAwesome5
                onPress={canvasRef.current?.undo}
                name={"undo"}
                size={25}
                color="black"
              />
            </View>
            <View style={{ marginRight: 20 }}>
              <FontAwesome5
                onPress={canvasRef.current?.redo}
                name={"redo"}
                size={25}
                color="black"
              />
            </View>
          </View>
        ) : (
          <View>
            <Subheading>{`<-- Click to start drawing`}</Subheading>
          </View>
        )}
      </View>
      {isDrawwing && (
        <SketchCanvas
          ref={canvasRef}
          strokeColor={"black"}
          strokeWidth={8}
          containerStyle={{
            flex: 1,
            zIndex: 9999,
          }}
        />
      )}

      {/* <Button onPress={canvasRef.current?.reset}>RESET</Button>
      <Button onPress={canvasRef.current?.undo}>UNDO</Button>
      <Button onPress={canvasRef.current?.redo}>REDO</Button>
      <Button onPress={onCLickToSVG}>TO SVG</Button>
      <Button onPress={onCLickToBase64}>TO Base64</Button>
      {imageBase64 && (
        <Image
          style={{
            resizeMode: "contain",
            width: 100,
            height: 100,
            borderColor: "black",
            borderWidth: 1,
          }}
          source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
        />
      )} 
    </View>
  );
};

export default Canvas;

const styles = StyleSheet.create({});
 */

import { View, Text, Animated, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Canvas } from "@vcandou/react-native-draw";
import {
  BrushProperties,
  CanvasControls,
  CanvasRef,
  DEFAULT_COLORS,
  DrawingTool,
} from "@benjeau/react-native-draw-extras";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as svg from "react-native-svg";
import { updateRoomSVGContent } from "../Data/rooms";
import { useAppContext } from "../Contexts/AppContext";

const CanvasScreen = () => {
  const appContext = useAppContext();
  const { room } = appContext;

  const canvasRef = React.useRef(null);

  const [color, setColor] = useState(DEFAULT_COLORS[0][0][0]);
  const [thickness, setThickness] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [tool, setTool] = useState(DrawingTool.Brush);
  const [visibleBrushProperties, setVisibleBrushProperties] = useState(false);
  const [currentSVG, setCurrentSVG] = useState(null);

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleClear = () => {
    canvasRef.current?.clear();
  };

  const handleToggleEraser = () => {
    setTool((prev) =>
      prev === DrawingTool.Brush ? DrawingTool.Eraser : DrawingTool.Brush
    );
  };

  const [overlayOpacity] = useState(new Animated.Value(0));
  const handleToggleBrushProperties = () => {
    if (!visibleBrushProperties) {
      setVisibleBrushProperties(true);

      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setVisibleBrushProperties(false);
      });
    }
  };

  const updateSvg = async (svg) => {
    await updateRoomSVGContent(room?.id, svg);
  };

  const pathRef = React.useRef(null);
  const onPathsChange = (paths) => {
    const currentPath = JSON.stringify(paths);
    if (true) {
      pathRef.current = paths;
      const svg = canvasRef.current?.getSvg();
      console.log("🚀 ~ CanvasScreen ~ svg:", svg);
      updateSvg(svg?.includes("path") ? svg : null);
    }
  };

  const [viewWidth, setViewWidth] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setViewWidth(width);
    setViewHeight(height);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0)" }}>
      <View
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0)" }}
        onLayout={handleLayout}
      >
        <Canvas
          onPathsChange={onPathsChange}
          ref={canvasRef}
          color={color}
          thickness={thickness}
          opacity={opacity}
          tool={tool}
          width={viewWidth - 10}
          height={viewHeight}
          style={{
            backgroundColor: "rgba(0,0,0,0)",
            alignSelf: "center",
            flex: 1,
          }}
        />
      </View>
      <GestureHandlerRootView>
        <View style={{ width: "50%", marginVertical: -10 }}>
          <CanvasControls
            onUndo={handleUndo}
            onClear={handleClear}
            onToggleBrushProperties={handleToggleBrushProperties}
            tool={DrawingTool.Brush}
            color={color}
            opacity={opacity}
            thickness={thickness}
          />
        </View>
        {visibleBrushProperties && (
          <BrushProperties
            color={color}
            thickness={thickness}
            opacity={opacity}
            onColorChange={setColor}
            onThicknessChange={setThickness}
            onOpacityChange={setOpacity}
            style={{
              position: "absolute",
              bottom: 60,
              left: 0,
              right: 0,
              padding: 10,
              backgroundColor: "#f2f2f2",
              borderRadius: 10,
              borderColor: "#ccc",
              borderWidth: 2,
              opacity: overlayOpacity,
            }}
          />
        )}
      </GestureHandlerRootView>
    </View>
  );
};

export default CanvasScreen;
