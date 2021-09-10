import React, { useContext } from "react";
import { View, StyleSheet, Share, Text } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { StackActions } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

import context from "../Context/context";

function ShareScreen(props) {
  const [isActive, setIsActive] = React.useState(false);
  const val = useContext(context);

  const onBackUp = async () => {
    const res = await MediaLibrary.requestPermissionsAsync();
    if (res.granted) {
      var fileUri = FileSystem.documentDirectory + (val.usename + ".txt");
      let key = JSON.parse(val.currentKey);
      await FileSystem.writeAsStringAsync(fileUri, key.n, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      MediaLibrary.createAssetAsync(fileUri).then((asset) => {
        console.log(fileUri);
        MediaLibrary.createAlbumAsync("KeysFolder", asset, false).then(() =>
          alert("File Saved")
        );
      });
      const string = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      console.log(string);
    } else {
      console.log("permission not granted");
    }
  };

  const onQR = () => {
    props.navigation.navigate("QR");
  };

  const onShare = async () => {
    try {
      let key = JSON.parse(val.currentKey);
      const result = await Share.share({
        message: key.n,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Appbar></Appbar>
      <View style={styles.maincontainer}>
        <>
          <Text style={{ fontSize: 22, marginTop: 25 }}>
            Key Pair Successfully Created
          </Text>
          <View
            style={{
              height: 200,
              justifyContent: "space-between",
              marginTop: 150,
            }}
          >
            <Button mode="contained" icon="download" onPress={onBackUp}>
              Backup Key Pair
            </Button>

            <Button mode="contained" icon="share" onPress={onShare}>
              Share Key Pair
            </Button>

            <Button mode="contained" icon="qrcode" onPress={onQR}>
              QR Public Key
            </Button>

            <Button
              mode="outlined"
              onPress={() => props.navigation.dispatch(StackActions.popToTop())}
            >
              Finish
            </Button>
          </View>
        </>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    alignItems: "center",
    padding: 25,
  },
});
export default ShareScreen;
