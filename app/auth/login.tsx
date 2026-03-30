import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PrimaryButton } from '@/app/components/button';
import { TextField } from '@/app/components/input';
import Homelogo from '@/app/components/logo';
import { TermsText } from '@/app/components/terms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modali from '@/app/components/profielicons/modali';
import { ENV } from '@/constants/env';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isLoginValid = username.trim() && password.trim();
  const isRegisterValid =
    username.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    password === confirmPassword;

  const BASE_URL = 'http://192.168.5.82:5000';

  const handleModeSwitch = () => {
    setIsRegisterMode(!isRegisterMode);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async () => {
    const endpoint = isRegisterMode ? '/register' : '/login';
    const payload = { username, password };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Something went wrong');
        return;
      }

      if (!isRegisterMode && data.token) {
        await AsyncStorage.multiSet([
          ['token', data.token],
          ['username', username],
          ['loginFlag', '1'],
        ]);
        ENV === 'dev'&& console.log('✅ Logged in:', username);
        router.replace('/home');
      } else if (isRegisterMode) {
        alert('✅ Account created. Please log in.');
        setIsRegisterMode(false);
      }
    } catch (error) {
      console.error('🚨 Auth error:', error);
      alert('Failed to connect to server');
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
              {isRegisterMode ? 'Create Account' : "Let's Get Started!"}
            </Text>
          </View>

          {/* Form */}
          <View className="mt-4">
            {/* Username */}
            <Text className="text-base leading-6 mt-4 mb-2">Username</Text>
            <TextField
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
            />

            {/* Password */}
<View className="flex-row items-center justify-between mt-4 mb-2">
  <View className="flex-row items-center">
    <Text className="text-base leading-6 text-slate-800">Password</Text>
    {isRegisterMode && (
      <TouchableOpacity onPress={() => setShowPasswordModal(true)} className="ml-2">
        <Modali />
      </TouchableOpacity>
    )}
  </View>
</View>



            <View className="relative">
              <TextField
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            {isRegisterMode && (
              <>
                <Text className="text-base leading-6 mt-4 mb-2">Confirm Password</Text>
                <View className="relative">
                  <TextField
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>
                {confirmPassword.length > 0 && (
                  <Text
                    className={`text-sm mt-1 ${
                      password === confirmPassword ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {password === confirmPassword
                      ? 'Passwords match'
                      : 'Passwords do not match'}
                  </Text>
                )}
              </>
            )}

            {/* Button */}
            <View className="mt-6 items-end justify-start">
              <PrimaryButton
                title={isRegisterMode ? 'Create Account' : 'Proceed'}
                onPress={handleSubmit}
                disabled={isRegisterMode ? !isRegisterValid : !isLoginValid}
              />
            </View>
          </View>
        </View>

        {/* Bottom Sticky Section */}
        <View className="items-center mb-6">
          <TouchableOpacity onPress={handleModeSwitch}>
            <Text className="text-river-blue-5 text-base">
              {isRegisterMode ? 'Already have an account? Sign In' : 'New here ? Create Account'}
            </Text>
          </TouchableOpacity>
          <View className="mt-2">
            <TermsText />
          </View>
        </View>
      </View>

      {/* Password Requirements Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 mx-4 w-80">
            <Text className="text-lg font-bold text-river-blue-5 mb-4">Password Requirements</Text>
            <View className="space-y-2">
              <Text className="text-slate-600">• At least 8 characters long</Text>
              <Text className="text-slate-600">• Contains uppercase and lowercase letters</Text>
              <Text className="text-slate-600">• Includes a number</Text>
              <Text className="text-slate-600">• Has a special character (!@#$%^&*)</Text>
            </View>
            <View className="mt-6 items-center">
              <TouchableOpacity
                className="bg-river-blue-5 px-6 py-3 rounded-lg"
                onPress={() => setShowPasswordModal(false)}
              >
                <Text className="text-white font-semibold">Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LoginScreen;
