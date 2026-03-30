import React from 'react';
import { View, ScrollView } from 'react-native';
import { FollowUpCard } from '../FollowUpCard';

export const FollowUpCardDemo = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4 items-center">
        <FollowUpCard
          leadName="Lead Name"
          followUpCount="1"
          phoneNumber="9876521390"
          lastRemark="Customer Asked to Follow Up Later.."
          followUpDate="10 May, 10:30 AM"
          followUpType="Reschedule TR Call"
          status="Warm"
        />
      </View>
    </ScrollView>
  );
};