import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Allfollowups = () => {
  return (
    <View>
      <Text>Allfollowups</Text>
    <Link href='/follow-ups/1'> <Text>Follow-up 1</Text></Link> 
    </View>
  )
}

export default Allfollowups

const styles = StyleSheet.create({})