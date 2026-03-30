import Typography from '@/constants/typography';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from '@/app/components/inputdropdown';
import { ENV } from '@/constants/env';

const DropoutTestRide = () => {
  const [leadSource, setLeadSource] = useState('Select...');
    const isSelected = leadSource !== 'Select...';

  return (
    <View className="flex-1 bg-gray-50 pt-4">
      <View className="flex-1 p-6 pt-6">
        <Text className=" text-river-blue-6 mb-8" style={Typography.headline4}>Lead Drop Out</Text>
        
        <Dropdown
          label="Reason*"
          value={leadSource}
          onSelect={setLeadSource}
          options={[
            'Not Interested / Not Serious',
            'Considering Later / Unable to Proceed',
            'Choose Another Brand / Store'
          ]}
        />
      </View>
      
       <View className="bg-white   pb-12 px-4">
        <View className="flex-row gap-3">
          <TouchableOpacity
            className={`flex-1 h-12 rounded-full justify-center items-center ${
              isSelected ? 'bg-river-blue-6' : 'bg-river-blue-2'
            }`}
            onPress={() => isSelected &&  ENV === 'dev'&&console.log('Confirm pressed')}
            disabled={!isSelected}
            style={{
              elevation: 2,
              shadowColor: '#00405D',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text className={`text-base font-semibold ${
              isSelected ? 'text-white' : 'text-river-blue-4'
            }`}>Confirm</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 h-12 rounded-full border border-[#00405D] justify-center items-center bg-white"
            onPress={() =>  ENV === 'dev'&&console.log('Close pressed')}
          >
            <Text className="text-[#00405D] text-base font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DropoutTestRide;