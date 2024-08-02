import React, { useState, useRef, useEffect } from "react";
import { View } from "components/Themed";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TextInputProps,
  Pressable,
  Modal,
} from "react-native";
import { Stack, Link } from "expo-router";
import Colors from "constants/Colors";
import { useColorScheme } from "react-native";
import { coustomTheme } from "components/coustomTheme";
import Checkbox from "expo-checkbox";
import { useSendQuestion } from "components/useSendQuestion";
import Toast from "react-native-toast-message";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Picker } from "@react-native-picker/picker";
import { Text } from "components/Themed";
import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";
import { router } from "expo-router";
import * as Network from "expo-network";
import {
  CustomToastContainer,
  notifySuccess,
  notifyError,
  notifyInfo,
} from "components/toast";

const siteKey = "46059823-5a16-4179-98ac-347075bcf465";
const baseUrl = "https://hcaptcha.com";

const genderOptions = [
  { label: "-- Wähle bitte dein Geschlecht aus --", value: "default" },
  { label: "Männlich", value: "Männlich" },
  { label: "Weiblich", value: "Weiblich" },
];

const marjaOptions = [
  { label: "-- Wähle bitte deinen Marja aus --", value: "default" },
  { label: "Sayid al-Khamenei", value: "Sayid al-Khamenei" },
  { label: "Sayid as-Sistani", value: "Sayid as-Sistani" },
  { label: "Keine Rechtsfrage", value: "Keine Rechtsfrage" },
];

const initialFormState = {
  name: "",
  age: "",
  email: "",
  validateEmail: "",
  marja: marjaOptions[0].value,
  gender: genderOptions[0].value,
  question: "",
  acceptRules: false,
};

export default function askQuestion() {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();

  const [formState, setFormState] = useState(initialFormState);
  const {
    name,
    age,
    email,
    validateEmail,
    marja,
    gender,
    question,
    acceptRules,
  } = formState;

  const [isPickerVisibleMarja, setIsPickerVisibleMarja] = useState(false);
  const [isPickerVisibleGender, setIsPickerVisibleGender] = useState(false);
  const { sendEmail } = useSendQuestion();
  const captchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (showCaptcha && captchaRef.current) {
      captchaRef.current.execute();
    }
  }, [showCaptcha]);

  useEffect(() => {
    // Reset the form state when the component mounts
    setFormState(initialFormState);
  }, []);

  const validateForm = () => {
    if (
      !age ||
      !email ||
      !validateEmail ||
      !question ||
      question.trim() === ""
    ) {
      notifyError("Bitte fülle alle Pflichtfelder aus!");
      return false;
    }

    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      notifyError("Bitte gebe ein gültiges Alter ein!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notifyError("Bitte gebe eine gültige E-Mail-Adresse ein!");
      return false;
    }

    if (email !== validateEmail) {
      notifyError("Die E-Mail-Adressen stimmen nicht überein!");
      return false;
    }

    if (gender === genderOptions[0].value) {
      notifyError("Bitte wähle dein Geschlecht aus!");
      return false;
    }
    if (marja === marjaOptions[0].value) {
      notifyError("Bitte wähle einen Marja aus!");
      return false;
    }

    if (!acceptRules) {
      notifyError(
        "Bitte lies die Richtlinien und akzeptiere sie um die E-Mail versenden zu können!"
      );
      return false;
    }

    return true;
  };

  const handleInputChange = (name, value) => {
    setFormState({ ...formState, [name]: value });
  };

  const checkInternetConnection = async () => {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected && networkState.isInternetReachable;
  };

  const send = async () => {
    if (validateForm()) {
      const isConnected = await checkInternetConnection();
      if (isConnected) {
        setIsFormValid(true); // Mark the form as valid
        setShowCaptcha(true); // Show hCaptcha challenge
      } else {
        notifyError(
          "Bitte stelle sicher, dass du mit dem Internet verbunden bist, bevor du eine Frage schickst"
        );
      }
    }
  };

  const verifiedToken = async (token: string) => {
    setCaptchaToken(token);

    if (isFormValid) {
      const success = await sendEmail(
        name,
        age,
        email,
        marja,
        gender,
        question
      );
      if (success) {
        setShowCaptcha(false); // Hide captcha on success
        notifySuccess(
          "Frage erfolgreich gesendet! Du erhälst die Antwort in wenigen Tagen als Email!"
        );
        router.navigate("/");
        setFormState(initialFormState); // Reset form state on success
      } else {
        notifyError("Fehler! Versuch es später erneut");
      }
    }
  };

  const errorToken = async (err: string) => {
    setShowCaptcha(false);
    notifyError(
      "Captcha-Überprüfung fehlgeschlagen. Bitte versuche es erneut."
    );
  };

  const closeToken = async () => {
    setShowCaptcha(false);
  };

  const expireToken = async () => {
    setShowCaptcha(false);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Eine Frage stellen",
          headerRight: () => (
            <View style={styles.headerButton}>
              <Pressable onPress={send}>
                <Text style={styles.submitButtonText}>Senden</Text>
              </Pressable>
            </View>
          ),
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollStyle}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        <View style={styles.textInputContainer}>
          <TextInput
            style={[styles.input, themeStyles.inverseTextInput]}
            onChangeText={(value) => handleInputChange("name", value)}
            value={name}
            placeholder='Name (optional)'
            keyboardType='default'
          />
          <TextInput
            style={[styles.input, themeStyles.inverseTextInput]}
            onChangeText={(value) => handleInputChange("age", value)}
            value={age}
            placeholder='Alter (Pflicht)'
            keyboardType='numeric'
          />
          <TextInput
            style={[styles.input, themeStyles.inverseTextInput]}
            onChangeText={(value) => handleInputChange("email", value)}
            value={email}
            placeholder='E-Mail (Pflicht)'
            keyboardType='email-address'
          />
          <TextInput
            style={[styles.input, themeStyles.inverseTextInput]}
            onChangeText={(value) => handleInputChange("validateEmail", value)}
            value={validateEmail}
            placeholder='E-Mail wiederholen (Pflicht)'
            keyboardType='email-address'
          />

          {/* Gender Picker */}
          <Pressable
            onPress={() => setIsPickerVisibleGender(true)}
            style={
              {
                
                //outline: "none",
              } as TextInputProps["style"]
            }
          >
            <View style={[styles.pickerTrigger, themeStyles.inverseTextInput]}>
              <Text
                style={[styles.pickerText, themeStyles.inverseQuestionText]}
              >
                {genderOptions.find((option) => option.value === gender)?.label}
              </Text>
            </View>
          </Pressable>
          <Modal
            visible={isPickerVisibleGender}
            transparent={true}
            animationType='slide'
            onRequestClose={() => setIsPickerVisibleGender(false)}
          >
            <Pressable
              style={[
                styles.modalContainer,
                themeStyles.modalQuestionBlurredBackground,
              ]}
              onPress={() => setIsPickerVisibleGender(false)}
            >
              <Pressable
                style={styles.pickerContainer}
                onPress={(event) => event.stopPropagation()}
              >
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => {
                    handleInputChange("gender", itemValue);
                    setIsPickerVisibleGender(false);
                  }}
                >
                  {genderOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </Pressable>
            </Pressable>
          </Modal>

          {/* Marja Picker */}

          <Pressable
            onPress={() => setIsPickerVisibleMarja(true)}
            style={
              {
                //outline: "none",
              } as TextInputProps["style"]
            }
          >
            <View style={[styles.pickerTrigger, themeStyles.inverseTextInput]}>
              <Text
                style={[styles.pickerText, themeStyles.inverseQuestionText]}
              >
                {marjaOptions.find((option) => option.value === marja)?.label}
              </Text>
            </View>
          </Pressable>
          <Modal
            visible={isPickerVisibleMarja}
            transparent={true}
            animationType='slide'
            onRequestClose={() => setIsPickerVisibleMarja(false)}
          >
            <Pressable
              style={[
                styles.modalContainer,
                themeStyles.modalQuestionBlurredBackground,
              ]}
              onPress={() => setIsPickerVisibleMarja(false)}
            >
              <Pressable
                style={styles.pickerContainer}
                onPress={(event) => event.stopPropagation()}
              >
                <Picker
                  selectedValue={marja}
                  onValueChange={(itemValue) => {
                    handleInputChange("marja", itemValue);
                    setIsPickerVisibleMarja(false);
                  }}
                >
                  {marjaOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </Pressable>
            </Pressable>
          </Modal>

          <View style={styles.rules}>
            <Checkbox
              style={styles.rulesCheckbox}
              value={acceptRules}
              onValueChange={(value) => handleInputChange("acceptRules", value)}
            />
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Ich habe die</Text>
              <Link href='rules' style={[styles.link, themeStyles.link]}>
                Richtlinien
              </Link>
              <Text style={styles.linkText}>gelesen und akzeptiert.</Text>
            </View>
          </View>
          <TextInput
            style={[
              styles.input,
              styles.inputQuestion,
              themeStyles.inverseTextInput,
            ]}
            onChangeText={(value) => handleInputChange("question", value)}
            value={question}
            placeholder='Frage (Pflicht)'
            multiline={true}
            keyboardType='default'
          />
        </View>
      </ScrollView>
      {showCaptcha && (
        <HCaptcha
          sitekey='46059823-5a16-4179-98ac-347075bcf465'
          size='normal'
          onVerify={(token) => verifiedToken(token)}
          ref={captchaRef}
          onClose={closeToken}
          onExpire={expireToken}
          onError={errorToken}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  headerButton: {
    backgroundColor: "transparent",
    marginRight: 20,
  },
  submitButtonText: {
    fontSize: 20,
    color: Colors.light.link,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    flexDirection: "column",
    paddingTop: 20,
  },
  scrollStyle: {
    flex: 1,
  },
  textInputContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 700,
    marginHorizontal: "auto",
  },

  input: {
    marginHorizontal: 10,
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16,
  },
  pickerTrigger: {
    marginHorizontal: 10,
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: "center",
  },
  pickerText: {
    textAlign: "center",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    borderWidth: 3,
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  rules: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  rulesCheckbox: {
    marginRight: 7,
  },
  linkContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  linkText: {
    marginLeft: 2,
    marginRight: 2,
    fontSize: 14,
  },
  link: {
    marginLeft: 2,
    marginRight: 2,
    fontWeight: "bold",
    fontSize: 14,
  },
  inputQuestion: {
    flex: 1,
    marginBottom: 50,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 20,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16,
    lineHeight: 30,
  },
});
