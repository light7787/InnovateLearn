import Typography from '@/constants/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import CalenderIcon from './calendericon';

interface DateFieldProps {
  date: string;
  onPress: () => void;
}

export const DateField: React.FC<DateFieldProps> = ({ date, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-88 h-12 bg-[#DEEEF6] rounded-full px-4 flex-row items-center justify-between"
    >
      <Text className="text-[16px] text-[#0073A8] font-normal"  style={Typography.copy1} >{date}</Text>
      {/* <MaterialCommunityIcons name="calendar-blank-outline" size={20} color="#0073A8" /> */}
      <CalenderIcon/>
    </TouchableOpacity>
  );
};
