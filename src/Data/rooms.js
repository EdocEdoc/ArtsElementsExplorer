import { db } from "./config";

export const getCodes = async (accessCode) => {
  if (!accessCode) {
    return null;
  }

  try {
    const codes = await db
      .collection("rooms")
      .where("code", "==", accessCode)
      .where("status", "==", "enrolling")
      .where("max", ">", 0)
      .limit(1)
      .get();

    const roomData = codes.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    return roomData;
  } catch (error) {
    console.log("🚀 ~ getCodes ~ error:", error);
    return null;
  }
};

export const useCode = async (accessCode) => {
  try {
    const codeData = await getCodes(accessCode);
    if (Array.isArray(codeData) && codeData.length > 0) {
      const codeInfo = codeData[0];
      await db
        .collection("rooms")
        .doc(codeInfo.id)
        .update({
          max: codeInfo.max - 1,
          students: codeInfo.students + 1,
          status: codeInfo.max - 1 === 0 ? "full" : "enrolling",
          isStarted: codeInfo.max - 1 === 0 ? true : false,
        });

      return { ...codeInfo };
    } else {
      console.log("🚀 ~ useCode ~ NO codeInfo");
      return null;
    }
  } catch (error) {
    console.log("🚀 ~ useCode ~ error:", error);
    return null;
  }
};

export const logRoomEntry = async (user, accessCode) => {
  if (!user?.name || !accessCode) {
    console.log("🚀 ~ logRoomEntry ~ logRoomEntry: FAILED", user);
    return null;
  }
  try {
    const codeData = await useCode(accessCode);
    if (codeData) {
      const datatoCreate = {
        ...user,
        timestamp: new Date(),
        room: codeData.code,
        type: "active",
      };
      // add collection to a doc
      const newLogData = await db
        .collection("rooms")
        .doc(codeData.id)
        .collection("inRoom")
        .add(datatoCreate);

      const logInfoID = newLogData?.id;
      const userData = { ...datatoCreate, id: logInfoID };
      console.log("🚀 ~ logUsedCode ~ userData:", userData);
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.log("🚀 ~ logUsedCode ~ error:", error);
    return null;
  }
};

export const updateRoomSVGContent = async (roomID, data) => {
  try {
    await db.collection("rooms").doc(roomID).update({
      svgContent: data,
    });
    return true;
  } catch (error) {
    console.log("🚀 ~ updateRoomSVGContent ~ error:", error);
    return false;
  }
};

export const updateGameStatus = async (roomID, data) => {
  try {
    await db
      .collection("rooms")
      .doc(roomID)
      .update({
        ...data,
      });
    return true;
  } catch (error) {
    console.log("🚀 ~ updateGameStatus ~ error:", error);
    return false;
  }
};

export const updateUserStatus = async (roomID, userID, data) => {
  try {
    await db
      .collection("rooms")
      .doc(roomID)
      .collection("inRoom")
      .doc(userID)
      .update({
        ...data,
      });
    return true;
  } catch (error) {
    console.log("🚀 ~ updateUserStatus ~ error:", error);
    return false;
  }
};
