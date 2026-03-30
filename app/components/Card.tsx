import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Divider, Card as PaperCard } from 'react-native-paper';

const LeadCard2 = () => {
  return (
    <PaperCard className="w-80 h-56 p-4 bg-blue-100 rounded-2xl">
      <PaperCard.Content className="flex flex-col items-start p-0 gap-4">
        {/* Top Section */}
        <View className="flex flex-row justify-between items-center w-full pb-2">
          <View className="flex flex-col items-start gap-2">
            <Text className="font-montserrat text-base font-medium text-blue-900">
              Lead Name
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text className="font-montserrat text-sm font-medium text-blue-700">
              9876521390
            </Text>
            <FontAwesome name="whatsapp" size={24} color="#25D366" />
          </View>
        </View>

        {/* Divider */}
        <Divider className="w-full h-px bg-blue-400" />

        {/* Order Info */}
        <View className="flex flex-row justify-between items-center w-full py-1">
          <View className="flex flex-col items-center px-6 gap-4">
            <Text className="font-sohne-breit text-sm font-bold text-blue-900">001</Text>
            <Text className="font-montserrat text-xs font-medium text-blue-700">Order ID</Text>
          </View>

          <View className="w-px h-10 bg-blue-400 rotate-90" />

          <View className="flex flex-col items-center px-4 gap-4">
            <Text className="font-sohne-breit text-sm font-bold text-blue-900">5,000 INR</Text>
            <Text className="font-montserrat text-xs font-medium text-blue-700">Remaining Amount</Text>
          </View>
        </View>

        {/* Status + View Details */}
        <View className="flex flex-col items-start gap-4 w-full">
          <View className="flex flex-row items-center gap-2 w-full">
            <Text className="font-montserrat text-xs font-semibold text-blue-900">
              Order Status :
            </Text>
            <View className="flex flex-row justify-center items-center px-4 py-1 bg-green-500 rounded-full">
              <Text className="font-sohne text-xs font-semibold text-white">
                Booking Confirmed
              </Text>
            </View>
          </View>

          <View className="flex flex-row justify-end items-center gap-4 w-full">
            <Text className="font-montserrat text-xs font-semibold text-blue-900">
              View details
            </Text>
            <AntDesign name="arrowright" size={16} color="#00405D" className="rotate-180" />
          </View>
        </View>
      </PaperCard.Content>
    </PaperCard>
  );
};

export default LeadCard2;
