import React, { useState } from "react";
import { StyleSheet, Dimensions, Pressable } from "react-native";
import { Text, View } from "./Themed";
import { Image } from "expo-image";
import Octicons from "@expo/vector-icons/Octicons";
import Feather from "@expo/vector-icons/Feather";
import { deletePosts } from "components/deletePosts";
import Colors from "constants/Colors";
import ImageCount from "./ImageCount";
import { coustomTheme } from "./coustomTheme";
import { useColorScheme } from "hooks/useColorScheme.web";
import AntDesign from "@expo/vector-icons/AntDesign";

interface RenderItemsFlashListProps {
  item: any;
  isLoggedIn: boolean;
}

export const RenderItemsFlashList = ({
  item,
  isLoggedIn,
}: RenderItemsFlashListProps) => {
  const screenWidth = Dimensions.get("window").width;
  const [currentIndex, setCurrentIndex] = useState(0);
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();

  const nextImage = () => {
    if (currentIndex < item.imagePaths.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <View style={[styles.container, themeStyles.containerContrast]}>
      <View style={styles.newsHeader}>
        <Image
          style={styles.newsImageAsk}
          source={require("assets/images/ask.png")}
          contentFit='contain'
        />
        <Text style={styles.newsHeaderText}>Islam-Fragen</Text>
        {isLoggedIn ? (
          <Feather
            name='trash-2'
            size={24}
            color='black'
            style={themeStyles.trashIcon}
            onPress={() => deletePosts(item.id)}
          />
        ) : null}
      </View>
      <View style={styles.newsContentTextContainer}>
        {item.title && <Text style={styles.newsTitleText}>{item.title}</Text>}
        {item.content && (
          <Text style={styles.newsContentText}>{item.content}</Text>
        )}
        {item.imagePaths && item.imagePaths.length > 0 ? (
          <View style={styles.ImageContainer}>
            <Image
              contentFit='cover'
              style={styles.newsImageSeveral}
              source={{ uri: item.imagePaths[currentIndex] }}
              recyclingKey={`${item.imagePaths[currentIndex]}-${currentIndex}`}
            />

            {item.imagePaths.length > 1 && (
              <>
                <View style={styles.buttonContainer}>
                  <Pressable onPress={prevImage} style={styles.button}>
                    <AntDesign
                      name='arrowleft'
                      size={34}
                      color={colorScheme === "light" ? "black" : "white"}
                    />
                  </Pressable>
                  <Pressable onPress={nextImage} style={styles.button}>
                    <AntDesign
                      name='arrowright'
                      size={34}
                      color={colorScheme === "light" ? "black" : "white"}
                    />
                  </Pressable>
                </View>
                <ImageCount
                  displayImageCounter={item.imagePaths.map((_, index) =>
                    index === currentIndex ? (
                      <Octicons
                        name='dot'
                        size={15}
                        color='black'
                        style={themeStyles.characterCountNewsImage}
                      />
                    ) : (
                      <Octicons
                        name='dot-fill'
                        size={15}
                        color='black'
                        style={themeStyles.characterCountNewsImage}
                      />
                    )
                  )}
                />
              </>
            )}
          </View>
        ) : null}
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    width: "95%",
    maxWidth: 700,
    marginHorizontal: "auto",
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  newsHeader: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  newsImageAsk: {
    height: 30,
    width: 30,
  },
  newsHeaderText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  newsContentTextContainer: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  newsTitleText: {
    fontSize: 25,
    fontWeight: "bold",
    textDecorationLine: "underline",
    paddingBottom: 15,
  },
  newsContentText: {
    backgroundColor: "transparent",
    fontSize: 18,
    lineHeight: 28,
  },
  toTopButton: {
    position: "absolute",
    backgroundColor: "transparent",
    top: 200,
    right: 10,
    zIndex: 1,
  },
  FlatListImageStyle: {
    flex: 1,
    backgroundColor: "transparent",
    paddingLeft: 3.5,
  },
  ImageContainer: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  ImageContainerFooter: {
    marginTop: 15,
    padding: 5,
    flexDirection: "row",
    borderRadius: 30,
  },
  ImageContainerFooterIcons: {
    padding: 5,
  },
  newsImageSeveral: {
    // width: screenWidth - 50,
    width: "70%",
    height: "auto",
    marginRight: 10,
    aspectRatio: 0.8,
  },
  newsImageSingle: {
    width: screenWidth - 50,
    height: "auto",
    aspectRatio: 0.8,
  },
  FlatListContainer: {
    flex: 1,
    alignItems: "center",
    padding: 0,
    margin: 0,
    backgroundColor: "transparent",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50,
    backgroundColor: "transparent",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
  },
});
