import { StyleSheet } from "react-native";
import { View } from "./Themed";
import React from "react";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useColorScheme } from "react-native";
import { coustomTheme } from "./coustomTheme";

const HeaderFlashListIndex = ({ isLoggedIn }: any) => {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();
  return (
    <View style={styles.headerContainer}>
      {isLoggedIn ? (
        <Link href='/adminDashboard' asChild>
          <Pressable>
            <Entypo name='plus' size={34} style={themeStyles.addNewsButton} />
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
};

export default HeaderFlashListIndex;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 14,
  },
  headerTitle: {
    flex: 1,
    fontSize: 30,
    fontWeight: "bold",
  },
});
