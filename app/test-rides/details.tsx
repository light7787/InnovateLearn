import Typography from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect,useCallback } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert,BackHandler, TouchableWithoutFeedback } from 'react-native';
import TestRideDetailsCard from '@/app/components/TestRide/TestrideDetails';
import ConfirmationPopup from '@/app/components/confirmationmodal';
import HeaderComponent from '@/app/components/AppHeader';
import AnimatedSingleButton from '@/app/components/footersinglebtn';
import { CommonActions, StackActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValidAccessToken } from '../auth/auth.service';
import { API_BASE, ENV } from '@/constants/env';
import { useFocusEffect } from '@react-navigation/native';

const TestRideDetails = () => {
  // Get the passed parameters
  const params = useLocalSearchParams();

  // Check if we need to fetch data from API
  const shouldFetchFromAPI = params.fetchFromAPI === 'true';
  const leadIdFromEnquiry = params.leadId as string;
  
  // Define the test ride data type
  interface TestRideData {
    LeadName?: string;
    LeadId?: string;
    TestDriveId?: string;
    TestStatus?: string;
    LeadPhone?: string;
    RideType?: string;
    ScheduleDateTime?: string;
    Address?: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
    };
  }

  interface UserProfileData {
    UserId: string;
    StoreName: string;
    StorePhone: string;
    UserDesignation: string | null;
    UserEmail: string;
    UserName: string;
    UserPhone: string;
  }

  // State for API fetched data
  const [testRideData, setTestRideData] = useState<TestRideData | null>(null);
  const [loading, setLoading] = useState(shouldFetchFromAPI);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // State for dropdown management
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to add 2 hours to time for home test rides
  const formatTimeWithRange = (time: string, testRideType: string) => {
    // First handle undefined/null cases
    if (!time || time === 'N/A' || testRideType.toLowerCase().includes('store')) {
      return time || 'N/A';
    }
  
    // Then add the same robust checking as in TestRide
    try {
      // Extract time and AM/PM - handle both formats
      const timeMatch = time.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
      if (!timeMatch) {
        return time; // Return original if format doesn't match
      }
  
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const period = timeMatch[3].toUpperCase();
      
      let endHour = hour + 2;
      let endPeriod = period;
      
      // Handle time overflow
      if (period === 'AM') {
        if (endHour > 12) {
          endHour = endHour - 12;
          endPeriod = 'PM';
        } else if (endHour === 12) {
          endPeriod = 'PM';
        }
      } else { // PM
        if (endHour > 12) {
          endHour = endHour - 12;
          endPeriod = 'AM';
        } else if (endHour === 12) {
          endPeriod = 'AM';
        }
      }
      
      // Format start time (remove :00 if minutes are 00)
      const startTime = minute === 0 ? `${hour}${period}` : `${hour}:${minute.toString().padStart(2, '0')}${period}`;
      const endTime = `${endHour}${endPeriod}`;
      
      return `${startTime}-${endTime}`;
    } catch (error) {
       ENV === 'dev'&&console.error('Error formatting time:', error);
      return time; // Return original time if formatting fails
    }
  };


  
  // Extract data from params (for normal navigation) or use fetched data
  const leadname = testRideData?.LeadName || (params.leadname as string);
  const leadId = params.leadId as string;
  const testrideId = testRideData?.TestDriveId || (params.testrideId as string);
  const testrideStatus = testRideData?.TestStatus || (params.testRideStatus as string);
  const no = testRideData?.LeadPhone || (params.phoneNumber as string);

  const determineTestRideType = () => {
    // 1. Check if explicitly passed in params
    if (params.testRideType) {
      return params.testRideType as string;
    }
    
    // 2. Check API data
    if (testRideData?.RideType) {
      return testRideData.RideType === 'STR' ? 'Store Test Ride' : 'Home Test Ride';
    }
    
    // 3. Default to Home Test Ride if no data
    return 'Home Test Ride';
  };
  
  const testRideType = determineTestRideType();
  const scheduledDate = testRideData?.ScheduleDateTime ? 
    formatDateFromAPI(testRideData.ScheduleDateTime) : (params.scheduledDate as string);
    const scheduledTime = testRideData?.ScheduleDateTime ? 
    formatTimeFromAPI(testRideData.ScheduleDateTime, testRideType) : 
    (params.scheduledTime ? formatTimeWithRange(params.scheduledTime as string, testRideType) : 'N/A');
  const address = testRideData?.Address ? 
    formatAddressFromAPI(testRideData.Address) : (params.address as string);
  
  // Extract postal code from params or API data
  const postalCode = testRideData?.Address?.postalCode || (params.postalCode as string) || '';
  
  const comeFrom = params.from as string;
  
  // Helper functions to format API data
  function formatDateFromAPI(dateTime: string | undefined): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function formatTimeFromAPI(dateTime: string | undefined, testRideType: string): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    
    // Add time range for home test rides
    return formatTimeWithRange(time, testRideType);
  }

  function formatAddressFromAPI(addressObj: TestRideData['Address']): string {
    if (!addressObj) return 'Store Location';
    const parts = [
      addressObj.street,
      addressObj.city,
      addressObj.state,
      addressObj.postalCode
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Store Location';
  }

  // Helper function to format date for API (YYYY-MM-DD)
  function formatDateForAPI(dateTime?: string): string {
    if (!dateTime) {
      return new Date().toISOString().split('T')[0];
    }
    const date = new Date(dateTime);
    return date.toISOString().split('T')[0];
  }

  // Helper function to format time for API (24 hour format HH:MM)
  function formatTimeForAPI(dateTime?: string): string {
    if (!dateTime) {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
    const date = new Date(dateTime);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  // API call to update test drive status
  const updateTestDriveStatus = async (
    status: string, 
    startTestDrive: boolean = false, 
    completeTestDrive: boolean = false
  ) => {
    if (!userProfile?.UserId || !testrideId) {
      Alert.alert('Error', 'Missing required data to update test ride status');
      return false;
    }

    try {
      setIsUpdatingStatus(true);
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        throw new Error('Could not get valid access token');
      }

      const apiPayload = {
        UserId: userProfile.UserId,
        TestDriveId: testrideId,
        TestDriveStatus: status,
        TestDriveDate: formatDateForAPI(testRideData?.ScheduleDateTime),
        TestDriveTime: formatTimeForAPI(testRideData?.ScheduleDateTime),
        StartTestDrive: startTestDrive,
        CompleteTestDrive: status == 'Canceled'? true : completeTestDrive
      };

       ENV === 'dev'&&console.log('🚀 Updating test drive with payload:', apiPayload);

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
       ENV === 'dev'&&console.log('✅ Test drive status updated:', result);

      if (result.StatusCode === 200) {
        return true;
      } else {
        throw new Error(result.StatusMessage || 'Failed to update status');
      }
    } catch (error) {
       ENV === 'dev'&&console.error('❌ Error updating test drive status:', error);
      Alert.alert('Error', 'Failed to update test ride status. Please try again.');
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Fetch user profile and test ride data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user profile
        const profileString = await AsyncStorage.getItem('userProfile');
        if (profileString) {
          const profile = JSON.parse(profileString);
          setUserProfile(profile);
          
          // If we need to fetch from API, call EventTestDrive
          if (shouldFetchFromAPI && leadIdFromEnquiry && profile.UserId) {
            await fetchTestRideData(profile.UserId, leadIdFromEnquiry);
          }
        }
      } catch (error) {
         ENV === 'dev'&&console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [shouldFetchFromAPI, leadIdFromEnquiry]);

  // Function to fetch test ride data from EventTestDrive API
  const fetchTestRideData = async (userId: string, targetLeadId: string) => {
    try {
      setLoading(true);
      const accessToken = await getValidAccessToken();
      if (!accessToken) throw new Error('Could not get valid access token');

      const response = await fetch(`${API_BASE}/api/data/EventTestDrive`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId: userId,
          FilterDate: 'TODAY'
        }),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const result = await response.json();
       ENV === 'dev'&&console.log('🔥 EventTestDrive API response:', result);

      // Find the test ride with matching LeadId
      if (result.Data && Array.isArray(result.Data)) {
        const matchingTestRide = result.Data.find((item: TestRideData) => 
          item.LeadId === targetLeadId && item.TestDriveId
        );

        if (matchingTestRide) {
           ENV === 'dev'&&console.log('✅ Found matching test ride:', matchingTestRide);
          setTestRideData(matchingTestRide);
        } else {
           ENV === 'dev'&&console.warn('⚠️ No matching test ride found for LeadId:', targetLeadId);
          await tryDifferentDateFilters(userId, targetLeadId, accessToken);
        }
      }
    } catch (error) {
       ENV === 'dev'&&console.error('❌ Error fetching test ride data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Try different date filters if TODAY doesn't return results
  const tryDifferentDateFilters = async (userId: string, targetLeadId: string, accessToken: string) => {
    const dateFilters = ['THIS_WEEK', 'THIS_MONTH'];
    
    for (const filter of dateFilters) {
      try {
         ENV === 'dev'&&console.log(`🔍 Trying filter: ${filter}`);
        const response = await fetch(`${API_BASE}/api/data/EventTestDrive`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            UserId: userId,
            FilterDate: filter
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const matchingTestRide = result.Data?.find((item: TestRideData) => 
            item.LeadId === targetLeadId && item.TestDriveId
          );

          if (matchingTestRide) {
             ENV === 'dev'&&console.log(`✅ Found matching test ride with ${filter}:`, matchingTestRide);
            setTestRideData(matchingTestRide);
            break;
          }
        }
      } catch (error) {
         ENV === 'dev'&&console.error(`Error with ${filter} filter:`, error);
      }
    }
  };

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  // Filter out 'started' status if it exists in params
  const initialStatus = testrideStatus || 'Scheduled';
  const [testRideStatus, setTestRideStatus] = useState(
    initialStatus.toLowerCase() === 'started' ? 'Scheduled' : initialStatus
  );
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    highlightedText: '',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  });

  // Function to get modal content for confirmed status only
  const getModalContent = (status: string) => {
    return {
      title: 'Do you wish to continue?',
      message: 'You are about to mark this test ride as',
      highlightedText: 'Confirmed.',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    };
  };
  const markTestRideForRefresh = async () => {
    try {
      await AsyncStorage.setItem('testRideNeedsRefresh', 'true');
      await AsyncStorage.setItem('testRideRefreshTimestamp', Date.now().toString());
    } catch (error) {
       ENV === 'dev'&&console.error('Failed to mark test ride for refresh:', error);
    }
  };

  // Handle status change from dropdown - only show modal for 'confirmed'
  const handleStatusChange = async (newStatus: string) => {
    // Prevent setting status to 'started' from dropdown
    if (newStatus.toLowerCase() === 'started') {
      return;
    }
    
    if (newStatus !== testRideStatus) {
      // Only show modal for 'confirmed' status
      if (newStatus.toLowerCase() === 'confirmed') {
        setPendingStatus(newStatus);
        const content = getModalContent(newStatus);
        setModalContent(content);
        setShowConfirmationModal(true);
      } else {
        // Directly update status for all other cases
        setTestRideStatus(newStatus);
        await handleDirectStatusChange(newStatus);
      }
    }
  };

  // Handle direct status changes without modal
  const handleDirectStatusChange = async (status: string) => {
    let apiStatus = '';
    
    switch (status.toLowerCase()) {
      case 'rescheduled':
        apiStatus = 'Rescheduled';
         ENV === 'dev'&&console.log('Test ride rescheduled!');
        router.push({
          pathname: '/test-rides/reschedule',
          params: {
            isReschedule: 'true',
            testrideId: testrideId,
            userId: userProfile?.UserId,
            leadId: leadId,
            leadname: leadname,
            testRideType: testRideType,
            currentDate: scheduledDate,
            currentTime: scheduledTime,
            currentAddress: address,
            postalCode: postalCode || testRideData?.Address?.postalCode || (params.postalCode as string) || '', // Add postal code to reschedule params
          }
        });
        break;
        case 'cancelled':
          apiStatus = 'Canceled';
           ENV === 'dev'&&console.log('Test ride cancelled!');
          
          // FIXED: Ensure all required parameters are passed correctly
          if (!userProfile?.UserId || !leadId || !testrideId) {
             ENV === 'dev'&&console.error('Missing required data:', {
              userId: userProfile?.UserId,
              leadId: leadId,
              testrideId: testrideId
            });
            Alert.alert('Error', 'Missing required information to proceed with dropout.');
            return;
          }
          
          router.push({
            pathname: '/dropout',
            params: { 
              from: 'test-rides',
              leadId: leadId,
              testrideId: testrideId,
              userId: userProfile?.UserId,
              originalSource: 'TestRide',
              // Add flag to indicate this is a cancellation flow
              isCancellation: 'true'
            }
          });
          break;
      case 'completed':
        apiStatus = 'Completed';
        await updateTestDriveStatus(apiStatus, false, true);
         ENV === 'dev'&&console.log('Test ride completed!');
        break;
      default:
         ENV === 'dev'&&console.log('Status updated to:', status);
    }
  };

  // Handle different actions that change status
  const handleStartTestRide = async () => {
    // Update status to "On-going" with StartTestDrive = true
    // const success = await updateTestDriveStatus('On-going', true, false);
    
    if (true) {
       ENV === 'dev'&&console.log('Test ride started!');
      // Navigate to documents page with all necessary data including postal code
      router.push({
        pathname: '/test-rides/documents',
        params: {
          leadname,
          leadId,
          testrideId,
          phoneNumber: no,
          testRideType,
          scheduledDate,
          scheduledTime,
          address,
          postalCode, // Add postal code to documents params
          userId: userProfile?.UserId
        }
      });
    }
  };

  const handleConfirmTestRide = () => {
    handleStatusChange('confirmed');
  };

  const handleRescheduleTestRide = () => {
    handleStatusChange('rescheduled');
  };

  const handleCancelTestRide = () => {
    handleStatusChange('cancelled');
  };

  const handleCompleteTestRide = () => {
    handleStatusChange('completed');
  };

  // Handle modal confirmation (only for 'confirmed' status)
  const handleConfirmAction = async () => {
    setShowConfirmationModal(false);
    
    if (pendingStatus && pendingStatus.toLowerCase() === 'confirmed') {
      setTestRideStatus(pendingStatus);
      const success = await updateTestDriveStatus('Test Ride Confirmed');
      
      if (success) {
         ENV === 'dev'&&console.log('Test ride confirmed!');
        // Mark for refresh before navigating back
        await markTestRideForRefresh();
      }
    }
    
    setPendingStatus(null);
  };

  // Handle modal cancellation
  const handleCancelAction = () => {
    setShowConfirmationModal(false);
    setPendingStatus(null); // Reset pending status
  };

  // Handle outside press to close dropdown
  const handleOutsidePress = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

   ENV === 'dev'&&console.log(postalCode)
  const navigation = useNavigation();

  const handleBackPress = () => {
    switch (comeFrom) {
      case 'Enquiry':
        router.replace('/test-rides');
        break;
      default:
        router.back();
    }
  };
    useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true; // Prevent default behavior
      };
 
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
 
      return () => subscription.remove();
    }, [comeFrom])
  );

  // Show loading state while fetching data
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7FBFD]">
        <HeaderComponent
          title="Test Ride Details"
          onBackPress={handleBackPress}
          showDropdown={false}
        />
        <View className="flex-1 justify-center items-center">
          <Text style={Typography.copy1}>Loading test ride details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if no data found after API call
  if (shouldFetchFromAPI && !testRideData && !loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7FBFD]">
        <HeaderComponent
          title="Test Ride Details"
          onBackPress={handleBackPress}
          showDropdown={false}
        />
        <View className="flex-1 justify-center items-center px-6">
          <Text style={Typography.headline6B} className="text-center mb-4">
            Test Ride Not Found
          </Text>
          <Text style={Typography.copy1} className="text-center text-gray-600">
            Unable to find test ride details. Please try again or contact support.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <SafeAreaView className="flex-1 bg-[#F7FBFD]">
        {/* Header */}
        <HeaderComponent
          title={`Test Ride: ${leadname || 'Loading...'}`}
          onBackPress={handleBackPress}
          showDropdown={false}
        />

        {/* Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 w-full flex justify-center items-center">
            <TestRideDetailsCard 
              currentStatus={testRideStatus}
              onStatusChange={handleStatusChange}
              
              // Pass all the data (either from params or API) including postal code
              leadname={leadname}
              phoneNumber={no}
              testRideType={testRideType}
              scheduledDate={scheduledDate}
              scheduledTime={scheduledTime}
              address={address}
              postalCode={postalCode} // Pass postal code to the details card
              // Add prop to exclude 'started' from visible options
              excludeStatuses={['started']}
              // Pass dropdown state management
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
            />
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <AnimatedSingleButton
          onPress={handleStartTestRide}
          buttonText={isUpdatingStatus ? "Updating..." : "Start Test Ride"}
          width={184}
          height={48}
          disabled={isUpdatingStatus}
        />

        {/* Confirmation Modal - Only for 'confirmed' status */}
        <ConfirmationPopup
          visible={showConfirmationModal}
          onClose={handleCancelAction}
          onConfirm={handleConfirmAction}
          title={modalContent.title}
          message={modalContent.message}
          highlightedText={modalContent.highlightedText}
          confirmButtonText={modalContent.confirmButtonText}
          cancelButtonText={modalContent.cancelButtonText}
          showBlur={true}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default TestRideDetails;