import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  BackHandler,
} from "react-native";
import SearchBar from "@/app/components/HomeScreen/searchinput";
import TimeFilterSelector from "@/app/components/HomeScreen/timefilter";
import { Dropdownsmall } from "@/app/components/inputdropdown2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Typography from "@/constants/typography";
import FollowupCard from "@/app/components/Followup/FoloowupCard";
import HeaderComponent from "@/app/components/AppHeader";
import { router } from "expo-router";
import { ENV } from "@/constants/env";
 
// Define types for better type safety
type LeadTemperature = "Hot" | "Warm" | "Cold";
type OrderStatus = "Booking Call" | "Schedule TR Call" | "Reschedule TR Call";
 
interface FollowupData {
  leadName: string;
  followUpCount: number;
  phoneNumber: string;
  leadTemperature: LeadTemperature;
  lastFollowUpRemark: string;
  upcomingFollowUpDate: string;
  upcomingFollowUpTime: string;
  followUpType: OrderStatus;
  leadId: string;
  followUpId: string;
  oldFollowUps: any[];
}
 
const AllFollowups = () => {
  const [selectedValue, setSelectedValue] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const dropdownOptions = ["All", "Hot", "Warm", "Cold"];
  const [followupData, setFollowupData] = React.useState<FollowupData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastsync, setLastsync] = React.useState<string>("");
 
  // Utility to format date/time
  const formatDateTime = (isoDate: string) => {
    const dateObj = new Date(isoDate);
    const date = dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return { date, time };
  };
 
  const fetchOldFollowupsFromStorage = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
     
      const stored = await AsyncStorage.getItem("oldFollowUps");
       ENV === 'dev'&&console.log("Stored old followups:", stored);
     
      // ✅ FIX: Always reset the state first, then set new data if available
      if (!stored || stored === null || stored === "null") {
         ENV === 'dev'&&console.log("No followups data found, clearing state");
        setFollowupData([]);
        return;
      }
 
      const parsed = JSON.parse(stored);
     
      // ✅ FIX: Check if parsed data is valid array
      if (!Array.isArray(parsed) || parsed.length === 0) {
         ENV === 'dev'&&console.log("Invalid or empty followups data, clearing state");
        setFollowupData([]);
        return;
      }
 
      const normalized = parsed.map((item: any) => {
        const { date, time } = formatDateTime(item.FollowUpDate);
 
        return {
          leadName: item.LeadName,
          followUpCount: 1, // Or derive from OldFollowUps.length?
          phoneNumber: item.LeadPhone,
          leadTemperature: item.LeadTemperature || "Hot",
          lastFollowUpRemark: item.Status || "-",
          upcomingFollowUpDate: date,
          upcomingFollowUpTime: time,
          followUpType: item.FollowUpType || "Booking Call",
          leadId: item.LeadId,
          followUpId: item.FollowUpId,
          oldFollowUps: item.OldFollowUps || []
        };
      });
     
       ENV === 'dev'&&console.log("✅ Loaded old followups:", normalized);
      setFollowupData(normalized);
     
    } catch (err) {
       ENV === 'dev'&&console.error("❌ Error loading old followups:", err);
      // ✅ FIX: On error, clear the state to avoid showing stale data
      setFollowupData([]);
    } finally {
      handleLastsync();
      setLoading(false);
      setRefreshing(false);
    }
  };
 
  const onRefresh = React.useCallback(() => {
    fetchOldFollowupsFromStorage(true);
    handleLastsync();
  }, []);
 
 
  const handleLastsync = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // 0 should be 12
    const timenow = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
    setLastsync(timenow);
  };
 
 
  // ✅ FIX: Clear data when component unmounts or loses focus and gains focus again
  const clearDataOnFocusLoss = React.useCallback(() => {
    return () => {
       ENV === 'dev'&&console.log("Screen losing focus, clearing search state");
      setSearchQuery("");
      setSelectedValue("All");
    };
  }, []);
 
  // Use focus effect to reload every time screen is focused
  useFocusEffect(
    React.useCallback(() => {
       ENV === 'dev'&&console.log("Screen gained focus, fetching data");
      fetchOldFollowupsFromStorage();
      return clearDataOnFocusLoss();
    }, [clearDataOnFocusLoss])
  );
 
  // ✅ FIX: Add a method to force clear data (useful for logout scenarios)
  const clearFollowupData = React.useCallback(() => {
    setFollowupData([]);
    setSearchQuery("");
    setSelectedValue("All");
  }, []);
 
  // Function to check if a date is in the past
  // const isDateInPast = (dateString: string): boolean => {
  //   const [day, monthStr] = dateString.split(" ");
  //   const monthMap: { [key: string]: number } = {
  //     Jan: 0,
  //     Feb: 1,
  //     Mar: 2,
  //     Apr: 3,
  //     May: 4,
  //     Jun: 5,
  //     Jul: 6,
  //     Aug: 7,
  //     Sep: 8,
  //     Oct: 9,
  //     Nov: 10,
  //     Dec: 11,
  //   };
 
  //   const targetDate = new Date(2025, monthMap[monthStr], parseInt(day));
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   return targetDate < today;
  // };
 
  // First filter by past dates only
  // const pastFollowups = followupData.filter((followup) =>
  //   // isDateInPast(followup.upcomingFollowUpDate)
  // );
 
  // Then filter by temperature for total count
  const temperatureFilteredFollowups = followupData.filter(
    (followup) =>
      selectedValue === "All" || followup.leadTemperature === selectedValue
  );
 
  // Finally apply search and temperature filters for displayed items
  const filteredFollowups = followupData.filter((followup) => {
    const matchesSearch =
      searchQuery === "" ||
      followup.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      followup.phoneNumber.includes(searchQuery) ||
      followup.followUpType.toLowerCase().includes(searchQuery.toLowerCase());
 
    const matchesTemperature =
      selectedValue === "All" || followup.leadTemperature === selectedValue;
 
    return matchesSearch && matchesTemperature;
  });
 
  const handleBackPress = () => {
    router.replace('/home');
  };
 
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true;
      };
 
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
 
      return () => subscription.remove();
    }, [])
  );
 
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
 
  const isSearching = searchQuery.trim() !== "";
 
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with back button and title */}
      <HeaderComponent
        title="Overdue Follow-ups"
        onBackPress={handleBackPress}
        showDropdown={true}
        dropdownOptions={dropdownOptions}
        selectedValue={selectedValue}
        onDropdownSelect={(value) => setSelectedValue(value)}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1F8CBF"]} // Android spinner
            tintColor="#1F8CBF" // iOS spinner
            title="Pull to refresh"
            titleColor="#1F8CBF"
          />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search follow-ups"
            value={searchQuery}
          />
        </View>
 
        {/* Time Filter Buttons - Hidden when searching */}
        {!isSearching && (
          <View style={styles.timeFilterContainer}>
            <TimeFilterSelector
              disabled={true}
            />
          </View>
        )}
 
        {/* Items count and sync info */}
        <View style={styles.infoContainer}>
          <Text style={Typography.copy2} className="text-[#1F8CBF]">
            {isSearching
              ? `Found ${filteredFollowups.length} results for "${searchQuery}"`
              : `Showing ${filteredFollowups.length} items of ${temperatureFilteredFollowups.length}`}
          </Text>
          {!isSearching && (
            <Text style={Typography.copy2} className="text-[#1F8CBF]">
          {refreshing ? 'Refreshing...' : `Last sync at ${lastsync}`}
            </Text>
          )}
        </View>
 
        {/* Followup Cards */}
        <View style={styles.cardsContainer}>
          {/* ✅ FIX: Show loading state when loading */}
          {loading ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>Loading...</Text>
            </View>
          ) : filteredFollowups.length > 0 ? (
            filteredFollowups.map((followup, index) => (
              <FollowupCard
                key={`${followup.followUpId}-${index}`} // ✅ Better key
                leadName={followup.leadName}
                followUpCount={followup.followUpCount}
                phoneNumber={followup.phoneNumber}
                leadTemperature={followup.leadTemperature}
                lastFollowUpRemark={followup.lastFollowUpRemark}
                upcomingFollowUpDate={followup.upcomingFollowUpDate}
                upcomingFollowUpTime={followup.upcomingFollowUpTime}
                followUpType={followup.followUpType}
                 isOverdue={true}
                leadId={followup.leadId}
                followupId={followup.followUpId}
                sourceScreen="overdue-followups"
                followupList={followup.oldFollowUps}
              />
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                {isSearching
                  ? `No results found for "${searchQuery}"`
                  : "No overdue followups found"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
 
export default AllFollowups;
 
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7fbfd",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f7fbfd",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: "#2196F3",
    fontWeight: "500",
  },
  headerTitle: {
    color: "#333",
    flex: 1,
    marginLeft: 8,
  },
  headerRight: {
    minWidth: 80,
  },
  container: {
    flex: 1,
    backgroundColor: "#f7fbfd",
  },
  scrollContent: {
    paddingBottom: 34,
  },
  searchContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  timeFilterContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  itemsText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "500",
  },
  syncText: {
    fontSize: 14,
  },
  cardsContainer: {
    gap: 16,
    paddingHorizontal: 16,
  },
  noResultsContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});