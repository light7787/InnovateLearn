// FIXED: Complete FollowUpScreen.tsx with create button disabled when required fields are missing
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useMemo } from 'react';
import { Animated, Easing, ScrollView, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarModal from '@/app/components/HomeScreen/calenderModal';
import TimeModal from '@/app/components/HomeScreen/timemodal';
import { DateField } from '@/app/components/inputCalender';
import { Dropdown } from '@/app/components/inputdropdown';
import { TimeField } from '@/app/components/inputTime';
import Typography from '@/constants/typography';
import AnimatedButtonsFooter from '@/app/components/footerbtnsecond';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValidAccessToken } from '../auth/auth.service';
import { API_BASE, ENV } from '@/constants/env'; 

type UserProfile = {
  StoreName: string;
  StorePhone: string;
  UserDesignation: string | null;
  UserEmail: string;
  UserId: string;
  UserName: string;
  UserPhone: string;
};
 
export default function FollowUpScreen() {
  // Get params from navigation
  const params = useLocalSearchParams();
  const leadId = params.leadId as string;
  const customerName = params.customerName as string;
  const customerPhone = params.customerPhone as string;
  const originalSource = params.originalSource as string;
  const followUpTypeParam = params.followUpTypeParam as string;
  const existingFollowUpId = params.existingFollowUpId as string; // For updating old follow-up
  const testrideId = params.testrideId as string;
  const existingFollowupfeedback = params.existingFollowupfeedback as string; // For updating old follow-up feedback
 
   ENV === 'dev'&&console.log('🔍 Follow-up Screen Params:', {
    leadId,
    customerName,
    customerPhone,
    originalSource,
    followUpTypeParam,
    existingFollowUpId
  });
 
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
 
  // Determine followUpType based on originalSource
  const getFollowUpType = (): string => {
    if(!followUpTypeParam) {
    if (originalSource === 'TestRide') {
      return 'Booking Call';
    } else {
      return 'Schedule TR Call';
    }
  }
  else {
    return followUpTypeParam;
  }

  };
 
  // Form state - matching exact API requirements
  const [followUpDateISO, setFollowUpDateISO] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [followUpTime, setFollowUpTime] = useState((() => {
                      // Get current time + 1 hour, rounded to next hour, formatted as "hh:00 AM/PM"
                      const now = new Date();
                      now.setHours(now.getHours() + 1);
                      now.setMinutes(0, 0, 0);
                      let hours = now.getHours();
                      const ampm = hours >= 12 ? 'PM' : 'AM';
                      hours = hours % 12;
                      hours = hours === 0 ? 12 : hours;
                      return `${hours.toString().padStart(2, '0')}:00 ${ampm}`;
                    })());
  const [followUpReason, setFollowUpReason] = useState('');
  const [followUpSubReason, setFollowUpSubReason] = useState('');
  const [followUpOther, setFollowUpOther] = useState('');
 
  // Set followUpType based on originalSource
  const [followUpType] = useState(getFollowUpType());
 
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
 
  // Modal states
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
 
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-20));
  const [subReasonFadeAnim] = useState(new Animated.Value(0));
  const [subReasonSlideAnim] = useState(new Animated.Value(-10));
  const documentStorageKey = `testride_docs_${testrideId}`;

  const clearSavedDocuments = async () => {
    try {
      await AsyncStorage.removeItem(documentStorageKey);
       ENV === 'dev'&&console.log('🗑️ Cleared saved documents for testride:', testrideId);
    } catch (error) {
       ENV === 'dev'&&console.error('Error clearing saved documents:', error);
    }
  };
 
  // Follow-up reason options (updated to match API)
  const followUpReasonOptions = [
    'RNR',
    'Needs more time',
    'Customer needs more information'
  ];
 
  // Sub-reason options
  const getSubReasonOptions = (reasonValue: string): string[] => {
    switch (reasonValue) {
      case 'Needs more time':
        return [
          'Customer Asked To Follow Up Later',
          'Needs More Time to Decide'
        ];
      case 'Customer needs more information':
        return [
          'Wants to Compare With Other Brands',
          'Wants Finance or Insurance Details',
          'Asking for Additional Discounts or Offers',
          'Wants Price List or Brochure',
          'Asking About Delivery Timelines',
          'Others'
        ];
      default:
        return [];
    }
  };

  // Memoized validation for button state
  const isFormValid = useMemo(() => {
    // Check basic required fields
    if (!leadId || !userProfile?.UserId || !followUpDateISO || !followUpTime || !followUpType || !followUpReason) {
      return false;
    }

    // Check if sub-reason is required and selected
    const hasSubReasons = getSubReasonOptions(followUpReason).length > 0;
    if (hasSubReasons && !followUpSubReason) {
      return false;
    }

    // Check if "Others" is selected and text is provided
    if (followUpSubReason === 'Others' && !followUpOther.trim()) {
      return false;
    }

    return true;
  }, [leadId, userProfile?.UserId, followUpDateISO, followUpTime, followUpType, followUpReason, followUpSubReason, followUpOther]);

  // Calculate if create button should be disabled
  const isCreateButtonDisabled = useMemo(() => {
    return isLoading || !isFormValid;
  }, [isLoading, isFormValid]);
 
  // Load user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
         ENV === 'dev'&&console.log('📱 Loading user profile...');
        const profileString = await AsyncStorage.getItem('userProfile');
        if (profileString) {
          const profile = JSON.parse(profileString);
          setUserProfile(profile);
           ENV === 'dev'&&console.log('✅ User profile loaded:', {
            UserId: profile.UserId,
            UserName: profile.UserName
          });
        } else {
           ENV === 'dev'&&console.error('❌ No user profile found in AsyncStorage');
          Alert.alert('Error', 'User profile not found. Please login again.');
        }
      } catch (e) {
         ENV === 'dev'&&console.error('❌ Failed to load user profile:', e);
        Alert.alert('Error', 'Failed to load user profile. Please try again.');
      }
    };
 
    fetchProfile();
  }, []);
 
  // Log the determined followUpType
  useEffect(() => {
     ENV === 'dev'&&console.log('📋 Follow-up type determined:', {
      originalSource,
      followUpType,
      logic: originalSource === 'TestRide' ? 'TestRide -> Booking Call' : 'Other -> Schedule TR Call'
    });
  }, [originalSource, followUpType]);
 
  // Handle follow-up reason change
  const handleFollowUpReasonChange = (newReason: string): void => {
     ENV === 'dev'&&console.log('📝 Follow-up reason changed:', newReason);
    setFollowUpReason(newReason);
    setFollowUpSubReason('');
    setFollowUpOther('');
   
    const subOptions = getSubReasonOptions(newReason);
    if (subOptions.length > 0) {
      setFollowUpSubReason(subOptions[0]);
       ENV === 'dev'&&console.log('📝 Auto-selected sub-reason:', subOptions[0]);
    }
  };
 
  // Handle sub-reason change
  const handleSubReasonChange = (newSubReason: string): void => {
     ENV === 'dev'&&console.log('📝 Sub-reason changed:', newSubReason);
    setFollowUpSubReason(newSubReason);
    if (newSubReason !== 'Others') {
      setFollowUpOther('');
    }
  };
 
  // Animation effects
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
 
  useEffect(() => {
    const hasSubReasons = getSubReasonOptions(followUpReason).length > 0;
   
    if (hasSubReasons) {
      subReasonFadeAnim.setValue(0);
      subReasonSlideAnim.setValue(-10);
     
      Animated.parallel([
        Animated.timing(subReasonFadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(subReasonSlideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(subReasonFadeAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(subReasonSlideAnim, {
          toValue: -10,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [followUpReason]);
 
  // Convert 12-hour time to 24-hour format
  function convertTo24HourFormat(time12h: string): string {
     ENV === 'dev'&&console.log('🕐 Converting time:', time12h);
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    let hrs = parseInt(hours, 10);
 
    if (modifier === 'PM' && hrs < 12) {
      hrs += 12;
    }
    if (modifier === 'AM' && hrs === 12) {
      hrs = 0;
    }
 
    const hh = hrs.toString().padStart(2, '0');
    const result = `${hh}:${minutes}`;
     ENV === 'dev'&&console.log('🕐 Converted time:', result);
    return result;
  }
 
  // Format date for display
  const formatDisplayDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
 
  // Calendar handlers
  const handleDateSelect = (date: string) => {
     ENV === 'dev'&&console.log('📅 Date selected:', date);
    setFollowUpDateISO(date);
    setIsCalendarVisible(false);
  };
 
  const openCalendar = () => setIsCalendarVisible(true);
  const closeCalendar = () => setIsCalendarVisible(false);
 
  // Time modal handlers
  const handleTimeSelect = (time: string) => {
     ENV === 'dev'&&console.log('🕐 Time selected:', time);
    setFollowUpTime(time);
    setIsTimeModalVisible(false);
  };
 
  const openTimeModal = () => setIsTimeModalVisible(true);
  const closeTimeModal = () => setIsTimeModalVisible(false);
 
  // Enhanced validation
  const validateForm = (): boolean => {
     ENV === 'dev'&&console.log('🔍 Validating form...');
   
    if (!leadId) {
       ENV === 'dev'&&console.error('❌ Validation failed: Missing Lead ID');
      Alert.alert('Error', 'Lead ID is missing. Cannot create follow-up.');
      return false;
    }
 
    if (!userProfile?.UserId) {
       ENV === 'dev'&&console.error('❌ Validation failed: Missing User ID');
      Alert.alert('Error', 'User profile not loaded. Please try again.');
      return false;
    }
 
    if (!followUpDateISO) {
       ENV === 'dev'&&console.error('❌ Validation failed: Missing follow-up date');
      Alert.alert('Validation Error', 'Please select a follow-up date.');
      return false;
    }
 
    if (!followUpTime) {
       ENV === 'dev'&&console.error('❌ Validation failed: Missing follow-up time');
      Alert.alert('Validation Error', 'Please select a follow-up time.');
      return false;
    }
 
    if (!followUpType) {
       ENV === 'dev'&&console.error('❌ Validation failed: Missing follow-up type');
      Alert.alert('Validation Error', 'Follow-up type could not be determined.');
      return false;
    }
 
    if (!followUpReason) {
       ENV === 'dev'&&console.error('❌ Validation failed: Missing follow-up reason');
      Alert.alert('Validation Error', 'Please select a follow-up reason.');
      return false;
    }
 
    const hasSubReasons = getSubReasonOptions(followUpReason).length > 0;
    if (hasSubReasons && !followUpSubReason) {
       ENV === 'dev'&&console.error('❌ Validation failed: Missing sub reason');
      Alert.alert('Validation Error', 'Please select a sub reason.');
      return false;
    }
 
    if (followUpSubReason === 'Others' && !followUpOther.trim()) {
       ENV === 'dev'&&console.error('❌ Validation failed: Missing other reason');
      Alert.alert('Validation Error', 'Please specify the other reason.');
      return false;
    }
 
     ENV === 'dev'&&console.log('✅ Form validation passed');
    return true;
  };


  const updateTestDriveStatus = async (accessToken: string): Promise<boolean> => {
    try {
      if (!testrideId || !userProfile?.UserId) {
         ENV === 'dev'&&console.error('Missing testrideId or UserId for status update');
        return false;
      }

      const now = new Date();
      const payload = {
        UserId: userProfile.UserId,
        TestDriveId: testrideId,
        TestDriveStatus: 'Completed',
        TestDriveDate: now.toISOString().split('T')[0], // YYYY-MM-DD
        TestDriveTime: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`, // HH:MM
        StartTestDrive: false,
        CompleteTestDrive: true
      };

       ENV === 'dev'&&console.log('🔄 Updating test ride status:', payload);

      const response = await fetch(`${API_BASE}/api/data/UpdateTestDrive`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
 
  // Update existing follow-up status to completed
  const updateExistingFollowUp = async (accessToken: string): Promise<boolean> => {
    if (!existingFollowUpId) {
       ENV === 'dev'&&console.log('ℹ️ No existing follow-up ID to update');
      return true; // Not an error, just no existing follow-up to update
    }
 
    try {
       ENV === 'dev'&&console.log('🔄 Updating existing follow-up status...');
     
      const updatePayload = {
        UserId: userProfile!.UserId,
        FollowUpId: existingFollowUpId,
    followUpfeedBack:existingFollowupfeedback,
        FollowUpStatusCompleted: true
      };
 
       ENV === 'dev'&&console.log('📞 Update follow-up API payload:', JSON.stringify(updatePayload, null, 2));
       ENV === 'dev'&&console.log(API_BASE)
      const response = await fetch(
        `${API_BASE}/api/data/UpdateFollowUp`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(updatePayload),
        }
      );
 
       ENV === 'dev'&&console.log('📡 Update API Response Status:', response.status);
 
      if (!response.ok) {
        const errorText = await response.text();
         ENV === 'dev'&&console.error('❌ Update API Error Response:', errorText);
        throw new Error(`Update API error ${response.status}: ${errorText}`);
      }
 
      const responseText = await response.text();
       ENV === 'dev'&&console.log('📡 Update API Raw Response:', responseText);
 
      const result = JSON.parse(responseText);
       ENV === 'dev'&&console.log('✅ Update API Parsed Response:', result);
 
      if (result.StatusCode === 200) {
         ENV === 'dev'&&console.log('✅ Existing follow-up updated successfully');
        return true;
      } else {
         ENV === 'dev'&&console.error('❌ Unexpected update response:', result);
        throw new Error(result.StatusMessage || 'Failed to update existing follow-up');
      }
 
    } catch (error) {
       ENV === 'dev'&&console.error('🚨 Failed to update existing follow-up:', error);
      throw error;
    }
  };
 
  // Create new follow-up
  const createNewFollowUp = async (accessToken: string): Promise<boolean> => {
    try {
      // Prepare exact API payload matching the format you showed
      const followUpPayload = {
        LeadId: leadId,
        FollowUpDate: followUpDateISO,
        FollowUpTime: convertTo24HourFormat(followUpTime),
        followUpType: followUpType,
        followUpReason: followUpReason,
        followUpSubReason: followUpSubReason || "",
        UserId: userProfile!.UserId,
        followUpOther: followUpOther || ""
      };
 
       ENV === 'dev'&&console.log('📞 Follow-up API payload:', JSON.stringify(followUpPayload, null, 2));
 
      // Make API call to create new follow-up
       ENV === 'dev'&&console.log('🌐 Making Create Follow-up API call...');
       ENV === 'dev'&&console.log(API_BASE)
      const response = await fetch(
        `${API_BASE}/api/data/CreateFollowUp`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(followUpPayload),
        }
      );
 
       ENV === 'dev'&&console.log('📡 Create API Response Status:', response.status);
 
      if (!response.ok) {
        const errorText = await response.text();
         ENV === 'dev'&&console.error('❌ Create API Error Response:', errorText);
        throw new Error(`Create API error ${response.status}: ${errorText}`);
      }
 
      const responseText = await response.text();
       ENV === 'dev'&&console.log('📡 Create API Raw Response:', responseText);
 
      const result = JSON.parse(responseText);
       ENV === 'dev'&&console.log('✅ Create API Parsed Response:', result);
 
      // Check if follow-up was created successfully
      if (result.StatusCode === 200 && result.StatusMessage === 'Follow Up Created') {
         ENV === 'dev'&&console.log('🎉 New follow-up created successfully!');
        return true;
      } else {
         ENV === 'dev'&&console.error('❌ Unexpected API response:', result);
        throw new Error(result.StatusMessage || 'Unexpected response from server');
      }
 
    } catch (error) {
       ENV === 'dev'&&console.error('🚨 Follow-up creation failed:', error);
      throw error;
    }
  };


  
 
  // Enhanced form submission with correct order: Update first, then create
  const handleConfirm = async () => {
     ENV === 'dev'&&console.log('🚀 Starting follow-up process...');
   
    if (!validateForm()) {
      return;
    }
 
    setIsLoading(true);
 
    try {
      // Get access token
       ENV === 'dev'&&console.log('🔑 Getting access token...');
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        throw new Error('Could not get valid access token');
      }
       ENV === 'dev'&&console.log('✅ Access token obtained');
 
      // STEP 1: Update existing follow-up first (if exists)
       ENV === 'dev'&&console.log('🔄 Step 1: Updating existing follow-up...');
      await updateExistingFollowUp(accessToken);
      if (testrideId) {
        const updateSuccess = await updateTestDriveStatus(accessToken);
        if (!updateSuccess) {
           ENV === 'dev'&&console.warn('Test ride status update failed, but follow-up was created');
        }
      }
     
      // STEP 2: Create new follow-up
       ENV === 'dev'&&console.log('🆕 Step 2: Creating new follow-up...');
      await createNewFollowUp(accessToken);
     
      // Navigate to success screen
      router.push({
        pathname: '/components/SplashProps',
        params: {
          title: "Follow-Up Created Successfully",
          subtitle: `Follow-up has been created successfully${customerName ? ` for ${customerName}` : ''}.`,
          showSubtitle: 'true',
          navigateTo: '/follow-ups',
          delay: '2500'
        }
      });
 
    } catch (error) {
       ENV === 'dev'&&console.error('🚨 Follow-up process failed:', error);
     
      let errorMessage = 'Failed to process follow-up. Please try again.';
     
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timeout. Please try again.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Access denied. Please check your permissions.';
        } else {
          errorMessage = error.message;
        }
      }
     
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleClose = () => {
    router.back();
  };
 
  const showSubReasonDropdown = getSubReasonOptions(followUpReason).length > 0;
  const showOtherReason = followUpSubReason === 'Others';
 
  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFD]">
      <View className="flex-1 relative">
        <View className="px-4 py-6">
          <Text style={Typography.headline4} className="text-xl font-semibold text-river-blue-6">
            New Follow-Up
          </Text>
        </View>
 
        <ScrollView
          className="flex-1 px-4 pt-6"
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Date */}
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Text style={Typography.copy1} className="text-river-blue-6">Select Date<Text className="text-red-500 ml-1">*</Text></Text>
              
              </View>
              <DateField
                date={formatDisplayDate(followUpDateISO)}
                onPress={openCalendar}
              />
            </View>
 
            {/* Time */}
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Text style={Typography.copy1} className="text-river-blue-6">Select Time<Text className="text-red-500 ml-1">*</Text></Text>
               
              </View>
              <TimeField
                time={followUpTime}
                onPress={openTimeModal}
              />
            </View>
 
            {/* Follow-Up Reason */}
            <View className="mb-6">
              <Dropdown
                label="Follow-up Reason"
                isRequired={true}
                value={followUpReason}
                onSelect={handleFollowUpReasonChange}
                options={followUpReasonOptions}
                placeholder="Select follow-up reason"
              />
            </View>
 
            {/* Sub Reason */}
            {showSubReasonDropdown && (
              <Animated.View
                className="mb-4"
                style={{
                  opacity: subReasonFadeAnim,
                  transform: [{ translateY: subReasonSlideAnim }]
                }}
              >
                <Dropdown
                  label="Sub Reason"
                  isRequired={true}
                  value={followUpSubReason}
                  onSelect={handleSubReasonChange}
                  options={getSubReasonOptions(followUpReason)}
                  placeholder="Select sub reason"
                />
              </Animated.View>
            )}
 
            {/* Other Reason Text Input */}
            {showOtherReason && (
              <Animated.View
                className="mb-4"
                style={{
                  opacity: subReasonFadeAnim,
                  transform: [{ translateY: subReasonSlideAnim }]
                }}
              >
                <View className="flex-row items-center mb-3">
                  <Text style={Typography.copy1}>Other Reason</Text>
                  <Text className="text-red-500 ml-1">*</Text>
                </View>
                <TextInput
                  style={[Typography.copy1, {
                    height: 120,
                    padding: 16,
                    backgroundColor: '#CEE9F5',
                    borderRadius: 24,
                    color: '#61AFD2',
                    textAlignVertical: 'top'
                  }]}
                  placeholder="Please specify the reason..."
                  value={followUpOther}
                  onChangeText={setFollowUpOther}
                  multiline
                  textAlignVertical="top"
                />
              </Animated.View>
            )}
          </Animated.View>
        </ScrollView>
 
        {/* Footer with dynamic button state */}
        <AnimatedButtonsFooter
          handleCreateEnquiry={handleConfirm}
          handleCancel={handleClose}
          Typography={Typography}
          createEnquiryText="Create"
          cancelText="Cancel"
          disableCreateEnquiry={isCreateButtonDisabled}
        />
 
        {/* Calendar Modal */}
        {isCalendarVisible && (
          <View className="absolute inset-0 bg-black/50 justify-end">
            <CalendarModal
              isVisible={isCalendarVisible}
              onClose={closeCalendar}
              onSelectDate={handleDateSelect}
              initialDate={followUpDateISO}
            />
          </View>
        )}
 
        {/* Time Modal */}
        {isTimeModalVisible && (
          <View className="absolute inset-0 bg-black/50 justify-end">
            <TimeModal
              isVisible={isTimeModalVisible}
              onClose={closeTimeModal}
              onSelectTime={handleTimeSelect}
              initialTime={followUpTime}
              selectedDate={followUpDateISO}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}