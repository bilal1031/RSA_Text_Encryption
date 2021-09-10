import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Appbar, Button } from "react-native-paper";

import context from "../Context/context";
import { handleImport } from "../Functions/handleImport";

function MainScreen(props) {
  const val = useContext(context);

  return (
    <View style={styles.container}>
      <Appbar style={styles.bottom}></Appbar>

      <View style={styles.midView}>
        <Text style={styles.text}>
          The private ket is needed to decrypt or sign.
        </Text>

        <Text style={styles.text}>
          The public key can be used by others to verify your identity or
          encrypt to you.
        </Text>

        <Button
          icon="plus"
          mode="contained"
          onPress={() => props.navigation.navigate("KeyGen")}
        >
          Create New Key Pair
        </Button>

        <Button
          style={styles.importButton}
          mode="outlined"
          onPress={() => handleImport(val, props.navigation)}
        >
          Import
        </Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  midView: {
    flex: 1,
    padding: 40,
    justifyContent: "space-between",
    paddingBottom: "40%",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    textAlign: "center",
    color: "grey",
  },
  importButton: { width: 120 },
});
export default MainScreen;
