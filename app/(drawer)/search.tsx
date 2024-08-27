import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { View, Text, SafeAreaView } from "components/Themed";
import { TextInput, TextInputProps } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import ItemSearch from "components/ItemSearch";
import { Feather } from "@expo/vector-icons";
import { coustomTheme } from "components/coustomTheme";
import { useRef } from "react";

export default function TabOneScreen() {
  const [search, setSearch] = useState("");

  const themeStyles = coustomTheme();
  const searchInputRef = useRef(null);

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <View style={[styles.searchContainer, themeStyles.inverseTextInput]}>
        <AntDesign
          name='search1'
          size={20}
          color='grey'
          style={styles.searchIcon}
        />
        <Text style={[styles.border, themeStyles.searchBorderDash]}>|</Text>
        <TextInput
          style={[
            styles.searchField,
            themeStyles.inverseTextInput,
            {
              outline: "none",
            } as TextInputProps["style"],
          ]}
          placeholder='Suche'
          keyboardType='default'
          editable
          value={search}
          ref={searchInputRef}
          onChangeText={setSearch}
        />

        {search && (
          <Pressable
            style={styles.deleteIconContainer}
            onPress={() => setSearch("")}
          >
            <Feather
              name='x-circle'
              size={20}
              style={[styles.deleteIcon, themeStyles.deleteIcon]}
            />
          </Pressable>
        )}
      </View>
      <View style={styles.renderSearchContainer}>
        <ItemSearch search={search} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "flex-start",
    width: "50%",
    minWidth: 350,
    maxWidth: 400,
    marginTop: 20,
    borderWidth: 2,
    borderRadius: 30,
  },
  searchIcon: {
    paddingLeft: 12,
  },
  deleteIconContainer: {
    backgroundColor: "transparent",
  },
  deleteIcon: {
    paddingVertical: 8,
    paddingRight: 10
  },
  border: {
    fontSize: 25,
    paddingLeft: 3,
    paddingBottom: 5,
    fontWeight: "100",
    alignSelf: "center",
  },
  searchField: {
    width:"100%",
    borderRadius: 30,
    paddingRight: 10,
    paddingLeft: 5,
    paddingVertical: 12,
    borderColor: "transparent",
    fontSize: 16
  },

  renderSearchContainer: {
    flex: 1,
    marginBottom: 10,
  },
});
