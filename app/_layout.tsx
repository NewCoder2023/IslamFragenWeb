import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "hooks/useColorScheme.web";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from "components/queryClient";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import Octicons from "@expo/vector-icons/Octicons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import preLoadImages from "components/preLoadImages";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    ...Feather.font,
    ...AntDesign.font,
    ...Entypo.font,
    ...Octicons.font,
    ...Ionicons.font,
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        await preLoadImages();
        if (loaded) {
          await SplashScreen.hideAsync();
          setIsReady(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadResources();
  }, [loaded]);

  if (!isReady || !colorScheme) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen
            name='(drawer)'
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='text/[renderText]'
            options={{ headerTitle: "" }}
          />
          <Stack.Screen name='rules' options={{ headerTitle: "Richtlinien" }} />
          <Stack.Screen name='+not-found' />
        </Stack>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
