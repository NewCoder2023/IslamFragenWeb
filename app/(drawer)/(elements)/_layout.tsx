import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "components/useColorScheme";
import { Header } from "react-native/Libraries/NewAppScreen";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// export const unstable_settings = {
 
//   initialRouteName: "(elements)/index",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

// Seperate header which is supabase table name
const separateWords = (name: string) => {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/&/g, " & ")
    .trim();
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();


  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name='(renderCategory)/[renderCategory]'
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name='(renderNestedCategories)/[renderNestedCategories]'
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      {/* <Toast /> */}
    </ThemeProvider>
  );
}
