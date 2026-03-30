import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native';
import HeaderComponent from '@/app/components/AppHeader'; // Adjust import path as needed

import Typography from '@/constants/typography';
import Raiseticket from '@/app/components/raiseticket';
import { ENV } from '@/constants/env';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function RaiseTicket() {
  const [activeTab, setActiveTab] = useState("open");
  const router = useRouter();

  const handleTabClick = (tab:any) => {
    setActiveTab(tab);
  };

  const handleCreateTicket = () => {
    // Handle create ticket functionality
     ENV === 'dev'&&console.log("Create ticket clicked");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFD]">
      <View className="flex-1 bg-[#F7FBFD]">
        {/* Header */}
        <HeaderComponent
          title="My Tickets"
          onBackPress={() => router.back()}
        />

        {/* Tab Navigation */}
        <View className="flex-row items-center justify-center px-6 mt-4 mb-6 gap-4">
          <TouchableOpacity
            onPress={() => handleTabClick("open")}
            className={`flex-1 h-12 rounded-[20px] justify-center items-center ${
              activeTab === "open" ? "bg-river-blue-6" : "bg-river-blue-2"
            }`}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === "open" }}
          >
            <Text
              className={`text-center ${
                activeTab === "open" ? "text-[#F7FBFD]" : "text-river-blue-5"
              }`}
              style={Typography.subline1}
            >
              Open Tickets
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabClick("closed")}
            className={`flex-1 h-10 rounded-[20px] justify-center items-center ${
              activeTab === "closed" ? "bg-river-blue-6" : "bg-river-blue-2"
            }`}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === "closed" }}
          >
            <Text
              className={`text-center ${
                activeTab === "closed" ? "text-[#F7FBFD]" : "text-river-blue-5"
              }`}
              style={Typography.copy1}
            >
              Closed Tickets
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View className="flex-1 px-6">
          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Open Tickets Panel */}
            {activeTab === "open" && (
              <View
                className="flex-1 justify-center items-center"
                accessible={true}
                accessibilityLabel="Open tickets panel"
              >
                <Text 
                  className="text-river-blue-4 text-center px-4 max-w-xs"
                  style={Typography.copy1}
                >
                  You have no open tickets yet!
                </Text>
              </View>
            )}

            {/* Closed Tickets Panel */}
            {activeTab === "closed" && (
              <View
                className="flex-1 justify-center items-center"
                accessible={true}
                accessibilityLabel="Closed tickets panel"
              >
                <Text 
                  className="text-river-blue-4 text-center px-4 max-w-xs"
                  style={Typography.copy1}
                >
                  You have no closed tickets yet!
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Bottom Action Bar */}
        <View className="bg-gradient-to-t from-[#F7FBFD]/80 to-transparent px-6 pt-2 mb-20">
          <View className="bg-gradient-to-t from-[#F7FBFD]/80 to-transparent pb-2">
            <TouchableOpacity
              onPress={handleCreateTicket}
              className="flex-row items-center self-start"
              accessible={true}
              accessibilityLabel="Create new ticket"
              accessibilityRole="button"
            >
              <View className="w-8 h-8 bg-river-blue-6 rounded-2xl justify-center items-center mr-3">
               <Raiseticket/>
              </View>
              
              <Text 
                className="text-river-blue-6"
                style={Typography.subline1}
              >
                Create Ticket
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};