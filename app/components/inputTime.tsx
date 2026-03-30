
import Typography from '@/constants/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import ClockIcon from './clockicon';

interface TimeFieldProps {
  time: string;
  onPress: () => void;
}

export const TimeField: React.FC<TimeFieldProps> = ({ time, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-88 h-12 bg-[#DEEEF6] rounded-full px-4 flex-row items-center justify-between"
    >
      <Text className="text-[16px] text-[#0073A8] font-normal"  style={Typography.copy1}>{time}</Text>
      
      {/* <MaterialCommunityIcons name="clock-time-three-outline" size={20} color="#0073A8" /> */}
      <ClockIcon/>
    </TouchableOpacity>
  );
};
