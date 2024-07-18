import React, { useState, useEffect } from "react";
import { db } from "../Data/config";

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "testName",
    room: "testCode",
    isLogin: false,
  });

  const [room, setRoom] = useState(null);
  const [inRoom, setInRoom] = useState(null);
  const [choices, setChoices] = useState(null);
  const [translations, setTranslations] = useState(null);
  const [userLanguage, setUserLanguage] = useState("en");
  const [t, setT] = useState(null);

  const logout = async () => {
    if (user?.id) {
      await db
        .collection("rooms")
        .doc(room.id)
        .collection("inRoom")
        .doc(user.id)
        .update({ type: "left", isLogin: false });
    }
    setUser({
      name: "testName",
      room: "testCode",
      isLogin: false,
    });
    setRoom(null);
    setInRoom(null);
  };

  useEffect(() => {
    if (user?.isLogin && user?.room) {
      const roomRef = db.collection("rooms");

      const subscriber = roomRef
        .where("code", "==", user?.room)
        .onSnapshot((documentSnapshot) => {
          const roomData = documentSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          //console.log("🚀 ~ roomData ~ roomData:", roomData);
          /* console.log(
            "🚀 ~ subscriber ~ roomData:",
            roomData.length,
            roomData[0]
          ); */

          if (roomData.length > 0) {
            setRoom(roomData[0]);
          } else {
            setRoom(null);
          }

          //setRoom(roomData);
        });

      // Stop listening for updates when no longer required
      return () => subscriber();
    }
  }, [user.isLogin]);

  useEffect(() => {
    console.log("🚀 ~ AppProvider ~ room:", room);
    if (room?.id) {
      const inRoomRef = db
        .collection("rooms")
        .doc(room.id)
        .collection("inRoom");
      const inRoomSubscriber = inRoomRef.onSnapshot((documentSnapshot) => {
        const inRoomData = documentSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log("🚀 ~ roomData ~ roomData:", inRoomData);

        setInRoom(inRoomData);
      });

      const choicesRef = db.collection("choices");
      const choicesSubscriber = choicesRef.onSnapshot((documentSnapshot) => {
        const choicesData = documentSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log("🚀 ~ choicesData ~ choicesData:", choicesData);

        setChoices(choicesData);
      });

      // Stop listening for updates when no longer required
      return () => {
        inRoomSubscriber();
        choicesSubscriber();
      };
    }
  }, [room]);

  useEffect(() => {
    const translationsRef = db.collection("translations");
    const translationsSubscriber = translationsRef.onSnapshot(
      (documentSnapshot) => {
        const translationsData = documentSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(
          "🚀 ~ translationsData ~ translationsData:",
          translationsData
        );

        setTranslations(translationsData[0].translation);
      }
    );

    return () => {
      translationsSubscriber();
    };
  }, []);

  useEffect(() => {
    console.log("🚀 ~ AppProvider ~ inRoom:", inRoom);
  }, [inRoom]);

  useEffect(() => {
    if (translations && userLanguage) {
      const curentTranslation = translations[userLanguage];
      setT(curentTranslation);
    }
  }, [translations, userLanguage]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        room,
        setRoom,
        logout,
        inRoom,
        choices,
        setUserLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};

export default AppContext;
