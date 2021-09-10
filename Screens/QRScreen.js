import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import QRCode from "react-qr-code";
import { Appbar, Button } from "react-native-paper";

import context from "../Context/context";

function QRScreen(props) {
  const val = useContext(context);
  return (
    <>
      <Appbar></Appbar>
      <View style={styles.maincontainer}>
        {val.currentKey == null ? (
          alert("No key imported")
        ) : (
          <QRCode value={val.currentKey} />
        )}

        <Button
          mode="contained"
          icon="arrow-left"
          onPress={() => {
            props.navigation.navigate("RSAHome");
          }}
          style={{ marginTop: 25 }}
        >
          Finish
        </Button>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default QRScreen;
