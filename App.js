import React, { useEffect } from "react";
import { LogBox, StatusBar, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Camera } from "expo-camera";
import * as SecureStore from "expo-secure-store";

import KeyGenerateScreen from "./Screens/KeyGenerateScreen";
import MainScreen from "./Screens/MainScreen";
import ShareScreen from "./Screens/ShareScreen";
import RSAFeaturesScreen from "./Screens/RSAFeaturesScreen";

import context from "./Context/context";
import QRScreen from "./Screens/QRScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  LogBox.ignoreLogs([
    "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation",
  ]);

  const [keyData, setKeyData] = React.useState({
    keyData: [],
  });

  const [currScreen, setCurrScreen] = React.useState("Home");
  const [isLoading, setLoading] = React.useState(false);

  const checkKey = () => {};

  const askPersmission = () => {
    Camera.requestCameraPermissionsAsync().then((res) =>
      console.log("Camera Permission: " + res.granted)
    );
  };

  useEffect(checkKey, []);
  useEffect(askPersmission, []);

  return (
    <>
      <StatusBar />
      {isLoading ? (
        <ActivityIndicator size={34} color="purple" />
      ) : (
        <NavigationContainer>
          <context.Provider
            value={{
              keyData: keyData,
            }}
          >
            <Stack.Navigator
              initialRouteName="RSAHome"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Home" component={MainScreen} />
              <Stack.Screen name="RSAHome" component={RSAFeaturesScreen} />
              <Stack.Screen name="KeyGen" component={KeyGenerateScreen} />
              <Stack.Screen name="Share" component={ShareScreen} />
              <Stack.Screen name="QR" component={QRScreen} />
            </Stack.Navigator>
          </context.Provider>
        </NavigationContainer>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
