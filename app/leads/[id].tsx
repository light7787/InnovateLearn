import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { ENV } from '@/constants/env';
const Index = () => {
  const { id } = useLocalSearchParams();
   ENV === 'dev'&&console.log(id);

  return (
    <View>
      <Text>{id}</Text>
    </View>
  )
}


export default Index

const styles = StyleSheet.create({})