import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const TimeSlotSelector = () => {
  const [selectedSlot, setSelectedSlot] = useState('11 AM - 1 PM');

  const handlePress = (slot:string) => {
    setSelectedSlot(slot);
  };

  const getBtnClass = (slot:string) =>
    `flex-row justify-center items-center px-4 py-[11px] w-[167px] h-12 rounded-full border
     ${selectedSlot === slot ? 'bg-[#007DB6]' : 'bg-[#F7FBFD] border-[#007DB6]'}`;

  const getTextClass = (slot:string) =>
    `text-base font-normal ${selectedSlot === slot ? 'text-[#F7FBFD]' : 'text-[#007DB6]'}`;

  return (
    <View className="flex flex-col items-start gap-4 w-[342px] h-[152px]">
      {/* Title */}
      <Text className="text-base font-medium text-[#00405D]">Select Time Slot</Text>

      {/* First Row */}
      <View className="flex-row gap-2 w-[342px]">
        <TouchableOpacity className={getBtnClass('9 AM - 11 AM')} onPress={() => handlePress('9 AM - 11 AM')}>
          <Text className={getTextClass('9 AM - 11 AM')}>9 AM - 11 AM</Text>
        </TouchableOpacity>
        <TouchableOpacity className={getBtnClass('11 AM - 1 PM')} onPress={() => handlePress('11 AM - 1 PM')}>
          <Text className={getTextClass('11 AM - 1 PM')}>11 AM - 1 PM</Text>
        </TouchableOpacity>
      </View>

      {/* Second Row */}
      <View className="flex-row gap-2 w-[342px]">
        <TouchableOpacity className={getBtnClass('2 PM - 4 PM')} onPress={() => handlePress('2 PM - 4 PM')}>
          <Text className={getTextClass('2 PM - 4 PM')}>2 PM - 4 PM</Text>
        </TouchableOpacity>
        <TouchableOpacity className={getBtnClass('4 PM - 6 PM')} onPress={() => handlePress('4 PM - 6 PM')}>
          <Text className={getTextClass('4 PM - 6 PM')}>4 PM - 6 PM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TimeSlotSelector;
