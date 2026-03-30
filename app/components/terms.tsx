import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';

export const TermsText = () => (
  <View className="w-[270px] h-[18px] justify-center items-center mt-6">
    <Text className="text-[14px] text-river-blue-5 text-center leading-5 font-normal">
      By continuing, you agree to{' '}
      <Text
        className="underline font-medium text-[#007DB6]"
        onPress={() => router.push('/auth/terms')}
      >
        T&C
      </Text>
      {' '} & {' '}
      <Text
        className="underline font-medium text-[#007DB6]"
        onPress={() => router.push('/auth/privacy')}
      >
        Privacy Policy
      </Text>
    </Text>
  </View>
);