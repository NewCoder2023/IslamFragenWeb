import { View, Text } from "./Themed";
import { ActivityIndicator } from "react-native";
import { useColorScheme } from "hooks/useColorScheme.web";
import { StyleSheet } from "react-native";
import React from "react";

export const Loading = ({ message }: { message: string }) => {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size='large'
        color={colorScheme == "light" ? "black" : "white"}
      />
      <Text style={styles.loadingIndicatorText}>{message}</Text>
      <Text style={styles.loadingIndicatorText}>
        Allahumma salli ala Muhammad wa aali Muhammad
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicatorText: {
    marginHorizontal: 10,
    fontSize: 20,
    textAlign: "center",
    marginTop: 15,
    fontWeight: "bold",
  },
});
