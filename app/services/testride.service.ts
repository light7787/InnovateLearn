import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '@/constants/env';

const USE_MOCK_TESTRIDE = true;

type TestRideParams = {
  opportunityId: string;
  testRideDate: string;
  testRideSlot: string;
  isHome: boolean;
  address?: string;
};

export const createTestRide = async ({
  opportunityId,
  testRideDate,
  testRideSlot,
  isHome,
  address,
}: TestRideParams): Promise<string> => {
  try {
    const profileRaw = await AsyncStorage.getItem('userProfile');
    const locationCode = await AsyncStorage.getItem('locationCode');
    const token = await AsyncStorage.getItem('authToken');

    if (!profileRaw) throw new Error('User profile missing');

    const profile = JSON.parse(profileRaw);

    const payload = {
      opportunityId,
      username: profile.UserName,
      dealerCode: profile.UserId,
      branchCode: locationCode,
      testRideType: isHome ? 'HTR' : 'STR',
      testRideDate,
      testRideSlot,
      address: isHome ? address : null,
    };

    let data;

    // 🧪 MOCK
    if (USE_MOCK_TESTRIDE) {
      await new Promise(res => setTimeout(res, 600));

      data = {
        isSuccess: true,
        data: {
          testRideId: 'TR-2026-00045',
        },
      };

      console.log('🧪 MOCK TEST RIDE CREATED');
    } else {
      const response = await fetch(`${API_BASE}/testride`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          client_id: 'YOUR_CLIENT_ID',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      data = await response.json();
    }

    if (!data?.isSuccess) {
      throw new Error(data?.errorList?.[0]?.message || 'Test ride failed');
    }

    return data.data?.testRideId;

  } catch (error) {
    console.error('🚨 TestRide error:', error);
    throw error;
  }
};