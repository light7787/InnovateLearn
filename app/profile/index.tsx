// app/profile.js
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Button, List, Appbar } from 'react-native-paper';
import Viewprofilei from '@/app/components/profielicons/viewprofilei';
import Raiseaticketi from '@/app/components/profielicons/raiseaticeketi';
import Tci from '@/app/components/profielicons/tci';
import Privacyi from '@/app/components/profielicons/privacyi';
import Callsupporti from '@/app/components/profielicons/callsupporti';
import HeaderComponent from '@/app/components/AppHeader';
import Typography from '@/constants/typography';

export default function Profile() {
  const router = useRouter();

  // Navigation ref to prevent multiple navigations
  const isNavigatingRef = useRef(false);

  // type ValidRoutes =
  // | '/profile/Viewprofile'
  // | '/profile/RaiseTicket'
  // | '/profile/Terms'
  // | '/profile/Privacy';

const menuItems = [
  {
    id: 1,
    title: 'View Profile',
    icon: () => <Viewprofilei />, 
    route: '/profile/Viewprofile' , 
  },
  // {
  //   id: 2,
  //   title: 'Raise a Ticket',
  //   icon: () => <Raiseaticketi/>,
  //   route: '/profile/raiseticket' ,
  // },
  {
    id: 3,
    title: 'Terms & Conditions',
    icon: () => <Tci/>,
    route: '/auth/terms' ,
  },
  {
    id: 4,
    title: 'Privacy Policy',
    icon: () => <Privacyi/>,
    route: '/auth/privacy' ,
  },
] as const;

  // Navigation handlers with ref protection
  const handleViewProfileWithNavigation = () => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    
    // Navigate to view profile
    router.push('/profile/Viewprofile' as any);
    
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  // const handleRaiseTicketWithNavigation = () => {
  //   if (isNavigatingRef.current) return;
    
  //   isNavigatingRef.current = true;
    
  //   // Navigate to raise ticket
  //   router.push('/profile/raiseticket' as any);
    
  //   setTimeout(() => {
  //     isNavigatingRef.current = false;
  //   }, 1000);
  // };

  const handleTermsWithNavigation = () => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    
    // Navigate to terms
    router.push('/auth/terms' as any);
    
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const handlePrivacyWithNavigation = () => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    
    // Navigate to privacy
    router.push('/auth/privacy' as any);
    
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const handleCallSupportWithNavigation = () => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    
    // Call the original handler
    handleCallSupport();
    
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const handleEmailSupportWithNavigation = () => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    
    // Call the original handler
    handleEmailSupport();
    
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  // Map menu items to their navigation handlers
  const getNavigationHandler = (route: string) => {
    switch (route) {
      case '/profile/Viewprofile':
        return handleViewProfileWithNavigation;
      // case '/profile/raiseticket':
      //   return handleRaiseTicketWithNavigation;
      case '/auth/terms':
        return handleTermsWithNavigation;
      case '/auth/privacy':
        return handlePrivacyWithNavigation;
      default:
        return () => {};
    }
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleChatWithUs = () => {
    alert('Chat feature would open here');
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@ridedriver.com');
  };

  const handleMenuItemPress = (route: string) => {
    const navigationHandler = getNavigationHandler(route);
    navigationHandler();
  };

  return (
    <SafeAreaView className="flex-1 bg-river-blue-1 relative">
      <View className="flex-1 bg-river-blue-1">
        {/* Header */}
        <HeaderComponent
          title="Profile"
          onBackPress={() => router.back()}
        />

        {/* Menu Items - Matching Figma Layout */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          {menuItems.map((item, index) => (
            <View key={item.id} style={{ marginBottom: 24 }}>
              <TouchableOpacity
                onPress={() => handleMenuItemPress(item.route)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 16,
                  // paddingVertical: 8,
                }}
                accessibilityLabel={item.title}
                accessibilityRole="button"
              >
                {/* Icon Container - Fixed 24x24 size like Figma */}
                <View style={{ 
                  width: 24, 
                  height: 24, 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <item.icon />
                </View>
                
                {/* Label */}
                <Text 
                  style={[
                    Typography.copy1, 
                    { 
                      color: '#007DB6', 
                      
                    }
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Fixed Support Section at bottom */}
      <View className="px-4 border-river-blue-5 bg-river-blue-1 mb-20">
        <View className="flex-row justify-between mb-4">
          <Button
            mode="outlined"
            onPress={handleCallSupportWithNavigation}
            icon={() => <Callsupporti />}
            className="flex-1 mr-2"
            buttonColor="white"
            labelStyle={Typography.subline2}
            textColor="#007DB6"
            contentStyle={{ paddingVertical: 8 }}
            style={{ borderRadius: 30, borderColor: '#007DB6' }}
          >
            Call Support
          </Button>
        </View>
        
        <TouchableOpacity onPress={handleEmailSupportWithNavigation} className="items-center">
          <Text className="text-river-blue-5 text-sm" style={Typography.status}>
            support@ridedriver.com
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}