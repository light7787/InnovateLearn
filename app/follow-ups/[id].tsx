import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const FollowupsDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View>
      <Text>FollowupsDetails {id}</Text>
    </View>
  )
}

export default FollowupsDetails

const styles = StyleSheet.create({})