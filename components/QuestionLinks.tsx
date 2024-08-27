import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import { coustomTheme } from "./coustomTheme";
import { ScrollView } from "react-native-gesture-handler";

export default function QuestionLinks() {
  const themeStyles = coustomTheme();

  const categoriesLeft = [
    {
      name: "Rechtsfragen",
      image: require("assets/images/rechtsfragen.png"),
      path: "elements/GetCategories/[GetCategories]",
    },
    {
      name: "Quran",
      image: require("assets/images/quran.png"),
      path: "elements/GetCategories/[GetCategories]",
    },
    {
      name: "Historie",
      image: require("assets/images/historie.png"),
      path: "elements/GetCategories/[GetCategories]",
    },
  ];
  const categoriesRight = [
    {
      name: "Glaubensfragen",
      image: require("assets/images/glaubensfragen.png"),
      path: "elements/GetCategories/[GetCategories]",
    },
    {
      name: "Ethik",
      image: require("assets/images/ethik.png"),
      path: "elements/GetCategories/[GetCategories]",
    },

    {
      name: "Ratschläge",
      image: require("assets/images/ratschlaege.png"),
      path: "elements/GetCategories/[GetCategories]",
    },
  ];

  return (
    <ScrollView contentContainerStyle={[styles.container]}>
      <View style={styles.leftElements}>
        {categoriesLeft.map((category, index) => (
          <View
            key={`${index}-left`}
            style={[
              styles.element,
              themeStyles.categorieBackground,
              themeStyles.indexBorderDash,
            ]}
          >
            <Link
              href={
                {
                  pathname: category.path,
                  params: {
                    category: category.name,
                  },
                } as any
              }
              asChild
            >
              <Pressable>
                <Image
                  style={styles.elementIcon}
                  source={category.image}
                  contentFit='contain'
                />
                <View
                  style={[
                    styles.textContainer,
                    themeStyles.indexCategoryTextBorder,
                  ]}
                >
                  <Text style={[styles.elementText, themeStyles.categorieText]}>
                    {category.name}
                  </Text>
                </View>
              </Pressable>
            </Link>
          </View>
        ))}
      </View>
      <View style={styles.rightElements}>
        {categoriesRight.map((category, index) => (
          <View
            key={`${index}-right`}
            style={[
              styles.element,
              themeStyles.categorieBackground,
              themeStyles.indexBorderDash,
            ]}
          >
            <Link
              href={
                {
                  pathname: category.path,
                  params: {
                    category: category.name,
                  },
                } as any
              }
              asChild
            >
              <Pressable>
                <Image
                  style={styles.elementIcon}
                  source={category.image}
                  contentFit='contain'
                />
                <View
                  style={[
                    styles.textContainer,
                    themeStyles.indexCategoryTextBorder,
                  ]}
                >
                  <Text style={[styles.elementText, themeStyles.categorieText]}>
                    {category.name}
                  </Text>
                </View>
              </Pressable>
            </Link>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end", // Align children to the bottom
  },
  leftElements: {
    height: "100%",
    width: "50%",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  rightElements: {
    height: "100%",
    width: "50%",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  element: {
    flexShrink: 1,
    flexGrow: 1,
    width: "70%",
    maxWidth: 350,
    minWidth: 150,
    height: "100%",
    minHeight: 130,
    margin: 15,
    textAlign: "center",
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 2,
  },

  elementIcon: {
    width: "40%",
    maxWidth: 65,
    height: "auto",
    aspectRatio: 1,
    alignSelf: "center",
  },
  textContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 5,
    width: "80%",
    alignSelf: "center",
  },
  elementText: {
    fontSize: 10,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
    paddingHorizontal: 5,
  },
});
