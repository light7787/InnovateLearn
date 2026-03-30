import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native';
import HeaderComponent from '@/app/components/AppHeader';
import ConfirmationPopup from '@/app/components/confirmationmodal';
import Typography from '@/constants/typography';
import { getValidAccessToken } from '../auth/auth.service';
import { ENV } from '@/constants/env';

const ProfileDetailsScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

type UserProfile = {
  StoreName: string;
  StorePhone: string;
  UserDesignation: string | null;
  UserEmail: string;
  UserId: string;
  UserName: string;
  UserPhone: string;
};

  const [user, setUser] = useState<UserProfile | null>(null);
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const instanceUrl = await AsyncStorage.getItem('instanceUrl');
      const accessToken = await AsyncStorage.getItem('accessToken');
      
      await AsyncStorage.multiRemove([
        'token', 
        'username', 
        'userProfile', 
        'loginFlag',
        'accessToken',
        'instanceUrl'
      ]);
      
      if (instanceUrl && accessToken) {
        try {
          await fetch(`${instanceUrl}/services/oauth2/revoke`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `token=${accessToken}`,
          });
        } catch (error) {
           ENV === 'dev'&&console.error('Token revocation failed:', error);
        }
      }
      
      router.replace('/auth/webviewlogin');
    } catch (error) {
       ENV === 'dev'&&console.error('Logout failed:', error);
      try {
        await AsyncStorage.clear();
        router.replace('/auth/webviewlogin');
      } catch (clearError) {
         ENV === 'dev'&&console.error('Storage clear failed:', clearError);
        router.replace('/auth/webviewlogin');
      }
    }
  };

  const handleLogoutPress = () => {
    setShowLogoutPopup(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutPopup(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  
  useEffect(() => {
  const loadUserProfile = async () => {
    try {
      const cachedProfile = await AsyncStorage.getItem('userProfile');

      if (cachedProfile) {
        const parsed = JSON.parse(cachedProfile);
        setUser(parsed);
         ENV === 'dev'&&console.log('[🧠 Cache Hit] Loaded user profile from storage');
        setLoading(false); // Done, don't hit API
        return;
      }

       ENV === 'dev'&&console.log('[🌐 Cache Miss] Fetching user profile from API');
    } catch (error) {
       ENV === 'dev'&&console.error('Error loading cached profile:', error);
      // Even if cache fails, try fetching from API
    
    }
  };

  loadUserProfile();
}, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFD]">
      <HeaderComponent
        title="Profile Details"
        onBackPress={() => router.back()}
      />

      {loading ? (
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#007DB6" />
        </View>
      ) : (
        user && (
          <ScrollView className="flex-1 bg-[#F7FBFD] px-5 pt-5">
            <View className="bg-[#DEEEF6] rounded-2xl px-6 pt-6 mb-6 ">
              {/* Profile Info Rows - Aligned */}
              <View className="flex-row items-center mb-4">
                <Text className="text-river-blue-6 w-32" style={Typography.copy2}>Name</Text>
                <Text className="text-river-blue-6 flex-1 ml-4" style={Typography.subline2}>{user.UserName}</Text>
              </View>

              <View className="flex-row items-center mb-4">
                <Text className="text-river-blue-6 w-32" style={Typography.copy2}>Designation</Text>
                <Text className="text-river-blue-6 flex-1 ml-4" style={Typography.subline2}>{`${user.UserDesignation?user.UserDesignation:"Product Specialist"}`}</Text>
              </View>

              <View className="flex-row items-center mb-4">
                <Text className="text-river-blue-6 w-32" style={Typography.copy2}>Store Name</Text>
                <Text className="text-river-blue-6 flex-1 ml-4" style={Typography.subline2}>{user.StoreName}</Text>
              </View>

              <View className="flex-row items-center mb-4">
                <Text className="text-river-blue-6 w-32" style={Typography.copy2}>Store Phone No.</Text>
                <Text className="text-river-blue-6 flex-1 ml-4" style={Typography.subline2}>{user.StorePhone}</Text>
              </View>

              <View className="border-t border-[#61AFD2] mb-4" />
              
              {/* ID Section - Perfectly Aligned */}
              <View className="flex-row items-center ">
                <Text className="text-river-blue-6 w-28" style={Typography.headline5}>ID</Text>
                <Text className="text-river-blue-6 flex-1 ml-4" style={Typography.headline3B}>{user.UserId}</Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-river-blue-6" style={Typography.subline1}>Email</Text>
              <Text
                className="text-river-blue-5 mt-1" 
                style={Typography.copy1}
                onPress={() => Linking.openURL(`mailto:${user.UserEmail}`)}
              >
                {user.UserEmail}
              </Text>
              <View className="border-b border-[#D6EAF8] mt-2" />
            </View>

            <View className="mb-8">
              <Text className="text-river-blue-6" style={Typography.subline1}>Phone number</Text>
              <Text
                className="text-river-blue-5 mt-1"
                style={Typography.copy1}
                onPress={() => Linking.openURL(`tel:${user.UserPhone}`)}
              >
                {user.UserPhone}
              </Text>
              <View className="border-b border-[#D6EAF8] mt-2" />
            </View>

            <TouchableOpacity className="mb-10" onPress={handleLogoutPress}>
              <Text className="text-river-red-4" style={Typography.subline1}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        )
      )}

      <ConfirmationPopup
        visible={showLogoutPopup}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Do you wish to continue ?"
        message="You are about to logout of the application."
        confirmButtonText="Yes"
        cancelButtonText="No"
        showBlur={true}
      />
    </SafeAreaView>
  );
};

export default ProfileDetailsScreen;