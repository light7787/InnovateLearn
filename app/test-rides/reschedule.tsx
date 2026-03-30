import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Animated, Easing, ScrollView, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarModal from '@/app/components/HomeScreen/calenderModal';
import { DateField } from '@/app/components/inputCalender';
import Typography from '@/constants/typography';
import { TextField } from '@/app/components/input';
import AnimatedButtonsFooter from '@/app/components/footerbtn';
import { getValidAccessToken } from '../auth/auth.service';
import { API_BASE, ENV } from '@/constants/env';

// API Configuration
const API_BASE_URL = `${API_BASE}`;

// TimeSlotSelector Component with past time prevention
const TimeSlotSelector = ({ selectedSlot, onSlotSelect, selectedDate }: { 
  selectedSlot: string; 
  onSlotSelect: (slot: string) => void;
  selectedDate: string;
}) => {
  // Function to check if a time slot is in the past for today's date
  const isTimeSlotPast = (timeSlot: string, selectedDate: string): boolean => {
    try {
      const today = new Date();
      const selectedDateObj = new Date(selectedDate);
      
      // Only check for past times if the selected date is today
      const isToday = selectedDateObj.toDateString() === today.toDateString();
      
      if (!isToday) {
        return false; // Future dates can have any time slot
      }
      
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      // Map time slots to their end times (we check against end time to be more lenient)
      const timeSlotEndHours: { [key: string]: number } = {
        '9 AM - 11 AM': 11 * 60,      // 11:00 AM in minutes
        '11 AM - 1 PM': 13 * 60,      // 1:00 PM in minutes  
        '2 PM - 4 PM': 16 * 60,       // 4:00 PM in minutes
        '4 PM - 6 PM': 18 * 60,       // 6:00 PM in minutes
      };
      
      const slotEndTime = timeSlotEndHours[timeSlot];
      return slotEndTime ? currentTimeInMinutes >= slotEndTime : false;
      
    } catch (error) {
       ENV === 'dev'&&console.error('Error checking time slot:', error);
      return false;
    }
  };

  const handlePress = (slot: string) => {
    // Don't allow selection of past time slots
    if (isTimeSlotPast(slot, selectedDate)) {
      return;
    }
    onSlotSelect(slot);
  };

  const getBtnClass = (slot: string) => {
    const isPast = isTimeSlotPast(slot, selectedDate);
    const isSelected = selectedSlot === slot;
    
    if (isPast) {
      return 'flex-row justify-center items-center px-4 w-[167px] h-12 rounded-full border bg-gray-200 border-gray-300';
    }
    
    return `flex-row justify-center items-center px-4 w-[167px] h-12 rounded-full border ${
      isSelected ? 'bg-[#007DB6]' : 'bg-[#F7FBFD] border-[#007DB6]'
    }`;
  };

  const getTextClass = (slot: string) => {
    const isPast = isTimeSlotPast(slot, selectedDate);
    const isSelected = selectedSlot === slot;
    
    if (isPast) {
      return 'text-base font-normal text-gray-400';
    }
    
    return `text-base font-normal ${
      isSelected ? 'text-[#F7FBFD]' : 'text-[#007DB6]'
    }`;
  };

  return (
    <View className="flex flex-col items-start gap-4 w-full">
      {/* First Row */}
      <View className="flex-row gap-2 w-full justify-between">
        <TouchableOpacity 
          className={getBtnClass('9 AM - 11 AM')} 
          onPress={() => handlePress('9 AM - 11 AM')}
          disabled={isTimeSlotPast('9 AM - 11 AM', selectedDate)}
        >
          <Text className={getTextClass('9 AM - 11 AM')} style={Typography.copy1}>
            9 AM - 11 AM
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={getBtnClass('11 AM - 1 PM')} 
          onPress={() => handlePress('11 AM - 1 PM')}
          disabled={isTimeSlotPast('11 AM - 1 PM', selectedDate)}
        >
          <Text className={getTextClass('11 AM - 1 PM')} style={Typography.copy1}>
            11 AM - 1 PM
          </Text>
        </TouchableOpacity>
      </View>

      {/* Second Row */}
      <View className="flex-row gap-2 w-full justify-between">
        <TouchableOpacity 
          className={getBtnClass('2 PM - 4 PM')} 
          onPress={() => handlePress('2 PM - 4 PM')}
          disabled={isTimeSlotPast('2 PM - 4 PM', selectedDate)}
        >
          <Text className={getTextClass('2 PM - 4 PM')} style={Typography.copy1}>
            2 PM - 4 PM
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={getBtnClass('4 PM - 6 PM')} 
          onPress={() => handlePress('4 PM - 6 PM')}
          disabled={isTimeSlotPast('4 PM - 6 PM', selectedDate)}
        >
          <Text className={getTextClass('4 PM - 6 PM')} style={Typography.copy1}>
            4 PM - 6 PM
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Radio Button Component
const RadioButton = ({ selected, onPress, label }: { selected: boolean; onPress: () => void; label: string }) => (
  <TouchableOpacity 
    className="flex-row items-center mb-3" 
    onPress={onPress}
  >
    <View className={`w-5 h-5 rounded-full border-2 mr-3 ${selected ? 'border-[#007DB6]' : 'border-gray-300'}`}>
      {selected && <View className="w-3 h-3 rounded-full bg-[#007DB6] m-0.5" />}
    </View>
    <Text className={`text-base ${selected ? 'text-[#007DB6] font-medium' : 'text-gray-600'}`} style={Typography.copy1}>{label}</Text>
  </TouchableOpacity>
);

export default function RescheduleTestRideScreen() {
  // Get route parameters
  const params = useLocalSearchParams();
  const originalSource = params.originalSource as string; // 'TestRide' or 'FollowUp'
  const isReschedule = params.isReschedule === 'true';
  const isFromFollowUp = originalSource === 'FollowUp';
  
  // State management
  const [testRideType, setTestRideType] = useState(
    (params.testRideType as string) || 'Home Test Ride'
  );
  const [leadName, setLeadName] = useState(
    (params.leadname as string) || (params.leadName as string) || 'Sandeep Singh'
  );
  const [testRideDateISO, setTestRideDateISO] = useState(() => {
    if (isFromFollowUp) {
      // For follow-ups, use today's date as default
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
    return (params.currentDate as string) || '2025-05-16';
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    (params.currentTime as string) || '11 AM - 1 PM'
  );
  const [address, setAddress] = useState(
    (params.currentAddress as string) || ''
  );
  const [pincode, setPincode] = useState(
    (params.postalCode as string) || ''
  );

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({
    address: '',
    pincode: ''
  });

  const [touched, setTouched] = useState({
    address: false,
    pincode: false
  });

  // Get additional params for API calls
  const testrideId = params.testrideId as string;
  const leadId = params.leadId as string;
  const userId = params.userId as string;
  const followupId = params.followupId as string;

  // Calendar Modal
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);

  // Additional useEffect to handle automatic time slot adjustment when date changes
  useEffect(() => {
    // If the selected time slot becomes invalid due to date change, reset it
    if (testRideType === 'Home Test Ride' && testRideDateISO) {
      const isCurrentSlotPast = (() => {
        try {
          const today = new Date();
          const selectedDateObj = new Date(testRideDateISO);
          const isToday = selectedDateObj.toDateString() === today.toDateString();
          
          if (!isToday) return false;
          
          const currentHour = today.getHours();
          const currentMinute = today.getMinutes();
          const currentTimeInMinutes = currentHour * 60 + currentMinute;
          
          const timeSlotEndHours: { [key: string]: number } = {
            '9 AM - 11 AM': 11 * 60,
            '11 AM - 1 PM': 13 * 60,
            '2 PM - 4 PM': 16 * 60,
            '4 PM - 6 PM': 18 * 60,
          };
          
          const slotEndTime = timeSlotEndHours[selectedTimeSlot];
          return slotEndTime ? currentTimeInMinutes >= slotEndTime : false;
        } catch (error) {
          return false;
        }
      })();
      
      if (isCurrentSlotPast) {
        // Find the next available time slot
        const availableSlots = ['9 AM - 11 AM', '11 AM - 1 PM', '2 PM - 4 PM', '4 PM - 6 PM'];
        const today = new Date();
        const currentTimeInMinutes = today.getHours() * 60 + today.getMinutes();
        
        const timeSlotEndHours: { [key: string]: number } = {
          '9 AM - 11 AM': 11 * 60,
          '11 AM - 1 PM': 13 * 60,
          '2 PM - 4 PM': 16 * 60,
          '4 PM - 6 PM': 18 * 60,
        };
        
        const nextAvailableSlot = availableSlots.find(slot => {
          const slotEndTime = timeSlotEndHours[slot];
          return currentTimeInMinutes < slotEndTime;
        });
        
        if (nextAvailableSlot) {
          setSelectedTimeSlot(nextAvailableSlot);
        } else {
          // If no slots are available today, set to first slot (will be handled by validation)
          setSelectedTimeSlot('9 AM - 11 AM');
        }
      }
    }
  }, [testRideDateISO, testRideType, selectedTimeSlot]);

  // Validation functions
  const validateAddress = useCallback((value: string): string => {
    if (testRideType === 'Home Test Ride') {
      if (!value.trim()) {
        return 'Address is required for home test ride';
      }
      if (value.trim().length < 10) {
        return 'Please enter a complete address';
      }
    }
    return '';
  }, [testRideType]);

  const validatePincode = useCallback((value: string): string => {
    if (testRideType === 'Home Test Ride') {
      if (!value.trim()) {
        return 'Pincode is required for home test ride';
      }
      if (!/^\d{6}$/.test(value.trim())) {
        return 'Pincode must be exactly 6 digits';
      }
    }
    return '';
  }, [testRideType]);

  // Update validation errors when values change
  useEffect(() => {
    const newErrors = {
      address: validateAddress(address),
      pincode: validatePincode(pincode)
    };
    
    setErrors(newErrors);
  }, [address, pincode, testRideType, validateAddress, validatePincode]);

  // Memoized validation for button state
  const isFormValid = useMemo(() => {
    // Check basic required fields
    if (!testRideDateISO || testRideDateISO === 'Invalid Date') {
       ENV === 'dev'&&console.log('❌ Form invalid: Missing or invalid date');
      return false;
    }

    if (!leadId || !userId) {
       ENV === 'dev'&&console.log('❌ Form invalid: Missing leadId or userId');
      return false;
    }

    // Additional validation for Home Test Ride
    if (testRideType === 'Home Test Ride') {
      if (errors.address || errors.pincode) {
         ENV === 'dev'&&console.log('❌ Form invalid: Address or pincode validation errors');
        return false;
      }

      if (!address.trim() || !pincode.trim()) {
         ENV === 'dev'&&console.log('❌ Form invalid: Missing address or pincode for Home Test Ride');
        return false;
      }

      if (!selectedTimeSlot) {
         ENV === 'dev'&&console.log('❌ Form invalid: Missing time slot for Home Test Ride');
        return false;
      }
    }

     ENV === 'dev'&&console.log('✅ Form validation passed');
    return true;
  }, [testRideDateISO, leadId, userId, testRideType, address, pincode, selectedTimeSlot, errors]);

  // Calculate if create button should be disabled
  const isCreateButtonDisabled = useMemo(() => {
    const disabled = isLoading || !isFormValid;
     ENV === 'dev'&&console.log('🔘 Button disabled state:', {
      isLoading,
      isFormValid,
      disabled,
      testRideType,
      address: address.trim(),
      pincode: pincode.trim(),
      errors
    });
    return disabled;
  }, [isLoading, isFormValid, errors]);

  // Dynamic header text and button text based on source
  const getHeaderText = () => {
    if (isFromFollowUp) {
      return 'Schedule Test Ride';
    }
    return isReschedule ? 'Reschedule Test Ride' : 'New Test Ride';
  };

  const getConfirmButtonText = () => {
    if (isFromFollowUp) {
      return 'Schedule Test Ride';
    }
    return isReschedule ? 'Reschedule' : 'Confirm';
  };

  const getSuccessTitle = () => {
    if (isFromFollowUp) {
      return 'Test Ride Scheduled';
    }
    return isReschedule ? 'Test Ride Rescheduled' : 'New Test Ride Created';
  };

  const getSuccessSubtitle = () => {
    if (isFromFollowUp) {
      return 'Test ride has been scheduled successfully from follow-up.';
    }
    return isReschedule ? 
      'Test ride has been rescheduled successfully.' : 
      'New test ride has been created successfully.';
  };

  const getNavigationTarget = () => {
    if (isFromFollowUp) {
      return '/test-rides'; // Navigate to test rides list
    }
    return '/test-rides'; // Default navigation
  };

  // Convert time slot to 24-hour format for API
  const convertTimeTo24Hour = (timeSlot: string): string => {
    const timeMap: { [key: string]: string } = {
      '9 AM - 11 AM': '09:00',
      '11 AM - 1 PM': '11:00',
      '2 PM - 4 PM': '14:00',
      '4 PM - 6 PM': '16:00',
    };
    return timeMap[timeSlot] || '09:00';
  };

  // Handle input changes with validation tracking
  const handleAddressChange = useCallback((text: string) => {
    setAddress(text);
    if (!touched.address) {
      setTouched(prev => ({ ...prev, address: true }));
    }
  }, [touched.address]);

  const handleAddressBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, address: true }));
  }, []);
  
  const handlePincodeChange = useCallback((text: string) => {
    // Only allow digits and limit to 6 characters maximum
    const digitsOnly = text.replace(/[^0-9]/g, '').slice(0, 6);
    setPincode(digitsOnly);
    if (!touched.pincode) {
      setTouched(prev => ({ ...prev, pincode: true }));
    }
  }, [touched.pincode]);

  const handlePincodeBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, pincode: true }));
  }, []);

  // API call to update follow-up status
  const updateFollowUpStatus = async () => {
    try {
       ENV === 'dev'&&console.log('Updating follow-up status for ID:', followupId);
      
      const requestBody = {
        UserId: userId,
        FollowUpId: followupId,
        FollowUpStatusCompleted: true
      };

       ENV === 'dev'&&console.log('Updating follow-up with:', requestBody);
      const token = await getValidAccessToken();

      const response = await fetch(`${API_BASE_URL}/api/data/UpdateFollowUp`, {
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

  // API call to update existing test drive (for TestRide source)
  const updateTestDrive = async (status: string = 'Scheduled') => {
    try {
      setIsLoading(true);
      
      // Build request body based on test ride type
      const baseRequestBody = {
        UserId: userId,
        LeadId: leadId,
        TestDriveId: testrideId,
        TestDriveStatus: 'Reschedule',
        TestDriveDate: testRideDateISO, // YYYY-MM-DD format
        StartTestDrive: false,
        CompleteTestDrive: false
      };

      let requestBody;

      if (testRideType === 'Home Test Ride') {
        requestBody = {
          ...baseRequestBody,
          TestDriveTime: convertTimeTo24Hour(selectedTimeSlot), // 24 hrs format
          rideType: 'HTR' ,
          HomeTestDriveAddress: address,
          pincode: pincode // Fixed: lowercase 'pincode' to match API expectation
        };
      } else {
        // Store Test Ride
        requestBody = {
          ...baseRequestBody,
          TestDriveTime: '09:00', // Default time for store test rides
          rideType:'STR',
        };
      }

       ENV === 'dev'&&console.log('Updating test drive with:', requestBody);
      const token = await getValidAccessToken();

      const response = await fetch(`${API_BASE_URL}/api/data/UpdateTestDrive`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      
      if (response.ok && responseData.StatusCode === 200) {
         ENV === 'dev'&&console.log('Test drive updated successfully:', responseData);
        return { success: true, data: responseData };
      } else {
         ENV === 'dev'&&console.error('API Error:', responseData);
        return { success: false, error: responseData.StatusMessage || 'Failed to update test drive' };
      }
    } catch (error) {
       ENV === 'dev'&&console.error('Network Error:', error);
      return { success: false, error: 'Network error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  // API call to create new test drive (for FollowUp source)
  const createTestDrive = async () => {
    try {
      setIsLoading(true);
      
      const requestBody = {
        UserId: userId,
        LeadId: leadId,
        TestDriveDate: testRideDateISO, // YYYY-MM-DD format
        TestDriveTime: testRideType === 'Home Test Ride' ? convertTimeTo24Hour(selectedTimeSlot) : '09:00', // 24 hrs format
        homeTestDrive: testRideType === 'Home Test Ride',
        storeTestDrive: testRideType === 'Store Test Ride',
 
        HomeTestDriveAddress: testRideType === 'Home Test Ride' ? address : '',
        Pincode: testRideType === 'Home Test Ride' ? pincode : '',
        StartTestDrive : false, 
        CompleteTestDrive : false,
        // Add TimeSlot field for home test rides
        ...(testRideType === 'Home Test Ride' && { TimeSlot: selectedTimeSlot }),
      };

       ENV === 'dev'&&console.log('Creating test drive with:', requestBody);
      const token = await getValidAccessToken();

      const response = await fetch(`${API_BASE_URL}/api/data/CreateTestDrive`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      
      if (response.ok && responseData.StatusCode === 200) {
         ENV === 'dev'&&console.log('Test drive created successfully:', responseData);
        return { success: true, data: responseData };
      } else {
         ENV === 'dev'&&console.error('API Error:', responseData);
        return { success: false, error: responseData.StatusMessage || 'Failed to create test drive' };
      }
    } catch (error) {
       ENV === 'dev'&&console.error('Network Error:', error);
      return { success: false, error: 'Network error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  // Animation effect
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(-20);

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
  }, [testRideType]);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        // Scroll to bottom when keyboard appears
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Reset validation when test ride type changes
  useEffect(() => {
    if (testRideType === 'Store Test Ride') {
      setTouched(prev => ({ ...prev, address: false, pincode: false }));
    }
  }, [testRideType]);

  // Improved date formatting function with error handling
  const formatDisplayDate = (isoDate: string) => {
    try {
      // Ensure we have a valid date string
      if (!isoDate || isoDate === 'Invalid Date') {
        return 'Select Date';
      }
      
      // Handle different date formats
      let date: Date;
      
      // If it's already in ISO format (YYYY-MM-DD)
      if (isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        date = new Date(isoDate + 'T00:00:00.000Z');
      } 
      // If it's in other formats, try to parse it
      else {
        date = new Date(isoDate);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
         ENV === 'dev'&&console.warn('Invalid date provided:', isoDate);
        return 'Select Date';
      }
      
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (error) {
       ENV === 'dev'&&console.error('Error formatting date:', error);
      return 'Select Date';
    }
  };

  // Improved date validation function
  const validateAndSetDate = (dateString: string) => {
    try {
      // If empty or invalid, use today's date
      if (!dateString || dateString === 'Invalid Date') {
        const today = new Date();
        const isoToday = today.toISOString().split('T')[0];
        setTestRideDateISO(isoToday);
        return;
      }
      
      // Validate the date format and set it
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        // If it's a valid date, ensure it's in ISO format
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          setTestRideDateISO(dateString);
        } else {
          // Convert to ISO format
          const isoDate = date.toISOString().split('T')[0];
          setTestRideDateISO(isoDate);
        }
      } else {
        // If invalid, use today's date
        const today = new Date();
        const isoToday = today.toISOString().split('T')[0];
        setTestRideDateISO(isoToday);
      }
    } catch (error) {
       ENV === 'dev'&&console.error('Error validating date:', error);
      // Fallback to today's date
      const today = new Date();
      const isoToday = today.toISOString().split('T')[0];
      setTestRideDateISO(isoToday);
    }
  };

  // Validate date on component mount
  useEffect(() => {
    validateAndSetDate(testRideDateISO);
  }, []);

  const handleDateSelect = (date: string) => {
    try {
      // Ensure the date is in proper format
      if (date && date !== 'Invalid Date') {
        setTestRideDateISO(date);
      }
      setIsCalendarVisible(false);
    } catch (error) {
       ENV === 'dev'&&console.error('Error selecting date:', error);
      setIsCalendarVisible(false);
    }
  };

  const openCalendar = () => {
    try {
      setIsCalendarVisible(true);
    } catch (error) {
       ENV === 'dev'&&console.error('Error opening calendar:', error);
    }
  };

  const closeCalendar = () => {
    setIsCalendarVisible(false);
  };

  const handleConfirm = async () => {
    try {
      let result;

      if (isFromFollowUp) {
        // Create new test drive for follow-up source
        result = await createTestDrive();
        
        // If test drive creation is successful and we have a followupId, update the follow-up status
        if (result.success && followupId) {
           ENV === 'dev'&&console.log('Test drive created successfully, now updating follow-up status...');
          const followUpResult = await updateFollowUpStatus();
          
          if (!followUpResult.success) {
             ENV === 'dev'&&console.warn('Follow-up update failed, but test drive was created:', followUpResult.error);
            // Don't fail the entire operation, just log the warning
            // The test drive was successfully created, which is the primary goal
          } else {
             ENV === 'dev'&&console.log('Follow-up status updated successfully');
          }
        }
      } else {
        // Update existing test drive for TestRide source (mark as "No Show" as per original logic)
        result = await updateTestDrive('No Show');
      }

      if (result.success) {
        router.push({
          pathname: '/components/SplashProps',
          params: {
            title: getSuccessTitle(),
            subtitle: getSuccessSubtitle(),
            showSubtitle: 'true',
            navigateTo: getNavigationTarget(),
            delay: '2500'
          }
        });
      } else {
        Alert.alert('Error', result.error || 'Failed to process request');
      }
    } catch (error) {
       ENV === 'dev'&&console.error('Error in handleConfirm:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleAddressFocus = () => {
    // Scroll to the address field when focused
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  // Error Message Component
  const ErrorMessage = ({ error, show }: { error: string; show: boolean }) => {
    if (!show || !error) return null;
    
    return (
      <Text className="text-red-500 text-sm mt-1" style={Typography.status}>
        {error}
      </Text>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-river-blue-1" edges={['top']}>
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View className="flex-1">
          <ScrollView 
            ref={scrollViewRef}
            className="flex-1 px-4 pt-6" 
            contentContainerStyle={{ 
              paddingBottom: Math.max(120, keyboardHeight + 40),
              flexGrow: 1
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          >
            {/* Header */}
            <View className="mb-8">
              <Text className="text-river-blue-6" style={Typography.headline4}>{getHeaderText()}</Text>
            </View>

            {/* Test Ride Type Selection */}
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <Text className=" text-river-blue-6" style={Typography.copy1}>Select Test Ride Type <Text className="text-red-500 ml-1">*</Text></Text>

              </View>
              
              <RadioButton 
                selected={testRideType === 'Home Test Ride'}
                onPress={() => setTestRideType('Home Test Ride')}
                label="Home Test Ride"
              />
              <RadioButton 
                selected={testRideType === 'Store Test Ride'}
                onPress={() => setTestRideType('Store Test Ride')}
                label="Store Test Ride"
              />
            </View>

            {/* Lead Name */}
            <View className="mb-6">
              <Text className=" mb-3" style={Typography.copy1}>Lead Name <Text className="text-red-500 ml-1">*</Text></Text>
              <View className="bg-[#DEEEF6] rounded-[90px] p-3">
                <Text className=" text-[#007DB6] " style={Typography.copy1}>{leadName}</Text>
              </View>
            </View>

            {/* Select Date */}
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Text className=" " style={Typography.copy1}>Select Date</Text>
               
              </View>
              <DateField
                date={formatDisplayDate(testRideDateISO)}
                onPress={openCalendar}
              />
            </View>
            
            {/* Select Time Slot - Only show for Home Test Ride */}
            {testRideType === 'Home Test Ride' && (
              <Animated.View 
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
                className="mb-6 pr-2"
              >
                <View className="flex-row items-center mb-4">
                  <Text className=" " style={Typography.copy1}>Select Time Slot</Text>
             
                </View>
                <TimeSlotSelector
                  selectedSlot={selectedTimeSlot}
                  onSlotSelect={setSelectedTimeSlot}
                  selectedDate={testRideDateISO}
                />
              </Animated.View>
            )}

            {/* Address (only for Home Test Ride) */}
            {testRideType === 'Home Test Ride' && (
                <Animated.View 
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  }}
                  className="mb-6"
                >
               <View className='mb-6'>
                 <View className="flex-row items-center mb-3">
                   <Text className=" " style={Typography.copy1}>Address
                   <Text className="text-red-500 ml-1">*</Text></Text>
                  
                 </View>
                 <View onTouchStart={handleAddressFocus}>
                   <TextField 
                     value={address} 
                     onChangeText={handleAddressChange}
                     onBlur={handleAddressBlur}
                     placeholder="Enter complete address"
                     style={errors.address && touched.address ? { borderColor: '#ef4444', borderWidth: 1 } : {}}
                   />
                 </View>
                 <Text><ErrorMessage error={errors.address} show={touched.address} /></Text>
               </View>

               <View className='mb-8'>
                 <View className="flex-row items-center mb-3">
                   <Text className=" " style={Typography.copy1}>Pincode<Text className="text-red-500 ml-1">*</Text></Text>
               
                 </View>
                 <View onTouchStart={handleAddressFocus}>
                   <TextField 
                     value={pincode} 
                     onChangeText={handlePincodeChange}
                     onBlur={handlePincodeBlur}
                     placeholder="Enter 6-digit pincode"
                     style={errors.pincode && touched.pincode ? { borderColor: '#ef4444', borderWidth: 1 } : {}}
              />
            </View>
            
          </View>
              </Animated.View>
            )}

            {/* Additional spacer when keyboard is visible */}
            {keyboardHeight > 0 && <View style={{ height: 100 }} />}
          </ScrollView>

          {/* Fixed Bottom Buttons - Hide when keyboard is visible */}
          {keyboardHeight === 0 && (
               <AnimatedButtonsFooter
               handleCreateEnquiry={handleConfirm}
               handleCancel={handleClose}
               Typography={Typography}
               createEnquiryText={isLoading ? "Processing..." : 'Confirm'}
               cancelText="Cancel"
              disableCreateEnquiry={isCreateButtonDisabled}
             />
           
          )}

          {/* Calendar Modal */}
          {isCalendarVisible && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 40,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'flex-end',
            }}>
              <Animated.View style={{
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim,
              }}>
                <CalendarModal
                  isVisible={isCalendarVisible}
                  onClose={closeCalendar}
                  onSelectDate={handleDateSelect}
                  initialDate={testRideDateISO}
                />
              </Animated.View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}