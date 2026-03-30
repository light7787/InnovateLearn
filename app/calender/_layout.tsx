import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function CalenderLayout() {
  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        
        }}
      />
    </PaperProvider>
  );
}