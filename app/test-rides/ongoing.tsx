import Typography from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValidAccessToken } from '../auth/auth.service';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { useCallback } from 'react';
import ConfirmationPopup from '@/app/components/confirmationmodal';
import TestRideDetailsCard from '@/app/components/TestRide/TestRideOngoing';
import HeaderComponent from '@/app/components/AppHeader';
import OngoingTestRideCard from '@/app/components/TestRide/TestRideOngoing';
import TestRideCard from '@/app/components/TestRide/TestRideOngoing';
import AnimatedSingleButton from '@/app/components/footersinglebtn';
import { API_BASE, ENV } from '@/constants/env';
import { StackActions } from '@react-navigation/native';

const TestRideOngoing = () => {
  // Get passed parameters
  const params = useLocalSearchParams();
  const leadname = params.leadname as string || 'Lead Name';
  const leadId = params.leadId as string;
  const testrideId = params.testrideId as string;
  const phoneNumber = params.phoneNumber as string || '9876543210';
  const testRideType = params.testRideType as string || 'Home Test Ride';
  const scheduledDate = params.scheduledDate as string || '10 May';
  const scheduledTime = params.scheduledTime as string || '10:30 AM';
  const address = params.address as string || 'Store Location';
  const userId = params.userId as string;

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Storage key for this specific test ride documents
  const documentStorageKey = `testride_docs_${testrideId}`;
  const navigation  = useNavigation();

  // Helper function to format date for API (YYYY-MM-DD)
  function formatDateForAPI(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Helper function to format time for API (24 hour format HH:MM)
  function formatTimeForAPI(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  // Function to clear saved documents after completion
  const clearSavedDocuments = async () => {
    try {
      await AsyncStorage.removeItem(documentStorageKey);
       ENV === 'dev'&&console.log('🗑️ Cleared saved documents for testride:', testrideId);
    } catch (error) {
       ENV === 'dev'&&console.error('Error clearing saved documents:', error);
    }
  };

  // API call to update test drive status to completed
  const updateTestDriveToCompleted = async () => {
    if (!userId || !testrideId) {
      Alert.alert('Error', 'Missing required data to complete test ride');
      return false;
    }

    try {
      setIsUpdatingStatus(true);
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        throw new Error('Could not get valid access token');
      }

      const apiPayload = {
        UserId: userId,
        TestDriveId: testrideId,
        TestDriveStatus: 'Completed',
        TestDriveDate: formatDateForAPI(),
        TestDriveTime: formatTimeForAPI(),
        StartTestDrive: false,
        CompleteTestDrive: true
      };

       ENV === 'dev'&&console.log('🚀 Completing test drive with payload:', apiPayload);

      const response = await fetch(`${API_BASE}/api/data/UpdateTestDrive`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const result = await response.json();
       ENV === 'dev'&&console.log('✅ Test drive completed:', result);

      if (result.StatusCode === 200) {
        // Clear saved documents after successful completion
        await clearSavedDocuments();
        return true;
      } else {
        throw new Error(result.StatusMessage || 'Failed to complete test ride');
      }
    } catch (error) {
       ENV === 'dev'&&console.error('❌ Error completing test drive:', error);
      Alert.alert('Error', 'Failed to complete test ride. Please try again.');
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileString = await AsyncStorage.getItem('userProfile');
        if (profileString) {
          setUserProfile(JSON.parse(profileString));
        }
      } catch (error) {
         ENV === 'dev'&&console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true; // Prevent default behavior
      };
 
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
     
      return () => subscription.remove();
    }, [])
  );

  const handleMarkAsComplete = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmComplete = async () => {
    setShowConfirmationModal(false);
    
    // Call API to mark test ride as completed
    // const success = await updateTestDriveToCompleted();
    
    // if (success) {
       ENV === 'dev'&&console.log('✅ Test ride completed successfully and documents cleared!');
      
      // Navigate to splash with ALL test ride data
      router.push({
        pathname: '/components/SplashProps',
        params: {
          // Splash configuration
          title: "Test Ride Completed",
          subtitle: "Thank you for booking your ride with River Indie.",
          showSubtitle: 'false',
          navigateTo: '/test-rides/complete',
          delay: '2500',
          
          // Pass ALL test ride data to splash
          leadname: leadname,
          leadId: leadId,
          testrideId: testrideId,
          phoneNumber: phoneNumber,
          testRideType: testRideType,
          scheduledDate: scheduledDate,
          scheduledTime: scheduledTime,
          address: address,
          userId: userId,
          from: 'TestRideCompleted',
          originalSource: 'TestRideOngoing'
        }
      });
    // } else {
    //   // If API call failed, don't clear documents and don't navigate
    //    ENV === 'dev'&&console.log('❌ Test ride completion failed, keeping documents saved');
    // }
  };

  const handleCancelComplete = () => {
    setShowConfirmationModal(false);
  };

    const handleBackPress = () => {
    navigation.dispatch(StackActions.replace('test-rides', { animation: 'slide_from_left' }));
  };
  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFD]">
      {/* Header */}
      <HeaderComponent
        title={`Test Ride: ${leadname}`}
        onBackPress={handleBackPress}
        showDropdown={false}
      />

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 w-full flex justify-center items-center">
          <TestRideCard
            leadname={leadname}
            phoneNumber={phoneNumber}
            testRideType={testRideType}
            scheduledDate={scheduledDate}
            scheduledTime={scheduledTime}
            address={address}
            status="ongoing"
            // Pass any other props your TestRideCard component needs
          />
          
          {/* Debug info (remove in production) */}
          {/* <View className="mt-4 p-3 bg-gray-100 rounded-lg">
            <Text className="text-xs text-gray-600">
              TestRide ID: {testrideId}
            </Text>
            <Text className="text-xs text-gray-600">
              Documents will be cleared when completed
            </Text>
          </View> */}
        </View>
      </ScrollView>

      {/* Fixed Button at Bottom */}
      <AnimatedSingleButton
        onPress={handleMarkAsComplete}
        buttonText={isUpdatingStatus ? "Completing..." : "Mark Ride As Complete"}
        width={242}
        height={48}
        disabled={isUpdatingStatus}
      />

      {/* Confirmation Modal */}
      <ConfirmationPopup
        visible={showConfirmationModal}
        onClose={handleCancelComplete}
        onConfirm={handleConfirmComplete}
        title="Do you wish to continue?"
        message="You are about to mark this testride as"
        highlightedText="Completed"
        confirmButtonText="Yes"
        cancelButtonText="No"
        showBlur={true}
      />
    </SafeAreaView>
  );
};

export default TestRideOngoing;

const styles = StyleSheet.create({});