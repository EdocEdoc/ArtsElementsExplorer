import { View, Text } from "react-native";
import React from "react";
import MainStack from "./MainStack";
import AuthStack from "./AuthStack";
import { useAppContext } from "../Contexts/AppContext";

const Route = () => {
  const { user, room } = useAppContext();

  if (user?.isLogin && room?.id) {
    return <MainStack />;
  }

  return <AuthStack />;
};

export default Route;
