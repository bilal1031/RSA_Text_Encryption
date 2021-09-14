import React, { useEffect } from "react";
import { LogBox, StatusBar, StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Camera } from "expo-camera";

import KeyGenerateScreen from "./Screens/KeyGenerateScreen";
import MainScreen from "./Screens/MainScreen";
import ShareScreen from "./Screens/ShareScreen";
import RSAFeaturesScreen from "./Screens/RSAFeaturesScreen";
import QRScreen from "./Screens/QRScreen";
import QRScanScreen from "./Screens/QRScanScreen";
import SettingsScreen from "./Screens/SettingsScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import context from "./Context/context";

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

  const getData = () => {
    AsyncStorage.getItem("@storage_Key").then((jsonValue) => {
      if (jsonValue !== null) {
        setKeyData(JSON.parse(jsonValue));
        // setLoading(false);
        // console.log(jsonValue);
        alert("Your Private Keys are imported");
      } else {
        setLoading(false);
        alert("No keys found!");
      }
    });
  };

  const askPersmission = () => {
    Camera.requestCameraPermissionsAsync().then((res) =>
      console.log("Camera Permission: " + res.granted)
    );
  };

  useEffect(getData, []);
  useEffect(askPersmission, []);

  return (
    <>
      <StatusBar />
      {isLoading ? (
        <View style={styles.isLoadingContainer}>
          <ActivityIndicator size={34} color="purple" />
        </View>
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
              <Stack.Screen name="QRScan" component={QRScanScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
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
  isLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
