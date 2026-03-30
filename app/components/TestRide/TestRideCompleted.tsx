import Typography from '@/constants/typography';
import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { Card, Divider, Text } from 'react-native-paper';
import WhatsappIcon from '../Whatsapp';
import { Dropdownsmall2 } from '../inputdropdown3';
import MapIcon from './mapicon';

// interface TestRideDetailsCardProps {
//   currentStatus: string;
//   onStatusChange: (newStatus: string) => void;
// }

// 
const TestRideDetailsCard =() => {
  return (
    <Card className="w-[342px] rounded-2xl overflow-visible p-4">
      <Card.Content className="flex flex-col gap-4 bg-river-blue-2 rounded-2xl">
        {/* Lead Header */}
        <View className="flex flex-row justify-between items-center pb-2 ">
          <Text style={Typography.copy1} className="text-river-blue-6">
            Lead Name
          </Text>
          <View className="flex flex-row items-center gap-4">
            <TouchableOpacity onPress={() => Linking.openURL('tel:9876521390')}>
              <Text style={Typography.copy2} className="text-river-blue-5">
                9876521390
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/9876521390')}>
              <WhatsappIcon/>
            </TouchableOpacity>
          </View>
        </View>
 
        <Divider className="bg-river-blue-4 h-[1px] mb-4" />
 
        {/* Test Ride Info */}
        <View className="flex flex-row justify-between items-center mb-2">
          <View className="flex-1 items-center">
            <Text style={Typography.headline6B} className="text-river-blue-6 mb-1">
              Home Test Ride
            </Text>
            <Text style={Typography.copy2} className="text-river-blue-5">
              Test Ride Type
            </Text>
          </View>
          <View className="w-[1px] h-16 bg-river-blue-4 mx-2" />
          <View className="flex-1 items-center">
            <Text style={Typography.headline6B} className="text-river-blue-6 mb-1">
              10 May, 10:30 AM
            </Text>
            <Text style={Typography.copy2} className="text-river-blue-5">
              Scheduled Date & Time
            </Text>
          </View>
        </View>
 
        {/* Address Section */}
        <View className="items-center mb-4 ">
        <Text style={Typography.headline6B} className="text-river-blue-6 mb-1">
              10 May, 10:30 AM
            </Text>
            <Text style={Typography.copy2} className="text-river-blue-5">
              Scheduled Date & Time
            </Text>
          <Text style={Typography.headline6B} className="text-river-blue-6 mb-1 text-center">
            No. 166/17, Amruthappa Layout...
          </Text>
          <Text style={Typography.status} className="text-river-blue-5 mb-2 text-center">
            Address
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://maps.google.com/?q=No. 166/17, Amruthappa Layout')}
            className="flex flex-row items-center"
          >
            <Text style={Typography.hyperlink3} className="text-river-blue-6 underline f">
              Open in Google Maps 
            </Text>
            <MapIcon/>
          </TouchableOpacity>
        </View>
 
        <Divider className="bg-river-blue-4 h-[1px] mb-4" />
 
        {/* Status Section */}
        <View className="flex flex-row justify-between items-center">
          <Text style={Typography.subline2} className="text-river-blue-6">
            Test Ride Status :
          </Text>
          
          <View className="bg-[#15CA5D] p-2 w-44 rounded-full ">
            <Text style={[Typography.subline2, { color: '#FFFFFF', fontWeight: '600', textAlign: 'center' }]}>
              Completed
            </Text>
          </View>

        </View>
      </Card.Content>
    </Card>
  );
};

export default TestRideDetailsCard;