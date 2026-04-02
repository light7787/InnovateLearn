// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { Animated, Dimensions, Easing, Pressable, ScrollView, Alert, Text, TouchableOpacity, View, BackHandler, RefreshControl, AppState, AppStateStatus } from 'react-native';
// import { useIsFocused } from '@react-navigation/native';
// import { useRouter } from 'expo-router';
// import TestRideCard from '@/components/HomeScreen/card';
// import EnquiryCard from '@/components/HomeScreen/longcard';
// import Notification from '@/components/HomeScreen/notification';
// import ProfileIcon from '@/components/HomeScreen/profile';
// import SearchBar from '@/components/HomeScreen/searchinput';
// import TimeFilterSelector from '@/components/HomeScreen/timefilter';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Typography from '@/constants/typography';
// import AnimatedSingleButton from '@/components/footersinglebtn';
// import { useNavigationState } from '@react-navigation/native';
// import { getValidAccessToken } from './auth/auth.service';
// import { useFocusEffect } from '@react-navigation/native';
// import { API_BASE, ENV } from '@/constants/env';
// import ConnectionStatusBar from '@/components/connection';
// import ConfirmationPopup from '@/components/confirmationmodal';
 
// import { performUnifiedSearch } from '@/components/TestRide/globalSearch';
 
// import { RelativePathString } from 'expo-router';
 
// // ---- Missing icon imports fixed ----
// import BikeIcon from '@/components/Notification/notificationicon';
// import FileIcon from '@/components/Notification/notificationicon2';
// import { logAsyncStorage } from './auth/AsyncStorageLog';
// import { sendLog } from './logger';
 
 
// ////// notifications ////////
// const NOTIFICATION_KEY = 'userNotifications'; // stored list for Notifications page
// const SHOWN_POPUPS_KEY = 'shownNotificationIds'; // shown popup ids (24h dedupe)
// const POLLING_INTERVAL = 4 * 60 * 1000; // 4 minutes
 
// // ⚙️ Configure the lead times here.
// // The user asked specifically for "show the popup in home 15 mins prior to followup or test ride".
// // Set TEST_RIDE_ALERT_MINUTES = 15 and FOLLOWUP_ALERT_MINUTES = 15 to match that.
// // If you want test rides at 60 minutes, change TEST_RIDE_ALERT_MINUTES to 60.
// const TEST_RIDE_ALERT_MINUTES = 15; // minutes before test ride to show popup
// const FOLLOWUP_ALERT_MINUTES = 15; // minutes before follow-up to show popup
 
// const DAY_MS = 24 * 60 * 60 * 1000;
 
// interface NotificationItem {
//   id: string;
//   iconType: 'shield' | 'document';
//   title: string;
//   message: string;
//   time: string; // display time
//   timestamp: number; // trigger time in ms
//   raw?: any;
// }
 
// const toISTString = (timestamp: number) =>
//   new Date(timestamp).toLocaleString('en-IN', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   });
 
// // --- helpers for dedupe shown popups ---
// const readShownMap = async (): Promise<Record<string, number>> => {
//   const raw = await AsyncStorage.getItem(SHOWN_POPUPS_KEY);
//   if (!raw) return {};
//   try {
//     return JSON.parse(raw);
//   } catch {
//     return {};
//   }
// };
// const markShown = async (id: string) => {
//   const map = await readShownMap();
//   map[id] = Date.now();
//   // prune older than 24h
//   for (const k of Object.keys(map)) {
//     if (Date.now() - map[k] > DAY_MS) delete map[k];
//   }
//   await AsyncStorage.setItem(SHOWN_POPUPS_KEY, JSON.stringify(map));
// };
// const hasShownRecently = async (id: string) => {
//   const map = await readShownMap();
//   return !!(map[id] && Date.now() - map[id] <= DAY_MS);
// };
 
// // --- normalization helper ---
// // Accepts many possible API formats:
// // - ISO timestamp string: "2025-08-08T10:00:00Z"
// // - "2025-08-08" (date-only) -> treat as at 00:00
// // - hour-only '10' or 10 -> combine with fallbackDate (yyyy-mm-dd) or today's date
// // - If fallbackDateStr provided (yyyy-mm-dd), use that to combine with hour-only.
// const normalizeToTimestamp = (raw: any, fallbackDateStr?: string): number | null => {
//   if (!raw && raw !== 0) return null;
//   // Already number (ms timestamp)
//   if (typeof raw === 'number') {
//     // if looks like seconds (10 digits) convert to ms
//     if (raw < 1e12) return raw * 1000;
//     return raw;
//   }
 
//   const s = String(raw).trim();
 
//   // hour-only like '9' or '09' or number string
//   if (/^\d{1,2}$/.test(s)) {
//     const hh = s.padStart(2, '0');
//     const datePart =
//       fallbackDateStr ||
//       new Date().toISOString().split('T')[0]; // 'yyyy-mm-dd' of today
//     const iso = `${datePart}T${hh}:00:00`;
//     const t = Date.parse(iso);
//     return isNaN(t) ? null : t;
//   }
 
//   // ISO-like or contains time
//   const parsed = Date.parse(s);
//   if (!isNaN(parsed)) return parsed;
 
//   // date-only 'YYYY-MM-DD'
//   if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
//     const t = Date.parse(`${s}T00:00:00`);
//     return isNaN(t) ? null : t;
//   }
 
//   // fallback: try to parse loose numbers
//   const asNum = Number(s);
//   if (!isNaN(asNum)) {
//     if (asNum < 1e12) return asNum * 1000;
//     return asNum;
//   }
 
//   return null;
// };
 
 
 
 
// // Get screen dimensions
// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
 
// // Responsive dimension calculations
// const getResponsiveDimensions = () => {
//   const isSmallScreen = screenWidth < 375;
//   const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
//   const isLargeScreen = screenWidth >= 414;
 
//   return {
//     // Horizontal padding - responsive
//     horizontalPadding: screenWidth * 0.062, // ~24px for 390px screen
//     // Header height - responsive
//     headerHeight: screenHeight * 0.218, // ~184px for 844px screen
//     // Content top margin - responsive
//     contentTopMargin: screenHeight * 0.236, // ~200px for 844px screen
//     // Card spacing
//     cardGap: screenWidth * 0.041, // ~16px for 390px screen
//     // Card heights - responsive
//     statCardHeight: Math.max(100, screenHeight * 0.142), // ~120px for 844px screen, minimum 100
//     // Bottom button area
//     bottomButtonHeight: Math.max(96, screenHeight * 0.114), // ~96px for 844px screen
//     // Font scaling for different screen sizes
//     fontScale: isSmallScreen ? 0.9 : isMediumScreen ? 1.0 : 1.1,
//   };
// };
 
// // Define the DateRange interface
// interface DateRange {
//   startDate: string | null;
//   endDate: string | null;
//   specificDate: string | null;
//   type: 'specific' | 'flexible';
// }
 
// const HomeScreen = () => {
//   const [bgAnim] = useState(new Animated.Value(0));
 
//   const handlePressIn = () => {
//     Animated.timing(bgAnim, {
//       toValue: 1,
//       duration: 400,
//       easing: Easing.inOut(Easing.ease), // smooth and elegant
//       useNativeDriver: false,
//     }).start();
//   };
 
//   const handlePressOut = () => {
//     Animated.timing(bgAnim, {
//       toValue: 0,
//       duration: 200,
//       easing: Easing.inOut(Easing.ease),
//       useNativeDriver: false,
//     }).start();
//   };
 
//   const animatedBackground = bgAnim.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: ['#00405D', '#373409', '#F7EC2B'],
//   });
 
//   const animatedTextColor = bgAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['#F7FBFD', '#000000'], // white to black
//   });
 
// type UserProfile = {
//   StoreName: string;
//   StorePhone: string;
//   UserDesignation: string | null;
//   UserEmail: string;
//   UserId: string;
//   UserName: string;
//   UserPhone: string;
// };
 
// type DashboardData = {
//   testRideCount: number;
//   followUpCount: number;
//   bookingCount: number;
//   retailCount: number;
//   overdueFollowUps: number;
//   expiringEdrives: number;
//   totalOpenOpp: number,
//   opportunitySources?: {
//     [key: string]: string[];
//   };
// };
 
// const hourlyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
// const hourlyIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
// const [dashboard, setDashboard] = useState<DashboardData | null>(null);
 
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [filter, setFilter] = useState<string>('Today');
 
//   const [showNoResults, setShowNoResults] = useState(false);
//   // Add state for date filter
//     const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
 
//   const [profileReady, setProfileReady] = useState(false);
 
//   // Get responsive dimensions
//   const dimensions = getResponsiveDimensions();
 
//   const isNavigatingRef = React.useRef(false);
 
 
//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => true; // disables back action
//       const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
//       return () => subscription.remove(); // ✅ correct cleanup
//     }, [])
//   );
 
 
 
//    const [searchQuery, setSearchQuery] = useState('');
 
// const [isSearching, setIsSearching] = useState(false);
 
 
 
 
 
// const handleSearchNavigation = async (query: string) => {
//   if (isNavigatingRef.current || !query.trim()) return;
 
//   setIsSearching(true);
//   setShowNoResults(false); // Reset no results state
 
//   try {
//     const searchResults = await performUnifiedSearch(query.trim());
   
//     if (searchResults.totalCount === 0) {
//       // No results found - show "No Results Found" in search bar
//       setShowNoResults(true);
//       setIsSearching(false);
     
//       // Hide the message after 3 seconds
//       setTimeout(() => {
//         setShowNoResults(false);
//       }, 3000);
     
//       return;
//     }
 
//     // Results found - proceed with navigation
//     const bestMatch = searchResults.bestMatch;
//     if (!bestMatch) {
//       setIsSearching(false);
//       return;
//     }
 
//     isNavigatingRef.current = true;
 
//     // Determine the route based on the best match type
//     let routePath = '';
//     switch (bestMatch.type) {
//       case 'testride':
//         routePath = '/test-rides';
//         break;
//       case 'followup':
//         routePath = '/follow-ups';
//         break;
//       case 'booking':
//         routePath = '/bookings';
//         break;
//       case 'retail':
//         routePath = '/retails';
//         break;
//       default:
//         routePath = '/test-rides'; // fallback
//     }
 
//     router.push({
//       pathname: routePath as RelativePathString,
//       params: {
//         searchQuery: query,
//         enableSearch: 'true',
//         searchResults: JSON.stringify(searchResults)
//       }
//     });
   
//     setTimeout(() => {
//       isNavigatingRef.current = false;
//     }, 1000);
 
//   } catch (error) {
//    ENV   === 'dev'
//   &&console.error('Search error:', error);

//   } finally {
//     setIsSearching(false);
//   }
// };
 
 
 
 
//   const storeFullDashboardData = async (rawResponse: any) => {
//     try {
//     const {
//       totalOldFollowUpList,
//       totalOldFollowUp,
//       totalFollowUp,
//       totalTestDrive,
//       totalBookings,
//       totalPurchase,
//       totalOpenOpp,
//       TestDriveType,
//       OpportunityDropOutSources,
//       OpportunitySources,
//       StatusCode,
//       StatusMessage
//     } = rawResponse;
   
//     const keyValuePairs: [string, any][] = [
//       ['oldFollowUps', totalOldFollowUpList],
//       ['countOldFollowUps', totalOldFollowUp],
//       ['countFollowUps', totalFollowUp],
//       ['countTestDrives', totalTestDrive],
//       ['countBookings', totalBookings],
//       ['countPurchases', totalPurchase],
//       ['countOpenOpportunities', totalOpenOpp],
//       ['testDriveTypes', TestDriveType],
//       ['dropOutSources', OpportunityDropOutSources],
//       ['opportunitySources', OpportunitySources],
//       ['dashboardStatusCode', StatusCode],
//       ['dashboardStatusMessage', StatusMessage]
//     ];
   
//     for (const [key, value] of keyValuePairs) {
//       await AsyncStorage.setItem(key, JSON.stringify(value));
//        ENV   === 'dev'
//   &&console.log(`[🧠 AsyncStorage] Saved: ${key}`, value);
//     }
   
//      ENV   === 'dev'
//   ?console.log('✅ Dashboard metadata stored successfully.')
//     : logAsyncStorage();

//     } catch (err) {
//     console.error('❌ Error storing dashboard data:', err);
//     }
//   };
 
 
//   //notifications ///////////////////////////////
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [popupItem, setPopupItem] = useState<NotificationItem | null>(null);
//   const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const appState = useRef<AppStateStatus>(AppState.currentState);
//   const isFocused = useIsFocused();
//   const router = useRouter();
 
//   // fetch & compute function
//   const fetchAndCompute = useCallback(async () => {
//     try {
//       const token = await getValidAccessToken();
//       const profileRaw = await AsyncStorage.getItem('userProfile');
//       if (!profileRaw) throw new Error('Missing user profile');
//       const { UserId, EmployeeType } = JSON.parse(profileRaw);
//       const headers = {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       };
//       const payload = { UserId, FilterDate: 'TODAY' };
 
//       const [testRidesRes, followUpsRes] = await Promise.all([
//         fetch(`${API_BASE}/api/data/EventTestDrive`, {
//           method: 'POST',
//           headers,
//           body: JSON.stringify(payload),
//         }),
//         fetch(`${API_BASE}/api/data/EventFollowUp`, {
//           method: 'POST',
//           headers,
//           body: JSON.stringify(payload),
//         }),
//       ]);
//       const testRides = await testRidesRes.json();
//       const followUps = await followUpsRes.json();
//       const now = Date.now();
 
//       const upcoming: NotificationItem[] = [];
 
//       // --- TEST RIDES ---
//       for (const ride of testRides?.Data || []) {
//         // try various possible fields
//         // Prefer ScheduleDateTime; fallback to ScheduleDate + ScheduleHour or Hour field
//         const scheduleRaw = ride.ScheduleDateTime ?? ride.ScheduleDate ?? ride.ScheduleTime ?? ride.Time ?? ride.ScheduleHour ?? ride.Hour ?? ride.Schedule;
//         // If ScheduleDateTime is just hour, pass ScheduleDate for fallback
//         let fallbackDate: string | undefined = undefined;
//         if (ride.ScheduleDate) {
//           // ensure yyyy-mm-dd format if possible (try to parse)
//           const d = normalizeToTimestamp(ride.ScheduleDate);
//           if (d) {
//             fallbackDate = new Date(d).toISOString().split('T')[0];
//           }
//         }
//         const scheduled = normalizeToTimestamp(scheduleRaw, fallbackDate);
//         if (!scheduled) continue;
 
//         // trigger at scheduled - TEST_RIDE_ALERT_MINUTES
//         const triggerTime = scheduled - TEST_RIDE_ALERT_MINUTES * 60 * 1000;
//         const withinWindow = now >= triggerTime && now - triggerTime <= DAY_MS;
//         if (withinWindow) {
//           const id = `ride-${ride.TestDriveId ?? ride.Id ?? scheduled}`;
//           const item: NotificationItem = {
//             id,
//             iconType: 'shield',
//             title: 'Upcoming Test Ride',
//             message: `Test ride with ${ride.LeadName ?? ride.ContactName ?? 'customer'} at ${toISTString(scheduled).split(',')[1].trim()}`,
//             time: toISTString(triggerTime),
//             timestamp: triggerTime,
//             raw: ride,
//           };
//           upcoming.push(item);
//         }
//       }
 
//       // --- FOLLOW-UPS ---
//       for (const f of followUps?.Data || []) {
//         const scheduleRaw = f.FollowUpDate ?? f.ScheduleDateTime ?? f.ScheduleDate ?? f.FollowUpTime ?? f.Time;
//         let fallbackDate: string | undefined = undefined;
//         if (f.FollowUpDate && /^\d{4}-\d{2}-\d{2}$/.test(String(f.FollowUpDate))) {
//           fallbackDate = String(f.FollowUpDate);
//         } else if (f.ScheduleDate) {
//           const d = normalizeToTimestamp(f.ScheduleDate);
//           if (d) fallbackDate = new Date(d).toISOString().split('T')[0];
//         }
//         const scheduled = normalizeToTimestamp(scheduleRaw, fallbackDate);
//         if (!scheduled) continue;
 
//         const triggerTime = scheduled - FOLLOWUP_ALERT_MINUTES * 60 * 1000;
//         const nowTs = Date.now();
//         const withinWindow = nowTs >= triggerTime && nowTs - triggerTime <= DAY_MS;
//         if (withinWindow) {
//           const id = `follow-${f.FollowUpId ?? f.Id ?? scheduled}`;
//           const item: NotificationItem = {
//             id,
//             iconType: 'document',
//             title: 'Upcoming Follow-up',
//             message: `Follow-up with ${f.LeadName ?? f.ContactName ?? 'contact'} at ${toISTString(scheduled).split(',')[1].trim()}`,
//             time: toISTString(triggerTime),
//             timestamp: triggerTime,
//             raw: f,
//           };
//           upcoming.push(item);
//         }
//       }
 
//       // Save upcoming to AsyncStorage for Notifications page
//       await AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(upcoming));
//       setNotifications(upcoming);
 
//       // If app is active and Home is focused, show popups for any items that haven't been shown
//       if (appState.current === 'active' && isFocused) {
//         // show one popup at a time
//         for (const item of upcoming) {
//           const shown = await hasShownRecently(item.id);
//           if (!shown) {
//             // show popup
//             setPopupItem(item);
//             setPopupVisible(true);
//             // wait for user response before marking others — the popup handlers will mark shown
//             break;
//           }
//         }
//       }
//     } catch (err) {
     
//       // try load cache to render
//       try {
//         const cached = await AsyncStorage.getItem(NOTIFICATION_KEY);
//         if (cached) {
//           const arr = JSON.parse(cached) as NotificationItem[];
//           const valid = arr.filter((n) => Date.now() - n.timestamp <= DAY_MS);
//           setNotifications(valid);
//         }
//       } catch (e) {
//         /* ignore */
//       }
//     }
//   }, [isFocused]);
// // --------- Hourly aligned polling :44:05 ----------
// const CHECK_MINUTE = 44; // run at :44 of every hour
// const CHECK_SECOND = 5;  // run at :44:05 to avoid edge-second race
 
// const clearHourlyTimers = () => {
//   if (hourlyTimeoutRef.current) {
//     clearTimeout(hourlyTimeoutRef.current as any);
//     hourlyTimeoutRef.current = null;
//   }
//   if (hourlyIntervalRef.current) {
//     clearInterval(hourlyIntervalRef.current as any);
//     hourlyIntervalRef.current = null;
//   }
// };
 
// const scheduleHourlyAtMinute = (minute: number, second = 0) => {
//   // clear existing timers first
//   clearHourlyTimers();
 
//   const now = new Date();
//   const next = new Date(now);
//   next.setMinutes(minute, second, 0); // mm:ss:ms
//   if (next.getTime() <= now.getTime()) {
//     next.setHours(next.getHours() + 1);
//   }
//   const delay = next.getTime() - now.getTime();
 
//   hourlyTimeoutRef.current = setTimeout(() => {
//     // only fetch if app is active & Home focused
//     if (appState.current === 'active' && isFocused) {
//       fetchAndCompute().catch((e) => ENV === 'dev'&&console.warn('scheduled fetch error', e));
//     }
 
//     // now set repeating hourly interval
//     hourlyIntervalRef.current = setInterval(() => {
//       if (appState.current === 'active' && isFocused) {
//         fetchAndCompute().catch((e) => ENV === 'dev'&&console.warn('scheduled fetch error', e));
//       }
//     }, 60 * 60 * 1000); // every hour
//   }, delay);
// };
 
// useEffect(() => {
//   // schedule the hourly check at :44:05
//   scheduleHourlyAtMinute(CHECK_MINUTE, CHECK_SECOND);
 
//   // immediate check when screen mounted and app active
//   if (appState.current === 'active' && isFocused) {
//     fetchAndCompute();
//   }
 
//   // listen for app state changes to start/stop polling sensibly
//   const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
//     appState.current = next;
//     if (next === 'active') {
//       // immediate fetch on resume
//       fetchAndCompute();
//       // if interval was cleared while backgrounded, reschedule
//       if (!hourlyIntervalRef.current) scheduleHourlyAtMinute(CHECK_MINUTE, CHECK_SECOND);
//     } else {
//       // backgrounded — stop the hourly interval to save battery
//       if (hourlyIntervalRef.current) {
//         clearInterval(hourlyIntervalRef.current as any);
//         hourlyIntervalRef.current = null;
//       }
//       // keep the timeout so the next run stays aligned (optional)
//     }
//   });
 
//   return () => {
//     sub.remove();
//     clearHourlyTimers();
//   };
//   // Re-run when fetchAndCompute or focus changes
// }, [fetchAndCompute, isFocused]);
 
 
//   // also re-check whenever Home is focused
//   useEffect(() => {
//     if (isFocused && appState.current === 'active') {
//       fetchAndCompute();
//     }
//   }, [isFocused, fetchAndCompute]);
 
//   // popup handlers
//   const handleConfirm = async () => {
//     if (!popupItem) {
//       setPopupVisible(false);
//       return;
//     }
//     await markShown(popupItem.id);
//     setPopupVisible(false);
//     // go to notifications page (user wanted this routing)
//     router.push('/notify');
//     // after closing, check if another pending popup exists in notifications state
//     setTimeout(() => {
//       // keep flow: we will re-run fetchAndCompute soon via polling or immediate call
//       fetchAndCompute();
//     }, 500);
//   };
 
//   const handleIgnore = async () => {
//     if (popupItem) await markShown(popupItem.id);
//     setPopupVisible(false);
//     // After ignoring, continue to next pending (if any) by re-checking
//     setTimeout(() => fetchAndCompute(), 300);
//   };
 
 
 
 
 
//   // Navigation handler for Profile Icon
//   const handleProfileNavigation = () => {
//     if (isNavigatingRef.current) return;
//     isNavigatingRef.current = true;
   
//     // Navigate to profile screen (adjust route as needed)
//     router.push('/profile');
   
//     setTimeout(() => {
//       isNavigatingRef.current = false;
//     }, 2000);
//   };
 
//   // Navigation handler for Notification
//   const handleNotificationNavigation = () => {
//     if (isNavigatingRef.current) return;
//     isNavigatingRef.current = true;
   
//     // Navigate to notification screen
//     router.push('/notify');
   
//     setTimeout(() => {
//       isNavigatingRef.current = false;
//     }, 1000);
//   };
 
//   const fetchUserProfile = async () => {
//   setLoading(true);
//   try {
//     const username = await AsyncStorage.getItem('username');
//     if (!username) throw new Error('Username not found in storage');
 
//     const accessToken = await getValidAccessToken();
//     if (!accessToken) throw new Error('Could not get valid access token');
 
//     const response = await fetch(`${API_BASE}/api/data/EventProfile/`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify({ username }),
//     });
 
//     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//     const result = await response.json();
 
//     if (!result.Data || !Array.isArray(result.Data) || result.Data.length === 0) {
//       throw new Error('No user data returned from API');
//     }
 
 
//     const data: UserProfile = result.Data[0];
//     setUser(data);
//     await AsyncStorage.setItem('userProfile', JSON.stringify(data));
//   } catch (error) {
//     ENV === 'dev'?console.error('Failed to fetch user profile:', error):
//     sendLog('error', `
//        Failed to fetch user profile:
//        ${error}
//       `);;
//   } finally {
//     setLoading(false);
//     setProfileReady(true); // ✅ Always set this in finally
//   }
 
// };
 
// const handleSearchTextChange = (text: string) => {
//   setSearchQuery(text);
//   if (showNoResults) {
//     setShowNoResults(false); // Reset no results when user starts typing again
//   }
// };
 
// // Helper function to check if a date is today
// const isToday = (dateString: string): boolean => {
//   if (!dateString || dateString === 'N/A') return false;
 
//   try {
//     const today = new Date();
//     const checkDate = new Date(dateString);
   
//     if (isNaN(checkDate.getTime())) return false;
   
//     return (
//       today.getFullYear() === checkDate.getFullYear() &&
//       today.getMonth() === checkDate.getMonth() &&
//       today.getDate() === checkDate.getDate()
//     );
//   } catch {
//     return false;
//   }
// };

 
// const storeTimeFilter = async (filter: string, range?: DateRange) => {
//  const filterPayload: any = {};
 
 
//  if (filter === 'Custom' && range) {
//    if (range.specificDate) {
//      filterPayload.FilterDate = range.specificDate;
//    } else if (range.startDate && range.endDate) {
//      filterPayload.FilterDate = range.startDate;
//      filterPayload.FilterEndRange = range.endDate;
//    }
//  } else {
//    filterPayload.FilterDate = filter.toUpperCase();
//  }
 
 
//  try {
//    await AsyncStorage.setItem('timeFilter', JSON.stringify(filterPayload));
//    ENV === 'dev'&&console.log('🧠 [AsyncStorage] Saved: timeFilter', filterPayload);
//  } catch (err) {
//    ENV === 'dev'&&console.error('❌ Failed to save time filter', err);
//  }
// };
 
// // Cache invalidation function
// const invalidateDashboardCache = async () => {
//   try {
//     const token = await getValidAccessToken();
//     const userProfile = await AsyncStorage.getItem('userProfile');
//     if (!userProfile) return;
 
//     const { UserId } = JSON.parse(userProfile);
   
//     // Call the cache invalidation endpoint
//     await fetch(`${API_BASE}/api/data/invalidate-cache`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         UserId,
//         cacheKey: 'dashboard'
//       }),
//     });
   
//      ENV === 'dev'&&console.log('🗑️ Dashboard cache invalidated');
//   } catch (error) {
//      ENV === 'dev'&&console.error('❌ Failed to invalidate dashboard cache:', error);
//   }
// };
 
// const fetchDashboardData = async ({
//   filter,
//   startDate,
//   endDate,
//   specificDate,
//   isRefresh = false
// }: {
//   filter: string;
//   startDate?: string | null;
//   endDate?: string | null;
//   specificDate?: string | null;
//   isRefresh?: boolean;
// }): Promise<DashboardData> => {
//   try {
//     // Invalidate cache if this is a refresh
//     if (isRefresh) {
//       await invalidateDashboardCache();
//     }
 
//     const accessToken = await getValidAccessToken();
//     const userProfile = await AsyncStorage.getItem('userProfile');
//     if (!userProfile) throw new Error('User profile not found');
 
//     const { UserId } = JSON.parse(userProfile);
 
//     let payload: any = { UserId };
 
//     if (filter === 'Custom') {
//       if (specificDate) {
//         payload.FilterDate = specificDate;
//       } else if (startDate && endDate) {
//         payload.FilterDate = startDate;
//         payload.FilterEndRange = endDate;
//       } else {
//         throw new Error('Invalid custom date range');
//       }
//     } else {
//       payload.FilterDate = filter.toUpperCase();
//     }
 
//      ENV === 'dev'&&console.log('[📊 DASHBOARD] Sending payload:', payload);
//      ENV === 'dev'&&console.log('[📊 DASHBOARD] Using token:', accessToken);
 
//     // Fetch both dashboard data and test rides count
//     const [dashboardResponse] = await Promise.all([
//       fetch(`${API_BASE}/api/data/userDashboard`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(payload),
//       }),
//       // fetchTestRidesCount({ filter, startDate, endDate, specificDate })
//     ]);
 
//     if (!dashboardResponse.ok) ENV === 'dev'?console.log(`HTTP error! Status: ${dashboardResponse.status}`):sendLog('error', `HTTP error! Status: ${dashboardResponse.status}`);
//     const result = await dashboardResponse.json();
 
//     if (!result || result.StatusCode !== 200) {
//       ENV === 'dev'&&console.log('No dashboard data found');
//     }
//     await storeFullDashboardData(result);
 
 
   
 
//     const parsed: DashboardData = {
//       testRideCount: result.totalTestDrive ?? 0, // Use the filtered count from test rides API
//       followUpCount: result.totalFollowUp ?? 0,
//       bookingCount: result.totalBookings ?? 0,
//       retailCount: result.totalPurchase ?? 0,
//       overdueFollowUps: result.totalOldFollowUp ?? 0,
//       expiringEdrives: result.totalExpiringEdrives ?? 0,
//       totalOpenOpp: result.totalOpenOpp ?? 0,
//       opportunitySources: result.OpportunitySources || {}
//     };
 
//     return parsed;
//   } catch (error) {
//    ENV === 'dev'? console.error('Dashboard fetch error:', error):sendLog('error', `Dashboard fetch error: ${error}`);
//     throw error;
//   }
// };
 
 
//  useEffect(() => {
//   const loadUserProfile = async () => {
//     try {
//       const cachedProfile = await AsyncStorage.getItem('userProfile');
//       if (cachedProfile) {
//         const parsed = JSON.parse(cachedProfile);
//         setUser(parsed);
//         setLoading(false);
//         setProfileReady(true); // ✅
//         return;
//       }
 
//       await fetchUserProfile();
//     } catch (error) {
//       ENV === 'dev'?console.error('Error loading cached profile:', error):sendLog('error', `Error loading cached profile: ${error}`)  ;
//       await fetchUserProfile();
//     }
//   };
 
//   loadUserProfile();
// }, []);
 
// const handlePress = () => {
//   const opportunitySourcesParam = dashboard?.opportunitySources ?
//   encodeURIComponent(JSON.stringify(dashboard.opportunitySources)) : '';
//   if (isNavigatingRef.current) return;
//   isNavigatingRef.current = true;
//   router.push({
//     pathname: '/leads/create',
//     params: {
//       opportunitySources: opportunitySourcesParam
//     }
//   });
//   setTimeout(() => {
//     isNavigatingRef.current = false;
//   }, 1000); // Adjust as needed
// };
 
 
// const isDashboardFetching = React.useRef(false);
 
// const loadDashboard = useCallback(async (isRefresh = false) => {
//   if (isDashboardFetching.current) return;
//   isDashboardFetching.current = true;
 
//   if (isRefresh) {
//     setRefreshing(true);
//   } else {
//     setIsLoading(true);
//   }
 
//   try {
//     const data = await fetchDashboardData({
//       filter,
//       isRefresh,
//       ...(filter === 'Custom' && dateRange
//         ? {
//             startDate: dateRange.startDate,
//             endDate: dateRange.endDate,
//             specificDate: dateRange.specificDate
//           }
//         : {})
//     });
 
//     setDashboard(data);
   
//     if (isRefresh) {
//       ENV === 'dev'&&console.log('✅ Dashboard refreshed successfully');
//     }
//   } catch (err) {
//     ENV === 'dev'&&console.error('Dashboard fetch error:', err);
//     setDashboard(null);
//   } finally {
//     setIsLoading(false);
//     setRefreshing(false);
//     isDashboardFetching.current = false;
//   }
// }, [filter, dateRange]);
 
// // Pull to refresh handler
// const onRefresh = useCallback(() => {
//   loadDashboard(true);
// }, [loadDashboard]);
 
 
//   // Trigger fetch when filter or date changes
//   useEffect(() => {
//   if (!profileReady) return;
//   loadDashboard(false);
// }, [loadDashboard, profileReady]);
 
//   const handleFilterChange = (newFilter: string, range?: DateRange) => {
//     storeTimeFilter(newFilter,range);
//     setFilter(newFilter);
//     setDateRange(range);
//   };
 
//   return (
//     <View style={{ flex: 1, backgroundColor: '#F7FBFD' }}>
//       <ConnectionStatusBar></ConnectionStatusBar>
//       {/* Header Section - Exact Figma Dimensions */}
//       <View
//         style={{
//           width: '100%',
//           height: 184, // Fixed height from Figma
//           backgroundColor: '#00405D',
//           borderBottomLeftRadius: 24,
//           borderBottomRightRadius: 24,
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: 1,
//         }}
//       >
//         {/* Content container - starts at 64px from top (status bar + 16px) */}
//         <View
//           style={{
//             paddingHorizontal: 24, // Fixed 24px padding from Figma
//             paddingTop: 64, // Status bar (44-48px) + 16px padding = 64px
//             flex: 1,
//           }}
//         >
//           {/* Top Row - Profile and Notification - Height: 32px */}
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               width: '100%',
//               height: 32, // Exact height from Figma
//               marginBottom: 16, // 16px gap between profile row and search
//             }}
//           >
//             {/* Profile Section */}
//             <TouchableOpacity
//               onPress={handleProfileNavigation}
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 height: 32, // Match parent height
//               }}
//             >
//               {/* Profile Icon - 32x32px */}
//               <View
//                 style={{
//                   width: 32,
//                   height: 32,
//                   backgroundColor: '#F7FBFD',
//                   borderRadius: 16,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}
//               >
//                 <ProfileIcon
//                     onPress={handleProfileNavigation}/>
//               </View>
 
//               {/* Name Text */}
//               <Text
//                 style={[
//                   Typography.headline4,
//                   {
//                     marginLeft: 8, // 8px gap between icon and text
//                     color: '#F7FBFD', // River Blue/01
//                     fontSize: Typography.headline4.fontSize * dimensions.fontScale,
//                   }
//                 ]}
//                 numberOfLines={1}
//               >
//                 {loading ? 'Loading...' :  user?.UserName }
//               </Text>
//             </TouchableOpacity>
 
//             {/* Notification Icon - 24x24px */}
//             <TouchableOpacity
//               onPress={handleNotificationNavigation}
//               style={{
//                 width: 24,
//                 height: 24,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//             >
//               <Notification />
//             </TouchableOpacity>
//           </View>
 
//           {/* Search Bar Container - Height: 48px */}
//           {/* Search Icon - 24x24px positioned at left */}
//           {/* Search Input */}
//           <SearchBar backgroundColor="bg-river-blue-1" onSearch={handleSearchNavigation}
 
//   value={searchQuery}
 
//   isSearching={isSearching} onChangeText={handleSearchTextChange}  showNoResults={showNoResults} />
//         </View>
//       </View>
 
//       {/* Main Content - Fixed top margin to match header */}
//       <ScrollView
//         style={{
//           flex: 1,
//           marginTop: 190, // Header (184px) + 16px gap = 200px
//         }}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: 32, // Bottom padding for last content
//         }}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#1F8CBF']} // Android
//             tintColor="#1F8CBF" // iOS
//             title="Pull to refresh"
//             titleColor="#1F8CBF"
//           />
//         }
//       >
//         {/* Time Filter - 16px horizontal padding */}
//         <View
//           style={{
//             paddingHorizontal: 16, // Fixed 16px as shown in Figma
//             paddingVertical: 16,
//           }}
//         >
//           <TimeFilterSelector onFilterChange={handleFilterChange}  />
//         </View>
 
//         {/* Total Enquiries Card - 24px horizontal padding */}
//         <View
//           style={{
//             paddingHorizontal: 24, // Fixed 24px as shown in Figma
//             marginBottom: 16, // Fixed 16px gap
//           }}
//         >
//          <View
//       className="flex-row justify-between items-center w-88 h-[52px] rounded-2xl bg-[#DEEEF6] px-8 py-2 gap-x-2.5"
//     >
//       <Text style={Typography.copy1}
//         className=" leading-6 text-river-blue-5"
//       >
//         Total Enquiries
//       </Text>
//       <Text style={Typography.headline3B}
//         className=" text-[#00405D]"
//       >
//         {dashboard?.totalOpenOpp?.toString() ?? '0'}
//       </Text>
//     </View>
//         </View>
 
//         {/* Stats Grid - First Row */}
//         <View
//           style={{
//             flexDirection: 'row',
//             paddingHorizontal: 24, // Fixed 24px horizontal padding
//             marginBottom: 16, // Fixed 16px gap
//             gap: 16, // Fixed 16px gap between cards
//           }}
//         >
//           <Pressable
//             style={{ flex: 1 }}
//             onPress={() => router.push('/test-rides')}
//           >
//             <TestRideCard
//               number={dashboard?.testRideCount?.toString() ?? '0'}
//               label="Test Ride"
//               cardHeight={120} // Fixed 120px height from Figma
//               fontScale={dimensions.fontScale}
//             />
//           </Pressable>
 
//           <Pressable
//             style={{ flex: 1 }}
//             onPress={() => router.push('/follow-ups')}
//           >
//             <TestRideCard
//               number={dashboard?.followUpCount?.toString() ?? '0'}
//               label="Follow-Ups"
//               cardHeight={120} // Fixed 120px height from Figma
//               fontScale={dimensions.fontScale}
//             />
//           </Pressable>
//         </View>
 
//         {/* Stats Grid - Second Row */}
//         <View
//           style={{
//             flexDirection: 'row',
//             paddingHorizontal: 24, // Fixed 24px horizontal padding
//             marginBottom: 16, // Fixed 16px gap
//             gap: 16, // Fixed 16px gap between cards
//           }}
//         >
//           <Pressable
//             style={{ flex: 1 }}
//             onPress={() => router.push('/bookings')}
//           >
//             <TestRideCard
//               number={dashboard?.bookingCount?.toString() ?? '0'}
//               label="Booking"
//               cardHeight={120} // Fixed 120px height from Figma
//               fontScale={dimensions.fontScale}
//             />
//           </Pressable>
 
//           <Pressable
//             style={{ flex: 1 }}
//             onPress={() => router.push('/retails')}
//           >
//             <TestRideCard
//               number={dashboard?.retailCount?.toString() ?? '0'}
//               label="Retails"
//               cardHeight={120} // Fixed 120px height from Figma
//               fontScale={dimensions.fontScale}
//             />
//           </Pressable>
//         </View>
 
//         {/* Alert Cards - Third Row */}
//         <View
//           style={{
//             flexDirection: 'row',
//             paddingHorizontal: 24, // Fixed 24px horizontal padding
//             marginBottom: 32, // 32px gap before button (as requested)
//             gap: 16, // Fixed 16px gap between cards
//           }}
//         >
//           <Pressable
//             style={{ flex: 1 }}
//             onPress={() => router.push('/follow-ups/overdue')}
//           >
//             <TestRideCard
//               number={dashboard?.overdueFollowUps?.toString() ?? '0'}
//               isRed={true}
//               label="Overdue Follow-Ups"
//               cardHeight={120} // Fixed 120px height from Figma
//               fontScale={dimensions.fontScale}
//             />
//           </Pressable>
 
//           <Pressable
//             style={{ flex: 1 }}
//             onPress={() => router.push('/retails/expiring')}
//           >
//             <TestRideCard
//               number={dashboard?.expiringEdrives?.toString() ?? '0'}
//               isRed={true}
//               label="Expiring PM EDrive"
//               cardHeight={120} // Fixed 120px height from Figma
//               fontScale={dimensions.fontScale}
//             />
//           </Pressable>
//         </View>
 
//         {/* Create Enquiry Button - 32px below last content */}
//         <View
//           style={{
//             alignItems: 'center',
//             justifyContent: 'center',
//             paddingHorizontal: 24,
//             marginBottom: 48,
//           }}
//         >
//           <Pressable
//             onPress={handlePress}
//             onPressIn={handlePressIn}
//             onPressOut={handlePressOut}
//             accessibilityRole="button"
//             accessibilityLabel="Create Enquiry"
//             accessibilityHint="Creates a new enquiry"
//           >
//             <Animated.View
//               style={{
//                 width: 184,
//                 height: 48,
//                 borderRadius: 90,
//                 backgroundColor: animatedBackground,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 shadowColor: '#00405D',
//                 shadowOffset: { width: 0, height: 2 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 4,
//                 elevation: 3,
//               }}
//             >
//               <Animated.Text
//                 style={[
//                   Typography.subline1,
//                   {
//                     color: animatedTextColor,
//                     textAlign: 'center',
//                     includeFontPadding: false,
//                     textAlignVertical: 'center',
//                   },
//                 ]}
//                 numberOfLines={1}
//               >
//                 Create Enquiry
//               </Animated.Text>
//             </Animated.View>
//           </Pressable>
//         </View>
 
//          {/* <View style={{ marginTop: 16 }}>
//           <Text style={[Typography.subline1, { marginBottom: 8 }]}>Notifications (last 24h)</Text>
//           {notifications.length === 0 ? (
//             <Text style={[Typography.copy1, { color: '#6B7280' }]}>No notifications in the last 24 hours.</Text>
//           ) : (
//             notifications.map((n) => (
//               <View
//                 key={n.id}
//                 style={{
//                   backgroundColor: '#FFFFFF',
//                   padding: 12,
//                   borderRadius: 10,
//                   marginBottom: 10,
//                   shadowColor: '#000',
//                   shadowOpacity: 0.03,
//                   elevation: 1,
//                 }}
//               >
//                 <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
//                   <View style={{ marginRight: 12, marginTop: 2 }}>
//                     {n.iconType === 'shield' ? <BikeIcon /> : <FileIcon />}
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={[Typography.subline1, { color: '#00405D' }]}>{n.title}</Text>
//                     <Text style={[Typography.copy1, { color: '#0F172A', marginTop: 6 }]}>{n.message}</Text>
//                     <Text style={[Typography.copy2, { color: '#6B7280', marginTop: 6 }]}>{n.time}</Text>
//                   </View>
//                 </View>
//               </View>
//             ))
//           )}
//         </View> */}
 
//       </ScrollView>
 
//  <ConfirmationPopup
//         visible={popupVisible}
//         onClose={handleIgnore}
//         onConfirm={handleConfirm}
//         title={popupItem?.title ?? 'Upcoming'}
//         message={popupItem?.message ?? ''}
//         highlightedText={''}
//         confirmButtonText="View Details"
//         cancelButtonText="Ignore"
//         showBlur={true}
//       />
 
//     </View>
//   );
// };
 
// export default HomeScreen;


import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Animated, Dimensions, Easing, Pressable, ScrollView, Alert, Text, TouchableOpacity, View, BackHandler, RefreshControl, AppState, AppStateStatus } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import TestRideCard from '@/app/components/HomeScreen/card';
import EnquiryCard from '@/app/components/HomeScreen/longcard';
import Notification from '@/app/components/HomeScreen/notification';
import ProfileIcon from '@/app/components/HomeScreen/profile';
import SearchBar from '@/app/components/HomeScreen/searchinput';
import TimeFilterSelector from '@/app/components/HomeScreen/timefilter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Typography from '@/constants/typography';
import AnimatedSingleButton from '@/app/components/footersinglebtn';
import { useNavigationState } from '@react-navigation/native';
import { getValidAccessToken } from './auth/auth.service';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE, ENV } from '@/constants/env';
import ConnectionStatusBar from '@/app/components/connection';
import ConfirmationPopup from '@/app/components/confirmationmodal';
 
import { performUnifiedSearch } from '@/app/components/TestRide/globalSearch';
 
import { RelativePathString } from 'expo-router';
import { useTimeFilter } from './timefiltercontext'; 
 
// ---- Missing icon imports fixed ----
import BikeIcon from '@/app/components/Notification/notificationicon';
import FileIcon from '@/app/components/Notification/notificationicon2';
import { sendLog } from './logger';
import { logAsyncStorage } from './auth/AsyncStorageLog';
 
 
////// notifications ////////
const NOTIFICATION_KEY = 'userNotifications'; // stored list for Notifications page
const SHOWN_POPUPS_KEY = 'shownNotificationIds'; // shown popup ids (24h dedupe)
const POLLING_INTERVAL = 4 * 60 * 1000; // 4 minutes
 
// ⚙️ Configure the lead times here.
// The user asked specifically for "show the popup in home 15 mins prior to followup or test ride".
// Set TEST_RIDE_ALERT_MINUTES = 15 and FOLLOWUP_ALERT_MINUTES = 15 to match that.
// If you want test rides at 60 minutes, change TEST_RIDE_ALERT_MINUTES to 60.
const TEST_RIDE_ALERT_MINUTES = 15; // minutes before test ride to show popup
const FOLLOWUP_ALERT_MINUTES = 15; // minutes before follow-up to show popup
 
const DAY_MS = 24 * 60 * 60 * 1000;
 
interface NotificationItem {
  id: string;
  iconType: 'shield' | 'document';
  title: string;
  message: string;
  time: string; // display time
  timestamp: number; // trigger time in ms
  raw?: any;
}
 
const toISTString = (timestamp: number) =>
  new Date(timestamp).toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
 
// --- helpers for dedupe shown popups ---
const readShownMap = async (): Promise<Record<string, number>> => {
  const raw = await AsyncStorage.getItem(SHOWN_POPUPS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};
const markShown = async (id: string) => {
  const map = await readShownMap();
  map[id] = Date.now();
  // prune older than 24h
  for (const k of Object.keys(map)) {
    if (Date.now() - map[k] > DAY_MS) delete map[k];
  }
  await AsyncStorage.setItem(SHOWN_POPUPS_KEY, JSON.stringify(map));
};
const hasShownRecently = async (id: string) => {
  const map = await readShownMap();
  return !!(map[id] && Date.now() - map[id] <= DAY_MS);
};
 
// --- normalization helper ---
// Accepts many possible API formats:
// - ISO timestamp string: "2025-08-08T10:00:00Z"
// - "2025-08-08" (date-only) -> treat as at 00:00
// - hour-only '10' or 10 -> combine with fallbackDate (yyyy-mm-dd) or today's date
// - If fallbackDateStr provided (yyyy-mm-dd), use that to combine with hour-only.
const normalizeToTimestamp = (raw: any, fallbackDateStr?: string): number | null => {
  if (!raw && raw !== 0) return null;
  // Already number (ms timestamp)
  if (typeof raw === 'number') {
    // if looks like seconds (10 digits) convert to ms
    if (raw < 1e12) return raw * 1000;
    return raw;
  }
 
  const s = String(raw).trim();
 
  // hour-only like '9' or '09' or number string
  if (/^\d{1,2}$/.test(s)) {
    const hh = s.padStart(2, '0');
    const datePart =
      fallbackDateStr ||
      new Date().toISOString().split('T')[0]; // 'yyyy-mm-dd' of today
    const iso = `${datePart}T${hh}:00:00`;
    const t = Date.parse(iso);
    return isNaN(t) ? null : t;
  }
 
  // ISO-like or contains time
  const parsed = Date.parse(s);
  if (!isNaN(parsed)) return parsed;
 
  // date-only 'YYYY-MM-DD'
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const t = Date.parse(`${s}T00:00:00`);
    return isNaN(t) ? null : t;
  }
 
  // fallback: try to parse loose numbers
  const asNum = Number(s);
  if (!isNaN(asNum)) {
    if (asNum < 1e12) return asNum * 1000;
    return asNum;
  }
 
  return null;
};
 
 
 
 
// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
 
// Responsive dimension calculations
const getResponsiveDimensions = () => {
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
  const isLargeScreen = screenWidth >= 414;
 
  return {
    // Horizontal padding - responsive
    horizontalPadding: screenWidth * 0.062, // ~24px for 390px screen
    // Header height - responsive
    headerHeight: screenHeight * 0.218, // ~184px for 844px screen
    // Content top margin - responsive
    contentTopMargin: screenHeight * 0.236, // ~200px for 844px screen
    // Card spacing
    cardGap: screenWidth * 0.041, // ~16px for 390px screen
    // Card heights - responsive
    statCardHeight: Math.max(100, screenHeight * 0.142), // ~120px for 844px screen, minimum 100
    // Bottom button area
    bottomButtonHeight: Math.max(96, screenHeight * 0.114), // ~96px for 844px screen
    // Font scaling for different screen sizes
    fontScale: isSmallScreen ? 0.9 : isMediumScreen ? 1.0 : 1.1,
  };
};
 
// Define the DateRange interface
interface DateRange {
  startDate: string | null;
  endDate: string | null;
  specificDate: string | null;
  type: 'specific' | 'flexible';
}
 
const HomeScreen = () => {
  const [bgAnim] = useState(new Animated.Value(0));
 
  const handlePressIn = () => {
    Animated.timing(bgAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.inOut(Easing.ease), // smooth and elegant
      useNativeDriver: false,
    }).start();
  };
 
  const handlePressOut = () => {
    Animated.timing(bgAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };
 
  const animatedBackground = bgAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#00405D', '#373409', '#F7EC2B'],
  });
 
  const animatedTextColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F7FBFD', '#000000'], // white to black
  });
 
type UserProfile = {
  StoreName: string;
  StorePhone: string;
  UserDesignation: string | null;
  UserEmail: string;
  UserId: string;
  UserName: string;
  UserPhone: string;
};
 
type DashboardData = {
  testRideCount: number;
  followUpCount: number;
  bookingCount: number;
  retailCount: number;
  overdueFollowUps: number;
  expiringEdrives: number;
  totalOpenOpp: number,
  opportunitySources?: {
    [key: string]: string[];
  };
};
 
const hourlyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const hourlyIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
const [dashboard, setDashboard] = useState<DashboardData | null>(null);
 
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // const [filter, setFilter] = useState<string>('Today');
 
  const [showNoResults, setShowNoResults] = useState(false);
  // Add state for date filter
    // const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const { filter, dateRange, setGlobalFilter, isLoading: filterLoading } = useTimeFilter();
 
  const [profileReady, setProfileReady] = useState(false);
 
  // Get responsive dimensions
  const dimensions = getResponsiveDimensions();
 
  const isNavigatingRef = React.useRef(false);
 
 
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true; // disables back action
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove(); // ✅ correct cleanup
    }, [])
  );
 
 
 
   const [searchQuery, setSearchQuery] = useState('');
 
const [isSearching, setIsSearching] = useState(false);
 
 
 
 
 
const handleSearchNavigation = async (query: string) => {
  if (isNavigatingRef.current || !query.trim()) return;
 
  setIsSearching(true);
  setShowNoResults(false); // Reset no results state
 
  try {
    const searchResults = await performUnifiedSearch(query.trim());
   
    if (searchResults.totalCount === 0) {
      // No results found - show "No Results Found" in search bar
      setShowNoResults(true);
      setIsSearching(false);
     
      // Hide the message after 3 seconds
      setTimeout(() => {
        setShowNoResults(false);
      }, 3000);
     
      return;
    }
 
    // Results found - proceed with navigation
    const bestMatch = searchResults.bestMatch;
    if (!bestMatch) {
      setIsSearching(false);
      return;
    }
 
    isNavigatingRef.current = true;
 
    // Determine the route based on the best match type
    let routePath = '';
    switch (bestMatch.type) {
      case 'testride':
        routePath = '/test-rides';
        break;
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
        routePath = '/test-rides'; // fallback
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
 
  } catch (error) {
    console.error('Search error:', error);
    Alert.alert('Search Error', 'Failed to perform search. Please try again.');
  } finally {
    setIsSearching(false);
  }
};
 
 
 
 
  const storeFullDashboardData = async (rawResponse: any) => {
    try {
    const {
      totalOldFollowUpList,
      totalOldFollowUp,
      totalFollowUp,
      totalTestDrive,
      totalBookings,
      totalPurchase,
      totalOpenOpp,
      TestDriveType,
      OpportunityDropOutSources,
      OpportunitySources,
      StatusCode,
      StatusMessage
    } = rawResponse;
   
    const keyValuePairs: [string, any][] = [
      ['oldFollowUps', totalOldFollowUpList],
      ['countOldFollowUps', totalOldFollowUp],
      ['countFollowUps', totalFollowUp],
      ['countTestDrives', totalTestDrive],
      ['countBookings', totalBookings],
      ['countPurchases', totalPurchase],
      ['countOpenOpportunities', totalOpenOpp],
      ['testDriveTypes', TestDriveType],
      ['dropOutSources', OpportunityDropOutSources],
      ['opportunitySources', OpportunitySources],
      ['dashboardStatusCode', StatusCode],
      ['dashboardStatusMessage', StatusMessage]
    ];
   
    for (const [key, value] of keyValuePairs) {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      ENV   === 'dev'
         &&  console.log(`[🧠 AsyncStorage] Saved: ${key}`, value);
      // sendLog('info', `Stored dashboard data: ${key} = ${JSON.stringify(value)}`);
    }
   
      ENV === 'dev'&&console.log('✅ Dashboard metadata stored successfully.');
    } catch (err) {
      ENV === 'dev'&&console.error('❌ Error storing dashboard data:', err);
    // sendLog('error', `Failed to store dashboard data: ${err}`);
    }
  };
 
 
  //notifications ///////////////////////////////
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupItem, setPopupItem] = useState<NotificationItem | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const isFocused = useIsFocused();
  const router = useRouter();
 
  // fetch & compute function
  const fetchAndCompute = useCallback(async () => {
    try {
      const token = await getValidAccessToken();
      const profileRaw = await AsyncStorage.getItem('userProfile');
      if (!profileRaw) throw new Error('Missing user profile');
      const { UserId, EmployeeType } = JSON.parse(profileRaw);
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      const payload = { UserId, FilterDate: 'TODAY' };
 
      const [testRidesRes, followUpsRes] = await Promise.all([
        fetch(`${API_BASE}/api/data/EventTestDrive`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        }),
        fetch(`${API_BASE}/api/data/EventFollowUp`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        }),
      ]);
      const testRides = await testRidesRes.json();
      const followUps = await followUpsRes.json();
      const now = Date.now();
 
      const upcoming: NotificationItem[] = [];
 
      // --- TEST RIDES ---
      for (const ride of testRides?.Data || []) {
        // try various possible fields
        // Prefer ScheduleDateTime; fallback to ScheduleDate + ScheduleHour or Hour field
        const scheduleRaw = ride.ScheduleDateTime ?? ride.ScheduleDate ?? ride.ScheduleTime ?? ride.Time ?? ride.ScheduleHour ?? ride.Hour ?? ride.Schedule;
        // If ScheduleDateTime is just hour, pass ScheduleDate for fallback
        let fallbackDate: string | undefined = undefined;
        if (ride.ScheduleDate) {
          // ensure yyyy-mm-dd format if possible (try to parse)
          const d = normalizeToTimestamp(ride.ScheduleDate);
          if (d) {
            fallbackDate = new Date(d).toISOString().split('T')[0];
          }
        }
        const scheduled = normalizeToTimestamp(scheduleRaw, fallbackDate);
        if (!scheduled) continue;
 
        // trigger at scheduled - TEST_RIDE_ALERT_MINUTES
        const triggerTime = scheduled - TEST_RIDE_ALERT_MINUTES * 60 * 1000;
        const withinWindow = now >= triggerTime && now - triggerTime <= DAY_MS;
        if (withinWindow) {
          const id = `ride-${ride.TestDriveId ?? ride.Id ?? scheduled}`;
          const item: NotificationItem = {
            id,
            iconType: 'shield',
            title: 'Upcoming Test Ride',
            message: `Test ride with ${ride.LeadName ?? ride.ContactName ?? 'customer'} at ${toISTString(scheduled).split(',')[1].trim()}`,
            time: toISTString(triggerTime),
            timestamp: triggerTime,
            raw: ride,
          };
          upcoming.push(item);
        }
      }
 
      // --- FOLLOW-UPS ---
      for (const f of followUps?.Data || []) {
        const scheduleRaw = f.FollowUpDate ?? f.ScheduleDateTime ?? f.ScheduleDate ?? f.FollowUpTime ?? f.Time;
        let fallbackDate: string | undefined = undefined;
        if (f.FollowUpDate && /^\d{4}-\d{2}-\d{2}$/.test(String(f.FollowUpDate))) {
          fallbackDate = String(f.FollowUpDate);
        } else if (f.ScheduleDate) {
          const d = normalizeToTimestamp(f.ScheduleDate);
          if (d) fallbackDate = new Date(d).toISOString().split('T')[0];
        }
        const scheduled = normalizeToTimestamp(scheduleRaw, fallbackDate);
        if (!scheduled) continue;
 
        const triggerTime = scheduled - FOLLOWUP_ALERT_MINUTES * 60 * 1000;
        const nowTs = Date.now();
        const withinWindow = nowTs >= triggerTime && nowTs - triggerTime <= DAY_MS;
        if (withinWindow) {
          const id = `follow-${f.FollowUpId ?? f.Id ?? scheduled}`;
          const item: NotificationItem = {
            id,
            iconType: 'document',
            title: 'Upcoming Follow-up',
            message: `Follow-up with ${f.LeadName ?? f.ContactName ?? 'contact'} at ${toISTString(scheduled).split(',')[1].trim()}`,
            time: toISTString(triggerTime),
            timestamp: triggerTime,
            raw: f,
          };
          upcoming.push(item);
        }
      }
 
      // Save upcoming to AsyncStorage for Notifications page
      await AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(upcoming));
      setNotifications(upcoming);
 
      // If app is active and Home is focused, show popups for any items that haven't been shown
      if (appState.current === 'active' && isFocused) {
        // show one popup at a time
        for (const item of upcoming) {
          const shown = await hasShownRecently(item.id);
          if (!shown) {
            // show popup
            setPopupItem(item);
            setPopupVisible(true);
            // wait for user response before marking others — the popup handlers will mark shown
            break;
          }
        }
      }
    } catch (err) {
     
      // try load cache to render
      try {
        const cached = await AsyncStorage.getItem(NOTIFICATION_KEY);
        if (cached) {
          const arr = JSON.parse(cached) as NotificationItem[];
          const valid = arr.filter((n) => Date.now() - n.timestamp <= DAY_MS);
          setNotifications(valid);
        }
      } catch (e) {
        /* ignore */
      }
    }
  }, [isFocused]);
// --------- Hourly aligned polling :44:05 ----------
const CHECK_MINUTE = 44; // run at :44 of every hour
const CHECK_SECOND = 5;  // run at :44:05 to avoid edge-second race
 
const clearHourlyTimers = () => {
  if (hourlyTimeoutRef.current) {
    clearTimeout(hourlyTimeoutRef.current as any);
    hourlyTimeoutRef.current = null;
  }
  if (hourlyIntervalRef.current) {
    clearInterval(hourlyIntervalRef.current as any);
    hourlyIntervalRef.current = null;
  }
};
 
const scheduleHourlyAtMinute = (minute: number, second = 0) => {
  // clear existing timers first
  clearHourlyTimers();
 
  const now = new Date();
  const next = new Date(now);
  next.setMinutes(minute, second, 0); // mm:ss:ms
  if (next.getTime() <= now.getTime()) {
    next.setHours(next.getHours() + 1);
  }
  const delay = next.getTime() - now.getTime();
 
  hourlyTimeoutRef.current = setTimeout(() => {
    // only fetch if app is active & Home focused
    if (appState.current === 'active' && isFocused) {
      fetchAndCompute().catch((e) => console.warn('scheduled fetch error', e));
    }
 
    // now set repeating hourly interval
    hourlyIntervalRef.current = setInterval(() => {
      if (appState.current === 'active' && isFocused) {
        fetchAndCompute().catch((e) => console.warn('scheduled fetch error', e));
      }
    }, 60 * 60 * 1000); // every hour
  }, delay);
};
 
useEffect(() => {
  // schedule the hourly check at :44:05
  scheduleHourlyAtMinute(CHECK_MINUTE, CHECK_SECOND);
 
  // immediate check when screen mounted and app active
  if (appState.current === 'active' && isFocused) {
    fetchAndCompute();
  }
 
  // listen for app state changes to start/stop polling sensibly
  const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
    appState.current = next;
    if (next === 'active') {
      // immediate fetch on resume
      fetchAndCompute();
      // if interval was cleared while backgrounded, reschedule
      if (!hourlyIntervalRef.current) scheduleHourlyAtMinute(CHECK_MINUTE, CHECK_SECOND);
    } else {
      // backgrounded — stop the hourly interval to save battery
      if (hourlyIntervalRef.current) {
        clearInterval(hourlyIntervalRef.current as any);
        hourlyIntervalRef.current = null;
      }
      // keep the timeout so the next run stays aligned (optional)
    }
  });
 
  return () => {
    sub.remove();
    clearHourlyTimers();
  };
  // Re-run when fetchAndCompute or focus changes
}, [fetchAndCompute, isFocused]);
 
 
  // also re-check whenever Home is focused
  useEffect(() => {
    if (isFocused && appState.current === 'active') {
      fetchAndCompute();
    }
  }, [isFocused, fetchAndCompute]);
 
  // popup handlers
  const handleConfirm = async () => {
    if (!popupItem) {
      setPopupVisible(false);
      return;
    }
    await markShown(popupItem.id);
    setPopupVisible(false);
    // go to notifications page (user wanted this routing)
    router.push('/notify');
    // after closing, check if another pending popup exists in notifications state
    setTimeout(() => {
      // keep flow: we will re-run fetchAndCompute soon via polling or immediate call
      fetchAndCompute();
    }, 500);
  };
 
  const handleIgnore = async () => {
    if (popupItem) await markShown(popupItem.id);
    setPopupVisible(false);
    // After ignoring, continue to next pending (if any) by re-checking
    setTimeout(() => fetchAndCompute(), 300);
  };
 
 
 
 
 
  // Navigation handler for Profile Icon
  const handleProfileNavigation = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
   
    // Navigate to profile screen (adjust route as needed)
    router.push('/profile');
   
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 2000);
  };
 
  // Navigation handler for Notification
  const handleNotificationNavigation = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
   
    // Navigate to notification screen
    router.push('/notify');
   
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };
 
  const fetchUserProfile = async () => {
  setLoading(true);
  try {
    const username = await AsyncStorage.getItem('username');
    if (!username) throw new Error('Username not found in storage');
 
    const accessToken = await getValidAccessToken();
    if (!accessToken) throw new Error('Could not get valid access token');
 
    const response = await fetch(`${API_BASE}/api/data/EventProfile/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ username }),
    });
 
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();
 
    if (!result.Data || !Array.isArray(result.Data) || result.Data.length === 0) {
      throw new Error('No user data returned from API');
    }
 
 
    const data: UserProfile = result.Data[0];
    setUser(data);
    await AsyncStorage.setItem('userProfile', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
  } finally {
    setLoading(false);
    setProfileReady(true); // ✅ Always set this in finally
  }
 
};
 
const handleSearchTextChange = (text: string) => {
  setSearchQuery(text);
  if (showNoResults) {
    setShowNoResults(false); // Reset no results when user starts typing again
  }
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
 
// Updated function to fetch test rides count using the same logic as test rides page
// const fetchTestRidesCount = async ({
//   filter,
//   startDate,
//   endDate,
//   specificDate
// }: {
//   filter: string;
//   startDate?: string | null;
//   endDate?: string | null;
//   specificDate?: string | null;
// }): Promise<number> => {
//   try {
//     const accessToken = await getValidAccessToken();
//     const userProfile = await AsyncStorage.getItem('userProfile');
//     if (!userProfile) throw new Error('User profile not found');
 
//     const { UserId } = JSON.parse(userProfile);
 
//     let payload: any = { UserId };
 
//     if (filter === 'Custom') {
//       if (specificDate) {
//         payload.FilterDate = specificDate;
//       } else if (startDate && endDate) {
//         payload.FilterDate = startDate;
//         payload.FilterEndRange = endDate;
//       } else {
//         throw new Error('Invalid custom date range');
//       }
//     } else {
//       payload.FilterDate = filter.toUpperCase();
//     }
 
//     console.log('[📊 TEST RIDES COUNT] Sending payload:', payload);
 
//     const response = await fetch(`${API_BASE}/api/data/EventTestDrive`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify(payload),
//     });
 
//     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//     const result = await response.json();
 
//     const apiData = result?.Data || [];
 
   
//     // The metadata is the last item in the array, not a separate array
//     let ridesArray = [];
   
//     if (Array.isArray(apiData) && apiData.length > 0) {
//       // Find the metadata object (it has TestDriveStatuses property)
//       const metaIndex = apiData.findIndex(item => item.TestDriveStatuses);
     
//       if (metaIndex !== -1) {
//         // Remove metadata from the rides array
//         ridesArray = apiData.filter((_, index) => index !== metaIndex);
//       } else {
//         // No metadata found, use all items as rides
//         ridesArray = apiData;
//       }
//     }
 
//     // Filter test rides using the same logic as the test rides page
//     const filteredRides = ridesArray
//       .filter((item) => {
//         // Only filter out items that are completely invalid or are metadata
//         return item && (item.LeadName || item.TestDriveId) && !item.TestDriveStatuses;
//       })
//       .filter((ride) => {
//         const originalStatus = ride.TestStatus || 'Scheduled';
       
//         if (originalStatus === 'Scheduled' ) {
//           return true;
//         }
       
//         if (originalStatus === 'Rescheduled' && ride.ScheduleDateTime) {
//           return isToday(ride.ScheduleDateTime);
//         }
       
//         return false;
//       });
 
//     console.log('[📊 TEST RIDES COUNT] Filtered count:', filteredRides.length);
//     return filteredRides.length;
 
//   } catch (error) {
//     console.error('Test rides count fetch error:', error);
//     return 0;
//   }
// };
 
const storeTimeFilter = async (filter: string, range?: DateRange) => {
 const filterPayload: any = {};
 
 
 if (filter === 'Custom' && range) {
   if (range.specificDate) {
     filterPayload.FilterDate = range.specificDate;
   } else if (range.startDate && range.endDate) {
     filterPayload.FilterDate = range.startDate;
     filterPayload.FilterEndRange = range.endDate;
   }
 } else {
   filterPayload.FilterDate = filter.toUpperCase();
 }
 
 
 try {
   await AsyncStorage.setItem('timeFilter', JSON.stringify(filterPayload));
     ENV === 'dev'&&console.log('🧠 [AsyncStorage] Saved: timeFilter', filterPayload);
 } catch (err) {
   console.error('❌ Failed to save time filter', err);
 }
};
 
// Cache invalidation function
const invalidateDashboardCache = async () => {
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
        cacheKey: 'dashboard'
      }),
    });
   
      ENV === 'dev'&&console.log('🗑️ Dashboard cache invalidated');
  } catch (error) {
    console.error('❌ Failed to invalidate dashboard cache:', error);
  }
};
 
// 🔥 Toggle this when backend is ready
const USE_MOCK_DASHBOARD = true;

const fetchDashboardData = async ({
  filter,
}: {
  filter: string;
}): Promise<DashboardData> => {
  try {
    // ================= GET STORED DATA =================
    const profileRaw = await AsyncStorage.getItem('userProfile');
    if (!profileRaw) throw new Error('User profile not found');

    const parsedProfile = JSON.parse(profileRaw);

    const username = parsedProfile.UserName;
    const dealerCode = parsedProfile.UserId;

    // ⚠️ IMPORTANT: make sure you stored this during login
    const branchCode = await AsyncStorage.getItem('locationCode');
    const token = await AsyncStorage.getItem('authToken');

    if (!branchCode) {
      console.warn('⚠️ branchCode missing');
    }

    // ================= FILTER MAPPING =================
    const filterMap: Record<string, string> = {
      Today: 'T',
      Week: 'CW',
      Month: 'CM',
      Custom: 'C',
    };

    const filterType = filterMap[filter] || 'T';

    let data;

    // ================= MOCK DATA =================
    if (USE_MOCK_DASHBOARD) {
      await new Promise(res => setTimeout(res, 600));

      data = {
        isSuccess: true,
        messageList: [],
        errorList: [],
        responseData: {
          totalEnquiries: 5,
          totalTestDrives: 5,
          totalFollowUps: 3,
          totalBookings: 4,
          totalRetail: 10,
          totalOverdueFollowUps: 1,
          totalOpenOpportunities: 7,
        },
      };

      console.log('🧪 Using MOCK dashboard');
    }

    // ================= REAL API =================
    else {
      console.log('📡 Calling Dashboard API');

      const response = await fetch(`${API_BASE}/dashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          client_id: 'YOUR_CLIENT_ID',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userName: username,
          dealerCode: dealerCode,
          branchCode: branchCode,
          filterType: filterType,
          fromDate: null,
          toDate: null,
        }),
      });

      data = await response.json();
    }

    // ================= ERROR HANDLING =================
    if (!data?.isSuccess) {
      const errorMsg =
        data?.errorList?.[0]?.message || 'Dashboard API failed';
      throw new Error(errorMsg);
    }

    const res = data.responseData;

    // ================= MAP RESPONSE =================
    const parsed: DashboardData = {
      testRideCount: res?.totalTestDrives ?? 0,
      followUpCount: res?.totalFollowUps ?? 0,
      bookingCount: res?.totalBookings ?? 0,
      retailCount: res?.totalRetail ?? 0,
      overdueFollowUps: res?.totalOverdueFollowUps ?? 0,
      expiringEdrives: 0, // not provided in API
      totalOpenOpp: res?.totalOpenOpportunities ?? 0,
    };

    console.log('📊 Dashboard parsed:', parsed);

    return parsed;

  } catch (error) {
    console.error('🚨 Dashboard fetch error:', error);
    throw error;
  }
};
 
 
 useEffect(() => {
  const loadUserProfile = async () => {
    try {
      const cachedProfile = await AsyncStorage.getItem('userProfile');
      if (cachedProfile) {
        const parsed = JSON.parse(cachedProfile);
        setUser(parsed);
        setLoading(false);
        setProfileReady(true); // ✅
        return;
      }
 
      await fetchUserProfile();
    } catch (error) {
      console.error('Error loading cached profile:', error);
      // sendLog("error", error);
      await fetchUserProfile();
    }
  };
 
  loadUserProfile();
}, []);
 
const handlePress = () => {
  const opportunitySourcesParam = dashboard?.opportunitySources ?
  encodeURIComponent(JSON.stringify(dashboard.opportunitySources)) : '';
  if (isNavigatingRef.current) return;
  isNavigatingRef.current = true;
  router.push({
    pathname: '/leads/create',
    params: {
      opportunitySources: opportunitySourcesParam
    }
  });
  setTimeout(() => {
    isNavigatingRef.current = false;
  }, 1000); // Adjust as needed
};
 
 
const isDashboardFetching = React.useRef(false);
 
const loadDashboard = useCallback(async (isRefresh = false) => {
  if (isDashboardFetching.current || filterLoading) return;
  isDashboardFetching.current = true;
 
  if (isRefresh) {
    setRefreshing(true);
  } else {
    setIsLoading(true);
  }
 
  try {
    const data = await fetchDashboardData({
      filter,
      ...(filter === 'Custom' && dateRange
        ? {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            specificDate: dateRange.specificDate
          }
        : {})
    });
 
    setDashboard(data);
   
    if (isRefresh) {
        ENV === 'dev'&&console.log('✅ Dashboard refreshed successfully');
    }
  } catch (err) {
      ENV === 'dev'&&console.error('Dashboard fetch error:', err);

    setDashboard(null);
  } finally {
    setIsLoading(false);
    setRefreshing(false);
    isDashboardFetching.current = false;
  }
}, [filter, dateRange, filterLoading]);

const onRefresh = useCallback(() => {
  loadDashboard(true);
}, [loadDashboard]);

useEffect(() => {
  if (!profileReady || filterLoading) return; 
  loadDashboard(false);
}, [loadDashboard, profileReady, filterLoading]);
 
 


 
const handleFilterChange = async (newFilter: string, range?: DateRange) => {
 
    ENV === 'dev'&&console.log('Filter changed:', { newFilter, range });
};

  return (
    <View style={{ flex: 1, backgroundColor: '#F7FBFD' }}>
      <ConnectionStatusBar></ConnectionStatusBar>
      {/* Header Section - Exact Figma Dimensions */}
      <View
        style={{
          width: '100%',
          height: 184, // Fixed height from Figma
          backgroundColor: '#00405D',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        {/* Content container - starts at 64px from top (status bar + 16px) */}
        <View
          style={{
            paddingHorizontal: 24, // Fixed 24px padding from Figma
            paddingTop: 64, // Status bar (44-48px) + 16px padding = 64px
            flex: 1,
          }}
        >
          {/* Top Row - Profile and Notification - Height: 32px */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: 32, // Exact height from Figma
              marginBottom: 16, // 16px gap between profile row and search
            }}
          >
            {/* Profile Section */}
            <TouchableOpacity
              onPress={handleProfileNavigation}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 32, // Match parent height
              }}
            >
              {/* Profile Icon - 32x32px */}
              <View
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#F7FBFD',
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ProfileIcon
                    onPress={handleProfileNavigation}/>
              </View>
 
              {/* Name Text */}
              <Text
                style={[
                  Typography.headline4,
                  {
                    marginLeft: 8, // 8px gap between icon and text
                    color: '#F7FBFD', // River Blue/01
                    fontSize: Typography.headline4.fontSize * dimensions.fontScale,
                  }
                ]}
                numberOfLines={1}
              >
                {loading ? 'Loading...' :  user?.UserName }
              </Text>
            </TouchableOpacity>
 
            {/* Notification Icon - 24x24px */}
            <TouchableOpacity
              onPress={handleNotificationNavigation}
              style={{
                width: 24,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Notification />
            </TouchableOpacity>
          </View>
 
          {/* Search Bar Container - Height: 48px */}
          {/* Search Icon - 24x24px positioned at left */}
          {/* Search Input */}
          <SearchBar backgroundColor="bg-river-blue-1" onSearch={handleSearchNavigation}
 
  value={searchQuery}
 
  isSearching={isSearching} onChangeText={handleSearchTextChange}  showNoResults={showNoResults} />
        </View>
      </View>
 
      {/* Main Content - Fixed top margin to match header */}
      <ScrollView
        style={{
          flex: 1,
          marginTop: 190, // Header (184px) + 16px gap = 200px
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 32, // Bottom padding for last content
        }}
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
        {/* Time Filter - 16px horizontal padding */}
        <View
          style={{
            paddingHorizontal: 16, // Fixed 16px as shown in Figma
            paddingVertical: 16,
          }}
        >
       <TimeFilterSelector />
        </View>
 
        {/* Total Enquiries Card - 24px horizontal padding */}
        <View
          style={{
            paddingHorizontal: 24, // Fixed 24px as shown in Figma
            marginBottom: 16, // Fixed 16px gap
          }}
        >
         <View
      className="flex-row justify-between items-center w-88 h-[52px] rounded-2xl bg-[#DEEEF6] px-8 py-2 gap-x-2.5"
    >
      <Text style={Typography.copy1}
        className=" leading-6 text-river-blue-5"
      >
        Total Enquiries
      </Text>
      <Text style={Typography.headline3B}
        className=" text-[#00405D]"
      >
        {dashboard?.totalOpenOpp?.toString() ?? '0'}
      </Text>
    </View>
        </View>
 
        {/* Stats Grid - First Row */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 24, // Fixed 24px horizontal padding
            marginBottom: 16, // Fixed 16px gap
            gap: 16, // Fixed 16px gap between cards
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => router.push('/test-rides')}
          >
            <TestRideCard
              number={dashboard?.testRideCount?.toString() ?? '0'}
              label="Test Ride"
              cardHeight={120} // Fixed 120px height from Figma
              fontScale={dimensions.fontScale}
            />
          </Pressable>
 
          <Pressable
            style={{ flex: 1 }}
            onPress={() => router.push('/follow-ups')}
          >
            <TestRideCard
              number={dashboard?.followUpCount?.toString() ?? '0'}
              label="Follow-Ups"
              cardHeight={120} // Fixed 120px height from Figma
              fontScale={dimensions.fontScale}
            />
          </Pressable>
        </View>
 
        {/* Stats Grid - Second Row */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 24, // Fixed 24px horizontal padding
            marginBottom: 16, // Fixed 16px gap
            gap: 16, // Fixed 16px gap between cards
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => router.push('/bookings')}
          >
            <TestRideCard
              number={dashboard?.bookingCount?.toString() ?? '0'}
              label="Booking"
              cardHeight={120} // Fixed 120px height from Figma
              fontScale={dimensions.fontScale}
            />
          </Pressable>
 
          <Pressable
            style={{ flex: 1 }}
            onPress={() => router.push('/retails')}
          >
            <TestRideCard
              number={dashboard?.retailCount?.toString() ?? '0'}
              label="Retails"
              cardHeight={120} // Fixed 120px height from Figma
              fontScale={dimensions.fontScale}
            />
          </Pressable>
        </View>
 
        {/* Alert Cards - Third Row */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 24, // Fixed 24px horizontal padding
            marginBottom: 32, // 32px gap before button (as requested)
            gap: 16, // Fixed 16px gap between cards
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => router.push('/follow-ups/overdue')}
          >
            <TestRideCard
              number={dashboard?.overdueFollowUps?.toString() ?? '0'}
              isRed={true}
              label="Overdue Follow-Ups"
              cardHeight={120} // Fixed 120px height from Figma
              fontScale={dimensions.fontScale}
            />
          </Pressable>
 
          <Pressable
            style={{ flex: 1 }}
            onPress={() => router.push('/retails/expiring')}
          >
            <TestRideCard
              number={dashboard?.expiringEdrives?.toString() ?? '0'}
              isRed={true}
              label="Expiring PM EDrive"
              cardHeight={120} // Fixed 120px height from Figma
              fontScale={dimensions.fontScale}
            />
          </Pressable>
        </View>
 
        {/* Create Enquiry Button - 32px below last content */}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
            marginBottom: 48,
          }}
        >
          <Pressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessibilityRole="button"
            accessibilityLabel="Create Enquiry"
            accessibilityHint="Creates a new enquiry"
          >
            <Animated.View
              style={{
                width: 184,
                height: 48,
                borderRadius: 90,
                backgroundColor: animatedBackground,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#00405D',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Animated.Text
                style={[
                  Typography.subline1,
                  {
                    color: animatedTextColor,
                    textAlign: 'center',
                    includeFontPadding: false,
                    textAlignVertical: 'center',
                  },
                ]}
                numberOfLines={1}
              >
                Create Enquiry
              </Animated.Text>
            </Animated.View>
          </Pressable>
        </View>
 
         {/* <View style={{ marginTop: 16 }}>
          <Text style={[Typography.subline1, { marginBottom: 8 }]}>Notifications (last 24h)</Text>
          {notifications.length === 0 ? (
            <Text style={[Typography.copy1, { color: '#6B7280' }]}>No notifications in the last 24 hours.</Text>
          ) : (
            notifications.map((n) => (
              <View
                key={n.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 10,
                  shadowColor: '#000',
                  shadowOpacity: 0.03,
                  elevation: 1,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ marginRight: 12, marginTop: 2 }}>
                    {n.iconType === 'shield' ? <BikeIcon /> : <FileIcon />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.subline1, { color: '#00405D' }]}>{n.title}</Text>
                    <Text style={[Typography.copy1, { color: '#0F172A', marginTop: 6 }]}>{n.message}</Text>
                    <Text style={[Typography.copy2, { color: '#6B7280', marginTop: 6 }]}>{n.time}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View> */}
 
      </ScrollView>
 
 <ConfirmationPopup
        visible={popupVisible}
        onClose={handleIgnore}
        onConfirm={handleConfirm}
        title={popupItem?.title ?? 'Upcoming'}
        message={popupItem?.message ?? ''}
        highlightedText={''}
        confirmButtonText="View Details"
        cancelButtonText="Ignore"
        showBlur={true}
      />
 
    </View>
  );
};
 
export default HomeScreen;