// 1. FIXED: CompleteTestride.tsx - Navigation to follow-up creation
import React, { useState, useRef, useCallback } from 'react';
import { View, ScrollView, Platform, TouchableOpacity, Animated, BackHandler } from 'react-native';
import { List, Divider } from 'react-native-paper';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter, type Route, router, useLocalSearchParams, useFocusEffect } from 'expo-router';

import TestRideDetailsCard from '@/app/components/TestRide/TestRideCompleted';
import { Text } from 'react-native';
import Typography from '@/constants/typography';
import HeaderComponent from '@/app/components/AppHeader';
import TestRideCard from '@/app/components/TestRide/TestRideOngoing';
import SideIcon from '@/app/components/sideicon';
import { ENV } from '@/constants/env';

export default function CompleteTestride() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // ✅ Extract all test ride data from params passed via splash
  const leadname = params.leadname as string || 'Lead Name';
  const leadId = params.leadId as string;
  const testrideId = params.testrideId as string;
  const phoneNumber = params.phoneNumber as string || '9876543210';
  const testRideType = params.testRideType as string || 'Home Test Ride';
  const scheduledDate = params.scheduledDate as string || '10 May';
  const scheduledTime = params.scheduledTime as string || '10:30 AM';
  const address = params.address as string || 'Store Location';
  const userId = params.userId as string;

  const from = params.from as string;
  const originalSource = params.originalSource as string;

  // Navigation ref to prevent multiple navigations
  const isNavigatingRef = useRef(false);

  // Animation refs for action buttons
  const actionButtonAnims = useRef(
    Array(3).fill(0).map(() => new Animated.Value(0))
  ).current;

  const animatePress = (animValue: Animated.Value, toValue: number, duration: number = 150) => {
    Animated.timing(animValue, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start();
  };

  // ✅ FIXED: Simple navigation to follow-up creation with only required data
  const handleFollowUpWithNavigation = () => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    
     ENV === 'dev'&&console.log('🚀 Navigating to follow-up creation with leadId:', leadId);
    
    // ✅ Pass only essential data that matches API requirements
    router.push({
      pathname: '/follow-ups/create' as any,
      params: {
        leadId: leadId,                    // Required for API
        customerName: leadname,           
        customerPhone: phoneNumber,   
        testrideId,   
        scheduledDate,
        scheduledTime,
        userId,  
        originalSource: 'TestRide',
               
      }
    });
    
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const handleBookNowWithNavigation = () => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    
    // ✅ Navigate to booking creation with test ride data
    router.push({
      pathname: '/bookings/create' as any,
      params: {
        leadname,
        leadId,
        phoneNumber,
        testRideType,
        scheduledDate,
        scheduledTime,
        address,
        userId,
        testrideId,
        from: 'CompletedTestRide'
      }
    });
    
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true; // disables back action
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove(); // ✅ correct cleanup
    }, [])
  );

  const handleDropOutWithNavigation = () => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    
    // ✅ Navigate to dropout with complete test ride data
    router.push({
      pathname: '/dropout' as any,
      params: { 
        from: 'test-rides',
        leadname,
        leadId,
        phoneNumber,
        testRideType,
        scheduledDate,
        scheduledTime,
        address,
        userId,
        testrideId,
        originalSource: 'TestRideComplete'
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
      title: 'Follow-Up',
      onPress: (index: number) => handleActionPress(index, handleFollowUpWithNavigation)
    },
    {
      title: 'Drop Out',
      onPress: (index: number) => handleActionPress(index, handleDropOutWithNavigation)
    },
  ];

  const handleActionPress = (index: number, navigationHandler: () => void) => {
    animatePress(actionButtonAnims[index], 1);
    setTimeout(() => {
      navigationHandler();
      animatePress(actionButtonAnims[index], 0);
    }, 150);
  };

  return (
    <View className="flex-1 bg-[#F7FBFD]">
      {/* <HeaderComponent
        title={`Test Rides: ${leadname}`}
        onBackPress={() => router.back()}
        showDropdown={false}
        noback={true}
      /> */}
        <View className="px-4 pt-12">
          <Text style={Typography.headline4} className="text-xl font-semibold text-river-blue-6">
            Test Rides: {leadname}
          </Text>
        </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ Test Ride Details Card - Now using actual data from params */}
        <View className="mt-4 mb-16">
          <TestRideCard
            leadname={leadname}
            leadId={leadId}
            testrideId={testrideId}
            phoneNumber={phoneNumber}
            testRideType={testRideType}
            scheduledDate={scheduledDate}
            scheduledTime={scheduledTime}
            address={address}
            userId={userId}
            status="completed"
            showActions={true}
            // onCallPress={() =>  ENV === 'dev'&&console.log('Call pressed from complete page')}
            // onWhatsAppPress={() =>  ENV === 'dev'&&console.log('WhatsApp pressed from complete page')}
            // onMapPress={() =>  ENV === 'dev'&&console.log('Map pressed from complete page')}
          />
        </View>

        {/* Action Items with Animation */}
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
    </View>
  );
}