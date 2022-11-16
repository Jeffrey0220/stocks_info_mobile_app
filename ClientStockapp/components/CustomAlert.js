import { View, Text } from "react-native";
import React from "react";
import Toast from "react-native-toast-message";

//implement nice message alert
const CustomAlert = (text) => {
  Toast.show({
    type: "error",

    text1: "Hello",
    text2: text,

    visibilityTime: 2500,
    autoHide: true,
    topOffset: 70,
  });
};

export default CustomAlert;
