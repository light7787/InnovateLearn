import { Ionicons } from '@expo/vector-icons';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { SafeAreaView, ScrollView, Text, View, RefreshControl, BackHandler, Alert } from 'react-native';
import SearchBar from '@/app/components/HomeScreen/searchinput';
import TimeFilterSelector from '@/app/components/HomeScreen/timefilter';
import { Dropdownsmall } from '@/app/components/inputdropdown2';
import TestRideDetailsCard from '@/app/components/TestRide/RideCard';
import { router } from 'expo-router';
import Typography from '@/constants/typography';
import HeaderComponent from '@/app/components/AppHeader';
import { CommonActions, StackActions, useNavigation } from '@react-navigation/native';
import { getValidAccessToken } from '../auth/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { API_BASE, ENV } from '@/constants/env';
import { useLocalSearchParams } from 'expo-router';

// Import global search function
import { performUnifiedSearch } from '@/app/components/TestRide/globalSearch';
import { RelativePathString } from 'expo-router';
import { useTimeFilter } from '../timefiltercontext';






// const { setGlobalFilter, resetToDashboard } = useTimeFilter();

type TestRideType = 'Home Test Ride' | 'Store Test Ride';
type TestRideStatus = 'Scheduled' | 'Confirmed' | 'Completed' |  'Cancelled' | 'Rescheduled' ;  

interface TestRideData {
  id: string;
  leadId?: string;
  leadname: string;
  phoneNumber: string;
  testRideStatus: TestRideStatus;
  testRideType: TestRideType;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  postalCode: string;
  originalScheduleDateTime?: string; 
  originalStatus?: string; 
}

interface SearchResultData {
  results: any[];
  totalCount: number;
  bestMatch: any;
}

const TestRide = () => {
  const { 
    searchQuery: initialSearchQuery, 
    enableSearch, 
    searchResults: searchResultsString 
  } = useLocalSearchParams();

  const [testRides, setTestRides] = useState<TestRideData[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [filter, setFilter] = useState('Today');
  const [dateRange, setDateRange] = useState<any>();
  const [selectedValue, setSelectedValue] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(enableSearch === 'true');
  const [searchResults, setSearchResults] = useState<SearchResultData | null>(null);
  const [preloadedData, setPreloadedData] = useState<TestRideData[]>([]);
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
  const dropdownOptions = ['All', 'Home Test Ride', 'Store Test Ride'];

  const sortTestRidesByTime = (rides: TestRideData[]): TestRideData[] => {
    return rides.sort((a, b) => {
      const dateA = new Date(a.originalScheduleDateTime || a.scheduledDate).getTime();
      const dateB = new Date(b.originalScheduleDateTime || b.scheduledDate).getTime();

      // Sort by date first
      if (dateA !== dateB) {
        return dateA - dateB;
      }

      // Same date → sort by time
      const timeA = new Date(a.originalScheduleDateTime || 0).getTime();
      const timeB = new Date(b.originalScheduleDateTime || 0).getTime();

      return timeA - timeB;
    });
  };

  const processSearchResultsForTestRides = (searchData: any[]): TestRideData[] => {
    return searchData
      .filter((item) => {
        return item && (item.LeadName || item.TestDriveId) && !item.TestDriveStatuses;
      })
      .map((item) => {
        // Extract date and time with proper fallbacks
        let date = 'N/A';
        let time = 'N/A';
        let originalScheduleDateTime = item.ScheduleDateTime;
        let extractedPostalCode = '';
        
        if (item.ScheduleDateTime) {
          if (typeof item.ScheduleDateTime === 'string') {
            if (item.ScheduleDateTime.includes('T')) {
              const [d, t] = item.ScheduleDateTime.split('T');
              date = formatDate(d) || 'N/A';
              time = t ? formatTime(item.ScheduleDateTime, 'Store Test Ride') : 'N/A';
            } else {
              date = formatDate(item.ScheduleDateTime) || 'N/A';
            }
          }
        }

        // Determine test ride type with proper fallback
        let testRideType: TestRideType = item?.RideType === 'STR' 
          ? 'Store Test Ride' 
          : 'Home Test Ride';

        // Format time with range if it's a home test ride
        if (item.ScheduleDateTime && testRideType === 'Home Test Ride') {
          time = formatTime(item.ScheduleDateTime, testRideType);
        }
        
        // Build address with fallbacks
        let address = 'Address not available';
        if (item.Address && typeof item.Address === 'object') {
          extractedPostalCode = item.Address.postalCode || '';
          const addressParts = [];
          if (item.Address.street) addressParts.push(item.Address.street);
          if (addressParts.length > 0) {
            address = addressParts.join(', ');
          }
        }

        // Normalize the status
        let displayStatus = normalizeStatus(item.TestStatus || 'Scheduled');
        
        return {
          id: item.TestDriveId || `temp_${Date.now()}_${Math.random()}`,
          leadId: item.LeadId,
          leadname: item.LeadName || 'Unknown Lead',
          phoneNumber: item.LeadPhone || 'N/A',
          testRideType,
          scheduledDate: date,
          scheduledTime: time,
          address,
          testRideStatus: displayStatus,
          originalStatus: item.TestStatus || 'Scheduled',
          originalScheduleDateTime,
          postalCode: extractedPostalCode,
        };
      })
      .filter((ride) => {
        const originalStatus = ride.originalStatus;
        
        if (originalStatus === 'Test Ride Confirmed') return true;
        if (originalStatus === 'Scheduled' || originalStatus === 'On-Going') return true;
        if (originalStatus === 'Reschedule') return true;
        
        return false;
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

      // Results found - check if we have test ride results
      const testRideResult = searchResults.results.find((r: any) => r.type === 'testride');
      
      if (testRideResult && testRideResult.data && testRideResult.data.length > 0) {
        // We have test ride results, show them in current screen
         ENV === 'dev'&&console.log('[🔍 GLOBAL SEARCH] Processing test ride results:', testRideResult.data);
        const processedData = processSearchResultsForTestRides(testRideResult.data);
        setPreloadedData(processedData);
        setTestRides(processedData);
        setIsSearchMode(true);
        setLoading(false);
      } else {
        // No test ride results, but other results exist - navigate to best match
        const bestMatch = searchResults.bestMatch;
        if (bestMatch && bestMatch.type !== 'testride') {
          isNavigatingRef.current = true;

          let routePath = '';
          switch (bestMatch.type) {
            case 'followup':
              routePath = '/follow-ups';
              break;
            case 'booking':
              routePath = '/bookings';
              break;
            case 'retail':
              routePath = '/retails';
              break;
            default:
              routePath = '/test-rides';
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
          // Show no results for test rides specifically
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
      setIsSearchMode(false);
      setPreloadedData([]);
      setTestRides([]);
      return;
    }
  
    // 🔥 debounce global search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  
    debounceRef.current = setTimeout(() => {
      handleGlobalSearchNavigation(text);
    }, 500); // half a second debounce
  };

  useEffect(() => {
    if (searchResultsString && typeof searchResultsString === 'string') {
      try {
        const parsed = JSON.parse(searchResultsString);
        setSearchResults(parsed);
        
        // Find test ride data from search results
        const testRideResult = parsed.results.find((r: any) => r.type === 'testride');
        
        if (testRideResult && testRideResult.data) {
           ENV === 'dev'&&console.log('[🔍 TEST RIDE] Processing search results:', testRideResult.data);
          const processedData = processSearchResultsForTestRides(testRideResult.data);
          setPreloadedData(processedData);
          setTestRides(processedData);
          setLoading(false);
        }
      } catch (error) {
         ENV === 'dev'&&console.error('[🔍 TEST RIDE] Failed to parse search results:', error);
      }
    }
  }, [searchResultsString]);

  const handleBackPress = async () => {

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

  const handleStatusChange = (id: string, newStatus: string) => {
    setTestRides((prev) =>
      prev.map((ride) =>
        ride.id === id ? { ...ride, testRideStatus: newStatus as TestRideStatus } : ride
      )
    );
  };

  // Helper function to check if a date is today
  const isToday = (dateString: string): boolean => {
    if (!dateString || dateString === 'N/A') return false;
    
    try {
      const today = new Date();
      const checkDate = new Date(dateString);
      
      if (isNaN(checkDate.getTime())) return false;
      
      return (
        today.getFullYear() === checkDate.getFullYear() &&
        today.getMonth() === checkDate.getMonth() &&
        today.getDate() === checkDate.getDate()
      );
    } catch {
      return false;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      const options: Intl.DateTimeFormatOptions = { 
        day: 'numeric', 
        month: 'short' 
      };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return 'N/A';
    }
  };

  // Helper function to format time with range for home test rides
  const formatTime = (dateString: string | null, testRideType: TestRideType): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      const options: Intl.DateTimeFormatOptions = { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      };
      const time = date.toLocaleTimeString('en-US', options);
      
      // Add 2-hour range for home test rides only
      if (testRideType === 'Home Test Ride') {
        return formatTimeWithRange(time);
      }
      
      return time;
    } catch {
      return 'N/A';
    }
  };

  // Function to add 2 hours to time for home test rides
  const formatTimeWithRange = (time: string) => {
    if (time === 'N/A') {
      return time;
    }

    // Extract time and AM/PM
    const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) {
      return time;
    }

    let hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);
    const period = timeMatch[3].toUpperCase();
    
    let endHour = hour + 2;
    let endPeriod = period;
    
    // Handle time overflow
    if (period === 'AM') {
      if (endHour > 12) {
        endHour = endHour - 12;
        endPeriod = 'PM';
      } else if (endHour === 12) {
        endPeriod = 'PM';
      }
    } else { // PM
      if (endHour > 12) {
        endHour = endHour - 12;
        endPeriod = 'AM';
      } else if (endHour === 12) {
        endPeriod = 'AM';
      }
    }
    
    // Format start time (remove :00 if minutes are 00)
    const startTime = minute === 0 ? `${hour}${period}` : `${hour}:${minute.toString().padStart(2, '0')}${period}`;
    const endTime = `${endHour}${endPeriod}`;
    
    return `${startTime}-${endTime}`;
  };

  const handleLastsync = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    const timenow = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    setLastsync(timenow);
  }

  // Helper function to normalize status
  const normalizeStatus = (status: string): TestRideStatus => {
    if (status === 'Test Ride Confirmed') {
      return 'Confirmed';
    }
    if (status === 'Reschedule') {
      return 'Scheduled';
    }
    return status as TestRideStatus;
  };

  // Cache invalidation function
  const invalidateTestRideCache = async () => {
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
          cacheKey: 'testdrive'
        }),
      });
      
       ENV === 'dev'&&console.log('🗑️ Test ride cache invalidated');
    } catch (error) {
       ENV === 'dev'&&console.error('❌ Failed to invalidate cache:', error);
    }
  };

  // Fetch test rides function
  const fetchTestRides = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        await invalidateTestRideCache();
      } else {
        setLoading(true);
      }

      const token = await getValidAccessToken();
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (!userProfile) throw new Error('User profile missing');

      const { UserId } = JSON.parse(userProfile);

      // If we're in search mode and have preloaded data, use it instead of fetching
      if (isSearchMode && preloadedData.length > 0 && !isRefresh) {
         ENV === 'dev'&&console.log('[🔍 TEST RIDE] Using preloaded search data');
        setTestRides(preloadedData);
        setLoading(false);
        return;
      }

      // If we're in search mode but don't have preloaded data, don't fetch with date filters
      if (isSearchMode && !isRefresh) {
         ENV === 'dev'&&console.log('[🔍 TEST RIDE] In search mode but no preloaded data, skipping fetch');
        setTestRides([]);
        setLoading(false);
        return;
      }

      const payload: any = { UserId };

      // Only apply date filtering when NOT in search mode
      if (!isSearchMode) {
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
      } else {
        // For search mode, use expanded date range
        const today = new Date();
        const oneYearBefore = new Date(today);
        oneYearBefore.setFullYear(today.getFullYear() - 1);
        
        const oneYearAfter = new Date(today);
        oneYearAfter.setFullYear(today.getFullYear() + 1);
        
        payload.FilterDate = oneYearBefore.toISOString().split('T')[0];
        payload.FilterEndRange = oneYearAfter.toISOString().split('T')[0];
      }
      
       ENV === 'dev'&&console.log('[📊 TEST RIDES] Sending payload', payload);
      
      const res = await fetch(`${API_BASE}/api/data/EventTestDrive`, {
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
       ENV === 'dev'&&console.log('🔄 Test Ride API response:', json, res.status, res.statusText);
      
      const apiData = json?.Data || [];
      
      let metaData: { TestDriveStatuses: any; TestDriveRideType: any; } | null = null;
      let ridesArray = [];
      
      if (Array.isArray(apiData) && apiData.length > 0) {
        const metaIndex = apiData.findIndex(item => item.TestDriveStatuses);
        
        if (metaIndex !== -1) {
          metaData = apiData[metaIndex];
          ridesArray = apiData.filter((_, index) => index !== metaIndex);
        } else {
          ridesArray = apiData;
        }
      }

      setStatusOptions(metaData?.TestDriveStatuses || []);
      
      const normalized = ridesArray
        .filter((item) => {
          return item && (item.LeadName || item.TestDriveId) && !item.TestDriveStatuses;
        })
        .map((item) => {
          let date = 'N/A';
          let time = 'N/A';
          let originalScheduleDateTime = item.ScheduleDateTime;
          let extractedPostalCode = '';
          
          if (item.ScheduleDateTime) {
            if (typeof item.ScheduleDateTime === 'string') {
              if (item.ScheduleDateTime.includes('T')) {
                const [d, t] = item.ScheduleDateTime.split('T');
                date = formatDate(d) || 'N/A';
                time = t ? formatTime(item.ScheduleDateTime, 'Store Test Ride') : 'N/A';
              } else {
                date = formatDate(item.ScheduleDateTime) || 'N/A';
              }
            }
          }

          let testRideType: TestRideType = item?.RideType === 'STR' 
            ? 'Store Test Ride' 
            : 'Home Test Ride';

          if (item.ScheduleDateTime && testRideType === 'Home Test Ride') {
            time = formatTime(item.ScheduleDateTime, testRideType);
          }
          
          let address = 'Address not available';
          if (item.Address && typeof item.Address === 'object') {
            extractedPostalCode = item.Address.postalCode || '';
            const addressParts = [];
            if (item.Address.street) addressParts.push(item.Address.street);
            if (addressParts.length > 0) {
              address = addressParts.join(', ');
            }
          }

          let displayStatus = normalizeStatus(item.TestStatus || 'Scheduled');
          
          return {
            id: item.TestDriveId || `temp_${Date.now()}_${Math.random()}`,
            leadId: item.LeadId,
            leadname: item.LeadName || 'Unknown Lead',
            phoneNumber: item.LeadPhone || 'N/A',
            testRideType,
            scheduledDate: date,
            scheduledTime: time,
            address,
            testRideStatus: displayStatus,
            originalStatus: item.TestStatus || 'Scheduled',
            originalScheduleDateTime,
            postalCode: extractedPostalCode,
          };
        })
        .filter((ride) => {
          const originalStatus = ride.originalStatus;
          
          if (originalStatus === 'Test Ride Confirmed') return true;
          if (originalStatus === 'Scheduled' || originalStatus === 'On-Going') return true;
          if (originalStatus === 'Reschedule') return true;
          
          return false;
        });

       ENV === 'dev'&&console.log('🔍 Normalized and filtered test rides:', normalized);
      setTestRides(normalized);
      
      if (isRefresh) {
         ENV === 'dev'&&console.log('✅ Test rides refreshed successfully');
      }
    } catch (err) {
       ENV === 'dev'&&console.error('❌ Failed to fetch test rides:', err);
      setTestRides([]);
    } finally {
      handleLastsync();
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter, dateRange, isSearchMode, preloadedData]);

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    fetchTestRides(true);
  }, [fetchTestRides]);

  // Add useEffect to handle search mode changes
  useEffect(() => {
    // Only fetch when not in search mode and when search mode changes
    if (!isSearchMode && !isLocalSearching) {
      fetchTestRides(false);
    }
  }, [isSearchMode]); // Only depend on isSearchMode change

  useEffect(() => {
    // Fetch data when filter or dateRange changes, but only if not in search mode
    if (!isSearchMode && !isLocalSearching) {
      fetchTestRides(false);
    }
  }, [filter, dateRange]);

  const filteredRides = sortTestRidesByTime(
    testRides.filter((ride) => {
      const matchesLocalSearch =
        searchQuery === '' ||
        ride.leadname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.phoneNumber.includes(searchQuery) ||
        ride.testRideStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.testRideType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedValue === 'All' || ride.testRideType === selectedValue;

      return matchesLocalSearch && matchesType;
    })
  );

  useFocusEffect(
    useCallback(() => {
      const checkForRefresh = async () => {
        try {
          const needsRefresh = await AsyncStorage.getItem('testRideNeedsRefresh');
          
          if (needsRefresh === 'true') {
             ENV === 'dev'&&console.log('🔄 Refreshing test rides due to status change');
            fetchTestRides(true);
            
            await AsyncStorage.removeItem('testRideNeedsRefresh');
            await AsyncStorage.removeItem('testRideRefreshTimestamp');
          }
        } catch (error) {
           ENV === 'dev'&&console.error('Error checking refresh status:', error);
        }
      };
      
      checkForRefresh();
    }, [fetchTestRides])
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFD]">
      <HeaderComponent 
        title="Test Rides"
        onBackPress={handleBackPress}
        showDropdown={true}
        dropdownOptions={dropdownOptions}
        selectedValue={selectedValue}
        onDropdownSelect={(value) => setSelectedValue(value)}
      />

      <ScrollView 
        className="flex-1 bg-[#F7FBFD]" 
        contentContainerStyle={{ paddingBottom: 54 }}
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
        {/* Search */}
        <View className="mt-[24px] px-4 mb-[24px]">
          <SearchBar 
            onSearch={handleGlobalSearchNavigation}
            onChangeText={handleSearchTextChange}
            placeholder="Search test rides"
            value={searchQuery}
            isSearching={isSearching}
            showNoResults={showNoResults}
          />
        </View>

        {/* Time Filter */}
        {!isLocalSearching && !isSearchMode && (
          <View className="mb-4 px-4">
            <TimeFilterSelector onFilterChange={(newFilter, range) => {
              setFilter(newFilter);
              setDateRange(range);
            }}/>
          </View>
        )}

        {/* Info */}
        <View className="flex-row justify-between items-center mb-4 px-5">
          <Text style={Typography.copy2} className="text-[#1F8CBF]">
            {isLocalSearching 
              ? `Found ${filteredRides.length} results for "${searchQuery}"`
              : isSearchMode
                ? `Search results: ${filteredRides.length} items`
                : `Showing ${filteredRides.length} items of ${testRides.length}`
            }
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
            <Text className="text-[16px] text-gray-500 text-center">
              Loading test rides...
            </Text>
          </View>
        )}

        {/* Cards */}
        {!loading && (
          <View className="gap-4 px-4">
            {filteredRides.length > 0 ? (
              filteredRides.map((testRide, index) => (
                <TestRideDetailsCard
                  key={testRide.id || index}
                  testrideId={testRide.id}
                  leadId={testRide.leadId}
                  leadname={testRide.leadname}
                  no={testRide.phoneNumber}
                  testRideStatus={testRide.testRideStatus}
                  testRideType={testRide.testRideType}
                  scheduledDate={testRide.scheduledDate}
                  scheduledTime={testRide.scheduledTime}
                  address={testRide.address}
                  postalCode={testRide.postalCode}
                />
              ))
            ) : (
              <View className="py-10 items-center">
                <Text className="text-[16px] text-gray-500 text-center">
                  {isLocalSearching || isSearchMode
                    ? `No results found for "${searchQuery}"`
                    : 'No scheduled test rides found'}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TestRide;