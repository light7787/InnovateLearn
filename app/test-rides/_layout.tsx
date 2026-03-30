// app/_layout.tsx
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function AuthLayout() {
  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          animation: 'slide_from_right', // default forward animation
          gestureDirection: 'horizontal',
          headerShown: false,
          animationTypeForReplace: 'pop',
        }}
      />
    </PaperProvider>
  );
}
