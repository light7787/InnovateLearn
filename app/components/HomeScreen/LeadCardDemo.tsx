import React from 'react';
import { View, ScrollView } from 'react-native';
import { LeadCard } from '../LeadCard';

export const LeadCardDemo = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4 items-center">
        <LeadCard
          leadName="Lead Name"
          phoneNumber="9876521390"
          orderId="001"
          amount="5,000 INR"
          status="Booking Confirmed"
        />
      </View>
    </ScrollView>
  );
};