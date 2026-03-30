import Typography from '@/constants/typography';
import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { Card, Divider, Text } from 'react-native-paper';
import WhatsappIcon from '../Whatsapp';
import MapIcon from './mapicon';

interface TestRideCardProps {
  // Props for the passed data
  leadname?: string;
  leadId?: string;
  testrideId?: string;
  phoneNumber?: string;
  testRideType?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  completedDate?: string;
  completedTime?: string;
  address?: string;
  userId?: string;
  status?: 'ongoing' | 'completed';
  // Additional props for enhanced functionality
  onCallPress?: () => void;
  onWhatsAppPress?: () => void;
  onMapPress?: () => void;
  showActions?: boolean;
}

const TestRideCard: React.FC<TestRideCardProps> = ({ 
  leadname = 'Lead Name',
  leadId,
  testrideId,
  phoneNumber = '9876521390',
  testRideType = 'Home Test Ride',
  scheduledDate = '10 May',
  scheduledTime = '10:30 AM',
  completedDate,
  completedTime,
  address = 'No. 166/17, Amruthappa Layout...',
  userId,
  status = 'ongoing',
  onCallPress,
  onWhatsAppPress,
  onMapPress,
  showActions = true,
}) => {
  
  // Helper function to format current date and time for completion
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    });
    const time = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return { date, time };
  };

  // Use provided completion date/time or current date/time for completed status
  const getCompletionDateTime = () => {
    if (completedDate && completedTime) {
      return { date: completedDate, time: completedTime };
    }
    // If status is completed but no completion date/time provided, use current
    if (status === 'completed') {
      return getCurrentDateTime();
    }
    return null;
  };

  const completionDateTime = getCompletionDateTime();

  const handleCallPress = () => {
    if (onCallPress) {
      onCallPress();
    } else {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleWhatsAppPress = () => {
    if (onWhatsAppPress) {
      onWhatsAppPress();
    } else {
      Linking.openURL(`https://wa.me/${phoneNumber.replace(/\D/g, '')}`); // Remove non-digits
    }
  };

  const handleMapPress = () => {
    if (onMapPress) {
      onMapPress();
    } else {
      Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
    }
  };

  // Enhanced status configuration
  const statusConfig = {
    ongoing: {
      backgroundColor: '#007DB6',
      text: 'Ongoing',
      textColor: '#FFFFFF'
    },
    completed: {
      backgroundColor: '#15CA5D',
      text: 'Completed',
      textColor: '#FFFFFF'
    }
  };

  const currentStatus = statusConfig[status];

  return (
    <Card 
      className="w-full rounded-2xl overflow-visible p-4"
      style={{ 
        backgroundColor: '#DEEEF6',
        elevation: 0,
        shadowOpacity: 0,
      }}
    >
      <Card.Content 
        style={{ 
          borderRadius: 16,
          padding: 16,
          gap: 4,
          backgroundColor: 'transparent'
        }}
      >
        {/* Lead Header */}
        <View className="flex flex-row justify-between items-center pb-3">
          <Text style={[Typography.copy1, { color: '#1e293b' }]}>
            {leadname}
          </Text>
          {showActions && (
            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity onPress={handleCallPress}>
                <Text style={[Typography.copy2, { color: '#007DB6', letterSpacing: 1.2 }]}>
                  {phoneNumber}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleWhatsAppPress}
                style={{ opacity: 1 }}
              >
                <WhatsappIcon/>
              </TouchableOpacity>
            </View>
          )}
        </View>
 
        <Divider style={{ backgroundColor: '#61AFD2', height: 1, marginBottom: 12 }} />
 
        {/* Test Ride Info */}
        <View className="flex flex-row justify-between items-center">
          <View className="flex-1 items-center">
            <Text style={[Typography.headline6B, { color: '#1e293b', marginBottom: 4, textAlign: 'center' }]}>
              {testRideType}
            </Text>
            <Text style={[Typography.copy2, { color: '#007DB6' }]}>
              Test Ride Type
            </Text>
          </View>
          <View style={{ width: 1, height: 96, backgroundColor: '#61AFD2', marginHorizontal: 8 }} />
          <View className="flex-1 items-center">
            <Text style={[Typography.headline6B, { color: '#1e293b', marginBottom: 4, textAlign: 'center' }]}>
              {scheduledDate}, {scheduledTime}
            </Text>
            <Text style={[Typography.copy2, { color: '#007DB6' }]}>
              Scheduled Date & Time
            </Text>
          </View>
        </View>

        {/* Conditional Completion Date & Time - Only show when status is completed */}
        {status === 'completed' && completionDateTime && (
          <>
            {/* <Divider style={{ backgroundColor: '#61AFD2', height: 1, marginVertical: 12 }} /> */}
            <View className="items-center">
              <Text style={[Typography.headline6B, { color: '#1e293b', marginBottom: 4, textAlign: 'center' }]}>
                {completionDateTime.date}, {completionDateTime.time}
              </Text>
              <Text style={[Typography.copy2, { color: '#15CA5D', fontWeight: '600' }]}>
                Completed Date & Time
              </Text>
            </View>
          </>
        )}
 
        {/* Address Section */}
        <View className="items-center mb-8 mt-4">
          <Text style={[Typography.headline6B, { color: '#1e293b', marginBottom: 4, textAlign: 'center' }]}>
            {address}
          </Text>
          <Text style={[Typography.status, { color: '#007DB6', marginBottom: 4, textAlign: 'center' }]}>
            Address
          </Text>
          {showActions && (
            <TouchableOpacity
              onPress={handleMapPress}
              className="flex flex-row items-center"
            >
              <Text style={[Typography.hyperlink3, { color: '#00405D', textDecorationLine: 'underline' }]}>
                Open in Google Maps 
              </Text>
              <MapIcon/>
            </TouchableOpacity>
          )}
        </View>
 
        <Divider style={{ backgroundColor: '#94a3b8', height: 1, marginBottom: 16 }} />
 
        {/* Enhanced Status Section */}
        <View className="flex flex-row justify-between items-center pt-2 pb-2">
          <Text style={[Typography.subline2, { color: '#1e293b' }]}>
            Test Ride Status :
          </Text>
          <View 
            className="p-2 w-44 rounded-full"
            style={{ backgroundColor: currentStatus.backgroundColor }}
          >
            <Text style={[Typography.subline2, { color: '#FFFFFF', fontWeight: '600', textAlign: 'center' }]}>
              {currentStatus.text}
            </Text>
          </View>
        </View>

        {/* Debug Info - Remove in production */}
       
      </Card.Content>
    </Card>
  );
};

export default TestRideCard;