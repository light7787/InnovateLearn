// src/components/TestRideDetailsCard.tsx
import Typography from '@/constants/typography';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Linking, Pressable } from 'react-native'; // Import Linking
import WhatsappIcon from '../Whatsapp';
import { Divider } from 'react-native-paper';
import CardDetialsIcon from '../carddetails';
 
type OrderStatus = 'Reschedule TR Call' | 'Schedule TR Call' | 'Booking Call';
type LeadTemperature = 'Hot' | 'Warm' | 'Cold';
 
interface TestRideDetailsCardProps {
  leadId?: string; // Add leadId prop
  followupId?: string; // Add followupId prop
  leadName?: string;
  followUpCount?: number;
  phoneNumber?: string;
  leadTemperature?: LeadTemperature;
  lastFollowUpRemark?: string;
  upcomingFollowUpDate?: string;
  upcomingFollowUpTime?: string;
  followUpType?: OrderStatus;
  isOverdue?: boolean;
  followupList?: any[]; // New prop to indicate if the followup is overdue
  sourceScreen?: string;
}
 
const FollowUpCard: React.FC<TestRideDetailsCardProps> = ({
  leadId, // Add leadId
  followupId, // Add followupId
  leadName = 'Lead Name',
  followUpCount = 1,
  phoneNumber = '9876521390',
  leadTemperature = 'Hot',
  lastFollowUpRemark = 'Not Clear',
  upcomingFollowUpDate = '10 May',
  upcomingFollowUpTime = '10:30 AM',
  followUpType = 'Booking Call',
  isOverdue = false, // Default to false
  followupList = [], // Default to empty array
  sourceScreen = 'follow-ups',
}) => {
  // Navigation protection ref
  const isNavigatingRef = useRef(false);
 
  const getTemperatureStyle = (temperature: LeadTemperature) => {
    switch (temperature) {
      case 'Hot':
        return {
          backgroundColor: '#F3776C',
        };
      case 'Warm':
        return {
          backgroundColor: '#FFC500',
        };
      case 'Cold':
      default:
        return {
          backgroundColor: '#007DB6',
        };
    }
  };
 
  const getFollowUpTypeColor = (type: OrderStatus): string => {
    switch (type) {
      case 'Reschedule TR Call':
        return '#F3776C';
      case 'Schedule TR Call':
        return '#61AFD2';
      case 'Booking Call':
      default:
        return '#FFA500';
    }
  };
 
  // Helper function to format the upcoming follow-up display
  const getFormattedFollowUpDateTime = () => {
    if (upcomingFollowUpDate === 'N/A' || !upcomingFollowUpDate) {
      return 'Not Scheduled';
    }
   
    if (!upcomingFollowUpTime || upcomingFollowUpTime === '' || upcomingFollowUpTime === 'N/A') {
      return upcomingFollowUpDate;
    }
   
    return `${upcomingFollowUpDate}, ${upcomingFollowUpTime}`;
  };
 
  // Protected handler for phone call
  const handleCallLeadWithNavigation = (): void => {
    if (isNavigatingRef.current) return;
 
    isNavigatingRef.current = true;
 
    // Call the original handler
    handleCallLead();
 
    // Reset navigation flag after delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000); // Adjust as needed
  };
 
  // Function to make phone call
  const handleCallLead = (): void => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
 
  // Protected handler for WhatsApp
  const handleWhatsAppWithNavigation = (): void => {
    if (isNavigatingRef.current) return;
 
    isNavigatingRef.current = true;
 
    // Call the original handler
    handleWhatsAppPress();
 
    // Reset navigation flag after delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000); // Adjust as needed
  };
 
  // Function to open WhatsApp
  const handleWhatsAppPress = (): void => {
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };
 
  // Protected handler for view details
  const handleViewDetailsWithNavigation = (): void => {
    if (isNavigatingRef.current) return;
 
    isNavigatingRef.current = true;
 
    // Call the original handler
    handleViewDetails();
 
    // Reset navigation flag after delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000); // Adjust as needed
  };
 
  const handleViewDetails = (): void => {
    // Navigate to FollowUpDetailsScreen with the current props including leadId and followupId
    router.push({
      pathname: '/follow-ups/details',
      params: {
        leadId: leadId || '', // Pass leadId
        followupId: followupId || '', // Pass followupId
        leadName,
        followUpCount: followUpCount.toString(),
        phoneNumber,
        leadTemperature,
        lastFollowUpRemark,
        upcomingFollowUpDate,
        upcomingFollowUpTime,
        followUpType,
        followupList: JSON.stringify(followupList), // Pass followupList as a string
        sourceScreen,
      },
    });
  };
 
  return (
    <Pressable className="w-88 flex flex-col gap-4 p-4 bg-river-blue-2 rounded-2xl overflow-hidden " onPress={handleViewDetailsWithNavigation}>
      {/* Header Section */}
      <View className="flex flex-row justify-between items-start">
        <View className="flex flex-col justify-center gap-2 pt-2 flex-1 ">
          <Text style={Typography.headline4} className="text-river-blue-6  mr-2">
            {leadName}
          </Text>
          <Text style={Typography.copy2} className="text-river-blue-5">
            Follow-Up Count: {followUpCount}
          </Text>
        </View>
 
        <View className="flex flex-col items-end gap-2">
          {/* Temperature Badge */}
          <View
            className="px-3 py-1 rounded-full"
            style={getTemperatureStyle(leadTemperature)}
          >
            <Text style={[Typography.copy2, styles.temperatureText]}>
              {leadTemperature}
            </Text>
          </View>
 
          {/* Contact Info */}
          <View className="flex flex-row items-center gap-2">
            <TouchableOpacity onPress={handleCallLeadWithNavigation}>
              <Text className="text-river-blue-5 mr-3 " style={[Typography.copy2,{letterSpacing:1.2}]}>
                {phoneNumber}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleWhatsAppWithNavigation} >
              <WhatsappIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
 
      {/* Divider */}
      <Divider style={{ backgroundColor: '#61AFD2', height: 1 }} />
 
      {/* Content Section */}
      <View className="flex flex-row justify-between items-center ">
        <View className="flex flex-col items-center gap-1 flex-1">
          <Text style={Typography.headline6B} className="text-river-blue-6 text-center">
            {lastFollowUpRemark}
          </Text>
          <Text style={Typography.copy2} className="text-river-blue-5">
            Last Follow-Up Remark
          </Text>
        </View>
 
        <View className="w-[1px] h-[80px] bg-river-blue-4 mx-2" />
 
        <View className="flex flex-col items-center gap-1 flex-1">
          <Text
            style={[
              Typography.headline6B,
              isOverdue ? styles.overdueText :
              (upcomingFollowUpDate === 'N/A' || !upcomingFollowUpDate) ? styles.notScheduledText :
              { color: '#00405D' }
            ]}
            className="text-center"
          >
            {getFormattedFollowUpDateTime()}
          </Text>
          <Text style={Typography.copy2} className="text-river-blue-5">
            Upcoming Follow-Up
          </Text>
        </View>
      </View>
 
      {/* Follow-Up Type Section */}
      <View className="flex flex-row justify-between items-center">
        <Text style={Typography.subline2} className="text-river-blue-6">
          Follow-Up Type:
        </Text>
        <View
          className="flex flex-row items-center justify-center py-1.5 px-4 rounded-full w-48"
          style={{ backgroundColor: getFollowUpTypeColor(followUpType) }}
        >
          <Text style={[Typography.subline2, styles.statusText]}>
            {followUpType}
          </Text>
        </View>
      </View>
 
      {/* View Details Footer */}
      <TouchableOpacity
        onPress={handleViewDetailsWithNavigation}
        className="flex flex-row items-center justify-end gap-4"
      >
        <Text style={[Typography.subline2, styles.viewDetailsText]} className="text-river-blue-6">
          View details
        </Text>
        <CardDetialsIcon/>
      </TouchableOpacity>
    </Pressable>
  );
};
 
const styles = StyleSheet.create({
  temperatureText: {
    color: 'white',
    fontWeight: '600',
  },
  statusText: {
    color: 'white',
  },
  viewDetailsText: {
    fontWeight: '600',
  },
  overdueText: {
    color: '#FF0000', // Red color for overdue dates
  },
  notScheduledText: {
    color: '#888888', // Gray color for not scheduled dates
    fontStyle: 'italic',
  },
});
 
export default FollowUpCard;
