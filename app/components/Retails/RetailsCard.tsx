// src/components/RetailsDetailsCard.tsx
import Typography from '@/constants/typography';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Linking } from 'react-native';
import WhatsappIcon from '../Whatsapp';
import { Divider } from 'react-native-paper';
import { ENV } from '@/constants/env';

// Only PM EDrive statuses allowed
type OrderStatus = 'PM EDrive Pending' | 'PM EDrive Completed';

interface CountdownStyle {
  backgroundColor: string;
}

interface RetailsDetailsCardProps {
  orderId?: string;
  orderStatus?: OrderStatus;
  purchaseDate?: string;
  customDaysLeft?: number;
  leadName?: string;
  phoneNumber?: string;
  remainingAmount?: string;
  rtoRegistrationDate?: string | null;
  pmeDrive?: boolean;
}

const RetailsDetailsCard: React.FC<RetailsDetailsCardProps> = ({
  orderId,
  orderStatus,
  purchaseDate,
  customDaysLeft,
  leadName,
  phoneNumber,
  remainingAmount,
  rtoRegistrationDate,
  pmeDrive,
}) => {
  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'PM EDrive Pending':
        return '#FFA500';
      case 'PM EDrive Completed':
        return '#15CA5D';
      default:
        return '#FFA500';
    }
  };

  const calculateDaysLeft = (): number | null => {
    // If custom days provided (for testing/dummy data), use that
    if (typeof customDaysLeft === 'number') {
      return customDaysLeft;
    }

    // Calculate days left based on RTO registration date
    if (!rtoRegistrationDate) {
      return null;
    }

    try {
      const rtoDate = new Date(rtoRegistrationDate);
      const today = new Date();
      
      // Reset time to start of day for accurate calculation
      today.setHours(0, 0, 0, 0);
      rtoDate.setHours(0, 0, 0, 0);
      
      // Validate the date
      if (isNaN(rtoDate.getTime())) {
         ENV === 'dev'&&console.warn('Invalid RTO registration date provided:', rtoRegistrationDate);
        return null;
      }
      
      // Calculate days since RTO registration
      const daysSinceRegistration = Math.floor((today.getTime() - rtoDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // If RTO registration is today (daysSinceRegistration = 0), show 90 days left
      // Then decrease day by day: 90 - daysSinceRegistration
      const daysLeft = Math.max(0, 90 - daysSinceRegistration);
      
       ENV === 'dev'&&console.log(`RTO Date: ${rtoRegistrationDate}, Today: ${today.toISOString()}, Days Since: ${daysSinceRegistration}, Days Left: ${daysLeft}`);
      
      return daysLeft;
    } catch (error) {
       ENV === 'dev'&&console.error('Error calculating days left:', error);
      return null;
    }
  };

  const formatDisplayDate = (purchaseDate?: string): string => {
    // Use purchaseDate for display purposes
    if (!purchaseDate) {
      return 'N/A';
    }
    
    try {
      const date = new Date(purchaseDate);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      };
      
      const formattedDate = date.toLocaleDateString('en-GB', options);
      // Add comma after month: "10 May 2025" -> "10 May, 2025"
      return formattedDate.replace(/(\d+\s\w+)(\s\d+)/, '$1,$2');
    } catch (error) {
       ENV === 'dev'&&console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const getCountdownStyle = (daysLeft: number): CountdownStyle => {
    if (daysLeft <= 15) {
      return {
        backgroundColor: '#FFA500', // Orange for urgency
      };
    } else {
      return {
        backgroundColor: '#15CA5D', // Green for safe
      };
    }
  };

  // Map API PME_Drive field to our internal status (only PM EDrive statuses)
  const mapPmeDriveToOrderStatus = (pmeDriveValue: boolean): OrderStatus => {
    return pmeDriveValue ? 'PM EDrive Completed' : 'PM EDrive Pending';
  };

  const resolvedStatus: OrderStatus = orderStatus 
    ? orderStatus 
    : (pmeDrive !== undefined ? mapPmeDriveToOrderStatus(pmeDrive) : 'PM EDrive Pending');
  const resolvedOrderId: string = orderId ?? '001';
  const resolvedLeadName: string = leadName ?? 'Lead Name';
  const resolvedPhoneNumber: string = phoneNumber ?? '9876521390';
  const daysLeft: number | null = calculateDaysLeft();
  const displayDate: string = formatDisplayDate(purchaseDate);
  
  // Only show countdown for PM EDrive Pending status with valid RTO date
  const shouldShowCountdown: boolean = 
    resolvedStatus === 'PM EDrive Pending' && 
    daysLeft !== null && 
    daysLeft >= 0;

  const handleCall = () => {
    Linking.openURL(`tel:${resolvedPhoneNumber}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${resolvedPhoneNumber}`);
  };

  const handleViewDetails = (): void => {
    router.push('/bookings/comment');
  };

  return (
    <View className="w-88 flex flex-col gap-4 p-4 bg-river-blue-2 rounded-2xl overflow-hidden">
      {/* Lead Info Section */}
      <View className="flex flex-col gap-1 w-full">
        <View className="flex flex-row justify-between items-center pb-4 pt-2">
          <Text style={Typography.headline4} className="text-river-blue-6 flex-1 mr-2">
            {resolvedLeadName}
          </Text>
          <View className="flex flex-col items-end gap-2">
            {/* Countdown Badge - Only show for PM EDrive Pending */}
            {shouldShowCountdown && daysLeft !== null && (
              <View
                className="px-3 py-1 rounded-full"
                style={getCountdownStyle(daysLeft)}
              >
                <Text style={[Typography.subline2, styles.countdownText]}>
                  {daysLeft} days left
                </Text>
              </View>
            )}
            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity onPress={handleCall}>
                <Text className="text-river-blue-5" style={[Typography.copy2, {letterSpacing: 1.2}]}>
                  {resolvedPhoneNumber}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleWhatsApp}>
                <WhatsappIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Divider style={{ backgroundColor: '#61AFD2', height: 1 }} />

        <View className="flex flex-row justify-between items-center px-1">
          <View className="flex flex-col items-center gap-1 flex-1">
            <Text style={Typography.headline6B} className="text-river-blue-6">
              {resolvedOrderId}
            </Text>
            <Text style={Typography.copy2} className="text-river-blue-5">
              Order ID
            </Text>
          </View>

          <View className="w-[1px] h-[73px] bg-river-blue-4 mx-4" />

          <View className="flex flex-col items-center gap-1 flex-1">
            <Text style={Typography.headline6B} className="text-river-blue-6">
              {displayDate}
            </Text>
            <Text style={Typography.copy2} className="text-river-blue-5">
              Purchase Date
            </Text>
          </View>
        </View>
      </View>

      {/* Status Section - Only shows PM EDrive status */}
      <View className="flex flex-row justify-between items-center pl-12 pb-2">
        <Text style={Typography.subline2} className="text-river-blue-6">
          Order Status:
        </Text>
        <View
          className="flex flex-row items-center justify-center py-1.5 px-4 rounded-full w-48"
          style={{ backgroundColor: getStatusColor(resolvedStatus) }}
        >
          <Text style={[Typography.subline2, styles.statusText]}>
            {resolvedStatus}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  countdownText: {
    color: 'white',
    fontWeight: '600',
  },
  statusText: {
    color: 'white',
  },
  viewDetailsText: {
    fontWeight: '600',
  },
});

export default RetailsDetailsCard;