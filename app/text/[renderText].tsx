import { View, Text } from "components/Themed";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Colors from "constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "hooks/useColorScheme.web";
import { useRef } from "react";
import useFavorites from "components/useFavorites";
import { coustomTheme } from "components/coustomTheme";
import { useSetFontSize } from "components/fontSizeStore";
import { formatTitle } from "components/formatTitle";
import {
  CustomToastContainer,
  notifyError,
} from "components/toast";
import useInitializeSettings from "components/useInitializeSettings";
import FontSizePickerModal from "components/FontSizePickerModal";
import HeaderRight from "components/HeaderRightRenderText";
import HeaderLeft from "components/HeaderLeftRenderText";
import SingleAnswer from "components/SingleAnswereRenderText";
import { copySingleAnswer } from "components/copySingleAnswer";
import { copyMultipleAnswers } from "components/copyMultipleAnswers";
import MultipleAnswers from "components/MultipleAnswersRenderText";
import { useFetchText } from "components/useFetchText";
import { Loading } from "components/Loading";
import useNetworkStatus from "components/useNetworkStatus";

export default function RenderText() {
  const { id, table, title } = useLocalSearchParams<{
    id: string;
    table: string;
    title: string;
  }>();

  const { item, fetchError, isFetching } = useFetchText(
    table || "",
    title || ""
  );

  const {
    fontSize,
    lineHeight,
    pickerValue,
    setFontSize,
    setLineHeight,
    setPickerValue,
  } = useSetFontSize();
  const [canBack, setCanBack] = useState(false);
  const { toggleFavorite, isInFavorites } = useFavorites();
  const [marja, setMarja] = useState<string[]>([]);
  const [isCopiedSingle, setIsCopiedSingle] = useState(false);
  const [copiedText, setCopiedText] = useState<string>("");
  const timeoutRef = useRef(null);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const displayQuestion = item?.question;
  const displaySingleAnswer = item?.answer;
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();
  const { initializeSettings } = useInitializeSettings(
    setFontSize,
    setLineHeight
  );
  // Check for internet conncetion
  const { isConnected } = useNetworkStatus();

  useEffect(() => {
    if (isConnected === false) {
      notifyError("Keine Internetverbindung!");
    }
  }, [isConnected]);

  // Clean Timeout
  const cleanTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    // initialFetchDone();
    initializeSettings();
    router.canGoBack() ? setCanBack(true) : setCanBack(false);

    return () => {
      // Clear timeout when component unmounts
      cleanTimeout();
    };
  }, []);

  // Select Types
  const [isCopiedMultiple, setIsCopiedMultiple] = useState({
    "Sayid al-Khamenei": false,
    "Sayid as-Sistani": false,
  });
  const displayAnswers = [
    { marja: "Sayid al-Khamenei", answer: item?.answer_khamenei },
    { marja: "Sayid as-Sistani", answer: item?.answer_sistani },
  ];

  const images = {
    "Sayid as-Sistani": require("assets/images/sistani.png"),
    "Sayid al-Khamenei": require("assets/images/khamenei.png"),
  };

  const marjaOptions = [
    { label: "Sayid al-Khamenei", value: "Sayid al-Khamenei" },
    { label: "Sayid as-Sistani", value: "Sayid as-Sistani" },
  ];

  // Show answer from different Marja
  const handleCheckboxChange = (value: string) => {
    setMarja((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <View style={styles.container}>
      <CustomToastContainer width={300} time={30000} />
      <FontSizePickerModal
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        pickerValue={pickerValue}
        setPickerValue={setPickerValue}
        setFontSize={setFontSize}
        setLineHeight={setLineHeight}
      />
      <Stack.Screen
        options={{
          headerRight: () =>
            isConnected && (
              <HeaderRight
                isInFavorites={isInFavorites}
                id={id}
                table={table}
                title={title}
                toggleFavorite={toggleFavorite}
                setIsPickerVisible={setIsPickerVisible}
              />
            ),
          headerLeft: () => <HeaderLeft canBack={canBack} />,
          headerTitle: item ? formatTitle(item.title) : "",
        }}
      />
      {isFetching ? (
        <Loading message='Text wird geladen!' />
      ) : fetchError ? (
        <View style={styles.renderError}>
          <Text style={styles.errorText}>{fetchError}</Text>
        </View>
      ) : displaySingleAnswer ? (
        <SingleAnswer
          themeStyles={themeStyles}
          displayQuestion={displayQuestion}
          lineHeight={lineHeight}
          fontSize={fontSize}
          displaySingleAnswer={displaySingleAnswer}
          isCopiedSingle={isCopiedSingle}
          copySingleAnswer={copySingleAnswer}
          setCopiedText={setCopiedText}
          setIsCopiedSingle={setIsCopiedSingle}
          cleanTimeout={cleanTimeout}
          timeoutRef={timeoutRef}
          colorScheme={colorScheme}
          isConnected={isConnected}
        />
      ) : (
        <MultipleAnswers
          themeStyles={themeStyles}
          displayQuestion={displayQuestion}
          lineHeight={lineHeight}
          fontSize={fontSize}
          marjaOptions={marjaOptions}
          marja={marja}
          displayAnswers={displayAnswers}
          handleCheckboxChange={handleCheckboxChange}
          isCopiedMultiple={isCopiedMultiple}
          copyMultipleAnswers={copyMultipleAnswers}
          setCopiedText={setCopiedText}
          setIsCopiedMultiple={setIsCopiedMultiple}
          cleanTimeout={cleanTimeout}
          timeoutRef={timeoutRef}
          colorScheme={colorScheme}
          images={images}
          isConnected={isConnected}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  renderError: {
    flex: 1,
    marginTop: 20,
    paddingLeft: 12,
    paddingRight: 12,
  },
  errorText: {
    fontSize: 20,
    color: Colors.light.error,
    textAlign: "center",
  },
});
