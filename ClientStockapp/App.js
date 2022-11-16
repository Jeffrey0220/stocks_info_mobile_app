import * as React from "react";
import { Platform, StyleSheet, View, StatusBar } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { StocksProvider } from "./contexts/StocksContext";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ChartScreen from "./screens/ChartScreen";
import "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";

const Stack = createStackNavigator();

export default function App(props) {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <StocksProvider>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <NavigationContainer theme={DarkTheme} initialRouteName="Login">
            <Stack.Navigator>
              <Stack.Screen name="Login" component={LoginScreen} />

              <Stack.Screen name="Signup" component={SignupScreen} />

              <Stack.Screen name="Trends" component={ChartScreen} />

              <Stack.Screen
                name="Home"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </StocksProvider>
      </View>
      <Toast />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
