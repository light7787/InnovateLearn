import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl, BackHandler } from 'react-native';
import SearchBar from '@/app/components/HomeScreen/searchinput';
import TimeFilterSelector from '@/app/components/HomeScreen/timefilter';
import RetailsDetailsCard from '@/app/components/Retails/RetailsCard';
import HeaderComponent from '@/app/components/AppHeader';
import { router } from 'expo-router';
import Typography from '@/constants/typography';
import { CommonActions, StackActions, useNavigation } from '@react-navigation/native';
import { getValidAccessToken } from '../auth/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { API_BASE, ENV } from '@/constants/env';
 
// Define the OrderStatus type to match the one in RetailsDetailsCard
type OrderStatus = 'PM EDrive Pending' | 'PM EDrive Completed';
 
// Updated interface for retail data to include new fields
interface RetailData {
  orderId: string;
  orderStatus: OrderStatus;
  leadName: string;
  phoneNumber: string;
  remainingAmount?: string;
  purchaseDate?: string;
  rtoRegistrationDate: string | null;
  pmeDrive: boolean;
}
 
const ExpiringPMEDrive = () => {
  const [allRetailsData, setAllRetailsData] = useState<RetailData[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filter, setFilter] = useState('Today');
  const [dateRange, setDateRange] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastsync, setLastsync] = React.useState<string>("");
 
  const navigation = useNavigation();
 
  const handleBackPress = () => {
    navigation.dispatch(StackActions.replace('home', { animation: 'slide_from_left' }));
  };
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
 
  // Map PM EDrive status based only on PME_Drive field
  const mapPmeDriveToOrderStatus = (pmeDrive: boolean): OrderStatus => {
    return pmeDrive ? 'PM EDrive Completed' : 'PM EDrive Pending';
  };
 
  // Cache invalidation function
  const invalidateRetailsCache = async () => {
    try {
      const token = await getValidAccessToken();
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (!userProfile) return;
 
      const { UserId } = JSON.parse(userProfile);
     
      await fetch(`${API_BASE}/api/data/invalidate-cache`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId,
          cacheKey: 'retails'
        }),
      });
     
       ENV === 'dev'&&console.log('🗑️ Retails cache invalidated');
    } catch (error) {
       ENV === 'dev'&&console.error('❌ Failed to invalidate cache:', error);
    }
  };
 
  // Fetch retails function
  const fetchRetails = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        await invalidateRetailsCache();
      } else {
        setLoading(true);
      }
 
      const token = await getValidAccessToken();
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (!userProfile) throw new Error('User profile missing');
 
      const { UserId } = JSON.parse(userProfile);
      const payload: any = { UserId };
 
      if (filter === 'Custom' && dateRange) {
        if (dateRange.specificDate) {
          payload.FilterDate = dateRange.specificDate;
        } else if (dateRange.startDate && dateRange.endDate) {
          payload.FilterDate = dateRange.startDate;
          payload.FilterEndRange = dateRange.endDate;
        } else {
          throw new Error('Invalid custom date range');
        }
      } else {
        payload.FilterDate = filter.toUpperCase();
      }
     
       ENV === 'dev'&&console.log('[📊 EXPIRING PM EDRIVE] Sending payload', payload);
     
      const res = await fetch(`${API_BASE}/api/data/EventBooking`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
 
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API failed: ${errText}`);
      }
 
      const json = await res.json();
       ENV === 'dev'&&console.log('🔄 Expiring PM EDrive API response:', json, res.status, res.statusText);
     
      const apiData = json?.Data || [];
     
       ENV === 'dev'&&console.log('🔍 Expiring PM EDrive data:', apiData);
 
      const normalized = apiData
        .filter((item: any) => {
          // Filter out items that are completely invalid
          return item && (item.LeadName || item.OrdId);
        })
        .map((item: any) => {
          // Only use PME_Drive field to determine status, ignore API Status field
          const mappedStatus = mapPmeDriveToOrderStatus(item.PME_Drive);
 
          return {
            orderId: item.OrdId || item.OrderId || `temp_${Date.now()}_${Math.random()}`,
            orderStatus: mappedStatus,
            leadName: item.LeadName || 'Unknown Lead',
            phoneNumber: item.LeadPhone || 'N/A',
            remainingAmount: '0 INR',
            purchaseDate: item.PurchaseDate,
            rtoRegistrationDate: item.RTORegistrationDate,
            pmeDrive: item.PME_Drive,
          };
        });
 
       ENV === 'dev'&&console.log('🔍 Normalized expiring PM EDrive data:', normalized);
      setAllRetailsData(normalized);
     
      if (isRefresh) {
         ENV === 'dev'&&console.log('✅ Expiring PM EDrive refreshed successfully');
      }
    } catch (err) {
       ENV === 'dev'&&console.error('❌ Failed to fetch expiring PM EDrive:', err);
      setAllRetailsData([]);
    } finally {
      handleLastsync();
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter, dateRange]);
 
  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    fetchRetails(true);
  }, [fetchRetails]);
 
  useEffect(() => {
    fetchRetails(false);
  }, [fetchRetails]);
 
  // Helper function to calculate days left based on RTO registration date
  const calculateItemDaysLeft = (rtoRegistrationDate: string | null): number | null => {
    if (!rtoRegistrationDate) {
      return null;
    }
 
    try {
      const rtoDate = new Date(rtoRegistrationDate);
      const today = new Date();
     
      // Reset time to start of day for accurate calculation
      today.setHours(0, 0, 0, 0);
      rtoDate.setHours(0, 0, 0, 0);
     
      if (isNaN(rtoDate.getTime())) {
        return null;
      }
     
      // Calculate days since RTO registration
      const daysSinceRegistration = Math.floor((today.getTime() - rtoDate.getTime()) / (1000 * 60 * 60 * 24));
     
      // If RTO registration is today (daysSinceRegistration = 0), show 90 days left
      // Then decrease day by day: 90 - daysSinceRegistration
      const daysLeft = Math.max(0, 90 - daysSinceRegistration);
     
      return daysLeft;
    } catch (error) {
       ENV === 'dev'&&console.error('Error calculating days left:', error);
      return null;
    }
  };
 
  // Filter data to only show PM EDrive Pending items with less than 15 days left, then apply search
  const filteredData = allRetailsData
    .filter(item => {
      // Only show PM EDrive Pending items
      if (item.orderStatus !== 'PM EDrive Pending') {
        return false;
      }
     
      // Calculate days left
      const daysLeft = calculateItemDaysLeft(item.rtoRegistrationDate);
     
      // Only show items with less than 15 days left (and valid RTO date)
      return daysLeft !== null && daysLeft < 15;
    })
    .filter(item =>
      searchQuery.trim() === '' ||
      item.leadName.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
 
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
 
  const isSearching = searchQuery.trim() !== '';
 
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with back button and title */}
      <HeaderComponent
        title="Expiring PM EDrive"
        onBackPress={() => router.back()}
        showDropdown={false}
      />
 
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1F8CBF']}
            tintColor="#1F8CBF"
            title="Pull to refresh"
            titleColor="#1F8CBF"
          />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search PM EDrive"
            value={searchQuery}
          />
        </View>
 
        {/* Time Filter - Only show when not searching */}
        {!isSearching && (
          <View style={styles.timeFilterContainer}>
            <TimeFilterSelector onFilterChange={(newFilter, range) => {
              setFilter(newFilter);
              setDateRange(range);
            }}/>
          </View>
        )}
 
        {/* Items count and sync info */}
        <View style={styles.infoContainer}>
          <Text style={Typography.copy2} className='text-river-blue-5'>
            {isSearching
              ? `Found ${filteredData.length} results for "${searchQuery}"`
              : `Total Expiring PM EDrive: ${filteredData.length}`
            }
          </Text>
          <Text style={Typography.copy2} className='text-river-blue-5'>
          {refreshing ? 'Refreshing...' : `Last sync at ${lastsync}`}
          </Text>
        </View>
 
        {loading && !refreshing && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              Loading expiring PM EDrive...
            </Text>
          </View>
        )}
 
        {/* Retail Cards - Only showing PM EDrive Pending items with less than 15 days left */}
        {!loading && (
          <View style={styles.cardsContainer}>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <RetailsDetailsCard
                  key={item.orderId}
                  orderId={item.orderId}
                  orderStatus={item.orderStatus}
                  leadName={item.leadName}
                  phoneNumber={item.phoneNumber}
                  remainingAmount={item.remainingAmount}
                  purchaseDate={item.purchaseDate}
                  rtoRegistrationDate={item.rtoRegistrationDate}
                  pmeDrive={item.pmeDrive}
                />
              ))
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={Typography.copy2} className='text-black'>
                  {isSearching
                    ? `No results found for "${searchQuery}"`
                    : "No PM EDrive items expiring in less than 15 days"
                  }
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
 
export default ExpiringPMEDrive;
 
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7FBFD',
  },
  scrollContent: {
    paddingBottom: 34, // Extra padding for home indicator
  },
  searchContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  timeFilterContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
    paddingHorizontal: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});
 