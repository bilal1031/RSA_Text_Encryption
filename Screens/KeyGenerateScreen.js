import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  Appbar,
  Button,
  TextInput,
  List,
  RadioButton,
  Checkbox,
} from "react-native-paper";
import RSAKey from "react-native-rsa";
import AsyncStorage from "@react-native-async-storage/async-storage";

import context from "../Context/context";

function KeyGenerateScreen(props) {
  const [username, setUsername] = useState("default");
  const [date, setDate] = useState();
  const [phrase, setPhrase] = useState();
  const [repPhrase, setRepPhrase] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [checked, setChecked] = useState("2048");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  const val = useContext(context);

  const primaryColor = "#6200EE";
  let arr = ["2048", "3072", "4096"];

  const keyGen = async () => {
    let rsa = new RSAKey();
    const bits = Number(checked);
    rsa.generate(bits, "10001");

    var publicKey = rsa.getPublicString(); // return json encoded string
    var privateKey = rsa.getPrivateString(); // return json encoded string

    val.curUsername = username;
    val.keyData = [
      {
        publicKey: publicKey,
        privateKey: privateKey,
        passphrase: phrase,
        date: isChecked ? date : "",
      },
      ...val.keyData,
    ];

    val.currentKey = publicKey;
    val.currentPassPhrase = phrase;

    // console.log("Public Key: " + publicKey);
    // console.log("Private Key: " + privateKey);

    return 0;
  };
  const handleKeyGen = () => {
    setIsGenerating(true);

    setTimeout(
      () =>
        keyGen().then(() => {
          // console.log(checked);
          // console.log(username);

          const jsonValue = JSON.stringify(val.keyData);
          console.log(jsonValue);
          AsyncStorage.setItem("@storage_Key", jsonValue).then(() => {
            props.navigation.navigate("Share");
          });
        }),
      10
    );
  };

  return (
    <ScrollView>
      <Appbar style={styles.bottom}>
        {!isGenerating ? (
          <Appbar.BackAction onPress={() => props.navigation.pop()} />
        ) : null}
      </Appbar>

      <View style={styles.maincontainer}>
        {!isGenerating ? (
          // Form view to take pre-key generation inputs from user
          <>
            <Text style={styles.titleText}>Enter Details</Text>
            <TextInput
              label="Username (to identify your key)"
              value={username}
              onChangeText={(text) => setUsername(text)}
              style={styles.textInput}
              mode="outlined"
            />
            <FlatList
              style={styles.flatList}
              data={arr}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    borderWidth: 0.2,
                    width: "80%",
                    alignSelf: "flex-end",
                  }}
                />
              )}
              keyExtractor={(key) => key}
              renderItem={({ item }) => (
                <List.Item
                  title={item.toString() + " bits"}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="lock"
                      style={{ marginTop: 10, marginLeft: -10 }}
                    />
                  )}
                  right={() => (
                    <View style={{ alignItems: "center" }}>
                      {item === "2048" ? (
                        <Text
                          style={{ color: primaryColor, fontWeight: "bold" }}
                        >
                          RSA
                        </Text>
                      ) : (
                        <Text />
                      )}
                      <RadioButton
                        value={item}
                        status={checked === item ? "checked" : "unchecked"}
                        onPress={() => setChecked(item)}
                        color={primaryColor}
                      />
                    </View>
                  )}
                />
              )}
            />
            <Text style={{ alignSelf: "flex-start" }}>Valid Until:</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                paddingRight: 8,
              }}
            >
              <Checkbox
                status={isChecked ? "checked" : null}
                color={primaryColor}
                onPress={() => setIsChecked(!isChecked)}
              />

              <TextInput
                label="YY/MM/DD (default not expire)"
                value={date}
                onChangeText={(text) => setDate(text)}
                style={styles.dateInput}
                mode="outlined"
              />
            </View>

            <View style={styles.phraseView}>
              <TextInput
                label="Passphrase"
                value={phrase}
                onChangeText={(text) => setPhrase(text)}
                style={styles.textInput}
                mode="outlined"
              />

              {/* need to set themes */}
              <TextInput
                label="Repeat Passphrase"
                value={repPhrase}
                onChangeText={(text) => {
                  setRepPhrase(text);
                  if (phrase.includes(repPhrase)) {
                    setIsMatching(true);
                  } else {
                    setIsMatching(false);
                  }
                }}
                style={styles.textInput}
                theme={{
                  colors: {
                    primary: isMatching ? primaryColor : "red",
                    // accent: "#f1c40f",
                  },
                }}
                mode="outlined"
                right={() => (
                  <List.Icon icon="folder" style={{ width: 50, height: 50 }} />
                )}
                outlineColor={isMatching ? primaryColor : "red"}
              />
            </View>

            <Button
              icon="plus"
              mode="contained"
              style={{ marginTop: 20 }}
              onPress={handleKeyGen}
            >
              Create New Key Pair
            </Button>
          </>
        ) : (
          // key generatiing process view
          <View
            style={{
              height: "100%",
              padding: 25,
            }}
          >
            <Text style={styles.titleText}>Generating Key Pair....</Text>
            <Text style={styles.titleText}>
              The process of generating a key pair require large amount of
              random numbers.This may take a while
            </Text>

            <ActivityIndicator
              size={60}
              animating={true}
              color={primaryColor}
              style={{ marginTop: 50 }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  titleText: {
    color: "grey",
    fontSize: 22,
    marginBottom: 15,
    textAlign: "center",
  },
  textInput: { width: "95%", height: 50 },
  flatList: { width: "100%", marginTop: 15 },
  phraseView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    marginTop: 15,
    justifyContent: "space-between",
    height: 130,
  },
  dateInput: {
    width: "80%",
    height: 40,
    fontSize: 12,
  },
});
export default KeyGenerateScreen;
