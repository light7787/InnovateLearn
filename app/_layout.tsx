import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { TimeFilterProvider } from "./timefiltercontext";
import './styles/global.css';

export default function RootLayout() {
  return (
    <TimeFilterProvider>
      <PaperProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </PaperProvider>
    </TimeFilterProvider>
  );
}