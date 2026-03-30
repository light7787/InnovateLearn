import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Linking,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PrimaryButton } from '@/app/components/button';
import { TextField } from '@/app/components/input';
import Homelogo from '@/app/components/logo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { ENV } from '@/constants/env';

const BASE_URL = 'http://192.168.1.108:3000'; // Replace with your backend URL

const SalesforceLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalesforceLogin = async () => {
    setLoading(true);
    try {
      // 1. Get auth URL from backend
      const authResponse = await fetch(`${BASE_URL}/api/salesforce/auth`);
      const authResponseText = await authResponse.text();
  
      // Check if the response is valid JSON
      let authUrl;
      try {
        const parsedResponse = JSON.parse(authResponseText);
        authUrl = parsedResponse.authUrl;
      } catch (e) {
        ENV === 'dev'&&console.error('Invalid JSON response:', authResponseText);
        throw new Error('Unexpected response from server');
      }
  
      // 2. Open browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        'autocloud://oauth-callback'
      );
  
      if (result.type === 'success') {
        // 3. Extract code from callback URL
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
  
        if (code) {
          // 4. Exchange code for token via backend
          const tokenResponse = await fetch(`${BASE_URL}/api/salesforce/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });
  
          const tokenResponseText = await tokenResponse.text();
  
          // Check if the response is valid JSON
          let tokenData;
          try {
            tokenData = JSON.parse(tokenResponseText);
          } catch (e) {
            ENV === 'dev'&&console.error('Invalid JSON response:', tokenResponseText);
            throw new Error('Unexpected response from server');
          }
  
          const { accessToken, instanceUrl, email } = tokenData;
  
          // 5. Store tokens and navigate
          await AsyncStorage.multiSet([
            ['accessToken', accessToken],
            ['instanceUrl', instanceUrl],
            ['username', email],
          ]);
  
          router.replace('/home');
        }
      }
    } catch (error) {
      ENV === 'dev'&&console.error('Salesforce login error:', error);
      Alert.alert('Login Failed', 'Could not authenticate with Salesforce');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View className="flex-1 justify-between px-6">
        {/* Main form content */}
        <View>
          {/* Logo */}
          <View className="items-center mt-20">
            <Homelogo />
          </View>

          {/* Welcome Text */}
          <View className="mt-20">
            <Text className="text-2xl font-bold text-slate-800">
              Salesforce Login
            </Text>
          </View>

          {/* Form */}
          <View className="mt-4">
            {/* Username */}
            <Text className="text-base leading-6 mt-4 mb-2">Username</Text>
            <TextField
              placeholder="Enter your Salesforce username"
              value={username}
              onChangeText={setUsername}
            />

            {/* Password */}
            <Text className="text-base leading-6 mt-4 mb-2">Password</Text>
            <TextField
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />

            {/* Button */}
            <View className="mt-6 items-end justify-start">
              <PrimaryButton
                title="Login with Salesforce"
                onPress={handleSalesforceLogin}
            
              />
            </View>
          </View>
        </View>

        {/* Bottom Sticky Section */}
        <View className="items-center mb-6">
          <Text className="text-slate-500">
            You'll be redirected to Salesforce for authentication
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SalesforceLogin;