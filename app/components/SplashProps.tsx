import Typography from '@/constants/typography';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text,View, ImageSourcePropType ,BackHandler} from 'react-native';
import { useRootNavigationState } from 'expo-router';
 import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ENV } from '@/constants/env';
 
interface SplashProps {
  title?: string;
  subtitle?: string;
  showSubtitle?: boolean | string;
  navigateTo?: string;
  delay?: number | string;
  imageSource?: ImageSourcePropType;
  comingFrom?: string;
  originalSource?: string;
}
 
export default function Splash({
  title = "TestRide Completed",
  subtitle = "You can see your updated list in Test Rides",
  showSubtitle = false,
  navigateTo = '/test-rides/complete',
  delay = 2500,
  imageSource = require('../../assets/create.gif'),
  comingFrom = 'Splash',
  originalSource = ''
}: SplashProps) {
  const router = useRouter();
  const navigationState = useRootNavigationState();
 
  const params = useLocalSearchParams();
 ENV === 'dev'&&console.log('📥 Incoming Splash Params:', params)
  // Use params if available, otherwise use props
  const finalTitle = params.title as string || title;
  const finalSubtitle = params.subtitle as string || subtitle;
  const finalNavigateTo = params.navigateTo as string || navigateTo;
 
  // Handle showSubtitle from params or props
  const paramShowSubtitle = params.showSubtitle as string;
  const finalShowSubtitle = paramShowSubtitle
    ? paramShowSubtitle === 'true'
    : (typeof showSubtitle === 'string' ? showSubtitle === 'true' : showSubtitle);
 
  // Handle delay from params or props
  const paramDelay = params.delay as string;
  const comingfrom = params.comingFrom as string;
 
  // ✅ Extract ALL test ride data from params for complete forwarding
  const paramOriginalSource = params.originalSource as string;
  const finalOriginalSource = paramOriginalSource || originalSource;
  const leadId = params.leadId as string;
  const leadname = params.leadname as string;
  const testrideId = params.testrideId as string;
  const phoneNumber = params.phoneNumber as string;
  const testRideType = params.testRideType as string;
  const scheduledDate = params.scheduledDate as string;
  const scheduledTime = params.scheduledTime as string;
  const email = params.email as string;
  const pincode = params.pincode as string;
 
  const address = params.address as string;
  const userId = params.userId as string;
  const from = params.from as string;
    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => true; // disables back action
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove(); // ✅ correct cleanup
      }, [])
    );
 
  const finalDelay = paramDelay
    ? parseInt(paramDelay)
    : (typeof delay === 'string' ? parseInt(delay) : delay);
 
  useEffect(() => {
      if (!navigationState || navigationState.key == null) return;
    const timer = setTimeout(() => {
      // ✅ Enhanced navigation logic with complete data forwarding
      if (finalNavigateTo === '/test-rides/details' && finalOriginalSource === 'Enquiry' && leadId) {
        // Navigate to test ride details from enquiry
        router.replace({
          pathname: finalNavigateTo as any,
          params: {
            from: finalOriginalSource,
            leadId: leadId,
            fetchFromAPI: 'true',
          }
        });
      } else if (finalNavigateTo === '/test-rides/ongoing' && from === 'Documents') {
        // Navigate to ongoing page with all test ride data
        router.replace({
          pathname: finalNavigateTo as any,
          params: {
            leadname,
            leadId,
            testrideId,
            phoneNumber,
            testRideType,
            scheduledDate,
            scheduledTime,
            address,
            userId,
            from: 'Documents'
          }
        });
      } else if (finalNavigateTo === '/test-rides/complete') {
        // ✅ NEW: Navigate to complete page with ALL test ride data
        router.replace({
          pathname: finalNavigateTo as any,
          params: {
            // Pass all the test ride data to complete page
            leadname: leadname || 'Lead Name',
            leadId: leadId || '',
            testrideId: testrideId || '',
            phoneNumber: phoneNumber || '9876543210',
            testRideType: testRideType || 'Home Test Ride',
            scheduledDate: scheduledDate || '10 May',
            scheduledTime: scheduledTime || '10:30 AM',
            address: address || 'Store Location',
            userId: userId || '',
            from: 'TestRideCompleted', // Indicates this came from completed test ride
            originalSource: finalOriginalSource
          }
        });
      }else if (finalNavigateTo === '/bookings/create') {
  router.replace({
    pathname: finalNavigateTo as any,
    params: {
      leadId,
      leadname,
      phoneNumber,
      email,
      pincode,
      from: finalOriginalSource || comingfrom || 'Splash',
    }
  }) }
      else if (finalOriginalSource) {
        // For other navigation cases with original source
        router.replace({
          pathname: finalNavigateTo as any,
          params: {
            from: finalOriginalSource,
            // Include test ride data if available
             ...(leadId && { leadId }),
             ...(phoneNumber && { phoneNumber }),
            ...(leadname && { leadname }),
           
            ...(testrideId && { testrideId }),
           
            ...(testRideType && { testRideType }),
            ...(scheduledDate && { scheduledDate }),
            ...(scheduledTime && { scheduledTime }),
            ...(address && { address }),
            ...(userId && { userId }),
          }
        });
      } else {
        // Default navigation
        router.replace(finalNavigateTo as any);
       
      }
    }, finalDelay);
 
    return () => clearTimeout(timer);
  }, [  navigationState,
    router,
    finalNavigateTo,
    finalDelay,
    finalOriginalSource,
    leadId,
    leadname,
    testrideId,
    phoneNumber,
    testRideType,
    scheduledDate,
    scheduledTime,
    address,
    userId,
    from
  ]);
 
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={imageSource}
          style={styles.image}
          contentFit="cover"
          resizeMode="cover"
        />
        <Text className='text-river-blue-6 text-center mb-4' style={Typography.headline5}>
          {finalTitle}
        </Text>
      </View>
      {finalShowSubtitle && (
        <Text className='text-river-blue-5 text-center px-4' style={Typography.copy2}>
          {finalSubtitle}
        </Text>
      )}
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 16,
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});