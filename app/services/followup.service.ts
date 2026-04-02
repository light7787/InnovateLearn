import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '@/constants/env';

const USE_MOCK_FOLLOWUP = true;

type FollowUpParams = {
  opportunityId: string;
  followUpDateTime: string; // ISO
};

export const createFollowUp = async ({
  opportunityId,
  followUpDateTime,
}: FollowUpParams) => {
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
      nextFollowUpDateTime: followUpDateTime,
      followUpFeedback: 'Customer follow-up scheduled',
      callModeCode: 'TELE',
      followUpTypeCode: 'BOOKING_CALL',
      opportunityStatus: 'WARM',
    };

    let data;

    // 🧪 MOCK
    if (USE_MOCK_FOLLOWUP) {
      await new Promise(res => setTimeout(res, 500));

      data = {
        isSuccess: true,
        data: {
          message: 'Follow-up created successfully',
        },
      };

      console.log('🧪 MOCK FOLLOWUP CREATED');
    } else {
      const response = await fetch(`${API_BASE}/followup`, {
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
      throw new Error(data?.errorList?.[0]?.message || 'Follow-up failed');
    }

    return true;
  } catch (error) {
    console.error('🚨 FollowUp error:', error);
    throw error;
  }
};