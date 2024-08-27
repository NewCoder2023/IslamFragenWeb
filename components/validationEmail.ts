import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  name: Yup.string(),
  age: Yup.number()
    .required("Bitte gib dein Alter ein")
    .positive("Das Alter muss positiv sein"),
  email: Yup.string()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mail ist erforderlich"),
  validateEmail: Yup.string()
    .oneOf(
      [Yup.ref("email"), undefined],
      "E-Mail-Adressen stimmen nicht überein"
    )
    .required("Bestätige deine E-Mail"),
  marja: Yup.string().notOneOf(["default"], "Bitte wähle einen Marja aus"),
  gender: Yup.string().notOneOf(["default"], "Bitte wähle dein Geschlecht aus"),
  question: Yup.string().required("Frage ist erforderlich"),
  acceptRules: Yup.bool().oneOf([true], "Bitte akzeptiere die Richtlinien"),
});
