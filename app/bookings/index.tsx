import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  RefreshControl,
  ActivityIndicator,
  BackHandler,
  Alert 
} from 'react-native';
import SearchBar from '@/app/components/HomeScreen/searchinput';
import TimeFilterSelector from '@/app/components/HomeScreen/timefilter';
import { Dropdownsmall } from '@/app/components/inputdropdown2';

import Typography from '@/constants/typography';
import TestRideDetailsCard from '@/app/components/Bookings/BookingCard';
import HeaderComponent from '@/app/components/AppHeader';
import { router, useFocusEffect } from 'expo-router';
import { CommonActions, StackActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValidAccessToken } from '../auth/auth.service';
import { API_BASE, ENV } from '@/constants/env';
import { useLocalSearchParams } from 'expo-router';
import { useTimeFilter } from '../timefiltercontext';

// Import global search function
import { performUnifiedSearch } from '@/app/components/TestRide/globalSearch';
import { RelativePathString } from 'expo-router';

const statusMap: Record<string, string> = {
  "Draft": "Booking Confirmed",
  "Activated": "Booking Confirmed",
  "Processing": "Booking Confirmed",
  "Payment Pending": "Payment Pending",
  "Payment and Allocation":"	Payment Pending",
  "Booking":"Booking Confirmed",
  "Allotment in Process": "RTO Registration in Process",
  "Pre Invoice": "Invoicing",
  "Invoice and Insurance":"Invoicing",
  "RTO Registration": "RTO Registration in Process",
  "Ready For Delivery": "Ready for Delivery"
  // "Vehicle Delivered": "Delivered",
  // "Order Cancelled": "Cancelled"
};

type DateRange = {
  startDate: string | null;
  endDate: string | null;
  specificDate: string | null;
  type: 'specific' | 'flexible';
};

interface SearchResultData {
  results: any[];
  totalCount: number;
  bestMatch: any;
}

interface BookingData {
  OrderId: string;
  OrdId: string;
  Status: string;
  LeadName: string;
  RemainingAmount: number;
  LeadPhone: string;
  comments: any[];
}

const AllBookings = () => {
  // Get search params from navigation
  const { 
    searchQuery: initialSearchQuery, 
    enableSearch, 
    searchResults: searchResultsString 
  } = useLocalSearchParams();

  const [bookings, setBookings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(
    typeof initialSearchQuery === 'string' ? initialSearchQuery : ''
  );
  const [filter, setFilter] = useState('Today');
  const [originalFilter, setOriginalFilter] = useState('Today'); // Store original filter
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [originalDateRange, setOriginalDateRange] = useState<DateRange | undefined>(undefined); // Store original date range
  const [isInitialized, setIsInitialized] = useState(false); // Track if original values are set
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastsync, setLastsync] = useState<string>('');
  const [isSearchMode, setIsSearchMode] = useState(enableSearch === 'true');
  const [searchResults, setSearchResults] = useState<SearchResultData | null>(null);
  const [preloadedData, setPreloadedData] = useState<BookingData[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { resetToDashboard } = useTimeFilter();
  
  // Global search states
  const [isSearching, setIsSearching] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const isNavigatingRef = React.useRef(false);

  const navigation = useNavigation();
  const isLocalSearching = searchQuery.trim() !== '';

  const handleLastsync = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // 0 should be 12
    const timenow = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    setLastsync(timenow);
  }

  const handleBackPress = async() => {
    navigation.dispatch(StackActions.replace('home', { animation: 'slide_from_left' }));
    await resetToDashboard();
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

  // Process search results for bookings
  const processSearchResultsForBookings = (searchData: any[]): BookingData[] => {
    return searchData
      .filter((item) => {
        return item && item.OrderId && item.LeadName;
      })
      .map((item) => ({
        OrderId: item.OrderId,
        OrdId: item.OrdId || item.OrderId,
        Status: statusMap[item.Status] || item.Status || 'Pending',
        LeadName: item.LeadName,
        RemainingAmount: item.RemainingAmount || 0,
        LeadPhone: item.LeadPhone || 'N/A',
        comments: item.comments || []
      }));
  };

  // Global search navigation handler
  const handleGlobalSearchNavigation = async (query: string) => {
    if (isNavigatingRef.current || !query.trim()) return;

    setIsSearching(true);
    setShowNoResults(false);

    try {
      const searchResults = await performUnifiedSearch(query.trim());
     
      if (searchResults.totalCount === 0) {
        // No results found
        setShowNoResults(true);
        setIsSearching(false);
        
        // Hide the message after 3 seconds
        setTimeout(() => {
          setShowNoResults(false);
        }, 3000);
        
        return;
      }

      // Results found - check if we have booking results
      const bookingResult = searchResults.results.find((r: any) => r.type === 'booking');
      
      if (bookingResult && bookingResult.data && bookingResult.data.length > 0) {
        // We have booking results, show them in current screen
         ENV === 'dev'&&console.log('[🔍 GLOBAL SEARCH] Processing booking results:', bookingResult.data);
        const processedData = processSearchResultsForBookings(bookingResult.data);
        setPreloadedData(processedData);
        setBookings(processedData);
        setIsSearchMode(true);
        setLoading(false);
      } else {
        // No booking results, but other results exist - navigate to best match
        const bestMatch = searchResults.bestMatch;
        if (bestMatch && bestMatch.type !== 'booking') {
          isNavigatingRef.current = true;

          let routePath = '';
          switch (bestMatch.type) {
            case 'testride':
              routePath = '/test-rides';
              break;
            case 'followup':
              routePath = '/follow-ups';
              break;
            case 'retail':
              routePath = '/retails';
              break;
            default:
              routePath = '/bookings';
          }

          router.push({
            pathname: routePath as RelativePathString,
            params: {
              searchQuery: query,
              enableSearch: 'true',
              searchResults: JSON.stringify(searchResults)
            }
          });
         
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 1000);
        } else {
          // Show no results for bookings specifically
          setShowNoResults(true);
          setTimeout(() => {
            setShowNoResults(false);
          }, 3000);
        }
      }

    } catch (error) {
       ENV === 'dev'&&console.error('Global search error:', error);
      Alert.alert('Search Error', 'Failed to perform search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Search text change handler with debouncing
  const handleSearchTextChange = (text: string) => {
    setSearchQuery(text);
    setShowNoResults(false);
  
    if (text.trim() === '') {
      // Clear search - reset to original state or Today if not set
      setIsSearchMode(false);
      setPreloadedData([]);
      setBookings([]);
      
      const resetFilter = isInitialized ? originalFilter : 'Today';
      const resetDateRange = isInitialized ? originalDateRange : undefined;
      
      setFilter(resetFilter);
      setDateRange(resetDateRange);
      
      // Clear debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      // Fetch with reset filter
      fetchBookingsWithFilter(resetFilter, resetDateRange, false);
      return;
    }
  
    // 🔥 Debounce global search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  
    debounceRef.current = setTimeout(() => {
      handleGlobalSearchNavigation(text);
    }, 500);
  };

  // Handle search results from navigation params
  useEffect(() => {
    if (searchResultsString && typeof searchResultsString === 'string') {
      try {
        const parsed = JSON.parse(searchResultsString);
        setSearchResults(parsed);
        
        // Find booking data from search results
        const bookingResult = parsed.results.find((r: any) => r.type === 'booking');
        
        if (bookingResult && bookingResult.data) {
           ENV === 'dev'&&console.log('[🔍 BOOKINGS] Processing search results:', bookingResult.data);
          const processedData = processSearchResultsForBookings(bookingResult.data);
          setPreloadedData(processedData);
          setBookings(processedData);
          setIsSearchMode(true); // Set search mode when we have search results
          setLoading(false);
        } else {
          // No booking results found in search
           ENV === 'dev'&&console.log('[🔍 BOOKINGS] No booking results in search data');
          setPreloadedData([]);
          setBookings([]);
          setIsSearchMode(true);
          setLoading(false);
        }
      } catch (error) {
         ENV === 'dev'&&console.error('[🔍 BOOKINGS] Failed to parse search results:', error);
        // Fall back to normal mode
        setIsSearchMode(false);
        setFilter('Today');
        setDateRange(undefined);
        fetchBookingsWithFilter('Today', undefined, false);
      }
    }
  }, [searchResultsString]);

  // Cache invalidation function for bookings
  const invalidateBookingsCache = async () => {
    try {
      const token = await getValidAccessToken();
      const profile = await AsyncStorage.getItem('userProfile');
      if (!profile) return;

      const { UserId } = JSON.parse(profile);
      
      // Call the cache invalidation endpoint
      await fetch(`${API_BASE}/api/data/invalidate-cache`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId,
          cacheKey: 'bookings'
        }),
      });
      
       ENV === 'dev'&&console.log('🗑️ Bookings cache invalidated');
    } catch (error) {
       ENV === 'dev'&&console.error('❌ Failed to invalidate bookings cache:', error);
    }
  };

  // Separate fetch function that accepts filter parameters
  const fetchBookingsWithFilter = async (filterValue: string, dateRangeValue: DateRange | undefined, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        await invalidateBookingsCache();
      } else {
        setLoading(true);
      }

      const token = await getValidAccessToken();
      const profile = await AsyncStorage.getItem('userProfile');
      if (!profile) throw new Error('User not found');

      const { UserId } = JSON.parse(profile);
      const payload: any = { UserId };

      // Apply date filtering based on provided parameters
      if (filterValue === 'Custom' && dateRangeValue) {
        if (dateRangeValue.specificDate) {
          payload.FilterDate = dateRangeValue.specificDate;
        } else if (dateRangeValue.startDate && dateRangeValue.endDate) {
          payload.FilterDate = dateRangeValue.startDate;
          payload.FilterEndRange = dateRangeValue.endDate;
        } else {
          throw new Error('Invalid custom date range');
        }
      } else {
        payload.FilterDate = filterValue.toUpperCase();
      }

       ENV === 'dev'&&console.log('🚀 Fetching bookings with payload:', payload);

      const res = await fetch(`${API_BASE}/api/data/EventClosedOppAndOrder`, {
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
       ENV === 'dev'&&console.log('🚀 Bookings API response:', json, res.status, res.statusText);

      const normalized = (json?.Data || [])
        .filter((d: any) => d?.OrderId)
        .map((d: any) => ({
          ...d,
          Status: statusMap[d.Status] || d.Status || "Pending"
        }));

      setBookings(normalized);

      if (isRefresh) {
         ENV === 'dev'&&console.log('✅ Bookings refreshed successfully');
      }
    } catch (err) {
       ENV === 'dev'&&console.error('❌ Booking fetch error:', err);
      setBookings([]);
    } finally {
      handleLastsync();
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Main fetch bookings function
  const fetchBookings = useCallback(async (isRefresh = false) => {
    // If we're in search mode and have preloaded data, use it instead of fetching
    if (isSearchMode && preloadedData.length > 0 && !isRefresh) {
       ENV === 'dev'&&console.log('[🔍 BOOKINGS] Using preloaded search data');
      setBookings(preloadedData);
      setLoading(false);
      return;
    }

    // If we're in search mode but don't have preloaded data, don't fetch with date filters
    if (isSearchMode && !isRefresh) {
       ENV === 'dev'&&console.log('[🔍 BOOKINGS] In search mode but no preloaded data, skipping fetch');
      setBookings([]);
      setLoading(false);
      return;
    }

    // Use current filter and dateRange for normal fetching
    await fetchBookingsWithFilter(filter, dateRange, isRefresh);
  }, [filter, dateRange, isSearchMode, preloadedData]);

  useEffect(() => {
    // Only fetch when not in search mode
    if (!isSearchMode) {
      fetchBookings(false);
    }
  }, [fetchBookings, isSearchMode]);

  // Pull to refresh handler - modified to handle search mode
  const onRefresh = useCallback(() => {
    if (isSearchMode) {
      // In search mode, refresh with original filter to get back to normal state
      setIsSearchMode(false);
      setPreloadedData([]);
      setSearchQuery('');
      
      const resetFilter = isInitialized ? originalFilter : 'Today';
      const resetDateRange = isInitialized ? originalDateRange : undefined;
      
      setFilter(resetFilter);
      setDateRange(resetDateRange);
      fetchBookingsWithFilter(resetFilter, resetDateRange, true);
    } else {
      // Normal refresh
      fetchBookings(true);
    }
  }, [isSearchMode, originalFilter, originalDateRange, isInitialized, fetchBookings]);

  useEffect(() => {
    if (isSearchMode && preloadedData.length > 0) {
      setBookings(preloadedData);
      setLoading(false);
    }
  }, [isSearchMode, preloadedData]);

  // Handle filter changes - store original values
  const handleFilterChange = (newFilter: string, range: DateRange | undefined) => {
    // Store original values when first changing from default or when not initialized
    if (!isInitialized) {
      setOriginalFilter(newFilter);
      setOriginalDateRange(range);
      setIsInitialized(true);
    }
    
    setFilter(newFilter);
    setDateRange(range);
  };

  // Initialize original values on first load
  useEffect(() => {
    if (!isInitialized && !isSearchMode) {
      setOriginalFilter('Today');
      setOriginalDateRange(undefined);
      setIsInitialized(true);
    }
  }, [isInitialized, isSearchMode]);

  useEffect(() => {
    // Fetch data when filter or dateRange changes, but only if not in search mode
    if (!isSearchMode && !isLocalSearching) {
      fetchBookings(false);
    }
  }, [filter, dateRange]);

  // Search and filter logic
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchQuery === '' ||
      booking.LeadName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.LeadPhone?.includes(searchQuery) ||
      booking.Status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.OrdId?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with back button and title */}
      <HeaderComponent
        title="Bookings"
        onBackPress={handleBackPress}
      />

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1F8CBF']} // Android
            tintColor="#1F8CBF" // iOS
            title="Pull to refresh"
            titleColor="#1F8CBF"
          />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar 
            onSearch={handleGlobalSearchNavigation}
            onChangeText={handleSearchTextChange}
            placeholder="Search bookings" 
            value={searchQuery}
            isSearching={isSearching}
            showNoResults={showNoResults}
          />
        </View>

        {/* Time Filter Buttons - Only show when not searching locally and not in search mode */}
        {!isLocalSearching && !isSearchMode && (
          <View style={styles.timeFilterContainer}>
            <TimeFilterSelector
              onFilterChange={handleFilterChange}
            />
          </View>
        )}

        {/* Items count and sync info */}
        <View style={styles.infoContainer}>
          <Text style={Typography.copy2} className='text-[#1F8CBF]'>
            {isLocalSearching
              ? `Found ${filteredBookings.length} results for "${searchQuery}"`
              : isSearchMode
                ? `Search results: ${filteredBookings.length} items`
                : `Showing ${filteredBookings.length} items of ${bookings.length}`}
          </Text>
          {!isLocalSearching && !isSearchMode && (
            <Text style={Typography.copy2} className='text-[#1F8CBF]'>
              {refreshing ? 'Refreshing...' : `Last sync at ${lastsync}`}
            </Text>
          )}
        </View>

        {/* Loading State */}
        {loading && !refreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1F8CBF" />
            <Text style={styles.loadingText}>Loading bookings...</Text>
          </View>
        )}

        {/* Booking Cards */}
        <View style={styles.cardsContainer}>
          {!loading && (
            filteredBookings.length > 0 ? (
              filteredBookings.map((item, index) => (
                <TestRideDetailsCard
                  key={item.OrderId || index}
                  orderIdFromComment={item.OrderId}
                  orderId={item.OrdId}
                  orderStatus={item.Status}
                  leadName={item.LeadName}
                  remainingAmount={item.RemainingAmount}
                  phoneNumber={item.LeadPhone}
                  comments={item.comments || []}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {isLocalSearching || isSearchMode
                    ? `No results found for "${searchQuery}"`
                    : 'No bookings found'}
                </Text>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllBookings;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7fbfd',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#2196F3',
    fontWeight: '500',
  },
  headerTitle: {
    color: '#333',
    flex: 1,
    marginLeft: 8,
  },
  headerRight: {
    minWidth: 80,
  },
  container: {
    flex: 1,
    backgroundColor: '#f7fbfd',
    marginBottom: 16
  },
  scrollContent: {
    paddingBottom: 54, // Extra padding for home indicator
  },
  searchContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  timeFilterContainer: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  itemsText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  syncText: {
    fontSize: 14,
  },
  cardsContainer: {
    gap: 16,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});