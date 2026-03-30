// Updated TestRideDetailsCard component
import Typography from '@/constants/typography';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Text, TouchableOpacity, View, Linking, Pressable } from 'react-native';
import WhatsappIcon from '../Whatsapp';
import { Divider } from 'react-native-paper';
import CardDetialsIcon from '../carddetails';

interface TestRideDetailsCardProps {
  leadname?: string;
  leadId?: string;
  testrideId?: string;
  no?: string;
  testRideStatus?: string;
  testRideType?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  address?: string;
  postalCode?: string; // Add postal code prop
}

const TestRideDetailsCard: React.FC<TestRideDetailsCardProps> = ({ 
  leadname, 
  leadId,
  testrideId,
  no, 
  testRideStatus, 
  testRideType,
  scheduledDate,
  scheduledTime,
  address,
  postalCode // Accept postal code prop
}) => {
  // Navigation protection ref
  const isNavigatingRef = useRef(false);
  
  // Default values with proper fallbacks
  const safeLeadName = leadname || 'Unknown Lead';
  const safePhoneNumber = no || 'N/A';
  const safeTestRideStatus = testRideStatus || 'Scheduled';
  const safeTestRideType = testRideType || 'Home Test Ride';
  const safeScheduledDate = scheduledDate || 'N/A';
  const safeScheduledTime = scheduledTime || 'N/A';
  const safeAddress = address || 'Address not available';
  const safePostalCode = postalCode || ''; // Safe postal code
  
  // Protected navigation handler for view details
  const handleViewDetailsWithNavigation = () => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    
    // Call the original handler
    handleViewDetails();
    
    // Reset navigation flag after delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const handleViewDetails = () => {
    // Check if status is ongoing - if yes, navigate to documents page
    if (safeTestRideStatus.toLowerCase() === 'on-going' || safeTestRideStatus.toLowerCase() === 'ongoing') {
      // Navigate to testrides/documents page for ongoing test rides
      const params = new URLSearchParams({
        leadId: leadId || '',
        testrideId: testrideId || '',
        leadname: safeLeadName,
        phoneNumber: safePhoneNumber,
        testRideStatus: safeTestRideStatus,
        testRideType: safeTestRideType,
        scheduledDate: safeScheduledDate,
        scheduledTime: safeScheduledTime,
        address: safeAddress,
        postalCode: safePostalCode
      });
      
      router.push(`/test-rides/ongoing?${params.toString()}`);
    } else {
      // For all other statuses, navigate to regular details page
      const params = new URLSearchParams({
        leadId: leadId || '',
        testrideId: testrideId || '',
        leadname: safeLeadName,
        phoneNumber: safePhoneNumber,
        testRideStatus: safeTestRideStatus,
        testRideType: safeTestRideType,
        scheduledDate: safeScheduledDate,
        scheduledTime: safeScheduledTime,
        address: safeAddress,
        postalCode: safePostalCode
      });
      
      router.push(`/test-rides/details?${params.toString()}`);
    }
  };

  // Protected handler for phone call
  const handlePhoneCallWithNavigation = () => {
    if (isNavigatingRef.current || safePhoneNumber === 'N/A') return;
    
    isNavigatingRef.current = true;
    
    // Call the original handler
    handlePhoneCall();
    
    // Reset navigation flag after delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  // Function to make phone call
  const handlePhoneCall = () => {
    if (safePhoneNumber !== 'N/A') {
      Linking.openURL(`tel:${safePhoneNumber}`);
    }
  };

  // Protected handler for WhatsApp
  const handleWhatsAppWithNavigation = () => {
    if (isNavigatingRef.current || safePhoneNumber === 'N/A') return;
    
    isNavigatingRef.current = true;
    
    // Call the original handler
    handleWhatsApp();
    
    // Reset navigation flag after delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  // Function to open WhatsApp
  const handleWhatsApp = () => {
    if (safePhoneNumber !== 'N/A') {
      Linking.openURL(`https://wa.me/91${safePhoneNumber.replace(/[^0-9]/g, '')}`);
    }
  };

  // Check if it's a store test ride (case insensitive)
  const isStoreTestRide = safeTestRideType.toLowerCase().includes('store');

  // Format date and time display based on test ride type
  const getDateTimeDisplay = () => {
    if (isStoreTestRide) {
      return safeScheduledDate; // Only show date for store test rides
    } else {
      // Show both date and time for home test rides
      if (safeScheduledDate === 'N/A' && safeScheduledTime === 'N/A') {
        return 'Not scheduled';
      } else if (safeScheduledTime === 'N/A') {
        return safeScheduledDate;
      } else if (safeScheduledDate === 'N/A') {
        return safeScheduledTime;
      } else {
        return `${safeScheduledDate}, ${safeScheduledTime}`;
      }
    }
  };

  // Get status styling based on status and format display text
  const getStatusStyles = () => {
    const lowerStatus = safeTestRideStatus.toLowerCase();
    switch (lowerStatus) {
      case 'confirmed':
        return {
          backgroundColor: '#15CA5D', // Blue background for ongoing
          textColor: 'text-white',
          displayText: 'Confirmed'
        };
      case 'completed':
        return {
          backgroundColor: '#F0F9FF',
          textColor: 'text-green-700',
          displayText: 'Completed'
        };
      case 'cancelled':
        return {
          backgroundColor: '#FEF2F2', // Light red background
          textColor: 'text-red-600',
          displayText: 'Cancelled'
        };
      case 'rescheduled':
        return {
          backgroundColor: '#FFA500', // Light orange background
          textColor: 'text-white',
          displayText: 'Rescheduled'
        };
      case 'pending':
        return {
          backgroundColor: '#FEFCE8', // Light yellow background
          textColor: 'text-yellow-600',
          displayText: 'Pending'
        };
      case 'on-going':
      case 'ongoing':
        return {
          backgroundColor: '#007DB6', // Blue background for ongoing
          textColor: 'text-white', // White text
          displayText: 'Ongoing' // Always display as "Ongoing"
        };
      default:
        return {
          backgroundColor: '#F0F9FF',
          textColor: 'text-river-blue-5',
          displayText: safeTestRideStatus
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <Pressable 
      className="w-88 flex flex-col gap-4 p-4 bg-river-blue-2 rounded-2xl overflow-hidden" 
      onPress={handleViewDetailsWithNavigation}
    >
      {/* Lead Info Section */}
      <View className="flex flex-col gap-4 w-full pt-2">
        <View className="flex flex-row justify-between items-center pb-2">
          <Text style={Typography.headline4} className="text-river-blue-6 flex-1 mr-2">
            {safeLeadName} 
          </Text>
          <View className="flex flex-row items-center gap-4">
            <TouchableOpacity 
              onPress={handlePhoneCallWithNavigation}
              disabled={safePhoneNumber === 'N/A'}
            >
              <Text 
                className={`${safePhoneNumber === 'N/A' ? 'text-gray-400' : 'text-river-blue-5'}`}
                style={[Typography.copy2, {letterSpacing: 1.2}]}
              >
                {safePhoneNumber}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleWhatsAppWithNavigation}
              disabled={safePhoneNumber === 'N/A'}
              style={{ opacity: safePhoneNumber === 'N/A' ? 0.4 : 1 }}
            >
              <WhatsappIcon/>
            </TouchableOpacity>
          </View>
        </View>
        
        <Divider style={{ backgroundColor: '#61AFD2', height: 1 }} />
        
        <View className="flex flex-row justify-between items-center py-2 px-1">
          <View className="flex flex-col items-center gap-1 flex-1">
            <Text style={Typography.headline6B} className="text-river-blue-6 text-center">
              {safeTestRideType}
            </Text>
            <Text style={Typography.copy2} className="text-river-blue-5">
              Test Ride Type
            </Text>
          </View>
          
          {/* Visual separator */}
          <View className="w-[1px] h-[73px] bg-river-blue-4 mx-0 mr-3" />
          
          <View className="flex flex-col items-center gap-1 flex-1 p-2">
            <Text style={Typography.headline6B} className="text-river-blue-6 text-center">
              {getDateTimeDisplay()}
            </Text>
            <Text style={Typography.copy2} className="text-river-blue-5">
              {isStoreTestRide ? 'Scheduled Date' : 'Scheduled Date & Time'}
            </Text>
          </View>
        </View>
      </View>

      {/* Status Section */}
      <View className="flex flex-row justify-between items-center gap-2">
        <Text style={Typography.subline2} className="font-semibold text-river-blue-6">
          Test Ride Status:
        </Text>
        <View 
          className="flex flex-row items-center w-48 justify-center py-1.5 px-10 rounded-full"
          style={{ backgroundColor: statusStyles.backgroundColor }}
        >
          <Text style={Typography.subline2} className={statusStyles.textColor}>
            {statusStyles.displayText}
          </Text>
        </View>
      </View>

      {/* View Details Footer */}
      <TouchableOpacity 
        onPress={handleViewDetailsWithNavigation} 
        className="flex flex-row items-center justify-end gap-4"
      >
        <Text style={Typography.subline2} className="font-semibold text-river-blue-6">
          View details
        </Text>
        <CardDetialsIcon/>
      </TouchableOpacity>
    </Pressable>
  );
};

export default TestRideDetailsCard;