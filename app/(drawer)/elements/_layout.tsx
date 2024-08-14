
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "hooks/useColorScheme.web";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from "components/queryClient";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// export const unstable_settings = {
//   initialRouteName: "/index",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

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
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen
            name='GetSubCategories/[GetSubCategories]'
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name='GetCategories/[GetCategories]'
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
