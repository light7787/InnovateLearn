import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
  Linking,
  Alert,
} from 'react-native';
import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Typography from '@/constants/typography';
import WhatsappIcon from '@/app/components/Whatsapp';
import HeaderComponent from '@/app/components/AppHeader';
import { Divider } from 'react-native-paper';
import SideIcon from '@/app/components/sideicon';
import { CommonActions, useNavigation, useNavigationState } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValidAccessToken } from '../auth/auth.service';
import ConfirmationPopup from '@/app/components/confirmationmodal';
import { API_BASE, ENV } from '@/constants/env';
import {
  getFollowUpHistory,
  FollowUpHistoryItem,
  FollowUpType
} from '../services/followupHistory.service';
 
type LeadTemperature = 'Hot' | 'Warm' | 'Cold';

 

 
// Helper function to format follow-up history date and time
const formatFollowUpHistoryDateTime = (dateTimeString: string | null) => {
  if (!dateTimeString) {
    return { date: 'N/A', time: 'N/A' };
  }
 
  try {
    const date = new Date(dateTimeString);
   
    // Format date as "1 Aug"
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });
   
    // Format time as "06:30 PM"
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
   
    return {
      date: formattedDate,
      time: formattedTime,
      combined: `${formattedDate}, ${formattedTime}`
    };
  } catch (error) {
     ENV === 'dev'&&console.error('Error formatting follow-up history date:', error);
    return { date: 'N/A', time: 'N/A', combined: 'N/A' };
  }
};
 
const FollowUpDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
 
  // Navigation ref to prevent multiple navigations
  const isNavigatingRef = useRef(false);
 
  // State for userId
  const [userId, setUserId] = useState<string>('');
 
  // Extract and parse parameters with defaults - INCLUDING leadId and followupId
  const sourceScreen = (params.sourceScreen as string) || 'follow-ups';
  const leadId = (params.leadId as string) || '';
  const followupId = (params.followupId as string) || '';
  const leadName = (params.leadName as string) || 'Lead Name';
  const followUpCount = params.followUpCount ? parseInt(params.followUpCount as string) : 3;
  const phoneNumber = (params.phoneNumber as string) || '9876521390';
  const leadTemperature = (params.leadTemperature as LeadTemperature) || 'Hot';
  const lastFollowUpRemark = (params.lastFollowUpRemark as string) || 'Customer Asked to Follow Up Later';
  const upcomingFollowUpDate = (params.upcomingFollowUpDate as string) || '10 May';
  const upcomingFollowUpTime = (params.upcomingFollowUpTime as string) || '10:30 AM';
  const followUpType = (params.followUpType as FollowUpType) || 'Booking Call';
 
 
  // Log the IDs for debugging
   ENV === 'dev'&&console.log('FollowUp Details - leadId:', leadId, 'followupId:', followupId);
 
  // Temperature update states
  const [selectedTemperature, setSelectedTemperature] = useState<LeadTemperature>(leadTemperature);
  const [pendingTemperature, setPendingTemperature] = useState<LeadTemperature | null>(null);
  const [showTemperatureModal, setShowTemperatureModal] = useState(false);
  const [isUpdatingTemperature, setIsUpdatingTemperature] = useState(false);
  const [followUpHistory, setFollowUpHistory] = useState<FollowUpHistoryItem[]>([]);
  // Other states
  const [showHistory, setShowHistory] = useState(false);
 
  // Get userId from AsyncStorage on component mount
  useEffect(() => {
    const getUserId = async () => {
      try {
        const userProfile = await AsyncStorage.getItem('userProfile');
        if (userProfile) {
          const { UserId } = JSON.parse(userProfile);
          setUserId(UserId || '');
        }
      } catch (error) {
         ENV === 'dev'&&console.error('Error getting user profile:', error);
      }
    };
 
    getUserId();
  }, []);
 
// In FollowUpDetailsScreen.tsx, update the useEffect that maps followupList:
 

 

 
 useEffect(() => {
  if (!leadId) return;

  const loadHistory = async () => {
    const history = await getFollowUpHistory(leadId);
    setFollowUpHistory(history);
  };

  loadHistory();
}, [leadId]);
  // API call to update follow-up temperature/rating
  const updateFollowUpRating = async (newTemperature: LeadTemperature) => {
    if (!userId || !followupId) {
      Alert.alert('Error', 'Missing required data to update temperature');
      return false;
    }
 
    try {
      setIsUpdatingTemperature(true);
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        throw new Error('Could not get valid access token');
      }
 
      const apiPayload = {
        UserId: userId,
        FollowUpId: followupId,
        FollowUpStatusCompleted: false,
        followUprating: newTemperature.toLowerCase() // API expects lowercase
      };
 
       ENV === 'dev'&&console.log('🚀 Updating follow-up rating with payload:', apiPayload);
 
      const response = await fetch(`${API_BASE}/api/data/UpdateFollowUp`, {
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
       ENV === 'dev'&&console.log('✅ Follow-up rating updated:', result);
 
      if (result.StatusCode === 200) {
        return true;
      } else {
        throw new Error(result.StatusMessage || 'Failed to update temperature');
      }
    } catch (error) {
       ENV === 'dev'&&console.error('❌ Error updating follow-up rating:', error);
      Alert.alert('Error', 'Failed to update temperature. Please try again.');
      return false;
    } finally {
      setIsUpdatingTemperature(false);
    }
  };
 
  const handleBackPress = () => {
    // Reset the stack with the correct route names from your logs
    navigation.dispatch(
      CommonActions.reset({
        index: 1, // Current screen will be at index 1
        routes: [
          { name: 'index' },     // The follow-ups main screen (index)
          { name: 'details' },   // Current screen (details)
        ],
      })
    );
   
    // Then immediately go back
    navigation.goBack();
  };
 
  // Animation refs for action buttons
  const actionButtonAnims = useRef(
    Array(4).fill(0).map(() => new Animated.Value(0))
  ).current;
 
  const animatePress = (animValue: Animated.Value, toValue: number, duration: number = 150) => {
    Animated.timing(animValue, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start();
  };
 
  // Navigation handlers with ref protection
  const handleBookNowWithNavigation = () => {
    if (isNavigatingRef.current) return;
   
    isNavigatingRef.current = true;
     ENV === 'dev'&&console.log('🚀 Navigating with leadName:', leadName);
 
    // Navigate to booking creation with leadId and followupId
    router.push({
      pathname: '/bookings/create',
      params: {
        leadId,
        followupId,
        leadname:leadName,
        userId,phoneNumber
      }
    });
   
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };
 
  const handleNewTestRideWithNavigation = () => {
    if (isNavigatingRef.current) return;
   
    isNavigatingRef.current = true;
   
    // Navigate to test ride reschedule with proper IDs
    router.push({
      pathname: '/test-rides/reschedule',
      params: {
        originalSource: 'FollowUp',
        leadId: leadId,
        followupId: followupId,
        leadName: leadName,
        userId: userId,
        // No testrideId needed since we're creating new
      }
    });
   
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };
 
  const handleNewFollowUpWithNavigation = () => {
    if (isNavigatingRef.current) return;
   
    isNavigatingRef.current = true;
     ENV === 'dev'&&console.log('🚀 Navigating to new follow-up with leadName:', leadName);
     ENV === 'dev'&&console.log('📞 followup type:', followUpType);
    // Navigate to follow-up creation with leadId
    router.push({
      pathname: '/follow-ups/create',
      params: {
        leadId,
        // followupId,
        customerName: leadName,
        customerPhone: phoneNumber,
        originalSource: 'FollowUp',
        followUpTypeParam: followUpType,
        existingFollowUpId:followupId,
        existingFollowupfeedback:lastFollowUpRemark
      }
    });
   
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };
 
  const handleDropOutWithNavigation = () => {
    if (isNavigatingRef.current) return;
   
    isNavigatingRef.current = true;
   
    // Navigate to dropout with leadId and followupId
    router.push({
      pathname: '/dropout' as any,
      params: {
        from: 'follow-ups',
        leadId: leadId,
        followupId: followupId, // This is crucial for follow-up flows
        userId: userId,
        originalSource: 'FollowUp', // Optional: to track the original source
        sourceScreen: sourceScreen,
      }
    });
   
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };
 
  // Action items with updated handlers
  const actionItems = [
    {
      title: 'Book Now',
      onPress: (index: number) => handleActionPress(index, handleBookNowWithNavigation)
    },
    {
      title: 'New Test Ride',
      onPress: (index: number) => handleActionPress(index, handleNewTestRideWithNavigation)
    },
    {
      title: 'New Follow-Up',
      onPress: (index: number) => handleActionPress(index, handleNewFollowUpWithNavigation)
    },
    {
      title: 'Drop Out',
      onPress: (index: number) => handleActionPress(index, handleDropOutWithNavigation)
    },
  ];
 
  const getTemperatureStyle = (temperature: LeadTemperature, isSelected: boolean) => {
    const baseStyle = {
      borderWidth: 1,
      borderColor: '#007db6',
    };
 
    if (isSelected) {
      switch (temperature) {
        case 'Hot':
          return { ...baseStyle, backgroundColor: '#f3776c', borderColor: '#f3776c' };
        case 'Warm':
          return { ...baseStyle, backgroundColor: '#ffc500', borderColor: '#ffc500' };
        case 'Cold':
          return { ...baseStyle, backgroundColor: '#007db6', borderColor: '#007db6' };
        default:
          return baseStyle;
      }
    }
    return baseStyle;
  };
 
  const getTemperatureTextColor = (temperature: LeadTemperature, isSelected: boolean) => {
    return isSelected ? '#f7fbfd' : '#007db6';
  };
 
  const getFollowUpTypeColor = (type: FollowUpType): string => {
    switch (type) {
      case 'Reschedule TR Call':
        return '#f3776c';
      case 'Schedule TR Call':
        return '#61afd2';
      case 'Booking Call':
        return '#FFA500';
      default:
        return '#ffc500';
    }
  };
 
  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
 
  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };
 
  // Updated temperature press handler
  const handleTemperaturePress = (temperature: LeadTemperature) => {
    // If it's the same temperature, do nothing
    if (temperature === selectedTemperature) {
      return;
    }
 
    // Set pending temperature and show modal
    setPendingTemperature(temperature);
    setShowTemperatureModal(true);
  };
 
  // Confirm temperature update
  const handleConfirmTemperatureUpdate = async () => {
    if (!pendingTemperature) return;
 
    setShowTemperatureModal(false);
   
    // Call API to update temperature
    const success = await updateFollowUpRating(pendingTemperature);
   
    if (success) {
      // Update local state only if API call was successful
      setSelectedTemperature(pendingTemperature);
      // No success alert - just update silently
    }
   
    setPendingTemperature(null);
  };
 
  // Cancel temperature update
  const handleCancelTemperatureUpdate = () => {
    setShowTemperatureModal(false);
    setPendingTemperature(null);
  };
 
  const handleHistoryToggle = () => {
    setShowHistory(!showHistory);
  };
 
  const handleActionPress = (index: number, navigationHandler: () => void) => {
    animatePress(actionButtonAnims[index], 1);
    setTimeout(() => {
      navigationHandler();
      animatePress(actionButtonAnims[index], 0);
    }, 150);
  };
 
  // Calculate dynamic bottom padding based on history visibility
  const getBottomPadding = () => {
    return showHistory ? 100 : 50; // More padding when history is shown
  };
 
  return (
    <SafeAreaView className="flex-1 bg-river-blue-1">
      <HeaderComponent
        title={`Follow-Up Details: ${leadName || ''}`}
        onBackPress={handleBackPress}
        showDropdown={false}
      />
 
      <ScrollView
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingBottom: getBottomPadding(),
          flexGrow: 1 // Ensures content can grow and be scrollable
        }}
      >
        {/* Debug Info - Remove in production */}
        {/* {__DEV__ && (
          <View className="bg-yellow-100 p-2 mb-4 rounded">
            <Text className="text-xs">Debug: leadId={leadId}, followupId={followupId}, userId={userId}</Text>
          </View>
        )} */}
 
        {/* Lead Info Card */}
        <View className="bg-river-blue-2 rounded-2xl p-4 mb-6">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <Text style={Typography.headline4} className="text-river-blue-6 mb-1">
                {leadName}
              </Text>
              <Text style={Typography.copy2} className="text-river-blue-5">
                Follow-Up Count: <Text style={styles.boldText}>{followUpCount}</Text>
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity onPress={handleCall}>
                <Text style={Typography.copy2} className="text-river-blue-5">
                  {phoneNumber}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleWhatsApp}>
                <WhatsappIcon />
              </TouchableOpacity>
            </View>
          </View>
 
          <Divider style={{ backgroundColor: '#61AFD2', height: 1 }} />
 
          <View className="flex-row justify-between items-center py-4">
            <View className="flex-1 items-center">
              <Text style={Typography.headline6B} className="text-river-blue-6 text-center mb-1">
                {lastFollowUpRemark}
              </Text>
              <Text style={Typography.copy2} className="text-river-blue-5 text-center">
                Last Follow-Up Remark
              </Text>
            </View>
 
            <View className="w-[1px] h-[80px] bg-river-blue-4 mx-4" />
 
            <View className="flex-1 items-center">
              <Text style={Typography.headline6B} className="text-river-blue-6 text-center mb-1">
                {upcomingFollowUpDate}, {upcomingFollowUpTime}
              </Text>
              <Text style={Typography.copy2} className="text-river-blue-5 text-center">
                Upcoming Follow-Up
              </Text>
            </View>
          </View>
 
          <View className="flex-row justify-between items-center">
            <Text style={Typography.subline2} className="text-river-blue-6">
              Follow-Up Type:
            </Text>
            <View
              className="px-4 py-1 rounded-full w-48 items-center justify-center"
              style={{ backgroundColor: getFollowUpTypeColor(followUpType) }}
            >
              <Text style={[Typography.subline2, { color: '#f7fbfd' }]}>
                {followUpType}
              </Text>
            </View>
          </View>
        </View>
 
        {/* Temperature Selection */}
        <View className="flex-row gap-4 mb-6">
          {(['Warm', 'Hot', 'Cold'] as LeadTemperature[]).map((temp) => (
            <TouchableOpacity
              key={temp}
              onPress={() => handleTemperaturePress(temp)}
              className="flex-1 py-2 px-4 rounded-full items-center justify-center"
              style={getTemperatureStyle(temp, selectedTemperature === temp)}
              disabled={isUpdatingTemperature}
            >
              <View className="flex-row items-center">
                <Text
                  style={[
                    Typography.subline1,
                    { color: getTemperatureTextColor(temp, selectedTemperature === temp) }
                  ]}
                >
                  {temp}
                </Text>
                {selectedTemperature === temp && (
                  <MaterialIcons name="check" size={24} color="#f7fbfd" style={{ marginLeft: 8 }} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
 
        {/* Follow Up History */}
        <TouchableOpacity
          onPress={handleHistoryToggle}
          className={`bg-river-blue-2 rounded-full px-6 py-3  ${showHistory ? "border border-river-blue-5 mb-4" : "mb-10"}`}
        >
          <View className="flex-row justify-between items-center">
            <Text style={Typography.headline4} className="text-river-blue-5">
              Follow Up History
            </Text>
            <FontAwesome5 name={showHistory ? "chevron-up" : "chevron-down"} size={20} color="#007db6" />
          </View>
        </TouchableOpacity>
 
        {/* History Items */}
        {showHistory && (
          <View className="mb-6">
            {followUpHistory.length > 0 ? (
              followUpHistory.map((item) => {
                // Format the date and time for display
                const { combined: formattedDateTime } = formatFollowUpHistoryDateTime(item.dateTime);
               
                return (
                  <View key={item.id} className="bg-river-blue-2 rounded-2xl p-4 mb-4">
                    <Text style={Typography.copy1} className="text-river-blue-6 mb-4">
                      {leadName}
                    </Text>
 
                    <Divider style={{ backgroundColor: '#61AFD2', height: 1, marginBottom: 8 }} />
 
                    <View className="flex-row justify-between items-center mb-4">
                      <View className="flex-1 items-center">
                        <Text style={Typography.headline6B} className="text-river-blue-6 text-center mb-1">
                          {item.remark}
                        </Text>
                        <Text style={Typography.copy2} className="text-river-blue-5 text-center">
                          Last Follow-Up Remark
                        </Text>
                      </View>
 
                      <View className="w-[1px] h-[80px] bg-river-blue-4 mx-4" />
 
                      <View className="flex-1 items-center">
                        <Text style={Typography.headline6B} className="text-river-blue-6 text-center mb-1">
                          {formattedDateTime}
                        </Text>
                        <Text style={Typography.copy2} className="text-river-blue-5 text-center">
                          Last Follow-Up Date & Time
                        </Text>
                      </View>
                    </View>
 
                    <View className="flex-row justify-between items-center">
                      <Text style={Typography.subline2} className="text-river-blue-6">
                        Follow-Up Type:
                      </Text>
                      <View
                        className="px-4 py-1 rounded-full"
                        style={{ backgroundColor: getFollowUpTypeColor(item.type) }}
                      >
                        <Text style={[Typography.subline2, { color: '#f7fbfd' }]}>
                          {item.type}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View className="bg-river-blue-2 rounded-2xl p-4 mb-4">
                <Text style={Typography.copy1} className="text-river-blue-6 text-center">
                  No follow-up history available
                </Text>
              </View>
            )}
          </View>
        )}
 
        {/* Action Menu with Animated Buttons - Always at the end of ScrollView */}
        <View className="bg-[#F7FBFD] rounded-lg ">
          <View className="gap-2">
            {actionItems.map((item, index) => {
              const bgColor = actionButtonAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: ['#f7fbfd', 'yellow'],
              });
 
              const textColor = actionButtonAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: ['#007db6', '#000000'],
              });
              const isLastItem = index === actionItems.length - 1;
 
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1}
                  onPressIn={() => animatePress(actionButtonAnims[index], 1)}
                  onPressOut={() => animatePress(actionButtonAnims[index], 0)}
                  onPress={() => item.onPress(index)}
                  className={` ${
                    !isLastItem ? 'border-b border-river-blue-3' : ''
                  }`}
                >
                  <Animated.View
                  className={`flex-row justify-between rounded-full items-center py-4 px-4 `}
                  style={{ backgroundColor: bgColor }}
                  >
                    <Animated.Text style={[Typography.copy1, { color: textColor }]}>
                      {item.title}
                    </Animated.Text>
                    <Animated.View>
                      <SideIcon/>
                    </Animated.View>
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
 
      {/* Temperature Update Confirmation Modal */}
      <ConfirmationPopup
        visible={showTemperatureModal}
        onClose={handleCancelTemperatureUpdate}
        onConfirm={handleConfirmTemperatureUpdate}
        title="Do you wish to continue?"
        message="You are about to update the lead temperature to"
        highlightedText={pendingTemperature || ''}
        confirmButtonText="Yes"
        cancelButtonText="No"
        showBlur={true}
      />
    </SafeAreaView>
  );
};
 
const styles = StyleSheet.create({
  boldText: {
    fontWeight: '600',
  },
});
 
export default FollowUpDetailsScreen;
