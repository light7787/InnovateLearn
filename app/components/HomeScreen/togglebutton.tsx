import React from 'react';
import { Pressable, View } from 'react-native';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: (value: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle }) => {
  return (
    <Pressable
      onPress={() => onToggle(!isOn)}
      className={`w-10 h-5 rounded-full p-0.5 justify-center transition-colors duration-500 ease-in-out ${
        isOn ? 'bg-[#003B5C]' : 'bg-white border border-[#003B5C]'
      }`}
    >
      <View
        className={`w-4 h-4 rounded-full transition-all duration-500 ease-in-out ${
          isOn ? 'bg-[#C7E9F1] translate-x-5' : 'bg-[#003B5C] translate-x-0'
        }`}
      />
    </Pressable>
  );
};

export default ToggleSwitch;