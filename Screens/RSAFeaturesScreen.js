import React, { useContext, useState } from "react";
import { View, StyleSheet, ScrollView, Share } from "react-native";
import { Appbar, Button, TextInput, Menu, Provider } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import RSAKey from "react-native-rsa";

import context from "../Context/context";
import { handleImport } from "../Functions/handleImport";

function RSAFeaturesScreen(props) {
  const [visible, setVisible] = React.useState(false);
  const [mode, setMode] = React.useState(true);
  const [currentPublicKey, setCurrentPublicKey] = useState(null);
  const [currentPrivateKey, setCurrentPrivateKey] = useState(null);
  const [textInput1, setTextInput1] = useState("");
  const [textInput2, setTextInput2] = useState("");
  const [visible1, setVisible1] = React.useState(false);

  const openMenu = () => setVisible1(true);
  const closeMenu = () => setVisible1(false);

  const val = useContext(context);

  const handleEncrypt = () => {
    const rsa = new RSAKey();
    // console.log(currentPublicKey);
    let key = JSON.stringify({ n: currentPublicKey, e: "10001" });
    if (currentPublicKey != null && textInput1 !== "") {
      console.log("Public KEy: " + key);
      rsa.setPublicString(key);
      console.log(textInput1);
      const encryptedMsg = rsa.encrypt(textInput1);
      setTextInput2(encryptedMsg);
    } else {
      alert("Select Public Key");
    }
  };
  const handleDecrypt = () => {
    var rsa2 = new RSAKey();

    if (currentPrivateKey != null && textInput2 !== "") {
      rsa2.setPrivateString(currentPrivateKey);
      var encrypted = textInput2;
      // console.log("Enc " + encrypted);
      var decrypted = rsa2.decrypt(encrypted);
      // console.log("\nhere" + decrypted);
      setTextInput1(decrypted);
    } else {
      alert("Select Public Key");
    }
  };

  const handleCopy = () => {
    if (textInput2 != "") {
      Clipboard.setString(textInput2);
    } else {
      alert("Nothing to Copy!");
    }
  };

  const handleClearAll = () => {
    setTextInput1("");
    setTextInput2("");
    setCurrentPublicKey(null);
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: textInput2,
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
    <Provider>
      <ScrollView>
        <Appbar style={{ flex: 1, justifyContent: "flex-end" }}>
          <Appbar.Action
            icon="dots-vertical"
            style={{ position: "absolute", right: 0 }}
            onPress={() => {
              setVisible1(true);
            }}
          />
          <Menu
            visible={visible1}
            onDismiss={closeMenu}
            anchor={<Button onPress={openMenu}>Show menu</Button>}
            style={{ marginRight: 25 }}
          >
            <Menu.Item onPress={() => {}} title="EXPORT PUBLIC KEY " />
            <Menu.Item
              onPress={() => {
                val.currentKey = val.importedKeys;
                props.navigation.navigate("QR");
              }}
              title="PUBLIC KEY QR CODE"
            />
            <Menu.Item
              onPress={() => handleImport(val, props.navigation)}
              title="IMPORT PUBLIC KEY FILE"
            />
            <Menu.Item
              onPress={() => {
                props.navigation.navigate("QRScan");
              }}
              title="SCAN PUBLIC KEY QR"
            />
            <Menu.Item
              onPress={() => {
                props.navigation.navigate("KeyGen");
              }}
              title="CREATE NEW PUBLIC KEY"
            />
            <Menu.Item onPress={() => {}} title="SETTINGS" />
          </Menu>
        </Appbar>
        <View style={styles.maincontainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              padding: 25,
              paddingTop: 10,
              paddingBottom: 0,
            }}
          >
            <Button
              mode="outlined"
              color={mode ? "purple" : "grey"}
              onPress={() => setMode(true)}
            >
              ENCRYPTION
            </Button>
            <Button
              mode="outlined"
              color={!mode ? "purple" : "grey"}
              onPress={() => {
                handleClearAll();
                setMode(false);
              }}
            >
              DECRYPTION
            </Button>
          </View>
          <View style={{ padding: 20 }}>
            {!mode ? (
              <TextInput
                mode="outlined"
                label="Ciphertext"
                multiline={true}
                numberOfLines={9}
                value={textInput2}
                onChangeText={(text) => setTextInput2(text)}
              />
            ) : (
              <TextInput
                mode="outlined"
                label="Plaintext"
                multiline={true}
                placeholder="Input Text...."
                numberOfLines={7}
                value={textInput1}
                onChangeText={(text) => setTextInput1(text)}
              />
            )}
          </View>
          <View style={styles.optionsHandleContainer}>
            {!mode ? (
              <>
                <TextInput
                  mode="outlined"
                  label="Passphrase"
                  style={{ height: 40, width: "50%" }}
                />

                <Menu
                  visible={visible}
                  onDismiss={() => setVisible(false)}
                  anchor={
                    <TextInput
                      mode="outlined"
                      label="Private Key"
                      style={{ height: 40, width: 150 }}
                      right={
                        <TextInput.Icon
                          name="menu-down"
                          onPress={() => setVisible(true)}
                        />
                      }
                      onFocus={() => setVisible(true)}
                      disabled
                      autoFocus={true}
                    />
                  }
                >
                  {val.keyData != null && val.keyData.length > 0
                    ? val.keyData.map((e) => {
                        // console.log("Public Key: " + e.publicKey);
                        // console.log("Private Key: " + e.privateKey);
                        return (
                          <Menu.Item
                            key={JSON.parse(e.privateKey).n}
                            style={{ marginRight: 50 }}
                            title={JSON.parse(e.privateKey).n}
                            onPress={() => {
                              // console.log(e.privateKey);
                              setCurrentPrivateKey(e.privateKey);
                              setVisible(false);
                            }}
                          />
                        );
                      })
                    : null}
                </Menu>
              </>
            ) : (
              <>
                <Menu
                  visible={visible}
                  onDismiss={() => setVisible(false)}
                  anchor={
                    <Button onPress={() => setVisible(true)}>
                      {currentPublicKey != null
                        ? "Key Selected"
                        : "Add Recipent"}
                    </Button>
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      setCurrentPublicKey(val.importedKeys.toString());
                      setVisible(false);
                    }}
                    title={val.importedKeys}
                  />
                </Menu>
                <Button mode="contained" onPress={handleEncrypt}>
                  ENCRYPT
                </Button>
              </>
            )}
          </View>
          {!mode ? (
            <View style={styles.decryptButtonContainer}>
              <Button
                style={styles.decryptButton}
                mode="contained"
                onPress={handleDecrypt}
              >
                DECRYPT
              </Button>
            </View>
          ) : null}
          <View style={{ padding: 20 }}>
            {!mode ? (
              <TextInput
                mode="outlined"
                label="Plaintext"
                multiline={true}
                placeholder="Input Text...."
                value={textInput1}
                onChangeText={(text) => setTextInput1(text)}
                numberOfLines={7}
              />
            ) : (
              <TextInput
                mode="outlined"
                label="Ciphertext"
                multiline={true}
                numberOfLines={10}
                value={textInput2}
              />
            )}
          </View>
          <View style={styles.bottomButtonsView}>
            <View style={styles.innerButtonsContainer}>
              <Button mode="outlined" onPress={handleCopy}>
                COPY
              </Button>

              {mode ? (
                <Button
                  mode="outlined"
                  style={{ marginLeft: 10 }}
                  onPress={handleShare}
                >
                  SHARE
                </Button>
              ) : null}
            </View>

            <Button mode="outlined" onPress={handleClearAll}>
              CLEAR ALL
            </Button>
          </View>
        </View>
      </ScrollView>
    </Provider>
  );
}
const styles = StyleSheet.create({
  maincontainer: { flex: 1 },
  bottomButtonsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
  },
  innerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  decryptButton: { width: 120, alignSelf: "flex-end" },
  decryptButtonContainer: {
    paddingLeft: 20,
    paddingTop: 10,
    paddingRight: 20,
    justifyContent: "flex-end",
  },
  optionsHandleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
  },
});
export default RSAFeaturesScreen;
