 
import { TextField } from '@/app/components/input';
import Typography from '@/constants/typography';
import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { Image, Text, TouchableOpacity, View, Linking, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import WhatsappIcon from '@/app/components/Whatsapp';
import { API_BASE, ENV } from '@/constants/env';
import { useLocalSearchParams } from 'expo-router';
import { getValidAccessToken } from '@/app/auth/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedButtonsFooter from '@/app/components/footerbtn';
import QRCode from 'react-native-qrcode-svg';
import { sendLog } from '@/app/logger';

 
 
export default function UpiPaymentScreen() {
  const [amount, setAmount] = useState('2500');
  const [qrCode, setQrCode] = useState('');
  const [linkId, setLinkId] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [loading, setLoading] = useState(false);
const { firstName, lastName, phone,email, pincode, vehicleColor, paymentMode , leadId,followupId,testrideId} = useLocalSearchParams();
const documentStorageKey = `testride_docs_${testrideId}`;
const pollingRef = useRef<number | null>(null);

 
 ENV === 'dev'&&console.log('Email44:',email);
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
 
 
  const handleGenerateQR = async () => {
  setLoading(true);
  try {
    const userProfile = await AsyncStorage.getItem("userProfile");
const {  DealerCode } = JSON.parse(userProfile || '{}');
        
    const response = await fetch(`${API_BASE}/api/payment/cashfree/generate-payment-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Number(amount.replace(/,/g, '')),
      
            customerName: `${firstName || ''} ${lastName || ''}`.trim() || 'Customer',
            customerEmail: email || undefined,
            customerPhone: phone || undefined,
          
      
         vendorId: DealerCode,
        expirySeconds: 60 * 60,
      }),
    });
     ENV === 'dev'&&console.log(DealerCode);
    const data = await response.json();
     ENV === 'dev'?console.log('Cashfree create response:', data): sendLog('info', `Cashfree create response: ${JSON.stringify(data)}`) ;
    if (!response.ok) {
       ENV === 'dev'&&console.error('create link failed', data);
      alert('Failed to create payment link');
      return;
    }
 
const qr = data.paymentLink 
  || data.payment_link 


const id = data.linkId 
  || data.raw?.link_id 
  || data.raw?.cf_link_id 
  || data.order_id 
  || '';

const link = data.payment_link 
;

 
    if (!id) {
      alert('Bad link id from backend. Check logs.');
       ENV === 'dev'&&console.warn('Cashfree create raw:', data);
      return;
    }
 
    setQrCode(qr);
    setLinkId(id);
    setPaymentLink(link);
 
    // start polling fallback
    startPolling(id);
  } catch (err) {
     ENV === 'dev'&&console.error('QR error:', err);
    alert('Network error');
  } finally {
    setLoading(false);
  }
};
 
 
  const startPolling = (orderId: string) => {
  if (!orderId) return;
  stopPolling();
  pollingRef.current = setInterval(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/payment/cashfree/status/${encodeURIComponent(orderId)}`);
      const data = await res.json();

      const status = (data.status || "").toString().toUpperCase();
      if (data.paid || status.includes("PAID") || status.includes("SUCCESS")) {
        stopPolling();
        const transactionId = data.cf_order_id || data.order_id;
        await handleConfirm(transactionId);

        if (testrideId) {
          const token = await getValidAccessToken();
          if (token) {
            const updateSuccess = await updateTestDriveStatus(token);
            if (!updateSuccess)  ENV === 'dev'&&console.warn('⚠️ Test ride status update failed');
          }
        }
        if (followupId) updateFollowUpStatus();
      }
    } catch (err) {
       ENV === 'dev'&&console.error("Polling error:", err);
    }
  }, 5000) as unknown as number;
};
 
const stopPolling = () => {
  if (pollingRef.current) {
    clearInterval(pollingRef.current);
    pollingRef.current = null;
  }
};
 
useEffect(() => {
  return () => stopPolling();
}, []);
 
 
const openPaymentLink = async () => {
  if (!paymentLink) {
    alert('No link generated yet');
    return;
  }
  try {
    await Linking.openURL(paymentLink);
  } catch (e) {
     ENV === 'dev'&&console.warn('openURL failed', e);
    alert('Could not open link: ' + paymentLink);
  }
};
 
 
//   useEffect(() => {
//   const interval = setInterval(async () => {
//     if (!linkId) return;
 
//     try {
//       const res = await fetch(`${API_BASE}/api/payment/status/${linkId}`);
//       const data = await res.json();
 
//       if (data.status === 'paid') {
//         clearInterval(interval);
 
//         // Razorpay payment ID fallback
//         const transactionId = data.razorpay_payment_id || linkId;
//         handleConfirm(transactionId);
 
//          if (testrideId) {
//       const token = await getValidAccessToken();
//       if (token) {
//         const updateSuccess = await updateTestDriveStatus(token);
//         if (!updateSuccess) {
//            ENV === 'dev'&&console.warn('⚠️ Test ride status update failed');
//         }
//       }
//     }
 
//         if(followupId){
//           updateFollowUpStatus();
//         }
//       }
//     } catch (err) {
//        ENV === 'dev'&&console.error('Polling error:', err);
//     }
//   }, 5000);
 
//   return () => clearInterval(interval);
// }, [linkId]);
 
 
const handleConfirm = async (transactionId: string) => {
  try {
    const userProfile = await AsyncStorage.getItem('userProfile');
    if (!userProfile) throw new Error('User profile not found');
    const { UserId } = JSON.parse(userProfile);
     ENV === 'dev'&&console.log('UserId from profile:', UserId);
     ENV === 'dev'&&console.log('LinkId:', linkId);
 
    const colorKey = Array.isArray(vehicleColor) ? vehicleColor[0] : vehicleColor ?? '';
const colorMap: Record<string, string> = {
  'Spring Yellow': 'Spring Yellow',
  'Monsoon Blue': 'Monsoon Blue',
  'Summer Red': 'Summer Red',
  'Storm Grey': 'Storm Grey',
  'Winter White': 'Winter White',
};
 
 
 
    const payload = {
      userId: UserId,
      opportunityId: leadId, // 🔁 Replace with dynamic value if needed
      paymentStatus: 'SUCCESS',
      transactionId: transactionId,
      paymentMode: 'UPI',
      paymentGateway: 'cashfree',
orderAmount: Number(amount),
  VehicleColor: colorMap[colorKey],
      timestamp: new Date().toISOString(),
      gatewayResponseMessage: 'Payment processed successfully',
      customerDetails: {
        name: `${firstName} ${lastName}`,
        email: email, // 🔁 Optional: add email input if required
        phone: phone,
      },
    };
 
    const token = await getValidAccessToken(); // assumes you already implemented this
     ENV === 'dev'?console.log('🚀 Creating order with payload:', payload) : sendLog('info', `🚀 Creating order with payload: ${JSON.stringify(payload)}`);
    const res = await fetch(
      `${API_BASE}/api/data/CreateOrder`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
 
    const data = await res.json();
    if (!res.ok) throw new Error(data?.StatusMessage || 'Order creation failed');
 
   
 
    // Navigate to confirmation screen
    router.push({
      pathname: '/components/SplashProps',
      params: {
        title: 'Booking Created Successfully',
        subtitle: 'Thank you for booking your ride with River Indie.',
        showSubtitle: 'true',
        navigateTo: '/home',
        delay: '2500',
      },
    });
  } catch (err: any) {
     ENV === 'dev'&&console.error('❌ Salesforce Order Error:', err.message || err);
    alert('Order creation failed');
  }
};
 
  const handleWhatsAppShare = () => {
     ENV === 'dev'&&console.log('Sharing link via WhatsApp:', paymentLink);
    if (!paymentLink) return;
    const message = `Please complete your UPI payment using this link:\n${paymentLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };
 
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView className="flex-1 bg-river-blue-1 px-4 pt-6">
       
       
     
      <Text className="mb-4 text-river-blue-5" style={Typography.headline4}>
        UPI Payment
      </Text>
     
      <Text className="mb-2 text-river-blue-6" style={Typography.copy1}>
        Enter amount (INR)
      </Text>
     
      <TextField
        value={amount}
        onChangeText={(text) => {
          const digitsOnly = text.replace(/[^0-9]/g, '');
          setAmount(digitsOnly);
        }}
      />
     
      <TouchableOpacity
        onPress={handleGenerateQR}
        className="mt-6 bg-river-blue-6 p-4 rounded-full shadow-sm"
        disabled={loading}
      >
        <Text className="text-white text-center font-medium" style={Typography.copy1}>
          {loading ? 'Generating...' : 'Generate QR'}
        </Text>
      </TouchableOpacity>
     
      {qrCode ? (
        <View className="mt-6 items-center">
          <View className="bg-white p-6 rounded-2xl shadow-lg mb-4">
              <QRCode
        value={paymentLink}
        size={200}
      />
          </View>
         
          <Text className="mt-2 text-river-blue-4 text-center mb-4" style={Typography.copy1}>
            Scan this QR code for UPI payment link
          </Text>
         
          <TouchableOpacity
            className="bg-river-blue-6 px-6 py-3 rounded-full flex-row items-center shadow-sm"
            onPress={handleWhatsAppShare}
          >
            <WhatsappIcon />
            <Text className="text-white text-center font-medium ml-2">Share via WhatsApp</Text>
          </TouchableOpacity>
        </View>
      ) : null}
       
 
         
      <AnimatedButtonsFooter
  handleCreateEnquiry={() => handleConfirm(linkId)} // ✅ wrapped with default
        handleCancel={() => router.back()}
        Typography={Typography}
      disableCreateEnquiry={!qrCode || loading}
        createEnquiryText="Confirm"
        cancelText="Cancel"
      />
 
         
       
 
     
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}