import Typography from '@/constants/typography';
import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { Card, Divider, Text } from 'react-native-paper';
import WhatsappIcon from '../Whatsapp';
import { Dropdownsmall2 } from '../inputdropdown3';
import MapIcon from './mapicon';

interface TestRideDetailsCardProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
  // Add props for the passed data
  leadname?: string;
  phoneNumber?: string;
  testRideType?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  address?: string;
  // Props to control which statuses are available
  excludeStatuses?: string[];
  availableStatuses?: string[];
  postalCode?: string;
  // Add dropdown state management props
  isDropdownOpen?: boolean;
  setIsDropdownOpen?: (isOpen: boolean) => void;
}

const TestRideDetailsCard: React.FC<TestRideDetailsCardProps> = ({ 
  currentStatus, 
  onStatusChange,
  leadname = 'Lead Name',
  phoneNumber = '9876521390',
  testRideType = 'Home Test Ride',
  scheduledDate = '10 May',
  scheduledTime = '10:30 AM',
  address = 'No. 166/17, Amruthappa Layout...',
  excludeStatuses = [],
  availableStatuses = ['Confirmed', 'Rescheduled', 'Cancelled'],
  isDropdownOpen = false,
  setIsDropdownOpen
}) => {
  
  // Filter out excluded statuses from available options
  const filteredStatusOptions = availableStatuses.filter(
    status => !excludeStatuses.some(excluded => 
      excluded.toLowerCase() === status.toLowerCase()
    )
  );

  const handleCallPress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsAppPress = () => {
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  const handleMapPress = () => {
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
  };

  return (
    <Card 
      className="w-full rounded-2xl overflow-visible p-4"
      style={{ 
        backgroundColor: '#DEEEF6', // river-blue-2 equivalent
        elevation: 0, // Remove shadow
        shadowOpacity: 0, // Remove shadow on iOS
      }}
    >
      <Card.Content 
        style={{ 
          borderRadius: 16,
          padding: 16,
          gap: 4,
          backgroundColor: 'transparent' // Make content background transparent
        }}
      >
        {/* Lead Header */}
        <View className="flex flex-row justify-between items-center pb-3 ">
          <Text style={[Typography.copy1, { color: '#1e293b' }]}>
            {leadname}
          </Text>
          <View className="flex flex-row items-center gap-4">
            <TouchableOpacity onPress={handleCallPress}>
              <Text style={[Typography.copy2, { color: '#007DB6' ,letterSpacing:1.2}]}>
                {phoneNumber}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleWhatsAppPress}
              style={{ opacity: 1 }} // Ensure full opacity
            >
              <WhatsappIcon/>
            </TouchableOpacity>
          </View>
        </View>
 
        <Divider style={{ backgroundColor: '#61AFD2', height: 1 ,marginBottom:12}} />
 
        {/* Test Ride Info */}
        <View className="flex flex-row justify-between items-center  ">
          <View className="flex-1 items-center">
            <Text style={[Typography.headline6B, { color: '#1e293b', marginBottom: 4 }]}>
              {testRideType}
            </Text>
            <Text style={[Typography.copy2, { color: '#007DB6' }]}>
              Test Ride Type
            </Text>
          </View>
          <View style={{ width: 1, height: 96, backgroundColor: '#61AFD2', marginHorizontal: 8 }} />
          <View className="flex-1 items-center">
            <Text style={[Typography.headline6B, { color: '#1e293b', marginBottom: 4 }]}>
              {scheduledDate}, {scheduledTime}
            </Text>
            <Text style={[Typography.copy2, { color: '#007DB6' }]}>
              Scheduled Date & Time
            </Text>
          </View>
        </View>
 
        {/* Address Section */}
        <View className="items-center mb-8  ">
          <Text style={[Typography.headline6B, { color: '#1e293b', marginBottom: 4, textAlign: 'center' }]}>
            {address}
          </Text>
          <Text style={[Typography.status, { color: '#007DB6', marginBottom: 4, textAlign: 'center' }]}>
            Address
          </Text>
          <TouchableOpacity
            onPress={handleMapPress}
            className="flex flex-row items-center"
          >
            <Text style={[Typography.hyperlink3, { color: '#00405D', textDecorationLine: 'underline' }]}>
              Open in google Maps 
            </Text>
            <MapIcon/>
          </TouchableOpacity>
        </View>
 
        <Divider style={{ backgroundColor: '#94a3b8', height: 1, marginBottom: 16 }} />
 
        {/* Status Section */}
        <View className="flex flex-row justify-between items-center pt-2 pb-2">
          <Text style={[Typography.subline2, { color: '#1e293b' }]}>
            Test Ride Status :
          </Text>
          <View className="bg-white rounded-[30px] ml-2 ">
            <Dropdownsmall2 
              options={filteredStatusOptions}
              value={currentStatus} 
              onSelect={onStatusChange}
               isOpen={isDropdownOpen}
              setIsOpen={setIsDropdownOpen}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default TestRideDetailsCard;