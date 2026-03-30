import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import HeaderComponent from '@/app/components/AppHeader';
import Raiseticket from '@/app/components/raiseticket';
import Typography from '@/constants/typography';
import { ENV } from '@/constants/env';

const Raiseaticket = () => {
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
    <View className="bg-[#F7FBFD] w-full h-full relative">
      {/* Header */}
      <HeaderComponent
        title="My Tickets"
        onBackPress={() => router.back()}
      />

      {/* Tab Navigation */}
      <View className="flex-row w-[342px] items-center gap-4 absolute top-[104px] left-6">
        <TouchableOpacity
          onPress={() => handleTabClick("open")}
          className={`relative flex-1 h-10 rounded-[20px] ${
            activeTab === "open" ? "bg-river-blue-6" : "bg-river-blue-2"
          }`}
          accessible={true}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "open" }}
        >
          <Text
            className={`absolute w-[137px] top-[7px] left-[13px] text-center ${
              activeTab === "open" ? "text-[#F7FBFD]" : "text-river-blue-5"
            }`}
            style={Typography.subline1}
          >
            Open Tickets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTabClick("closed")}
          className={`relative flex-1 h-10 rounded-[20px] ${
            activeTab === "closed" ? "bg-river-blue-6" : "bg-river-blue-2"
          }`}
          accessible={true}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "closed" }}
        >
          <Text
            className={`absolute w-[131px] top-[7px] left-[17px] text-center ${
              activeTab === "closed" ? "text-[#F7FBFD]" : "text-river-blue-5"
            }`}
            style={Typography.copy1}
          >
            Closed Tickets
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView className="pt-[160px] pb-24 flex-1">
        {/* Open Tickets Panel */}
        {activeTab === "open" && (
          <View
            accessible={true}
            // accessibilityRole="tabpanel"
            accessibilityLabel="Open tickets panel"
          >
            <Text 
              className="absolute w-[271px] top-[249px] left-[59px] text-river-blue-4 text-center"
              style={Typography.copy1}
            >
              You have no open tickets yet!
            </Text>
          </View>
        )}

        {/* Closed Tickets Panel */}
        {activeTab === "closed" && (
          <View
            accessible={true}
            // accessibilityRole="tabpanel"
            accessibilityLabel="Closed tickets panel"
          >
            <Text 
              className="absolute w-[271px] top-[249px] left-[59px] text-river-blue-4 text-center"
              style={Typography.copy1}
            >
              You have no closed tickets yet!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute w-full h-24 bottom-0 left-0">
        <View className="absolute w-full h-24 top-0 left-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_100%)]">
          <View className="h-24 bg-[linear-gradient(180deg,rgba(247,251,253,0.8)_21%,rgba(247,251,253,0)_100%)]" />
        </View>

        <TouchableOpacity
          onPress={handleCreateTicket}
          className="absolute w-[149px] h-8 top-4 left-6 rounded-2xl"
          accessible={true}
          accessibilityLabel="Create new ticket"
          accessibilityRole="button"
        >
          <Text 
            className="absolute w-[109px] top-[3px] left-10 text-river-blue-6"
            style={Typography.subline1}
          >
            Create Ticket
          </Text>

          <View className="absolute w-8 h-8 top-0 left-0 bg-river-blue-6 rounded-2xl">
       
            <Raiseaticket/>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
  );
};

export default Raiseaticket;