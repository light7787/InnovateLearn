import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Allleads = () => {
  return (
    <View>
      <Text>All leads</Text>
      <Link href='/leads/1'><Text> Lead no 1</Text></Link>
    </View>
  )
}

export default Allleads

const styles = StyleSheet.create({})