import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  BackHandler,
  Alert,
} from 'react-native';

import SearchBar from '@/app/components/HomeScreen/searchinput';
import TimeFilterSelector from '@/app/components/HomeScreen/timefilter';
import { Dropdownsmall } from '@/app/components/inputdropdown2';
import Typography from '@/constants/typography';
import FollowupCard from '@/app/components/Followup/FoloowupCard';
import HeaderComponent from '@/app/components/AppHeader';
import { router } from 'expo-router';
import { StackActions, useNavigation } from '@react-navigation/native';
import { getValidAccessToken } from '../auth/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { API_BASE, ENV } from '@/constants/env';
import { useLocalSearchParams } from 'expo-router';
import { useTimeFilter } from '../timefiltercontext';

// Import global search function
import { performUnifiedSearch } from '@/app/components/TestRide/globalSearch';
import { RelativePathString } from 'expo-router';
import { getLeadList } from '../services/leadList.service';

type LeadTemperature = 'Hot' | 'Warm' | 'Cold';
type OrderStatus = 'Booking Call' | 'Schedule TR Call' | 'Reschedule TR Call';
type DateRange = {
  startDate: string | null;
  endDate: string | null;
  specificDate: string | null;
  type: 'specific' | 'flexible';
};

interface FollowupData {
  leadId: string;
  followupId: string;
  leadName: string;
  followUpCount: number;
  phoneNumber: string;
  Rating: LeadTemperature;
  lastFollowUpRemark: string;
  upcomingFollowUpDate: string;
  upcomingFollowUpTime: string;
  followUpType: OrderStatus;
  FollowUpStatus: string;
  followUpList: any[];
  rawFollowUpDate: Date | null;
}

interface RawFollowupItem {
  Id?: string;
  LeadId?: string;
  LeadTemperature__c?: LeadTemperature;
  LastFollowUpRemark__c?: string;
  LeadName?: string;
  LeadPhone?: string;
  FollowUpCount?: number;
  Feedback?: string;
  NextFollowUp?: string;
  FollowUpType__c?: OrderStatus;
}

interface SearchResultData {
  results: any[];
  totalCount: number;
  bestMatch: any;
}

// Helper function to format date and time
const formatFollowUpDateTime = (dateTimeString: string | null) => {
  if (!dateTimeString) {
    return { date: 'N/A', time: 'N/A', rawDate: null };
  }

  try {
    const date = new Date(dateTimeString);
    
    // Format date as "10 May"
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });
    
    // Format time as "7:30 AM"
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return { date: formattedDate, time: formattedTime, rawDate: date };
  } catch (error) {
     ENV === 'dev'&&console.error('Error formatting date:', error);
    return { date: 'N/A', time: 'N/A', rawDate: null };
  }
};

const AllFollowups = () => {

  const { 
    searchQuery: initialSearchQuery, 
    enableSearch, 
    searchResults: searchResultsString 
  } = useLocalSearchParams();

  const [selectedValue, setSelectedValue] = useState('All');
  
  const [followupData, setFollowupData] = useState<FollowupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [filter, setFilter] = useState('Today');
  const [originalFilter, setOriginalFilter] = useState('Today'); // Store original filter
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [originalDateRange, setOriginalDateRange] = useState<DateRange | undefined>(undefined); // Store original date range
  const [isInitialized, setIsInitialized] = useState(false); // Track if original values are set
  const [isSearchMode, setIsSearchMode] = useState(enableSearch === 'true');
  const [searchResults, setSearchResults] = useState<SearchResultData | null>(null);
  const [preloadedData, setPreloadedData] = useState<FollowupData[]>([]);
  const [lastsync, setLastsync] = useState<string>('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { resetToDashboard } = useTimeFilter();

  const dropdownOptions = ['All', 'Hot', 'Warm', 'Cold'];
  const [searchQuery, setSearchQuery] = useState(
    typeof initialSearchQuery === 'string' ? initialSearchQuery : ''
  );

  // Global search states
  const [isSearching, setIsSearching] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const isNavigatingRef = React.useRef(false);

  const navigation = useNavigation();
  const isLocalSearching = searchQuery.trim() !== '';

  const processSearchResultsForFollowups = (searchData: any[]): FollowupData[] => {
    return searchData
      .filter((item) => item?.LeadName && item?.LeadPhone)
      .map((item) => {
        const followUpDateTime = item.NextFollowUp || item.FollowUpDate;
        const { date, time, rawDate } = formatFollowUpDateTime(followUpDateTime);

        return {
          leadId: item.LeadId,
          followupId: item.FollowUpId,
          leadName: item.LeadName || 'N/A',
          followUpCount: item.FollowUpCount || 0,
          phoneNumber: item.LeadPhone || '',
          Rating: item.Rating || 'Hot',
          lastFollowUpRemark: item.Feedback || '-',
          upcomingFollowUpDate: date,
          upcomingFollowUpTime: time,
          followUpType: item.FollowUpType || 'Booking Call',
          FollowUpStatus: item.FollowUpStatus,
          followUpList: (item.followUpListOpp || []).filter(
            (f: any) => f.Opportunity__c === item.LeadId
          ),
          rawFollowUpDate: rawDate,
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

      // Results found - check if we have followup results
      const followupResult = searchResults.results.find((r: any) => r.type === 'followup');
      
      if (followupResult && followupResult.data && followupResult.data.length > 0) {
        // We have followup results, show them in current screen
         ENV === 'dev'&&console.log('[🔍 GLOBAL SEARCH] Processing followup results:', followupResult.data);
        const processedData = processSearchResultsForFollowups(followupResult.data);
        setPreloadedData(processedData);
        setFollowupData(processedData);
        setIsSearchMode(true);
        setLoading(false);
      } else {
        // No followup results, but other results exist - navigate to best match
        const bestMatch = searchResults.bestMatch;
        if (bestMatch && bestMatch.type !== 'followup') {
          isNavigatingRef.current = true;

          let routePath = '';
          switch (bestMatch.type) {
            case 'testride':
              routePath = '/test-rides';
              break;
            case 'booking':
              routePath = '/bookings';
              break;
            case 'retail':
              routePath = '/retails';
              break;
            default:
              routePath = '/follow-ups';
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
          // Show no results for followups specifically
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
      setFollowupData([]);
      
      const resetFilter = isInitialized ? originalFilter : 'Today';
      const resetDateRange = isInitialized ? originalDateRange : undefined;
      
      setFilter(resetFilter);
      setDateRange(resetDateRange);
      
      // Clear debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      // Fetch with reset filter
      fetchFollowupsWithFilter(resetFilter, resetDateRange, false);
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

  useEffect(() => {
    if (searchResultsString && typeof searchResultsString === 'string') {
      try {
        const parsed = JSON.parse(searchResultsString);
        setSearchResults(parsed);
        
        // Find followup data from search results
        const followupResult = parsed.results.find((r: any) => r.type === 'followup');
        
        if (followupResult && followupResult.data) {
           ENV === 'dev'&&console.log('[🔍 FOLLOWUP] Processing search results:', followupResult.data);
          const processedData = processSearchResultsForFollowups(followupResult.data);
          setPreloadedData(processedData);
          setFollowupData(processedData);
          setIsSearchMode(true); // Set search mode when we have search results
          setLoading(false);
        } else {
          // No followup results found in search
           ENV === 'dev'&&console.log('[🔍 FOLLOWUP] No followup results in search data');
          setPreloadedData([]);
          setFollowupData([]);
          setIsSearchMode(true);
          setLoading(false);
        }
      } catch (error) {
         ENV === 'dev'&&console.error('[🔍 FOLLOWUP] Failed to parse search results:', error);
        // Fall back to normal mode
        setIsSearchMode(false);
        setFilter('Today');
        setDateRange(undefined);
        fetchFollowupsWithFilter('Today', undefined, false);
      }
    }
  }, [searchResultsString]);

  const handleBackPress = async() => {
    navigation.dispatch(StackActions.replace('home', { animation: 'slide_from_left' }));
    await resetToDashboard();
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true; // Prevent default back action
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  // Cache invalidation function
  const invalidateFollowupCache = async () => {
    try {
      const token = await getValidAccessToken();
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (!userProfile) return;

      const { UserId } = JSON.parse(userProfile);
      
      // Call the cache invalidation endpoint
      await fetch(`${API_BASE}/api/data/invalidate-cache`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId,
          cacheKey: 'followup'
        }),
      });
      
       ENV === 'dev'&&console.log('🗑️ Follow-up cache invalidated');
    } catch (error) {
       ENV === 'dev'&&console.error('❌ Failed to invalidate cache:', error);
    }
  };

  const sortFollowupsByDateTime = (followups: FollowupData[]): FollowupData[] => {
    return followups.sort((a, b) => {
      // Handle null dates - push them to the end
      if (!a.rawFollowUpDate && !b.rawFollowUpDate) return 0;
      if (!a.rawFollowUpDate) return 1;
      if (!b.rawFollowUpDate) return -1;
      
      // Sort by date first, then by time
      return a.rawFollowUpDate.getTime() - b.rawFollowUpDate.getTime();
    });
  };

  // Separate fetch function that accepts filter parameters
  // const fetchFollowupsWithFilter = async (filterValue: string, dateRangeValue: DateRange | undefined, isRefresh = false) => {
  //   try {
  //     if (isRefresh) {
  //       setRefreshing(true);
  //       await invalidateFollowupCache();
  //     } else {
  //       setLoading(true);
  //     }

  //     const token = await getValidAccessToken();
  //     const userProfile = await AsyncStorage.getItem('userProfile');
  //     if (!userProfile) throw new Error('User profile missing');

  //     const { UserId } = JSON.parse(userProfile);

  //     const payload: any = { UserId };

  //     // Apply date filtering based on provided parameters
  //     if (filterValue === 'Custom' && dateRangeValue) {
  //       if (dateRangeValue.specificDate) {
  //         payload.FilterDate = dateRangeValue.specificDate;
  //       } else if (dateRangeValue.startDate && dateRangeValue.endDate) {
  //         payload.FilterDate = dateRangeValue.startDate;
  //         payload.FilterEndRange = dateRangeValue.endDate;
  //       } else {
  //         throw new Error('Invalid custom date range');
  //       }
  //     } else {
  //       payload.FilterDate = filterValue.toUpperCase();
  //     }

  //     const res = await fetch(`${API_BASE}/api/data/EventFollowUp`, {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!res.ok) {
  //       const errText = await res.text();
  //       throw new Error(`API failed: ${errText}`);
  //     }

  //     const json = await res.json();
  //      ENV === 'dev'&&console.log('🔄 Follow-up API response:', json, res.status, res.statusText);

  // const normalized: FollowupData[] = records
  // .filter((r: any) => r.followUp)
  // .map((r: any) => {
  //   const follow = r.followUp;

  //   const { date, time, rawDate } = formatFollowUpDateTime(
  //     follow?.nextFollowUpDate
  //   );

  //   // 🔥 SAFER temperature mapping
  //   const temperatureMap: any = {
  //     HOT: 'Hot',
  //     WARM: 'Warm',
  //     COLD: 'Cold',
  //   };

  //   return {
  //     leadId: r.opportunityNo,
  //     followupId: r.opportunityNo,
  //     leadName: r.customerName,
  //     phoneNumber: r.phoneNo,

  //     // ✅ use opportunityType
  //     Rating: temperatureMap[r.opportunityType] || 'Cold',

  //     // 🔥 TEMP until backend fixes
  //     followUpCount: 1,

  //     lastFollowUpRemark: follow?.lastFollowUpRemark || '-',

  //     upcomingFollowUpDate: date,
  //     upcomingFollowUpTime: time,

  //     // 🔥 TEMP
  //     followUpType: 'Booking Call',
  //     FollowUpStatus: r.opportunityType || 'WARM',

  //     followUpList: [],
  //     rawFollowUpDate: rawDate,
  //   };
  // });

  //     const sortedNormalized = sortFollowupsByDateTime(normalized);
  //     setFollowupData(sortedNormalized);
      
  //     if (isRefresh) {
  //        ENV === 'dev'&&console.log('✅ Follow-ups refreshed successfully');
  //     }
  //   } catch (err) {
  //      ENV === 'dev'&&console.error('❌ Failed to fetch followups:', err);
  //     setFollowupData([]);
  //   } finally {
  //     handleLastsync();
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };
const fetchFollowupsWithFilter = async (
  filterValue: string,
  dateRangeValue: DateRange | undefined,
  isRefresh = false
) => {
  try {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const records = await getLeadList({
      listType: 'F', // 👈 FOLLOWUP
      filterType: filterValue.toUpperCase(),
    });

    const normalized: FollowupData[] = records
      .filter((r: any) => r.followUp) // 👈 only followups
      .map((r: any) => {
        const follow = r.followUp;

        const { date, time, rawDate } = formatFollowUpDateTime(
          follow.nextFollowUpDate
        );

        return {
          leadId: r.opportunityNo,
          followupId: r.opportunityNo,
          leadName: r.customerName,
          followUpCount: 1, // dummy (API doesn’t give)
          phoneNumber: r.phoneNo,
          Rating:
            r.opportunityType === 'HOT'
              ? 'Hot'
              : r.opportunityType === 'WARM'
              ? 'Warm'
              : 'Cold',

          lastFollowUpRemark: follow.lastFollowUpRemark || '-',

          upcomingFollowUpDate: date,
          upcomingFollowUpTime: time,

          followUpType: 'Booking Call', // dummy mapping
          FollowUpStatus: r.opportunityType,

          followUpList: [],
          rawFollowUpDate: rawDate,
        };
      });

    const sorted = sortFollowupsByDateTime(normalized);
    setFollowupData(sorted);

  } catch (err) {
    console.error('❌ Followup fetch error:', err);
    setFollowupData([]);
  } finally {
    handleLastsync();
    setLoading(false);
    setRefreshing(false);
  }
};
  // Main fetch followups function
  const fetchFollowups = useCallback(async (isRefresh = false) => {
    // If we're in search mode and have preloaded data, use it instead of fetching
    if (isSearchMode && preloadedData.length > 0 && !isRefresh) {
       ENV === 'dev'&&console.log('[🔍 FOLLOWUP] Using preloaded search data');
      setFollowupData(preloadedData);
      setLoading(false);
      return;
    }

    // If we're in search mode but don't have preloaded data, don't fetch with date filters
    if (isSearchMode && !isRefresh) {
       ENV === 'dev'&&console.log('[🔍 FOLLOWUP] In search mode but no preloaded data, skipping fetch');
      setFollowupData([]);
      setLoading(false);
      return;
    }

    // Use current filter and dateRange for normal fetching
    await fetchFollowupsWithFilter(filter, dateRange, isRefresh);
  }, [filter, dateRange, isSearchMode, preloadedData]);

  useEffect(() => {
    // Only fetch when not in search mode
    if (!isSearchMode) {
      fetchFollowups(false);
    }
  }, [fetchFollowups, isSearchMode]);

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
      fetchFollowupsWithFilter(resetFilter, resetDateRange, true);
    } else {
      // Normal refresh
      fetchFollowups(true);
    }
  }, [isSearchMode, originalFilter, originalDateRange, isInitialized, fetchFollowups]);

  useEffect(() => {
    if (isSearchMode && preloadedData.length > 0) {
      setFollowupData(preloadedData);
      setLoading(false);
    }
  }, [isSearchMode, preloadedData]);

  const filteredFollowups = sortFollowupsByDateTime(
    followupData.filter((followup) => {
      const matchesSearch =
        searchQuery === '' ||
        followup.leadName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        followup.phoneNumber?.includes(searchQuery) ||
        followup.followUpType?.toLowerCase().includes(searchQuery.toLowerCase());
  
      const matchesTemp =
        selectedValue === 'All' || followup.Rating === selectedValue;
  
      return matchesSearch && matchesTemp;
    })
  );

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
      fetchFollowups(false);
    }
  }, [filter, dateRange]);

  return (
    <SafeAreaView className="flex-1 bg-[#f7fbfd]">
      <HeaderComponent
        title="Follow-Ups"
        onBackPress={handleBackPress}
        showDropdown={true}
        dropdownOptions={dropdownOptions}
        selectedValue={selectedValue}
        onDropdownSelect={(value) => setSelectedValue(value)}
      />

      <ScrollView 
        className="flex-1 py-2 bg-[#f7fbfd]" 
        contentContainerStyle={{ paddingBottom: 54 }}
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
        {/* Search */}
        <View className="mt-4 mb-6 px-4">
          <SearchBar
            onSearch={handleGlobalSearchNavigation}
            onChangeText={handleSearchTextChange}
            placeholder="Search follow-ups"
            value={searchQuery}
            isSearching={isSearching}
            showNoResults={showNoResults}
          />
        </View>

        {/* Time Filter */}
        {!isLocalSearching && !isSearchMode && (
          <View className="mb-4 px-3">
            <TimeFilterSelector
              onFilterChange={handleFilterChange}
            />
          </View>
        )}

        {/* Info */}
        <View className="flex-row justify-between items-center mb-4 px-5">
          <Text style={Typography.copy2} className="text-[#1F8CBF]">
            {isLocalSearching
              ? `Found ${filteredFollowups.length} results for "${searchQuery}"`
              : isSearchMode
                ? `Search results: ${filteredFollowups.length} items`
                : `Showing ${filteredFollowups.length} items of ${followupData.length}`}
          </Text>
          {!isLocalSearching && !isSearchMode && (
            <Text style={Typography.copy2} className="text-[#1F8CBF]">
              {refreshing ? 'Refreshing...' : `Last sync at ${lastsync}`}
            </Text>
          )}
        </View>

        {/* Loading State */}
        {loading && !refreshing && (
          <View className="py-10 items-center">
            <Text className="text-base text-gray-500 text-center">
              Loading follow-ups...
            </Text>
          </View>
        )}

        {/* Cards */}
        {!loading && (
          <View className="gap-4 px-4">
            {filteredFollowups.length > 0 ? (
              filteredFollowups.map((followup, index) => (
                <FollowupCard
                  key={index}
                  leadId={followup.leadId}
                  followupId={followup.followupId}
                  leadName={followup.leadName}
                  followUpCount={followup.followUpCount}
                  phoneNumber={followup.phoneNumber}
                  leadTemperature={followup.Rating}
                  lastFollowUpRemark={followup.FollowUpStatus}
                  upcomingFollowUpDate={followup.upcomingFollowUpDate}
                  upcomingFollowUpTime={followup.upcomingFollowUpTime}
                  followUpType={followup.followUpType}
                  followupList={followup.followUpList}
                />
              ))
            ) : (
              <View className="py-10 items-center">
                <Text className="text-base text-gray-500 text-center">
                  {isLocalSearching || isSearchMode
                    ? `No results found for "${searchQuery}"`
                    : 'No followups found'}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllFollowups;