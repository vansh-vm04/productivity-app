import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { enableScreens } from 'react-native-screens';

SplashScreen.preventAutoHideAsync();
enableScreens(true);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, statusBarHidden: false }}
      />
      <Stack.Screen
        name="createTask"
        options={{
          headerShown: false,
          statusBarHidden: false,
          animation: "simple_push",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="CreateNote"
        options={{
          headerShown: false,
          statusBarHidden: false,
          animation: "simple_push",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
