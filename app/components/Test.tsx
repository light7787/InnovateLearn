import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Card, Divider } from 'react-native-paper';
const OrderCard = () => {
  return (
    <Card className="m-4 bg-blue-50 rounded-2xl">
      <Card.Content className="p-4">
        {/* Header Section */}
        <View className="flex-col gap-4">
          <View className="flex-col items-center">
            {/* Lead Name and Contact */}
            <View className="flex-row justify-between items-center pb-2 w-full">
              <View className="flex-col gap-2 w-30">
                <Text className="text-blue-900 text-base font-medium leading-4">
                  Lead Name
                </Text>
              </View>
              <View className="flex-col items-end justify-center gap-2 py-1 px-2">
                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center justify-center gap-4">
                    <Text className="text-blue-600 text-xs font-medium whitespace-nowrap">
                      9876521390
                    </Text>
            <FontAwesome name="whatsapp" size={24} color="black" />
                  </View>
                </View>
              </View>
            </View>
            
            {/* Divider */}
            <Divider className="w-full h-px bg-gray-300" />
            
            {/* Order Details */}
            <View className="flex-row justify-between items-center py-1 w-full">
              <View className="flex-col items-center gap-4 px-6">
                <View className="flex-col items-center gap-1">
                  <Text className="text-blue-900 text-xs font-normal text-center leading-4 whitespace-nowrap">
                    002
                  </Text>
                  <Text className="text-blue-600 text-xs font-medium text-center leading-4 whitespace-nowrap">
                    Order ID
                  </Text>
                </View>
              </View>
              
              {/* Vertical Divider */}
              <View className="w-px h-16 bg-gray-300" />
              
              <View className="flex-col items-center gap-4 px-4">
                <View className="flex-col items-center justify-center gap-1">
                  <Text className="text-blue-900 text-xs font-normal text-center leading-4 whitespace-nowrap">
                    5,000 INR
                  </Text>
                  <Text className="text-blue-600 text-xs font-medium text-center leading-4 whitespace-nowrap">
                    Remaining Amount
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Order Status */}
          <View className="flex-row items-center gap-2.5 w-full">
            <Text className="text-blue-900 text-xs font-semibold leading-4 whitespace-nowrap">
              Order Status :
            </Text>
            <View className="flex-row items-center justify-center gap-2.5 py-1 px-4 bg-orange-500 rounded-full">
              <Text className="text-white text-xs font-normal text-center leading-4">
                Payment Pending
              </Text>
            </View>
          </View>
        </View>
        
        {/* View Details Button */}
        <TouchableOpacity className="flex-row items-center justify-end gap-4 w-full mt-4">
          <Text className="text-blue-900 text-xs font-semibold leading-4 whitespace-nowrap">
            View details
          </Text>
          <MaterialIcons name="arrow-forward" size={16} color="#00405d" />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
};

export default OrderCard;