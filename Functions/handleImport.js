import React, { useContext, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

export const handleImport = async (val, navigation) => {
  DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
  }).then((res) => {
    // console.log("file://" + res.uri + "\n" + FileSystem.cacheDirectory);

    FileSystem.readDirectoryAsync(
      FileSystem.cacheDirectory + "DocumentPicker"
    ).then((res) => {
      console.log(res);
      FileSystem.readAsStringAsync(
        "file://" +
          FileSystem.cacheDirectory +
          "DocumentPicker/" +
          res[res.length - 1],
        {
          encoding: FileSystem.EncodingType.UTF8,
        }
      ).then((res) => {
        val.importedKeys = res;
        navigation.navigate("RSAHome");
        alert(val.importedKeys);
      });
    });
  });
};
