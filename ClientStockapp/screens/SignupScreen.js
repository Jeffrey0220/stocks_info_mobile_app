import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

import { useNavigation } from "@react-navigation/native";
import { keys } from "../config/apiUrl";
import CustomAlert from "../components/CustomAlert";
const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const navigation = useNavigation();
  // check that email format [ ...@ .... ]
  const regEmail = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );
  // Password must have minimum 8 characters, at least one letter, one number and one special character
  const filterPassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

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
  async function register() {
    const url = `${keys.API_URL}/users/register`;
    try {
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
        navigation.pop();

        console.log(data.message);
        console.log("Success");
        CustomAlert("Success 👏");
      } else {
        CustomAlert(data.message + "💈");
      }
    } catch (e) {
      console.log("Cannot connect the to sever");
      CustomAlert("Connection failed, please try again later 👋");
    }
  }

  const onRegisterPressed = () => {
    if (
      regEmail.test(email) === true &&
      filterPassword.test(password) === true
    ) {
      if (password === passwordRepeat) {
        register();
      } else {
        console.log("Password is not match");
        CustomAlert("Password is not match 👋");
      }
    } else {
      if (
        regEmail.test(email) != true ||
        filterPassword.test(password) == true
      ) {
        console.log("Email wrong format");
        CustomAlert("Wrong email format 👋");
      }
      if (
        filterPassword.test(password) != true ||
        regEmail.test(email) == true
      ) {
        console.log("Please check the format of password 👋");
        CustomAlert("Wrong password format👋");
      }
      if (
        (filterPassword.test(password) == false) &
        (regEmail.test(email) == false)
      ) {
        console.log("Please check the format of password 👋");
        CustomAlert("Wrong email and password format 👋");
      }
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create An Account</Text>

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
        <CustomInput
          icon="lock"
          placeholder="Confirm Password"
          value={passwordRepeat}
          setValue={setPasswordRepeat}
          secureTextEntry={true}
        />

        <CustomButton text="Register" onPress={onRegisterPressed} />

        <Text style={styles.text}>
          To register, you need to follow correct format.{"\n"}
          <Text style={styles.link}>Email</Text> : Email format, e.g.
          xxx@example.com{"\n"}
          <Text style={styles.link}>Password</Text> : Password must have minimum
          8 characters, at least one letter, one number and one special
          character
        </Text>

        <CustomButton
          text="Have an account? Sign In"
          onPress={() => {
            navigation.pop();
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#3582c4",
    margin: 10,
  },
  text: {
    color: "gray",
    marginVertical: 10,
  },
  link: {
    color: "#FDB075",
  },
});

export default SignUpScreen;
