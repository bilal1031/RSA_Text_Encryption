import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BarCodeScanner, BarCodeSize } from "expo-barcode-scanner";
import { Appbar, Button } from "react-native-paper";

function QRScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`${data}`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <Appbar />
      {/* <View style={styles.container}> */}
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFill, styles.container]}
      >
        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom}>
          {scanned && (
            <Button onPress={() => setScanned(false)}>Tap to Scan Again</Button>
          )}
          <Button mode="contained" onPress={() => setScanned(false)}>
            Finish
          </Button>
        </View>
      </BarCodeScanner>

      {/* </View> */}
    </>
  );
}
const opacity = "rgba(0, 0, 0, .6)";
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: "#fff",
  //   padding: 10,
  // },
  barCodeView: {
    width: "100%",
    height: "50%",
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  layerTop: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 1,
    flexDirection: "row",
  },
  layerLeft: {
    flex: 2,
    backgroundColor: opacity,
  },
  focused: {
    flex: 10,
  },
  layerRight: {
    flex: 2,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity,
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default QRScanScreen;
