import Typography from '@/constants/typography';
import React from 'react';
import { Text, View } from 'react-native';

const EnquiryCard = () => {
  return (
    <View
      className="flex-row justify-between items-center w-88 h-[52px] rounded-2xl bg-[#DEEEF6] px-8 py-2 gap-x-2.5"
    >
      <Text style={Typography.copy1}
        className=" leading-6 text-river-blue-5"
      >
        Total Enquiries
      </Text>
      <Text style={Typography.headline3B}
        className=" text-[#00405D]"
      >
        5
      </Text>
    </View>
  );
};

export default EnquiryCard;