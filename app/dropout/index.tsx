import Typography from '@/constants/typography';
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, TextInput, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from '@/app/components/inputdropdown';
import { router, useLocalSearchParams } from 'expo-router';
import AnimatedButtonsFooter from '@/app/components/footerbtn';
import { getValidAccessToken } from '../auth/auth.service';
import { API_BASE, ENV } from '@/constants/env';
 
interface DropoutSources {
  [key: string]: string[];
}
 
const Dropout = () => {
  const params = useLocalSearchParams();
  const [leadSource, setLeadSource] = useState('Select...');
  const [subReason, setSubReason] = useState('Select...');
  const [otherReason, setOtherReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dropoutSources, setDropoutSources] = useState<DropoutSources>({});
  const [mainReasonOptions, setMainReasonOptions] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>('');
 
  // Get all params passed from previous screen
  const navigationSource = (params.from as string) || 'home';
  const leadId = params.leadId as string;
  const testrideId = params.testrideId as string;
  const followupId = params.followupId as string;
  const originalSource = params.originalSource as string;
  const isCancellation = params.isCancellation === 'true';
  const documentStorageKey = `testride_docs_${testrideId}`;
  const sourceScreen = (params.sourceScreen as string) || 'follow-ups';
 
  // Debug logging to identify missing parameters
   ENV === 'dev'&&console.log('🔍 Dropout params received:', {
    navigationSource,
    leadId,
    userId,
    testrideId,
    followupId,
    originalSource,
    isCancellation,
    allParams: params
  });
 
  // Load dropout sources and userId from AsyncStorage
  useEffect(() => {
    loadDropoutSources();
    loadUserProfile();
  }, []);
 
  // Load userId from AsyncStorage
  const loadUserProfile = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (userProfile) {
        const { UserId } = JSON.parse(userProfile);
        setUserId(UserId || '');
         ENV === 'dev'&&console.log('✅ Loaded userId from AsyncStorage:', UserId);
      } else {
         ENV === 'dev'&&console.warn('⚠️ No user profile found in AsyncStorage');
      }
    } catch (error) {
       ENV === 'dev'&&console.error('❌ Error loading user profile from AsyncStorage:', error);
    }
  };
 
  // Inline validation function
  const validateForm = (): string[] => {
    const errors: string[] = [];
   
    if (!leadId || leadId === 'undefined') {
      errors.push('Lead ID is missing');
    }
   
    if (!userId || userId === 'undefined') {
      errors.push('User ID is missing');
    }
   
    if (isCancellation && (!testrideId || testrideId === 'undefined')) {
      errors.push('Test ride ID is missing for cancellation');
    }
   
    if (navigationSource === 'follow-ups' && (!followupId || followupId === 'undefined')) {
      errors.push('Follow-up ID is missing');
    }
   
    if (leadSource === 'Select...') {
      errors.push('Please select a dropout reason');
    }
   
    if (isSubReasonRequired && subReason === 'Select...') {
      errors.push('Please select a sub reason');
    }
   
    if (isOtherReasonSelected && otherReason.trim() === '') {
      errors.push('Please provide details for other reason');
    }
   
    return errors;
  };
 
  // Update validation errors whenever form changes
  useEffect(() => {
    const errors = validateForm();
    setValidationErrors(errors);
  }, [leadSource, subReason, otherReason, leadId, userId, testrideId, followupId]);
 
  const loadDropoutSources = async () => {
    try {
      setIsLoadingData(true);
      const savedSources = await AsyncStorage.getItem('dropOutSources');
     
      if (savedSources) {
        const parsedSources: DropoutSources = JSON.parse(savedSources);
        setDropoutSources(parsedSources);
        const mainOptions = Object.keys(parsedSources);
        setMainReasonOptions(mainOptions);
       
        // FIX 1: Preselect the first value of dropdown 1
        if (mainOptions.length > 0) {
          setLeadSource(mainOptions[0]);
         
          // FIX 2: Auto-select first value of dropdown 2 when dropdown 1 has a selection
          const firstMainReason = mainOptions[0];
          if (parsedSources[firstMainReason] && parsedSources[firstMainReason].length > 0) {
            setSubReason(parsedSources[firstMainReason][0]);
          }
        }
       
         ENV === 'dev'&&console.log('Loaded dropout sources from AsyncStorage:', parsedSources);
      } else {
        // Fallback to default options if AsyncStorage is empty
         ENV === 'dev'&&console.log('No dropout sources found in AsyncStorage, using defaults');
        const defaultSources: DropoutSources = {
          'Not Interested / Not Serious Casual enquiry': [
            'Casual enquiry',
            'Customer Not Required',
            'High expectations on product (not met)',
            'RNR'
          ],
          'Considering Later / Unable to Proceed': [
            'Retail Finance Issues',
            'Out Of Delivery Area',
            'Price is High',
            'Others - Need Reason (Keep Text Box Visible if Selected)'
          ],
          'Chose Another Brand / Store': ['Chose Another Brand / Store']
        };
        setDropoutSources(defaultSources);
        const mainOptions = Object.keys(defaultSources);
        setMainReasonOptions(mainOptions);
       
        // FIX 1: Preselect the first value of dropdown 1
        if (mainOptions.length > 0) {
          setLeadSource(mainOptions[0]);
         
          // FIX 2: Auto-select first value of dropdown 2 when dropdown 1 has a selection
          const firstMainReason = mainOptions[0];
          if (defaultSources[firstMainReason] && defaultSources[firstMainReason].length > 0) {
            setSubReason(defaultSources[firstMainReason][0]);
          }
        }
      }
    } catch (error) {
       ENV === 'dev'&&console.error('Error loading dropout sources from AsyncStorage:', error);
      Alert.alert(
        'Data Loading Error',
        'Failed to load dropout options. Please try again or contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingData(false);
    }
  };
 
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
      if (!testrideId || !userId) {
         ENV === 'dev'&&console.error('Missing testrideId or userId for status update');
        return false;
      }
      if (!token) {
         ENV === 'dev'&&console.warn("Token is null, cannot update TestDriveStatus");
        return false;
      }
 
      const now = new Date();
      const payload = {
        UserId: userId,
        TestDriveId: testrideId,
        TestDriveStatus: 'Completed',
        TestDriveDate: now.toISOString().split('T')[0], // YYYY-MM-DD
        TestDriveTime: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`, // HH:MM
        StartTestDrive: false,
        CompleteTestDrive: true
      };
 
       ENV === 'dev'&&console.log('🔄 Updating test ride status for TestRideComplete:', payload);
 
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
 
  const isSelected = leadSource !== 'Select...';
  const isSubReasonRequired = dropoutSources[leadSource] && dropoutSources[leadSource].length > 0;
  const isSubReasonSelected = subReason !== 'Select...' || !isSubReasonRequired;
  const isOtherReasonSelected = subReason === 'Others – need reason' || subReason === 'Others - Need Reason (Keep Text Box Visible if Selected)';
  const isOtherReasonValid = !isOtherReasonSelected || otherReason.trim() !== '';
 
  const isFormValid = validationErrors.length === 0;
 
  // Handle main reason change
  const handleLeadSourceChange = (value: any) => {
    setLeadSource(value);
    setOtherReason('');
   
    // FIX 2: Auto-select first value of dropdown 2 when dropdown 1 selection changes
    if (dropoutSources[value] && dropoutSources[value].length > 0) {
      setSubReason(dropoutSources[value][0]);
    } else {
      setSubReason('Select...');
    }
  };
 
  const handleClose = () => {
    router.back();
  };
 
  // Handle sub reason change
  const handleSubReasonChange = (value: any) => {
    setSubReason(value);
    if (!value.toLowerCase().includes('others')) {
      setOtherReason('');
    }
  };
 
  // Determine navigation route based on source
  const getNavigationRoute = () => {
    switch (navigationSource) {
      case 'test-rides':
        return '/test-rides';
      case 'follow-ups':
        if (sourceScreen === 'overdue-followups') {
          return '/follow-ups/overdue'; 
        }
        return '/follow-ups';
      default:
        return '/home';
    }
  };
 
  // Function to call Follow-up Update API
  const callFollowUpUpdateAPI = async () => {
    if (!followupId || !userId) {
       ENV === 'dev'&&console.log('Missing followupId or userId for follow-up update API');
      return false;
    }
 
    try {
      const token = await getValidAccessToken();
     
      const followUpPayload = {
        UserId: userId,
        FollowUpId: followupId,
        FollowUpStatusCompleted: true,
      };
 
       ENV === 'dev'&&console.log('Follow-up Update API Request:', followUpPayload);
 
      const response = await fetch(`${API_BASE}/api/data/UpdateFollowUp`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(followUpPayload),
      });
 
      const responseData = await response.json();
       ENV === 'dev'&&console.log('Follow-up Update API Response:', responseData);
 
      if (response.ok && responseData && responseData.StatusCode === 200) {
         ENV === 'dev'&&console.log('✅ Follow-up status updated successfully');
        return true;
      } else {
         ENV === 'dev'&&console.error('❌ Failed to update follow-up status:', responseData);
        return false;
      }
    } catch (error) {
       ENV === 'dev'&&console.error('❌ Error calling follow-up update API:', error);
      return false;
    }
  };
 
  // Function to call Test Ride Status Cancel API
  const callTestRideCancelAPI = async () => {
    if (!testrideId || !userId) {
       ENV === 'dev'&&console.log('Missing testrideId or userId for test ride cancel API');
      return false;
    }
 
    try {
      const token = await getValidAccessToken();
     
      // Helper function to format date for API (YYYY-MM-DD)
      const formatDateForAPI = (): string => {
        return new Date().toISOString().split('T')[0];
      };
 
      // Helper function to format time for API (24 hour format HH:MM)
      const formatTimeForAPI = (): string => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      };
 
      const testRidePayload = {
        UserId: userId,
        TestDriveId: testrideId,
        TestDriveStatus: 'Canceled',
        TestDriveDate: formatDateForAPI(),
        TestDriveTime: formatTimeForAPI(),
        StartTestDrive: false,
        CompleteTestDrive: false
      };
 
       ENV === 'dev'&&console.log('Test Ride Cancel API Request:', testRidePayload);
 
      const response = await fetch(`${API_BASE}/api/data/UpdateTestDrive`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testRidePayload),
      });
 
      const responseData = await response.json();
       ENV === 'dev'&&console.log('Test Ride Cancel API Response:', responseData);
 
      if (response.ok && responseData && responseData.StatusCode === 200) {
         ENV === 'dev'&&console.log('✅ Test ride status updated to Canceled successfully');
        return true;
      } else {
         ENV === 'dev'&&console.error('❌ Failed to update test ride status:', responseData);
        return false;
      }
    } catch (error) {
       ENV === 'dev'&&console.error('❌ Error calling test ride cancel API:', error);
      return false;
    }
  };
 
  // Backend API call for dropout
  const callDropoutAPI = async () => {
    try {
      setIsLoading(true);
      const token = await getValidAccessToken();
      if (!token) {
        Alert.alert('Auth Error', 'Could not retrieve access token. Please login again.');
        setIsLoading(false);
        return;
      }
 
      if (originalSource === 'TestRideComplete') {
         ENV === 'dev'&&console.log('🔄 Handling TestRideComplete flow...');
        const updateSuccess = await updateTestDriveStatus(token);
       
        if (!updateSuccess) {
          Alert.alert(
            'Error',
            'Failed to update test ride status. Please try again.',
            [{ text: 'OK' }]
          );
          setIsLoading(false);
          return;
        }
      }
     
      const requestBody = {
        UserId: userId,
        LeadId: leadId,
        DropOutReason: leadSource,
        DropOutSubReason: isSubReasonRequired && subReason !== 'Select...' ? subReason : '',
        Others: isOtherReasonSelected ? otherReason.trim().substring(0, 255) : ''
      };
 
       ENV === 'dev'&&console.log('Dropout API Request:', requestBody);
 
      const response = await fetch(`${API_BASE}/api/data/DropLead`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
 
      const responseData = await response.json();
       ENV === 'dev'&&console.log('Dropout API Response:', responseData);
 
      if (response.ok && responseData && responseData.StatusCode === 200) {
       
        // Determine which additional API to call based on navigation source
        if (isCancellation && testrideId) {
          // Test ride cancellation flow
           ENV === 'dev'&&console.log('🔄 Calling test ride cancel API after successful dropout...');
          const testRideCancelSuccess = await callTestRideCancelAPI();
         
          if (!testRideCancelSuccess) {
            // Show warning but still proceed to success screen
             ENV === 'dev'&&console.warn('⚠️ Dropout successful but test ride status update failed');
            Alert.alert(
              'Partial Success',
              'Lead marked as dropout successfully, but there was an issue updating the test ride status. Please contact support if needed.',
              [{
                text: 'OK',
                onPress: () => navigateToSuccess()
              }]
            );
            return;
          }
        } else if (navigationSource === 'follow-ups' && followupId) {
          // Follow-up completion flow
           ENV === 'dev'&&console.log('🔄 Calling follow-up update API after successful dropout...');
          const followUpUpdateSuccess = await callFollowUpUpdateAPI();
         
          if (!followUpUpdateSuccess) {
            // Show warning but still proceed to success screen
             ENV === 'dev'&&console.warn('⚠️ Dropout successful but follow-up status update failed');
            Alert.alert(
              'Partial Success',
              'Lead marked as dropout successfully, but there was an issue updating the follow-up status. Please contact support if needed.',
              [{
                text: 'OK',
                onPress: () => navigateToSuccess()
              }]
            );
            return;
          }
        }
       
        // Navigate to success screen
        navigateToSuccess();
       
      } else {
        // Handle API error from response
        handleDropoutAPIError(responseData);
      }
    } catch (error) {
       ENV === 'dev'&&console.error('Dropout API Error:', error);
      Alert.alert(
        'Network Error',
        'Unable to connect to server. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  const refreshDashboardAfterDropout = async () => {
    try {
       ENV === 'dev'&&console.log('Refreshing dashboard data after dropout...');
      
      const token = await getValidAccessToken();
      if (!token || !userId) {
         ENV === 'dev'&&console.warn('Cannot refresh dashboard - missing token or userId');
        return false;
      }
  
      // Use TODAY filter to get current data
      const payload = {
        UserId: userId,
        FilterDate: 'TODAY'
      };
  
      const response = await fetch(`${API_BASE}/api/data/userDashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
         ENV === 'dev'&&console.warn('Dashboard refresh failed:', response.status);
        return false;
      }
  
      const result = await response.json();
      
      if (result.StatusCode !== 200) {
         ENV === 'dev'&&console.warn('Dashboard API returned error:', result.StatusMessage);
        return false;
      }
  
      // Store the updated data using the same function as HomeScreen
      await storeFullDashboardData(result);
       ENV === 'dev'&&console.log('Dashboard data refreshed successfully after dropout');
      return true;
  
    } catch (error) {
       ENV === 'dev'&&console.error('Error refreshing dashboard after dropout:', error);
      return false;
    }
  };
  
  // Add the storeFullDashboardData function (same as HomeScreen)
  const storeFullDashboardData = async (rawResponse: any) => {
    try {
      const {
        totalOldFollowUpList,
        totalOldFollowUp,
        totalFollowUp,
        totalTestDrive,
        totalBookings,
        totalPurchase,
        totalOpenOpp,
        TestDriveType,
        OpportunityDropOutSources,
        OpportunitySources,
        StatusCode,
        StatusMessage
      } = rawResponse;
     
      // Handle empty or null oldFollowUps data properly
      const oldFollowUpsData = totalOldFollowUpList && Array.isArray(totalOldFollowUpList) && totalOldFollowUpList.length > 0 
        ? totalOldFollowUpList 
        : null;
     
      const keyValuePairs: [string, any][] = [
        ['oldFollowUps', oldFollowUpsData], // Store null if empty
        ['countOldFollowUps', totalOldFollowUp],
        ['countFollowUps', totalFollowUp],
        ['countTestDrives', totalTestDrive],
        ['countBookings', totalBookings],
        ['countPurchases', totalPurchase],
        ['countOpenOpportunities', totalOpenOpp],
        ['testDriveTypes', TestDriveType],
        ['dropOutSources', OpportunityDropOutSources],
        ['opportunitySources', OpportunitySources],
        ['dashboardStatusCode', StatusCode],
        ['dashboardStatusMessage', StatusMessage]
      ];
     
      for (const [key, value] of keyValuePairs) {
        if (key === 'oldFollowUps' && value === null) {
          // Remove the key entirely if data is empty
          await AsyncStorage.removeItem(key);
           ENV === 'dev'&&console.log(`[AsyncStorage] Removed empty: ${key}`);
        } else {
          await AsyncStorage.setItem(key, JSON.stringify(value));
           ENV === 'dev'&&console.log(`[AsyncStorage] Saved: ${key}`);
        }
      }
     
       ENV === 'dev'&&console.log('Dashboard metadata stored successfully after dropout');
    } catch (err) {
       ENV === 'dev'&&console.error('Error storing dashboard data after dropout:', err);
    }
  };
 
  // Helper function to navigate to success screen
  const navigateToSuccess = () => {
    const navigateToRoute = getNavigationRoute();
     refreshDashboardAfterDropout();
   
    router.push({
      pathname: '/components/SplashProps',
      params: {
        title: `Lead marked as dropout successfully`,
        subtitle: "You can see updated list in follow-ups.",
        showSubtitle: 'true',
        navigateTo: navigateToRoute,
        delay: '2500'
      }
    });
  };
 
  // Helper function to handle dropout API errors
  const handleDropoutAPIError = (responseData: any) => {
    let errorMessage = 'Failed to mark as dropout. Please try again.';
   
    if (responseData && responseData.StatusMessage) {
      if (responseData.StatusMessage.includes('ENTITY_IS_DELETED')) {
        errorMessage = 'This lead has been deleted and cannot be updated. Please refresh the list and try again.';
      } else if (responseData.StatusMessage.includes('STRING_TOO_LONG')) {
        errorMessage = 'The reason text is too long. Please shorten your description.';
      } else if (responseData.StatusMessage.includes('INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST')) {
        errorMessage = 'Invalid selection. Please choose a valid option from the dropdown.';
      } else {
        errorMessage = responseData.StatusMessage;
      }
    }
   
    Alert.alert(
      'Error',
      errorMessage,
      [{ text: 'OK' }]
    );
  };
 
  const handleConfirm = () => {
    // Add loading check to prevent double calls
    if (isLoading) {
      return;
    }
 
    // ✅ REMOVED ALL MODAL VALIDATIONS - Now using inline validation only
    if (!isFormValid) {
       ENV === 'dev'&&console.log('Form validation failed:', validationErrors);
      return;
    }
 
    // Call the dropout API (which will also call test ride cancel API if needed)
    callDropoutAPI();
  };
 
  // Get sub reason options based on main reason
  const getSubReasonOptions = () => {
    if (leadSource && dropoutSources[leadSource]) {
      return dropoutSources[leadSource];
    }
    return [];
  };
 
  // Show loading state while data is being loaded
  if (isLoadingData) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-river-blue-6" style={Typography.copy1}>
          Loading dropout options...
        </Text>
      </View>
    );
  }
 
  return (
    // FIX 3: TouchableWithoutFeedback to dismiss keyboard when tapping outside
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 bg-gray-50 pt-6">
        <View className="flex-1 p-6 pt-6">
          <Text className="text-river-blue-6 mb-8" style={Typography.headline4}>
            Lead Drop Out
          </Text>
         
          {/* ✅ INLINE VALIDATION ERRORS DISPLAY */}
          {/* {validationErrors.length > 0 && (
            <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Text className="text-red-600 text-sm font-medium mb-1">
                Please fix the following issues:
              </Text>
              {validationErrors.map((error, index) => (
                <Text key={index} className="text-red-600 text-sm">
                  • {error}
                </Text>
              ))}
            </View>
          )} */}
         
          <Dropdown
            label="Reason"
            value={leadSource}
            isRequired={true}
            onSelect={handleLeadSourceChange}
            options={mainReasonOptions}
          />
 
          {/* Sub Reason Dropdown - Show for all main reasons including "Chose Another Brand / Store" */}
          {isSubReasonRequired && (
            <View className="mt-4">
              <Dropdown
                label="Sub Reason"
                isRequired={true}
                value={subReason}
                onSelect={handleSubReasonChange}
                options={getSubReasonOptions()}
              />
            </View>
          )}
 
          {/* Other Reason Text Input */}
          {isOtherReasonSelected && (
            <View className="mt-4">
               <View className="flex-row items-center mb-3">
                  <Text className=" " style={Typography.copy1}>Other Reason</Text>
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
                value={otherReason}
                onChangeText={setOtherReason}
                multiline
                textAlignVertical="top"
                editable={!isLoading}
              />
            </View>
          )}
        </View>
       
        <AnimatedButtonsFooter
          handleCreateEnquiry={handleConfirm}
          handleCancel={handleClose}
          Typography={Typography}
          createEnquiryText={isLoading ? "Processing..." : "Confirm"}
          cancelText="Cancel"
          disableCreateEnquiry={!isFormValid || isLoading || isLoadingData}
        />
     
      </View>
    </TouchableWithoutFeedback>
  );
};
 
export default Dropout;