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
import { getMasters } from '../services/master.service';
import { loginUser } from '../services/auth.service';

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
  if (isRegisterMode) return;

  try {
    const responseData = await loginUser({ username, password });

    // 👇 now same flow continues
    const masters = await getMasters({
      username,
      dealerCode: responseData.dealer?.dealerCode,
      token: responseData.authToken,
    });

    await AsyncStorage.setItem('masters', JSON.stringify(masters));

    router.replace('/home');

  } catch (error: any) {
    alert(error.message || 'Login failed');
  }
};

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View className="flex-1 justify-between px-6">
        <View>
          <View className="items-center mt-20">
            <Homelogo />
          </View>

          <View className="mt-20">
            <Text className="text-2xl font-bold text-slate-800">
              {isRegisterMode ? 'Create Account' : "Let's Get Started!"}
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-base mt-4 mb-2">Username</Text>
            <TextField
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
            />

            <View className="flex-row items-center mt-4 mb-2">
              <Text>Password</Text>
            </View>

            <View className="relative">
              <TextField
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="absolute right-3 top-1/2"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                />
              </TouchableOpacity>
            </View>

            <View className="mt-6 items-end">
              <PrimaryButton
                title="Proceed"
                onPress={handleSubmit}
                disabled={!isLoginValid}
              />
            </View>
          </View>
        </View>

        <View className="items-center mb-6">
          <TouchableOpacity onPress={handleModeSwitch}>
            <Text className="text-blue-500">
              New here? Create Account
            </Text>
          </TouchableOpacity>
          <View className="mt-2">
            <TermsText />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;