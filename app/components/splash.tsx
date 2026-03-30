import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '@/constants/env';
export default function Splash() {
  const router = useRouter();


  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.replace('/auth/login');
  //   }, 2500);

  //   return () => clearTimeout(timer);
  // }, [router]);

useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      setTimeout(() => {
        if (token) {
          router.replace('/home');
        } else {
          router.replace('/auth/login');
        }
      }, 1500);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.replace('/auth/login');
    }
  };

  checkLoginStatus();
}, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/river.gif')}
        style={styles.image}
        contentFit="cover"
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', // center vertically
    alignItems: 'center',     // center horizontally
  },
  image: {
    width: 250,   // set your desired width
    height: 250,  // set your desired height
    borderRadius: 16, // optional: rounded corners
  },
});