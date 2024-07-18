import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Button,
  Caption,
  Headline,
  Subheading,
  Surface,
  TextInput,
  Title,
} from "react-native-paper";
import Spacer from "../components/Spacer";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useAppContext } from "../Contexts/AppContext";
import { Picker } from "@react-native-picker/picker";
import SketchPad from "../components/SketchPad";
import Canvas from "../components/Canvas";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../Utils/dimensions";
import CountDown from "../components/CountDown";
import ChatScreen from "../components/ChatScreen";
import Ranks from "../components/Ranks";
import ImagePreview from "../components/ImagePreview";
import { SvgXml } from "react-native-svg";
import { updateGameStatus, updateUserStatus } from "../Data/rooms";
import CountdownTimer from "../components/CountdownTimer";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInUp,
} from "react-native-reanimated";
import { colors } from "../Utils/colors";
import AudioButton from "../components/AudioButton";
import * as Speech from "expo-speech";
import { translate } from "../Utils/translation";
import { FONTS } from "../Utils/constants";

const GameScreen = ({ navigation }) => {
  const appContext = useAppContext();
  const { user, room, inRoom, choices, t } = appContext;
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] =
    useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timerStatus, setTimerStatus] = useState("standby");
  const [timerData, setTimerData] = useState(null);
  const [currentTimeServer, setCurrentTimeServer] = useState(null);
  const [theCurrentPlayer, setTheCurrentPlayer] = useState(null);
  const [startISODate, setStartISODate] = useState(null);
  const [message, setMessage] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [categoryChoices, setCategoryChoices] = useState(null);
  const [wordChoices, setWordChoices] = useState(null);

  const [viewWidth, setViewWidth] = useState(100);
  const [viewHeight, setViewHeight] = useState(100);

  const logGameStatus = async (gameData) => {
    await updateGameStatus(room.id, gameData);
  };

  const logUserStatus = async (userData) => {
    await updateUserStatus(room.id, user.id, userData);
  };

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setViewWidth(width);
    setViewHeight(height);
  };

  const setTheNextPlayer = async () => {
    setTimerData({ status: "standby" });
    setTheCurrentPlayer(null);
    setStartISODate(null);
    const theNextPlayer = inRoom.find(
      (player) =>
        player?.type == "active" &&
        player.id !== room?.player?.id &&
        !room?.donePlayers.includes(player.id)
    );
    if (theNextPlayer) {
      await logGameStatus({
        player: theNextPlayer,
        round: room?.round + 1,
        donePlayers: [...room?.donePlayers, room?.player?.id],
        playerEndTime: new Date(new Date().getTime() + 120000).toISOString(),
      });
    } else {
      // set room to done
      // proceed with score displays
      if (room?.donePlayers.length > 0 || room?.player?.id) {
        await logGameStatus({
          player: null,
          playerEndTime: null,
          status: "done",
        });
      }
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      theCurrentPlayer?.isCurrentUserPlayer && Speech.speak(selectedCategory);
      logGameStatus({
        toGuess: {
          category: selectedCategory,
          word: null,
        },
      });
      const theCategory = categoryChoices.find(
        (category) => category.category == selectedCategory
      );
      if (theCategory) {
        setWordChoices(theCategory.words);
        if (theCategory.words && theCategory.words.length > 0) {
          setSelectedWord(theCategory.words[0]);
        }
      }
    } else {
      setWordChoices(null);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedWord) {
      theCurrentPlayer?.isCurrentUserPlayer && Speech.speak(selectedWord);
      logGameStatus({
        toGuess: {
          word: selectedWord,
          category: selectedCategory,
        },
      });
    }
  }, [selectedWord]);

  const onSendMesssage = async () => {
    if (message && message.trim() !== "" && room?.player?.id !== user?.id) {
      // send message to the server
      // check first if the message is equal to the chosen word
      let isAnswerCorrent = false;
      if (room?.toGuess?.word) {
        if (
          message.trim().toLowerCase() === room?.toGuess?.word.toLowerCase()
        ) {
          isAnswerCorrent = true;
        }
      }

      console.log(
        "🚀 ~ onSendMesssage ~ isAnswerCorrent:",
        isAnswerCorrent,
        room?.toGuess?.word
      );
      await logGameStatus({
        chat: Array.isArray(room.chat)
          ? [
              ...room.chat,
              {
                name: user.name,
                message,
                id: user?.id,
                dateCreated: new Date().toISOString(),
                isCorrect: isAnswerCorrent,
              },
            ]
          : [
              {
                name: user.name,
                message,
                id: user?.id,
                dateCreated: new Date().toISOString(),
                isCorrect: isAnswerCorrent,
              },
            ],
        toGuess: isAnswerCorrent ? null : room?.toGuess,
      });

      if (isAnswerCorrent) {
        // update user score
        const theUser = inRoom.find((player) => player.id == user?.id);
        if (theUser) {
          const currentScore = !isNaN(theUser.score) ? theUser.score + 1 : 1;
          await logUserStatus({
            score: currentScore,
          });
        }

        // set the next player
        await setTheNextPlayer();
      }

      setMessage(null);
    }
  };

  // new emplimentation / logic
  /* 
  Check if room game status player is null > 
  First player > Check the inRoom > 
  get the first player & status: active 
  == autoSetPlayer ==
  */
  const autoSetPlayer = async () => {
    if (room?.isStarted && Array.isArray(inRoom) && inRoom.length > 0) {
      if (room?.player?.id) {
        // there is a player set already
        setTheCurrentPlayer({
          player: room?.player,
          isCurrentUserPlayer: room?.player?.id === user?.id,
        });
      } else if (!room?.status !== "done") {
        // there is no player set yet
        // setting the first player
        // find index of yourself in inRoom, if you are the first index, then you are the first player
        const firstPlayer = inRoom.indexOf(
          inRoom.find((player) => player.id == user?.id)
        );
        if (firstPlayer === 0) {
          setTheCurrentPlayer(null);
          await logGameStatus({
            player: inRoom[0],
            round: 1,
            donePlayers: [],
            playerEndTime: new Date(
              new Date().getTime() + 120000
            ).toISOString(),
          });
        }
      }
    }
  };

  /* 
  All users
  If changes in room > game status > timerISO > start timercointdown  
  */
  const autoSetCountdownTimer = async () => {
    if (room?.isStarted && room?.player?.id && room?.playerEndTime) {
      setStartISODate(room?.playerEndTime);
    }
  };

  const autoEndGame = async () => {
    if (room?.isStarted && room?.status == "done") {
      setTheCurrentPlayer(null);
      //alert("Game is done!");
      // proceed with score displays
      // navigate to scrore screen
      navigation.replace("ScoreScreen");
    }
  };

  const autoSetChat = async () => {
    const theChat = Array.isArray(room?.chat) ? room?.chat : [];
    setChatMessages([...theChat]);
  };

  useEffect(() => {
    autoSetPlayer()
      .then(() => {
        console.log(
          "🚪 ~ useEffect ~ autoSetPlayer:",
          new Date().toISOString()
        );
      })
      .catch((error) => {
        console.log("🚪 ~ useEffect ~ autoSetPlayer ~ error:", error);
      });

    autoSetCountdownTimer()
      .then(() => {
        console.log(
          "🚪 ~ useEffect ~ autoSetCountdownTimer:",
          new Date().toISOString()
        );
      })
      .catch((error) => {
        console.log("🚪 ~ useEffect ~ autoSetCountdownTimer ~ error:", error);
      });

    autoEndGame();
    autoSetChat();
  }, [room, inRoom]);

  /* 
  If iscurrentplayer > await update room > game status timerISO
  */
  const autoSetISOTime = async () => {
    if (theCurrentPlayer && theCurrentPlayer?.isCurrentUserPlayer) {
    }
  };

  useEffect(() => {
    autoSetISOTime()
      .then(() => {
        console.log(
          "🚀 ~ useEffect ~ autoSetISOTime:",
          new Date().toISOString()
        );
      })
      .catch((error) => {
        console.log("🚀 ~ useEffect ~ autoSetISOTime ~ error:", error);
      });
  }, [theCurrentPlayer]);

  /* 
  Currentplayer
  Time timeout / word guessed > 
  Await update current uset status in inRoom > status = done
  Await update room > game status > player = inroom player, status active, not current user
  */

  const autoSetNextPlayer = async () => {
    if (room?.player?.id === user?.id && timerData?.status == "timeout") {
      // update the current user status to done
      // store current player to donePlayers
      // set the next player > inRoom player, status active, not current user and not in donePlayers
      await setTheNextPlayer();
    }
  };

  useEffect(() => {
    autoSetNextPlayer()
      .then(() => {
        console.log(
          "🚀 ~ useEffect ~ autoSetNextPlayer:",
          new Date().toISOString()
        );
      })
      .catch((error) => {
        console.log("🚀 ~ useEffect ~ autoSetNextPlayer ~ error:", error);
      });
  }, [timerData]);

  // for testing purposes
  const forceStartGame = async () => {
    const theUser = inRoom.find((player) => player.id == user?.id);
    if (theUser) {
      setTheCurrentPlayer(null);
      setTimerData({ status: "standby" });
      setStartISODate(null);
      await logGameStatus({
        isStarted: true,
        player: theUser,
        round: 1,
        donePlayers: [],
        playerEndTime: new Date(new Date().getTime() + 120000).toISOString(),
      });
    }
  };

  const forceNextPlayer = async () => {
    if (room?.player?.id) {
      // set the next player
      await setTheNextPlayer();
      /* setTheCurrentPlayer(null);

      const theNextPlayer = inRoom.find(
        (player) =>
          player?.type == "active" &&
          player.id !== room?.player?.id &&
          !room?.donePlayers.includes(player.id)
      );

      if (theNextPlayer) {
        await logGameStatus({
          player: theNextPlayer,
          round: room?.round + 1,
          donePlayers: [...room?.donePlayers, room?.player?.id],
          playerEndTime: new Date(new Date().getTime() + 120000).toISOString(),
        });
      } else {
        // set room to done
        // proceed with score displays
        if (room?.donePlayers.length > 0 || room?.player?.id) {
          await logGameStatus({
            player: null,
            playerEndTime: null,
            status: "done",
          });
        }
      } */
    }
  };

  useEffect(() => {
    if (Array.isArray(choices) && choices.length > 0) {
      setCategoryChoices(choices);
      if (choices[0]?.category) {
        //setSelectedCategory(choices[0]?.category);
      }
    } else {
      setCategoryChoices(null);
      setWordChoices(null);
    }
  }, [choices]);

  const StartGameUI = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Surface
            style={{
              padding: 10,
              borderRadius: 10,
              marginLeft: 10,
              maxWidth: 200,
              paddingHorizontal: 20,
            }}
          >
            <Spacer size={20} />

            {startISODate ? (
              <CountdownTimer
                isoDate={startISODate}
                returnData={setTimerData}
              />
            ) : (
              <CountdownTimer
                isoDate={new Date().toISOString()}
                returnData={(data) => console.log(data)}
              />
            )}

            <Spacer size={20} />
            {theCurrentPlayer?.isCurrentUserPlayer &&
              Array.isArray(categoryChoices) &&
              categoryChoices.length > 0 && (
                <View>
                  <Subheading
                    style={{
                      color: "black",
                      fontFamily: FONTS.PoppinsSemiBold,
                    }}
                  >
                    {translate("str-category", t)}
                  </Subheading>
                  <View style={{ height: 50 }}>
                    <Picker
                      style={{
                        backgroundColor: "white",
                        borderWidth: 2,
                        borderColor: "black",
                        borderRadius: 10,
                        flex: 1,
                      }}
                      selectedValue={selectedCategory}
                      onValueChange={(itemValue, itemIndex) =>
                        setSelectedCategory(itemValue)
                      }
                    >
                      {categoryChoices.map((category, index) => (
                        <Picker.Item
                          key={index}
                          label={category.category}
                          value={category.category}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}

            {!theCurrentPlayer?.isCurrentUserPlayer && (
              <Animated.View entering={FadeInLeft.duration(200).delay(500)}>
                <Subheading>Category</Subheading>
                <Text
                  style={{
                    color: colors.darkBlue,
                    fontSize: 24,
                    fontFamily: FONTS.PoppinsBold,
                  }}
                >
                  {room?.toGuess?.category
                    ? room?.toGuess?.category
                    : translate("str-selecting", t)}
                </Text>
              </Animated.View>
            )}

            {theCurrentPlayer?.isCurrentUserPlayer &&
              wordChoices &&
              wordChoices.length > 0 && (
                <View>
                  <Subheading
                    style={{
                      color: "black",
                      fontFamily: FONTS.PoppinsSemiBold,
                    }}
                  >
                    {translate("str-word", t)}
                  </Subheading>
                  <View style={{ height: 50 }}>
                    <Picker
                      style={{
                        backgroundColor: "white",
                        borderWidth: 2,
                        borderColor: "black",
                        borderRadius: 10,
                        flex: 1,
                      }}
                      selectedValue={selectedWord}
                      onValueChange={(itemValue, itemIndex) =>
                        setSelectedWord(itemValue)
                      }
                    >
                      {wordChoices.map((word, index) => (
                        <Picker.Item key={index} label={word} value={word} />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}
            <Spacer size={20} />
            {theCurrentPlayer?.isCurrentUserPlayer ? (
              <Headline
                style={{
                  fontFamily: FONTS.PoppinsSemiBold,
                  textAlign: "center",
                }}
              >
                {translate("str-turn", t)}
              </Headline>
            ) : theCurrentPlayer?.player?.id ? (
              <Subheading
                style={{ textAlign: "center", fontFamily: FONTS.PoppinsBold }}
              >
                {theCurrentPlayer?.player?.name} {translate("str-drawing", t)}
              </Subheading>
            ) : (
              <Subheading
                style={{
                  textAlign: "center",
                  fontFamily: FONTS.PoppinsSemiBold,
                }}
              >
                {translate("str-waiting-player", t)}
              </Subheading>
            )}
          </Surface>
          <View style={{ flex: 1 }}>
            <Surface
              style={{
                padding: 5,
                borderRadius: 10,
                minHeight: SCREEN_HEIGHT,
                marginHorizontal: 10,
                overflow: "hidden",
                position: "relative",
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              {theCurrentPlayer?.isCurrentUserPlayer ? (
                <View
                  style={{
                    overflow: "hidden",
                    position: "relative",
                    height: "100%",
                  }}
                >
                  <View
                    style={{
                      height: SCREEN_WIDTH / 3,
                      width: 200,
                      position: "absolute",
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    {chatMessages && chatMessages.length > 0 && (
                      <ChatScreen chatData={chatMessages} />
                    )}
                  </View>
                  <Canvas />
                </View>
              ) : (
                <View
                  style={{
                    position: "relative",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onLayout={handleLayout}
                >
                  {room?.svgContent ? (
                    <SvgXml
                      xml={room?.svgContent}
                      height={"80%"}
                      width={"80%"}
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <Caption style={{ fontFamily: FONTS.PoppinsSemiBold }}>
                      {translate("str-waiting-player", t)}
                    </Caption>
                  )}
                  <View
                    style={{
                      flex: 1,
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      right: 0,
                      bottom: 0,
                      alignItems: "flex-end",
                    }}
                  >
                    <View style={{ flex: 1 }} />
                    <View
                      style={{
                        width: 200,
                        height: SCREEN_WIDTH / 3,
                      }}
                    >
                      {chatMessages && chatMessages.length > 0 && (
                        <ChatScreen chatData={chatMessages} />
                      )}
                    </View>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        padding: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        mode="outlined"
                        value={message}
                        onChangeText={(text) => setMessage(text)}
                        style={{
                          flex: 1,
                        }}
                      />
                      <Button
                        mode="contained"
                        onPress={onSendMesssage}
                        style={{ width: 100, height: 50, marginLeft: 10 }}
                        contentStyle={{ height: 50 }}
                        icon={"send"}
                        labelStyle={{ fontFamily: FONTS.PoppinsBold }}
                      >
                        {translate("str-send", t)}
                      </Button>
                    </View>
                  </View>
                </View>
              )}
            </Surface>
          </View>
        </View>
        <View style={{ margin: 10, borderRadius: 10, padding: 10 }}>
          <Ranks />
        </View>
      </View>
    );
  };

  const WaitingGameUi = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <Caption style={{ fontFamily: FONTS.PoppinsSemiBold }}>
          {translate("str-waiting-start", t)}
        </Caption>
        <Headline style={{ fontFamily: FONTS.PoppinsBold }}>
          {room?.max} {translate("str-remaining", t)}
        </Headline>
        <Caption
          style={{
            fontFamily: FONTS.PoppinsSemiBold,
            width: "100%",
            textAlign: "center",
          }}
        >
          {translate("str-in-room", t)}
        </Caption>
        {Array.isArray(inRoom) &&
          inRoom?.length > 0 &&
          inRoom?.map((player, index) => (
            <Animated.View
              entering={FadeInDown.duration(500).delay(index * 10)}
              key={player.id}
            >
              <Headline
                style={{
                  color: colors.darkBlue,
                  fontSize: 32,
                  lineHeight: 44,
                  fontFamily: FONTS.PoppinsBold,
                }}
              >
                {player.name}
              </Headline>
            </Animated.View>
          ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.ligthBlue }}
      scrollEnabled={!isDrawing}
    >
      <Animated.View style={{ margin: 20 }} entering={FadeInUp.duration(1000)}>
        <Headline
          style={{
            fontSize: 50,
            lineHeight: 50,
            textShadowColor: colors.yellow,
            textShadowOffset: { width: -2, height: 2 },
            textShadowRadius: 5,
            fontFamily: FONTS.CabinSketchBold,
            color: colors.darkBlue,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          {translate("str-aee", t)}
        </Headline>
      </Animated.View>
      <Animated.View entering={FadeInDown.duration(200).delay(100)}>
        <Surface
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            marginHorizontal: 10,
            backgroundColor: colors.yellow,
            borderWidth: 4,
            borderColor: colors.darkBlue,
          }}
        >
          <Ionicons
            name={"close-circle"}
            size={35}
            color={colors.darkBlue}
            onPress={() => {
              appContext.logout();
            }}
          />

          <View style={{ marginRight: 20 }} />
          <AudioButton />

          {/* <View style={{ marginRight: 20 }} />
          <Ionicons
            name={"play"}
            size={35}
            color="black"
            onPress={forceStartGame}
          />
          <Ionicons
            name={"stop"}
            size={35}
            color="black"
            onPress={() => navigation.navigate("ScoreScreen")}
          />
          <Ionicons
            name={"arrow-forward-circle"}
            size={35}
            color="black"
            onPress={forceNextPlayer}
          /> */}
        </Surface>
      </Animated.View>

      <Spacer size={10} />

      <Animated.View entering={FadeInDown.duration(400).delay(400)}>
        {room?.isStarted ? StartGameUI() : WaitingGameUi()}
      </Animated.View>

      <Spacer size={50} />
    </ScrollView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({});
