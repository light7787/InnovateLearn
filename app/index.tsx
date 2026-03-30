
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import { useState } from "react";
import { View } from "react-native";
import Splash from './components/splash';




export default function App() {
const [show, setShow] = useState(true);
const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
    Montserrat_600SemiBold,

  });
  const [selectedValue, setSelectedValue] = useState('All');

  if (!fontsLoaded) return null;
 

  return (
    <View className="flex-1 "> 
        <Splash/>     
    </View>
  );
}
