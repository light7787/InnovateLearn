import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl, BackHandler, Alert } from 'react-native';
import SearchBar from '@/app/components/HomeScreen/searchinput';
import TimeFilterSelector from '@/app/components/HomeScreen/timefilter';
import { Dropdownsmall } from '@/app/components/inputdropdown2';
import TestRideDetailsCard from '@/app/components/TestRide/RideCard';
import TestRideCard from '@/app/components/HomeScreen/card';
import RetailsDetailsCard from '@/app/components/Retails/RetailsCard';
import HeaderComponent from '@/app/components/AppHeader';
import { router } from 'expo-router';
import Typography from '@/constants/typography';
import { CommonActions, StackActions, useNavigation } from '@react-navigation/native';
import { getValidAccessToken } from '../auth/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { API_BASE, ENV } from '@/constants/env';
import { useLocalSearchParams } from 'expo-router';
import { useTimeFilter } from '../timefiltercontext';

import { performUnifiedSearch } from '@/app/components/TestRide/globalSearch';
import { RelativePathString } from 'expo-router';


type OrderStatus = 'PM EDrive Pending' | 'PM EDrive Completed';

type DateRange = {
  startDate: string | null;
  endDate: string | null;
  specificDate: string | null;
  type: 'specific' | 'flexible';
};


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

interface SearchResultData {
  results: any[];
  totalCount: number;
  bestMatch: any;
}

const Retails = () => {
  // Add search params handling like test ride screen
  const { 
    searchQuery: initialSearchQuery, 
    enableSearch, 
    searchResults: searchResultsString 
  } = useLocalSearchParams();

  const [allRetailsData, setAllRetailsData] = useState<RetailData[]>([]);
  const [selectedValue, setSelectedValue] = React.useState('All');
  const [selectedDaysFilter, setSelectedDaysFilter] = React.useState<'0-30' | '31-90' | null>(null);
  const [filter, setFilter] = useState('Today');
  const [originalFilter, setOriginalFilter] = useState('Today'); // Store original filter
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [originalDateRange, setOriginalDateRange] = useState<DateRange | undefined>(undefined); // Store original date range
  const [isInitialized, setIsInitialized] = useState(false); // Track if original values are set
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Add search mode states like test ride screen
  const [isSearchMode, setIsSearchMode] = useState(enableSearch === 'true');
  const [searchResults, setSearchResults] = useState<SearchResultData | null>(null);
  const [preloadedData, setPreloadedData] = useState<RetailData[]>([]);
  const [lastsync, setLastsync] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState(
    typeof initialSearchQuery === 'string' ? initialSearchQuery : ''
  );

  // Global search states
  const [isSearching, setIsSearching] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const isNavigatingRef = React.useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { resetToDashboard } = useTimeFilter();

  const navigation = useNavigation();
  const isLocalSearching = searchQuery.trim() !== '';

  const dropdownOptions = ["All", "PM EDrive Pending", "PM EDrive Completed"];

  const handleBackPress = async() => {
    navigation.dispatch(StackActions.replace('home', { animation: 'slide_from_left' }));

    await resetToDashboard();
  };

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

  // Add search results processing function like test ride screen
  const processSearchResultsForRetails = (searchData: any[]): RetailData[] => {
    return searchData
      .filter((item) => {
        // Filter out items that are completely invalid
        return item && (item.LeadName || item.OrdId);
      })
      .map((item) => {
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

      // Results found - check if we have retail results
      const retailResult = searchResults.results.find((r: any) => r.type === 'retail');
      
      if (retailResult && retailResult.data && retailResult.data.length > 0) {
        // We have retail results, show them in current screen
         ENV === 'dev'&&console.log('[🔍 GLOBAL SEARCH] Processing retail results:', retailResult.data);
        const processedData = processSearchResultsForRetails(retailResult.data);
        setPreloadedData(processedData);
        setAllRetailsData(processedData);
        setIsSearchMode(true);
        setLoading(false);
      } else {
        // No retail results, but other results exist - navigate to best match
        const bestMatch = searchResults.bestMatch;
        if (bestMatch && bestMatch.type !== 'retail') {
          isNavigatingRef.current = true;

          let routePath = '';
          switch (bestMatch.type) {
            case 'testride':
              routePath = '/test-rides';
              break;
            case 'booking':
              routePath = '/bookings';
              break;
            case 'followup':
              routePath = '/follow-ups';
              break;
            default:
              routePath = '/retails';
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
          // Show no results for retails specifically
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

  // Search text change handler
  const handleSearchTextChange = (text: string) => {
    setSearchQuery(text);
    setShowNoResults(false);
  
    if (text.trim() === '') {
      // Clear search - reset to original state or Today if not set
      setIsSearchMode(false);
      setPreloadedData([]);
      setAllRetailsData([]);
      
      const resetFilter = isInitialized ? originalFilter : 'Today';
      const resetDateRange = isInitialized ? originalDateRange : undefined;
      
      setFilter(resetFilter);
      setDateRange(resetDateRange);
      
      // Clear debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      // Fetch with reset filter
      fetchRetailsWithFilter(resetFilter, resetDateRange, false);
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

  // Add search results processing useEffect like test ride screen
  useEffect(() => {
    if (searchResultsString && typeof searchResultsString === 'string') {
      try {
        const parsed = JSON.parse(searchResultsString);
        setSearchResults(parsed);
        
        // Find retail data from search results
        const retailResult = parsed.results.find((r: any) => r.type === 'retail');
        
        if (retailResult && retailResult.data) {
           ENV === 'dev'&&console.log('[🔍 RETAILS] Processing search results:', retailResult.data);
          const processedData = processSearchResultsForRetails(retailResult.data);
          setPreloadedData(processedData);
          setAllRetailsData(processedData);
          setIsSearchMode(true); // Set search mode when we have search results
          setLoading(false);
        } else {
          // No retail results found in search
           ENV === 'dev'&&console.log('[🔍 RETAILS] No retail results in search data');
          setPreloadedData([]);
          setAllRetailsData([]);
          setIsSearchMode(true);
          setLoading(false);
        }
      } catch (error) {
         ENV === 'dev'&&console.error('[🔍 RETAILS] Failed to parse search results:', error);
        // Fall back to normal mode
        setIsSearchMode(false);
        setFilter('Today');
        setDateRange(undefined);
        fetchRetailsWithFilter('Today', undefined, false);
      }
    }
  }, [searchResultsString]);

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

  // Separate fetch function that accepts filter parameters
  const fetchRetailsWithFilter = async (filterValue: string, dateRangeValue: DateRange | undefined, isRefresh = false) => {
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
      
       ENV === 'dev'&&console.log('[📊 RETAILS] Sending payload', payload);
      
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
       ENV === 'dev'&&console.log('🔄 Retails API response:', json, res.status, res.statusText);
      
      const apiData = json?.Data || [];
      
       ENV === 'dev'&&console.log('🔍 Retails data:', apiData);

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

       ENV === 'dev'&&console.log('🔍 Normalized retails data:', normalized);
      setAllRetailsData(normalized);
      
      if (isRefresh) {
         ENV === 'dev'&&console.log('✅ Retails refreshed successfully');
      }
    } catch (err) {
       ENV === 'dev'&&console.error('❌ Failed to fetch retails:', err);
      setAllRetailsData([]);
    } finally {
      handleLastsync();
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Main fetch retails function
  const fetchRetails = useCallback(async (isRefresh = false) => {
    // If we're in search mode and have preloaded data, use it instead of fetching
    if (isSearchMode && preloadedData.length > 0 && !isRefresh) {
       ENV === 'dev'&&console.log('[🔍 RETAILS] Using preloaded search data');
      setAllRetailsData(preloadedData);
      setLoading(false);
      return;
    }

    // If we're in search mode but don't have preloaded data, don't fetch with date filters
    if (isSearchMode && !isRefresh) {
       ENV === 'dev'&&console.log('[🔍 RETAILS] In search mode but no preloaded data, skipping fetch');
      setAllRetailsData([]);
      setLoading(false);
      return;
    }

    // Use current filter and dateRange for normal fetching
    await fetchRetailsWithFilter(filter, dateRange, isRefresh);
  }, [filter, dateRange, isSearchMode, preloadedData]);

  useEffect(() => {
    // Only fetch when not in search mode
    if (!isSearchMode) {
      fetchRetails(false);
    }
  }, [fetchRetails, isSearchMode]);

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
      fetchRetailsWithFilter(resetFilter, resetDateRange, true);
    } else {
      // Normal refresh
      fetchRetails(true);
    }
  }, [isSearchMode, originalFilter, originalDateRange, isInitialized, fetchRetails]);

  useEffect(() => {
    if (isSearchMode && preloadedData.length > 0) {
      setAllRetailsData(preloadedData);
      setLoading(false);
    }
  }, [isSearchMode, preloadedData]);

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

  // Filter data based on selected dropdown value, search query, and days filter
  const getFilteredData = (): RetailData[] => {
    let filteredData = allRetailsData;

    // Filter by dropdown selection
    if (selectedValue !== 'All') {
      filteredData = filteredData.filter(item => item.orderStatus === selectedValue);
    }

    // Filter by search query (lead name)
    if (searchQuery.trim() !== '') {
      filteredData = filteredData.filter(item => 
        item.leadName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.phoneNumber.includes(searchQuery.trim()) ||
        item.orderId.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }

    // Filter by days range (only when PM EDrive Pending is selected)
    if (selectedValue === 'PM EDrive Pending' && selectedDaysFilter) {
      if (selectedDaysFilter === '0-30') {
        filteredData = filteredData.filter(item => {
          const daysLeft = calculateItemDaysLeft(item.rtoRegistrationDate);
          return daysLeft !== null && daysLeft >= 0 && daysLeft <= 30;
        });
      } else if (selectedDaysFilter === '31-90') {
        filteredData = filteredData.filter(item => {
          const daysLeft = calculateItemDaysLeft(item.rtoRegistrationDate);
          return daysLeft !== null && daysLeft >= 31 && daysLeft <= 90;
        });
      }
    }

    return filteredData;
  };

  const filteredData = getFilteredData();

  // Calculate counts for TestRideCard
  const getCompletedCount = (): number => {
    return allRetailsData.filter(item => item.orderStatus === 'PM EDrive Completed').length;
  };

  const getPendingCount = (): number => {
    return allRetailsData.filter(item => item.orderStatus === 'PM EDrive Pending').length;
  };

  const handleDropdownSelect = (value: string) => {
    setSelectedValue(value);
    if (value === 'PM EDrive Pending') {
      setSelectedDaysFilter('0-30');
    } else {
      setSelectedDaysFilter(null);
    }
  };

  const handleDaysFilterSelect = (filter: '0-30' | '31-90') => {
    setSelectedDaysFilter(selectedDaysFilter === filter ? null : filter);
  };

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
      fetchRetails(false);
    }
  }, [filter, dateRange]);

  const showDaysFilter = selectedValue === 'PM EDrive Pending' && !isLocalSearching;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderComponent
        title="Retails"
        onBackPress={handleBackPress}
        showDropdown={true}
        dropdownOptions={dropdownOptions}
        selectedValue={selectedValue}
        onDropdownSelect={handleDropdownSelect}
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
        <View style={styles.searchContainer}>
          <SearchBar 
            onSearch={handleGlobalSearchNavigation}
            onChangeText={handleSearchTextChange}
            placeholder="Search retails"
            value={searchQuery}
            isSearching={isSearching}
            showNoResults={showNoResults}
          />
        </View>

        {/* Time Filter - only show when not in search mode */}
        {!isLocalSearching && !isSearchMode && (
          <View style={styles.timeFilterContainer}>
            <TimeFilterSelector onFilterChange={handleFilterChange}/>
          </View>
        )}

        <View style={styles.testRideCardRow}>
          <View style={styles.testRideCardWrapper}>
            <TestRideCard number={getCompletedCount().toString()} label="Completed PM EDrive" variant="retails" cardHeight={96} />
          </View>
          <View style={styles.testRideCardWrapper}>
            <TestRideCard number={getPendingCount().toString()} isRed={true} label="Total Pending PM EDrive" cardHeight={96} variant="retails" />
          </View>
        </View>

        {/* Update info container like test ride screen */}
        <View style={styles.infoContainer}>
          <Text style={Typography.copy2} className='text-river-blue-5'>
            {isLocalSearching 
              ? `Found ${filteredData.length} results for "${searchQuery}"`
              : isSearchMode
                ? `Search results: ${filteredData.length} items`
                : `Total Retails: ${allRetailsData.length}`
            }
          </Text>
          {!isLocalSearching && !isSearchMode && (
            <Text style={Typography.copy2} className='text-river-blue-5'>
              {refreshing ? 'Refreshing...' : `Last sync at ${lastsync}`}
            </Text>
          )}
        </View>

        {showDaysFilter && (
          <View style={styles.daysFilterContainer}>
            <TouchableOpacity 
              style={[
                styles.daysFilterButton,
                selectedDaysFilter === '0-30' && styles.daysFilterButtonSelected
              ]}
              onPress={() => handleDaysFilterSelect('0-30')}
            >
              <Text style={[
                styles.daysFilterButtonText,
                selectedDaysFilter === '0-30' && styles.daysFilterButtonTextSelected, 
                selectedDaysFilter === '0-30' ? Typography.subline2 : Typography.copy2, 
              ]}>
                0 to 30 days
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.daysFilterButton,
                selectedDaysFilter === '31-90' && styles.daysFilterButtonSelected
              ]}
              onPress={() => handleDaysFilterSelect('31-90')}
            >
              <Text style={[
                styles.daysFilterButtonText,
                selectedDaysFilter === '31-90' && styles.daysFilterButtonTextSelected,
                selectedDaysFilter === '31-90' ? Typography.subline2 : Typography.copy2, 
              ]}>
                31 to 90 days
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && !refreshing && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              Loading retails...
            </Text>
          </View>
        )}

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
                <Text style={styles.noDataText}>
                  {isLocalSearching 
                    ? `No results found for "${searchQuery}"`
                    : isSearchMode
                      ? `No search results found`
                      : selectedDaysFilter
                        ? `No items found for ${selectedDaysFilter === '0-30' ? '0-30 days' : '31-90 days'} range`
                        : `No items found for "${selectedValue}"`
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

export default Retails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRight: {
    minWidth: 80,
  },
  container: {
    flex: 1,
    backgroundColor: '#F7FBFD',
    marginBottom: 34, 
  },
  scrollContent: {
    paddingBottom: 34, 
  },
  searchContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  timeFilterContainer: {
    marginBottom: 16,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  daysFilterContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  daysFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  daysFilterButtonSelected: {
    backgroundColor: '#00405D',
  },
  daysFilterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1976D2',
  },
  daysFilterButtonTextSelected: {
    color: '#FFFFFF',
  },
  testRideCardRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 16,
  },
  testRideCardWrapper: {
    flex: 1,
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