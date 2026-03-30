import AnimatedButtonsFooter from '@/app/components/footerbtn';
import { TextField } from '@/app/components/input';
import Typography from '@/constants/typography';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View,Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValidAccessToken } from '@/app/auth/auth.service';
import { API_BASE, ENV } from '@/constants/env';
import { sendLog } from '@/app/logger';
 
 
export default function CashPaymentScreen() {
    const [amount, setAmount] = useState('2500');
  const [loading, setLoading] = useState(false);
 
  const params = useLocalSearchParams();
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone ?? '';
  const email = Array.isArray(params.email) ? params.email[0] : params.email ?? '';
  const firstName = Array.isArray(params.firstName) ? params.firstName[0] : params.firstName ?? '';
  const lastName = Array.isArray(params.lastName) ? params.lastName[0] : params.lastName ?? '';
  const pincode = Array.isArray(params.pincode) ? params.pincode[0] : params.pincode ?? '';
  const paymentMode = Array.isArray(params.paymentMode) ? params.paymentMode[0] : params.paymentMode ?? '';
  const vehicleColor = Array.isArray(params.vehicleColor) ? params.vehicleColor[0] : params.vehicleColor ?? '';
  const leadId = Array.isArray(params.leadId) ? params.leadId[0] : params.leadId ?? '';
const followupId = Array.isArray(params.followupId) ? params.followupId[0] : params.followupId ?? '';
 const testrideId = params.testrideId ?? '';
  const colorMap: Record<string, string> = {
    'Spring Yellow': 'Spring Yellow',
  'Monsoon Blue': 'Monsoon Blue',
  'Summer Red': 'Summer Red',
  'Storm Grey': 'Storm Grey',
  'Winter White': 'Winter White',
  };
 
  const documentStorageKey = `testride_docs_${testrideId}`;
 
  const clearSavedDocuments = async () => {
    try {
      await AsyncStorage.removeItem(documentStorageKey);
       ENV === 'dev'&&console.log('🗑️ Cleared saved documents for testride:', testrideId);
    } catch (error) {
       ENV === 'dev'&&console.error('Error clearing saved documents:', error);
    }
  };
 
  const updateTestDriveStatus = async (token: string): Promise<boolean> => {
    try {
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (!userProfile) throw new Error('User profile not found');
      const { UserId } = JSON.parse(userProfile);
      if (!testrideId || !UserId) {
         ENV === 'dev'&&console.error('Missing testrideId or userId for status update');
        return false;
      }
 
      // Convert display date/time to API format
      const formatDateForAPI = (): string => {
        return new Date().toISOString().split('T')[0];
      };
 
      // Helper function to format time for API (24 hour format HH:MM)
      const formatTimeForAPI = (): string => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      };
   
 
      const payload = {
        UserId: UserId,
        TestDriveId: testrideId,
        TestDriveStatus: 'Completed',
        TestDriveDate: formatDateForAPI(),
        TestDriveTime: formatTimeForAPI(),
        StartTestDrive: false,
        CompleteTestDrive: true
      };
 
       ENV === 'dev'&&console.log('🔄 Updating test ride status:', payload);
 
      const response = await fetch(`${API_BASE}/api/data/UpdateTestDrive`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
 
      if (!response.ok) throw new Error(`API error ${response.status}`);
     
      const result = await response.json();
      if (result.StatusCode === 200) {
        // Clear saved documents after successful completion
        await clearSavedDocuments();
        return true;
      } else {
        throw new Error(result.StatusMessage || 'Failed to complete test ride');
      }
    } catch (error) {
       ENV === 'dev'&&console.error('❌ Failed to update test ride status:', error);
      return false;
    }
  };
 
  // API call to update follow-up status
  const updateFollowUpStatus = async () => {
    try {
       ENV === 'dev'&&console.log('Updating follow-up status for ID:', followupId);
       const userProfile = await AsyncStorage.getItem('userProfile');
      if (!userProfile) throw new Error('User profile not found');
      const { UserId } = JSON.parse(userProfile);
       ENV === 'dev'&&console.log('User ID:', UserId);
      const requestBody = {
        UserId: UserId,
        FollowUpId: followupId,
        FollowUpStatusCompleted: true
      };
 
       ENV === 'dev'&&console.log('Updating follow-up with:', requestBody);
      const token = await getValidAccessToken();
 
      const response = await fetch(`${API_BASE}/api/data/UpdateFollowUp`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
 
      const responseData = await response.json();
     
      if (response.ok && responseData.StatusCode === 200) {
         ENV === 'dev'&&console.log('Follow-up updated successfully:', responseData);
        return { success: true, data: responseData };
      } else {
         ENV === 'dev'&&console.error('Follow-up API Error:', responseData);
        return { success: false, error: responseData.StatusMessage || 'Failed to update follow-up' };
      }
    } catch (error) {
       ENV === 'dev'&&console.error('Follow-up Network Error:', error);
      return { success: false, error: 'Network error occurred while updating follow-up' };
    }
  };
 
 
 
  const handleConfirm = async () => {
    if (!amount) {
      Alert.alert('Amount Required', 'Please enter the booking amount.');
      return;
    }
 
    try {
      setLoading(true);
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (!userProfile) throw new Error('User profile not found');
      const { UserId } = JSON.parse(userProfile);
 
      const transactionId = `txn_${Date.now()}`;
 
      const payload = {
        userId: UserId,
        opportunityId: leadId,
        paymentStatus: 'SUCCESS',
        transactionId,
        paymentMode: 'Cash',
        paymentGateway: 'Manual',
        orderAmount: Number(amount),
        VehicleColor: colorMap[vehicleColor],
        timestamp: new Date().toISOString(),
        gatewayResponseMessage: 'Payment processed successfully',
        customerDetails: {
          name: `${firstName} ${lastName}`,
          email: email,
          phone,
        },
      };
     ENV === 'dev'&&console.log('Email:',email);
      const token = await getValidAccessToken();
       ENV   === 'dev'?console.log('🚀 Creating Cash Order with:', payload): sendLog('info', `🚀 Creating Cash Order with: ${JSON.stringify(payload)}`);
 
      const res = await fetch(`${API_BASE}/api/data/CreateOrder`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
 
      const data = await res.json();
      if (!res.ok) throw new Error(data?.StatusMessage || 'Order creation failed');
        if (testrideId) {
            const token = await getValidAccessToken();
            if (token) {
              const updateSuccess = await updateTestDriveStatus(token);
              if (!updateSuccess) {
                 ENV === 'dev'&&console.warn('⚠️ Test ride status update failed');
              }
            }
          }
if(followupId)
 
  {updateFollowUpStatus();}// Navigate to confirmation screen
      router.push({
        pathname: '/components/SplashProps',
        params: {
          title: 'Booking Created Successfully',
          subtitle: 'Thank you for booking your ride with River Indie.',
          showSubtitle: 'true',
          navigateTo: '/bookings',
          delay: '2500',
        },
      });
    } catch (err: any) {
       ENV === 'dev'&&console.error('❌ Order Creation Error:', err.message || err);
      Alert.alert('Error', 'Order creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-river-blue-1" edges={['top']}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 relative">
   
        {/* Header */}
        <View className="px-4 pt-6 mb-8">
        <Text className=" text-river-blue-6" style={Typography.headline4}>Payment</Text>
        </View>
 
        {/* Content */}
        <View className="px-4 flex-1">
          {/* Amount Input */}
          <View className="mb-6">
          <Text className=" text-river-blue-6 mb-3" style={Typography.copy1}>
              Enter amount (INR)<Text className="text-red-500">*</Text>
            </Text>
            <TextField
              value={amount}
              onChangeText={(text) => {
                const digitsOnly = text.replace(/[^0-9]/g, '');
                setAmount(digitsOnly);
              }}
              placeholder="2500"
            />
          </View>
        </View>
 
        {/* Fixed Bottom Buttons */}
        <AnimatedButtonsFooter
        handleCreateEnquiry={handleConfirm}
        handleCancel={() => router.back()}
        Typography={Typography}
        cancelText="Cancel"
          disableCreateEnquiry={loading} // Disable while loading
  createEnquiryText={loading ? "Confirming..." : "Confirm"}
      />
   
      </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}