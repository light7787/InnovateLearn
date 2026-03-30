import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function authLayout() {
  return (
    <PaperProvider>
      <Stack
        screenOptions={{
           animation: 'slide_from_right', // right-to-left transition
        gestureDirection: 'horizontal',
       
          headerShown: false,
        }}
      />
    </PaperProvider>
  );
}