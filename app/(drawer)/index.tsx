import { StyleSheet } from "react-native";
import { View, Text } from "components/Themed";
import QuestionLinks from "components/QuestionLinks";
import { coustomTheme } from "components/coustomTheme";
import { Image } from "expo-image";
import { ImageBackground } from "react-native";
import { useSetFontSize } from "components/fontSizeStore";
import { CustomToastContainer } from "components/toast";
import { useLayoutEffect } from "react";
import useInitializeSettings from "components/useInitializeSettings";

export default function index() {
  const themeStyles = coustomTheme();
  const { fontSize, setLineHeight, setFontSize } = useSetFontSize();
  const { initializeSettings } = useInitializeSettings(
    setFontSize,
    setLineHeight
  );

  useLayoutEffect(() => {
    initializeSettings();
  }, []);

  return (
    <View style={styles.container}>
      <CustomToastContainer width={450} />
      <View style={[styles.headerContainer, themeStyles.indexBorderDash]}>
        <View style={[styles.header, themeStyles.backgroundIndex]}>
          {/* <ImageBackground
            source={require("assets/images/background.png")}
            style={styles.calligraphyBackground}
          > */}
          <View style={styles.headerElements}>
            <View style={styles.headerImageContainer}>
              <Image
                style={styles.headerImage}
                source={require("assets/images/logo.png")}
                contentFit='contain'
              />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerText, themeStyles.inverseTextIndex]}>
                Islam-Fragen
              </Text>
              <Text style={[styles.headerDash, themeStyles.indexBorderDash]}>
                __________
              </Text>
            </View>
          </View>
          {/* </ImageBackground> */}
        </View>
      </View>
      <View style={styles.categoryContainer}>
        <QuestionLinks />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    borderBottomWidth: 3,
  },
  header: {
    flex: 1,
    flexDirection: "column",
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  calligraphyBackground: {
    flex: 1,
    resizeMode: "cover",
  },

  headerElements: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  headerTextContainer: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
  },
  headerImageContainer: {
    height: "80%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  headerDash: {
    marginBottom: 30,
    marginTop: -10,
    fontSize: 20,
  },
  headerText: {
    fontSize: 40,
  },
  headerImage: {
    width: "100%", // Take full width of the container
    height: "100%",
  },
  border: {
    fontSize: 25,
    paddingLeft: 3,
    paddingBottom: 5,
    fontWeight: "100",
    alignSelf: "center",
  },
  categoryContainer: {
    flex: 2,
    marginBottom: 10,
    backgroundColor: "transparent",
  },
});
