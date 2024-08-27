import React, { useState, useRef, useEffect } from "react";
import { View } from "components/Themed";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import { Stack, Link } from "expo-router";
import Colors from "constants/Colors";
import { useColorScheme } from "react-native";
import { coustomTheme } from "components/coustomTheme";
import Checkbox from "expo-checkbox";
import { useSendQuestion } from "components/useSendQuestion";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Picker } from "@react-native-picker/picker";
import { Text } from "components/Themed";
import { router } from "expo-router";
import { notifySuccess, notifyError } from "components/toast";
import useNetworkStatus from "components/useNetworkStatus";
import { genderOptions, marjaOptions } from "components/emailOptions";
import { useFormikSetup } from "components/useFormikSetup";

export default function askQuestion() {
  const [isPickerVisibleMarja, setIsPickerVisibleMarja] = useState(false);
  const [isPickerVisibleGender, setIsPickerVisibleGender] = useState(false);
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();
  const scrollViewRef = useRef(null);
  const { sendEmail } = useSendQuestion();
  const captchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const { isConnected } = useNetworkStatus();

  // Get formik setup from import
  const formik = useFormikSetup(
    isConnected,
    sendEmail,
    setShowCaptcha,
    setCaptchaToken
  );

  // Verify before sending
  const verifiedToken = async (token: string) => {
    setCaptchaToken(token);
    await formik.validateForm(); // Ensure the form is validated
    if (formik.isValid) {
      const success = await sendEmail(
        formik.values.name,
        formik.values.age,
        formik.values.email,
        formik.values.marja,
        formik.values.gender,
        formik.values.question
      );
      if (success) {
        setShowCaptcha(false);
        notifySuccess(
          "Frage erfolgreich gesendet! Du erhälst die Antwort in wenigen Tagen als Email!"
        );
        router.navigate("/");
        formik.resetForm(); // Reset form on success
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
              <Pressable
                onPress={() => {
                  formik.handleSubmit();
                }}
              >
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
      >
        <View style={styles.textInputContainer}>
          <TextInput
            style={[styles.input, themeStyles.inverseTextInput]}
            onChangeText={formik.handleChange("name")}
            value={formik.values.name}
            placeholder='Name (optional)'
            keyboardType='default'
          />
          <TextInput
            style={[styles.input, themeStyles.inverseTextInput]}
            onChangeText={formik.handleChange("age")}
            value={formik.values.age}
            placeholder='Alter (Pflicht)'
            keyboardType='numeric'
          />
          {formik.errors.age ? (
            <View style={styles.validationError}>
              <Text style={[styles.validationErrorText, themeStyles.error]}>
                {formik.errors.age}
              </Text>
            </View>
          ) : null}
          <TextInput
            style={[styles.input, themeStyles.inverseTextInput]}
            onChangeText={formik.handleChange("email")}
            value={formik.values.email}
            placeholder='E-Mail (Pflicht)'
            keyboardType='email-address'
          />
          {formik.errors.email ? (
            <View style={styles.validationError}>
              <Text style={[styles.validationErrorText, themeStyles.error]}>
                {formik.errors.email}
              </Text>
            </View>
          ) : null}
          <TextInput
            style={[styles.input, themeStyles.inverseTextInput]}
            onChangeText={formik.handleChange("validateEmail")}
            value={formik.values.validateEmail}
            placeholder='E-Mail wiederholen (Pflicht)'
            keyboardType='email-address'
          />

          {formik.errors.validateEmail ? (
            <View style={styles.validationError}>
              <Text style={[styles.validationErrorText, themeStyles.error]}>
                {formik.errors.validateEmail}
              </Text>
            </View>
          ) : null}

          {/* Gender Picker */}

          <Pressable onPress={() => setIsPickerVisibleGender(true)}>
            <View style={[styles.pickerTrigger, themeStyles.inverseTextInput]}>
              <Text
                style={[styles.pickerText, themeStyles.inverseQuestionText]}
              >
                {
                  genderOptions.find(
                    (option) => option.value === formik.values.gender
                  )?.label
                }
              </Text>
            </View>
          </Pressable>

          <Modal
            visible={isPickerVisibleGender}
            transparent={true}
            animationType='slide'
            onRequestClose={() => {
              setIsPickerVisibleGender(false);
            }}
          >
            <Pressable
              style={[
                styles.modalContainer,
                themeStyles.modalQuestionBlurredBackground,
              ]}
              onPress={() => {
                setIsPickerVisibleGender(false);
              }}
            >
              <Pressable
                style={styles.pickerContainer}
                onPress={(event) => event.stopPropagation()}
              >
                <Picker
                  selectedValue={formik.values.gender}
                  onValueChange={(itemValue) => {
                    formik.setFieldValue("gender", itemValue);
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
          {formik.errors.gender ? (
            <View style={styles.validationError}>
              <Text style={[styles.validationErrorText, themeStyles.error]}>
                {formik.errors.gender}
              </Text>
            </View>
          ) : null}

          {/* Gender Picker */}

          {/* Marja Picker */}

          <Pressable onPress={() => setIsPickerVisibleMarja(true)}>
            <View style={[styles.pickerTrigger, themeStyles.inverseTextInput]}>
              <Text
                style={[styles.pickerText, themeStyles.inverseQuestionText]}
              >
                {
                  marjaOptions.find(
                    (option) => option.value === formik.values.marja
                  )?.label
                }
              </Text>
            </View>
          </Pressable>
          <Modal
            visible={isPickerVisibleMarja}
            transparent={true}
            animationType='slide'
            onRequestClose={() => {
              setIsPickerVisibleMarja(false);
            }}
          >
            <Pressable
              style={[
                styles.modalContainer,
                themeStyles.modalQuestionBlurredBackground,
              ]}
              onPress={() => {
                setIsPickerVisibleMarja(false);
              }}
            >
              <Pressable
                style={styles.pickerContainer}
                onPress={(event) => event.stopPropagation()}
              >
                <Picker
                  selectedValue={formik.values.marja}
                  onValueChange={(itemValue) => {
                    formik.setFieldValue("marja", itemValue);
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
          {formik.errors.marja ? (
            <View style={styles.validationError}>
              <Text style={[styles.validationErrorText, themeStyles.error]}>
                {formik.errors.marja}
              </Text>
            </View>
          ) : null}

          {/* Marja Picker end */}

          <View style={styles.rules}>
            <Checkbox
              style={styles.rulesCheckbox}
              value={formik.values.acceptRules}
              onValueChange={(value) => {
                formik.setFieldValue("acceptRules", value);
              }}
            />
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Ich habe die</Text>
              <Link href='rules' style={[styles.link, themeStyles.link]}>
                Richtlinien
              </Link>
              <Text style={styles.linkText}>gelesen und akzeptiert.</Text>
            </View>
          </View>
          {formik.errors.acceptRules ? (
            <View style={styles.validationError}>
              <Text style={[styles.validationErrorText, themeStyles.error]}>
                {formik.errors.acceptRules}
              </Text>
            </View>
          ) : null}

          <TextInput
            style={[
              styles.input,
              styles.inputQuestion,
              themeStyles.inverseTextInput,
            ]}
            value={formik.values.question}
            onChangeText={(value) => formik.setFieldValue("question", value)}
            placeholder='Frage (Pflicht)'
            multiline={true}
            keyboardType='default'
          />
        </View>
        {formik.errors.question ? (
          <View style={styles.validationError}>
            <Text
              style={[
                styles.validationErrorText,
                styles.validationErrorInput,
                themeStyles.error,
              ]}
            >
              {formik.errors.question}
            </Text>
          </View>
        ) : null}
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
  validationError: {
    alignItems: "center",
  },
  validationErrorText: {},
  validationErrorInput: {
    marginTop: -10,
    marginBottom: 20,
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
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 20,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16,
    lineHeight: 30,
  },
});
