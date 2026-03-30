import Typography from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

const PhotoUpload = () => {
  const PhotoUploadArea = () => (
    <View className="bg-blue-100 rounded-2xl h-44 items-center justify-center">
        <View className='flex-row gap-6'>
      <Octicons name="upload" size={24} color="black" />
      <Feather name="camera" size={24} color="black" />
      </View>
      <Text className="text-blue-600 mt-3 text-center" style={Typography.subline2}>
        Upload or Click Photo
      </Text>
    </View>
  );
  const handleConfirm = () => {
    router.push({
      pathname: '/components/SplashProps', // This should be the route path, not component path
      params: {
        title: "Test Ride Completed",
        subtitle: "Thank you for booking your ride with River Indie.",
        showSubtitle: 'false', // Convert boolean to string for route params
        navigateTo: '/test-rides/complete',
        delay: '2500' // Convert number to string for route params
      }
    });
  };

  return (
    <View className="flex-1 bg-blue-50">
      {/* Header - Empty but keeping space */}
      <View className="h-12 bg-blue-50" />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        {/* Photo Upload Section */}
        <View className="px-6 pt-8">
          {/* Section Title */}
          <Pressable className="flex-row items-center mb-8" onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={24} color="black" />
            <Text className="text-slate-800 ml-3.5" style={Typography.headline4}>
              Photo Upload
            </Text>
          </Pressable>

          {/* Photo Upload Form */}
          <View>
            {/* Upload Photo */}
            <View className="mb-6">
              <Text className="text-slate-800 mb-3" style={Typography.subline1}>
                Upload Home Test Ride Completed Photo
                <Text className="text-red-500"> *</Text>
              </Text>
              <PhotoUploadArea />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button - Fixed at bottom */}
      <View className="absolute bottom-12 left-0 right-0 items-center bg-blue-50 py-4">
        <Button
          mode="contained"
          onPress={handleConfirm}
          buttonColor="#00405D"
          textColor="white"
          className="rounded-full w-56 h-12"
          contentStyle={{  }}
          labelStyle={{
            fontFamily: "Montserrat_500Medium",
            fontSize: 16,
            lineHeight: 24,
            color: 'white',
          }}
        >
          Submit
        </Button>
      </View>
    </View>
  );
};

export default PhotoUpload;