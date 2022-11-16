import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const CustomInput = ({
  icon,
  value,
  setValue,
  keyboardType,
  placeholder,
  secureTextEntry,
}) => {
  return (
    <View style={styles.container}>
      <FontAwesome name={icon} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={setValue}
        keyboardType={keyboardType}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#a7aaad"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    height: 30,

    borderColor: "#e8e8e8",
    paddingHorizontal: 10,
    marginVertical: 7,
  },
  icon: { alignSelf: "center", fontSize: 20 },
  input: {
    flex: 1,
    paddingLeft: 13,
  },
});

export default CustomInput;
