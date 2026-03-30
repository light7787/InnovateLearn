import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface LeadCardProps {
  leadName: string;
  phoneNumber: string;
  orderId: string;
  amount: string;
  status: string;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  leadName,
  phoneNumber,
  orderId,
  amount,
  status
}) => {
  return (
    <Card className="w-[342px] h-[222px] bg-[#DEEEF6] rounded-2xl">
      <View className="p-4 pb-5 flex-col gap-4">
        <View className="w-[310px] h-[152px] flex-col gap-4">
          <View className="w-[310px] h-[112px] flex-col items-center">
            <View className="w-[310px] h-[40px] flex-row justify-between items-center pb-2">
              <View className="w-[120px] h-[24px]">
                <Text 
                  className="text-base font-medium text-[#00405D] font-montserrat"
                  style={{ lineHeight: 24 }}
                >
                  {leadName}
                </Text>
              </View>
              
              <View className="w-[141px] h-[32px] flex-row items-center justify-end p-1 gap-2">
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
                  style={{ marginLeft: 16 }}
                />
              </View>
            </View>
            
            <View className="w-[310px] h-[1px] bg-[#61AFD2]" />
            
            <View className="w-[310px] h-[72px] flex-row justify-between items-center p-1 mt-4">
              <View className="w-[101px] h-[40px] flex-col items-center px-6">
                <View className="w-[53px] h-[40px] flex-col items-center gap-1">
                  <Text 
                    className="text-xs font-bold text-[#00405D] font-sohne-breit"
                    style={{ lineHeight: 18 }}
                  >
                    {orderId}
                  </Text>
                  <Text 
                    className="text-xs text-[#007DB6] font-montserrat"
                    style={{ lineHeight: 18 }}
                  >
                    Order ID
                  </Text>
                </View>
              </View>
              
              <View className="w-[101px] h-[40px] flex-col items-center px-6">
                <View className="w-[53px] h-[40px] flex-col items-center gap-1">
                  <Text 
                    className="text-xs font-bold text-[#00405D] font-sohne-breit"
                    style={{ lineHeight: 18 }}
                  >
                    {amount}
                  </Text>
                  <Text 
                    className="text-xs text-[#007DB6] font-montserrat"
                    style={{ lineHeight: 18 }}
                  >
                    Amount
                  </Text>
                </View>
              </View>
              
              <View className="w-[101px] h-[40px] flex-col items-center px-6">
                <View className="w-[96px] h-[40px] flex-col items-center gap-1">
                  <View className="bg-[#15CA5D] px-4 py-[3px] rounded-[30px]">
                    <Text 
                      className="text-xs font-semibold text-white font-sohne"
                      style={{ lineHeight: 18 }}
                    >
                      {status}
                    </Text>
                  </View>
                  <Text 
                    className="text-xs text-[#007DB6] font-montserrat"
                    style={{ lineHeight: 18 }}
                  >
                    Status
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};