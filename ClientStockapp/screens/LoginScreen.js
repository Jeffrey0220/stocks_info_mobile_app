import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Logo from "../assets/images/navlogo.png";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { keys } from "../config/apiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../components/CustomAlert";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /// function to abort the request if longer than 2.5 second
  async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 2500 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  }
  // Login sync

  useEffect(async () => {
    let token = await AsyncStorage.getItem("token");
    const url_api = `${keys.API_URL}/users/authorise`;
    if (token === null) {
      return;
    } else {
      try {
        let res = await fetch(url_api, {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        let response = await res.json();
        console.log(response);
        if (response.error === true) {
          console.log(`${response.message}`);
        } else {
          navigation.push("Home");
          AsyncStorage.setItem("email", response.data.email);
        }
      } catch (e) {
        console.log("cannot connect to the sever");
        CustomAlert("Connection failed, please try again later  👋");
      }
    }
  }, []);
  const navigation = useNavigation();

  async function login() {
    try {
      const url = `${keys.API_URL}/users/login`;
      let res = await fetchWithTimeout(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        // accpet from user
        body: JSON.stringify({ email: `${email}`, password: `${password}` }),
      });
      let data = await res.json();
      if (data.error === false) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("email", data.email);
        navigation.push("Home");
        setEmail("");
        setPassword("");
      } else {
        CustomAlert(data.message + " ✋");
      }
    } catch (e) {
      CustomAlert("Connection failed, please try again later  🚧");
      console.log("cannot connect to the sever");
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Nasdaq Stocks</Text>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        <CustomInput
          icon="user"
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          setValue={setEmail}
          secureTextEntry={false}
        />
        <CustomInput
          icon="lock"
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry={true}
        />

        <CustomButton
          text="Log in"
          onPress={() => {
            login();
          }}
        />

        <CustomButton
          text="Don't have an account? Create one"
          onPress={() => {
            navigation.push("Signup");
          }}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",

    color: "#fff",
    margin: 10,
  },
  logo: {
    width: "70%",

    maxWidth: 300,
    maxHeight: 200,
  },
});

export default LoginScreen;
