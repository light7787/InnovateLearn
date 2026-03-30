// components/FilterButton.tsx
import Typography from '@/constants/typography';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FilterButtonProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
  disabled?: boolean; // NEW PROP
}

const FilterButton = ({ label, isActive = false, onPress, disabled = false }: FilterButtonProps) => {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress} // BLOCK PRESS IF DISABLED
      activeOpacity={0.8}
      className="flex-1 max-w-[120px]"
      disabled={disabled} // Native disabled handling
      style={{ opacity: disabled ? 0.5 : 1 }} // VISUAL DIMMING
    >
      <View
        className={`px-3 py-1 h-[32px] rounded-[20px] justify-center items-center min-w-[60px] ${
          isActive
            ? disabled
              ? 'bg-gray-300' // Active but disabled
              : 'bg-river-blue-6'
            : disabled
              ? 'bg-gray-200' // Inactive and disabled
              : 'bg-river-blue-2'
        }`}
      >
        <Text
          style={isActive ? Typography.subline2 : Typography.copy2}
          className={`text-[12px] leading-[18px] text-center ${
            isActive
              ? disabled
                ? 'text-gray-500 font-semibold' // Muted active text
                : 'text-river-blue-1 font-semibold'
              : disabled
                ? 'text-gray-400 font-normal'
                : 'text-river-blue-5 font-normal'
          }`}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.7}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FilterButton;
