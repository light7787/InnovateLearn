import React from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

interface FollowUpCardProps {
  leadName: string;
  followUpCount: string;
  phoneNumber: string;
  lastRemark: string;
  followUpDate: string;
  followUpType: string;
  status: string;
}

export const FollowUpCard: React.FC<FollowUpCardProps> = ({
  leadName,
  followUpCount,
  phoneNumber,
  lastRemark,
  followUpDate,
  followUpType,
  status
}) => {
  return (
    <Card className="w-[342px] h-[270px] bg-[#DEEEF6] rounded-2xl">
      <View className="px-4 pt-2 pb-4 flex-col gap-4">
        <View className="w-[310px] h-[212px] flex-col gap-4">
          <View className="w-[310px] h-[212px] flex-col items-center">
            <View className="w-[310px] h-[80px] flex-row justify-between items-center pb-2">
              <View className="w-[120px] h-[50px] flex-col gap-2">
                <Text 
                  className="text-base font-medium text-[#00405D] font-montserrat"
                  style={{ lineHeight: 24 }}
                >
                  {leadName}
                </Text>
                <Text 
                  className="text-xs font-medium text-[#007DB6] font-montserrat"
                  style={{ lineHeight: 18 }}
                >
                  Follow-Up Count: {followUpCount}
                </Text>
              </View>
              
              <View className="w-[125px] h-[72px] flex-col justify-center items-end py-2 gap-2">
                <View className="bg-[#FFC500] px-4 py-[3px] rounded-[30px]">
                  <Text 
                    className="text-xs font-semibold text-[#F7FBFD] font-sohne"
                    style={{ lineHeight: 18 }}
                  >
                    {status}
                  </Text>
                </View>
                
                <View className="flex-row items-center gap-4">
                  <Text 
                    className="text-xs font-medium text-[#007DB6] font-montserrat"
                    style={{ lineHeight: 18 }}
                  >
                    {phoneNumber}
                  </Text>
                  <MaterialCommunityIcons 
                    name="whatsapp" 
                    size={24} 
                    color="#25D366"
                  />
                </View>
              </View>
            </View>
            
            <View className="w-[310px] h-[1px] bg-[#61AFD2]" />
            
            <View className="w-[310px] h-[108px] flex-row justify-center items-center py-3 px-1 gap-4">
              <View className="flex-1 flex-col items-start gap-2">
                <Text 
                  className="text-xs font-medium text-[#007DB6] font-montserrat"
                  style={{ lineHeight: 18 }}
                >
                  Last Follow-Up Remark
                </Text>
                <Text 
                  className="text-sm font-medium text-[#00405D] font-montserrat"
                  style={{ lineHeight: 20 }}
                >
                  {lastRemark}
                </Text>
              </View>
              
              <View className="w-[1px] h-full bg-[#61AFD2]" />
              
              <View className="flex-1 flex-col items-start gap-2">
                <View className="flex-row items-center gap-2">
                  <Text 
                    className="text-xs font-medium text-[#007DB6] font-montserrat"
                    style={{ lineHeight: 18 }}
                  >
                    Upcoming Follow-Up
                  </Text>
                  <Text 
                    className="text-xs font-medium text-[#00405D] font-montserrat"
                    style={{ lineHeight: 18 }}
                  >
                    {followUpDate}
                  </Text>
                </View>
                
                <View className="bg-[#FF6B6B] px-4 py-1 rounded-[30px]">
                  <Text 
                    className="text-xs font-semibold text-white font-sohne"
                    style={{ lineHeight: 18 }}
                  >
                    {followUpType}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      <View className="absolute bottom-4 right-4">
        <Feather name="chevron-right" size={24} color="#00405D" />
      </View>
    </Card>
  );
};