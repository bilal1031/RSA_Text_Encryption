import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Appbar, List } from "react-native-paper";

function SettingsScreen(props) {
  return (
    <>
      <Appbar>
        <Appbar.BackAction onPress={() => props.navigation.pop()} />
      </Appbar>
      <View style={styles.maincontainer}>
        <List.Subheader>SETTINGS</List.Subheader>
        <List.Item title="Your keys" onPress={() => {}} />
        <List.Item title="Delete exsiting keys" onPress={() => {}} />
        <List.Item title="List all recipent keys" onPress={() => {}} />
        <List.Item title="Factory default app" onPress={() => {}} />
      </View>
    </>
  );
}
const styles = StyleSheet.create({ maincontainer: { flex: 1, padding: 25 } });
export default SettingsScreen;
