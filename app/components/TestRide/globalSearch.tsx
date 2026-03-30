// Fixed globalSearch.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE, ENV } from '@/constants/env';
import { getValidAccessToken } from '@/app/auth/auth.service';

export interface SearchResult {
  type: 'testride' | 'followup' | 'booking' | 'retail';
  count: number;
  data: any[];
}

export interface UnifiedSearchResponse {
  results: SearchResult[];
  totalCount: number;
  bestMatch: SearchResult | null;
}

const getExpandedDateRange = () => {
  const today = new Date();
  const oneYearBefore = new Date(today);
  oneYearBefore.setFullYear(today.getFullYear() - 1);
  
  const oneYearAfter = new Date(today);
  oneYearAfter.setFullYear(today.getFullYear() + 1);
  
  return {
    startDate: oneYearBefore.toISOString().split('T')[0],
    endDate: oneYearAfter.toISOString().split('T')[0]
  };
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

// Apply the same filtering logic as in test ride screen
const filterTestRides = (data: any[]) => {
  return data.filter((ride) => {
    const originalStatus = ride.TestStatus || 'Scheduled';
    
    // Show "Confirmed" rides (from "Test Ride Confirmed" status)
    if (originalStatus === 'Test Ride Confirmed') {
      return true;
    }
    
    // Show "Scheduled" rides
    if (originalStatus === 'Scheduled' || originalStatus === 'On-Going') {
      return true;
    }

    // Show "Rescheduled" rides
    if (originalStatus === 'Reschedule') {
      return true;
    }
    
    return false;
  });
};

// Apply filtering for bookings - only show items with OrderId
const filterBookings = (data: any[]) => {
  return data.filter((booking) => {
    return booking && booking.OrderId;
  });
};

const searchInData = (data: any[], searchQuery: string, dataType: string) => {
  if (!Array.isArray(data)) return [];
  
  // First apply the same filtering logic as each screen
  let filteredData = data;
  
  if (dataType === 'testride') {
    filteredData = filterTestRides(data);
  } else if (dataType === 'booking') {
    filteredData = filterBookings(data);
  }
  // Add similar filters for other types if needed
  
  // Then apply search filter
  return filteredData.filter(item => {
    if (!item) return false;
    
    const searchLower = searchQuery.toLowerCase();
    
    // Check common fields across all types
    const leadName = (item.LeadName || item.leadName || '').toLowerCase();
    const phone = (item.LeadPhone || item.PhoneNumber || item.phoneNumber || item.phone || '').toString();
    const email = (item.LeadEmail || item.email || '').toLowerCase();
    
    // Type-specific fields
    if (dataType === 'testride') {
      const testRideType = (item.RideType === 'STR' ? 'Store Test Ride' : 'Home Test Ride').toLowerCase();
      const status = (item.TestStatus || '').toLowerCase();
      
      return leadName.includes(searchLower) || 
             phone.includes(searchQuery) || 
             email.includes(searchLower) ||
             testRideType.includes(searchLower) ||
             status.includes(searchLower);
    } else if (dataType === 'booking') {
      const orderStatus = (item.OrderStatus || '').toLowerCase();
      const orderId = (item.OrdId || item.OrderId || '').toLowerCase();
      
      return leadName.includes(searchLower) || 
             phone.includes(searchQuery) || 
             email.includes(searchLower) ||
             orderStatus.includes(searchLower) ||
             orderId.includes(searchLower);
    }
    
    return leadName.includes(searchLower) || 
           phone.includes(searchQuery) || 
           email.includes(searchLower);
  });
};

export const performUnifiedSearch = async (searchQuery: string): Promise<UnifiedSearchResponse> => {
  try {
    const token = await getValidAccessToken();
    const userProfile = await AsyncStorage.getItem('userProfile');
    if (!userProfile) throw new Error('User profile missing');

    const { UserId } = JSON.parse(userProfile);
    const expandedRange = getExpandedDateRange();
    
    const basePayload = {
      UserId,
      FilterDate: expandedRange.startDate,
      FilterEndRange: expandedRange.endDate
    };

     ENV === 'dev'&&console.log('[🔍 UNIFIED SEARCH] Searching for:', searchQuery);
     ENV === 'dev'&&console.log('[🔍 UNIFIED SEARCH] Base payload:', basePayload);

    // Call all APIs in parallel - FIXED: Use correct booking API
    const [testRideRes, followUpRes, bookingRes, retailRes] = await Promise.allSettled([
      fetch(`${API_BASE}/api/data/EventTestDrive`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(basePayload),
      }),
      fetch(`${API_BASE}/api/data/EventFollowUp`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(basePayload),
      }),
      // FIXED: Use the correct API endpoint for bookings
      fetch(`${API_BASE}/api/data/EventClosedOppAndOrder`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(basePayload),
      }),
      fetch(`${API_BASE}/api/data/EventBooking`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(basePayload),
      })
    ]);

    const results: SearchResult[] = [];

    // Process Test Rides
    if (testRideRes.status === 'fulfilled' && testRideRes.value.ok) {
      const testRideData = await testRideRes.value.json();
      const apiData = testRideData?.Data || [];
      
       ENV === 'dev'&&console.log('[🔍 TEST RIDE] Raw API data length:', apiData.length);
      
      // Filter out metadata - same logic as test ride screen
      const ridesArray = Array.isArray(apiData) 
        ? apiData.filter(item => item && (item.LeadName || item.TestDriveId) && !item.TestDriveStatuses)
        : [];
      
       ENV === 'dev'&&console.log('[🔍 TEST RIDE] After metadata filter:', ridesArray.length);
      
      // Apply search and status filters
      const filteredRides = searchInData(ridesArray, searchQuery, 'testride');
      
       ENV === 'dev'&&console.log('[🔍 TEST RIDE] After search and status filter:', filteredRides.length);
       ENV === 'dev'&&console.log('[🔍 TEST RIDE] Filtered items:', filteredRides.map(r => ({
        name: r.LeadName,
        status: r.TestStatus,
        phone: r.LeadPhone
      })));
      
      results.push({
        type: 'testride',
        count: filteredRides.length,
        data: filteredRides
      });
    } else {
       ENV === 'dev'&&console.log('[🔍 TEST RIDE] API call failed or not ok');
      results.push({
        type: 'testride',
        count: 0,
        data: []
      });
    }

    // Process Follow-ups
    if (followUpRes.status === 'fulfilled' && followUpRes.value.ok) {
      const followUpData = await followUpRes.value.json();
      const apiData = followUpData?.Data || [];
      
      const followUpsArray = Array.isArray(apiData) 
        ? apiData.filter(item => item && item.LeadName && !item.FollowUpStatuses)
        : [];
      
      const filteredFollowUps = searchInData(followUpsArray, searchQuery, 'followup');
      
      results.push({
        type: 'followup',
        count: filteredFollowUps.length,
        data: filteredFollowUps
      });
    } else {
      results.push({
        type: 'followup',
        count: 0,
        data: []
      });
    }

    // Process Bookings - FIXED: Use correct API response structure
    if (bookingRes.status === 'fulfilled' && bookingRes.value.ok) {
      const bookingData = await bookingRes.value.json();
      const apiData = bookingData?.Data || [];
      
       ENV === 'dev'&&console.log('[🔍 BOOKING] Raw API data length:', apiData.length);
      
      // FIXED: Apply the same filtering logic as the bookings page
      const bookingsArray = Array.isArray(apiData) 
        ? apiData.filter(item => item && item.OrderId) // Only items with OrderId
        : [];
      
       ENV === 'dev'&&console.log('[🔍 BOOKING] After OrderId filter:', bookingsArray.length);
      
      const filteredBookings = searchInData(bookingsArray, searchQuery, 'booking');
      
       ENV === 'dev'&&console.log('[🔍 BOOKING] After search filter:', filteredBookings.length);
       ENV === 'dev'&&console.log('[🔍 BOOKING] Filtered items:', filteredBookings.map(r => ({
        name: r.LeadName,
        status: r.Status,
        phone: r.LeadPhone,
        orderId: r.OrdId
      })));
      
      results.push({
        type: 'booking',
        count: filteredBookings.length,
        data: filteredBookings
      });
    } else {
       ENV === 'dev'&&console.log('[🔍 BOOKING] API call failed or not ok');
      results.push({
        type: 'booking',
        count: 0,
        data: []
      });
    }

    // Process Retails
    if (retailRes.status === 'fulfilled' && retailRes.value.ok) {
      const retailData = await retailRes.value.json();
      const apiData = retailData?.Data || [];
      
      const retailsArray = Array.isArray(apiData) 
        ? apiData.filter(item => item && item.LeadName && !item.RetailStatuses)
        : [];
      
      const filteredRetails = searchInData(retailsArray, searchQuery, 'retail');
      
      results.push({
        type: 'retail',
        count: filteredRetails.length,
        data: filteredRetails
      });
    } else {
      results.push({
        type: 'retail',
        count: 0,
        data: []
      });
    }

    const totalCount = results.reduce((sum, result) => sum + result.count, 0);
    
    // Find the best match (highest count)
    const bestMatch = results.reduce((best, current) => 
      current.count > (best?.count || 0) ? current : best, null as SearchResult | null);

     ENV === 'dev'&&console.log('[🔍 UNIFIED SEARCH] Final Results:', results);
     ENV === 'dev'&&console.log('[🔍 UNIFIED SEARCH] Total count:', totalCount);
     ENV === 'dev'&&console.log('[🔍 UNIFIED SEARCH] Best match:', bestMatch);

    return {
      results,
      totalCount,
      bestMatch
    };

  } catch (error) {
     ENV === 'dev'&&console.error('[🔍 UNIFIED SEARCH] Error:', error);
    return {
      results: [],
      totalCount: 0,
      bestMatch: null
    };
  }
};