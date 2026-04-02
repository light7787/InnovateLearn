import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '@/constants/env';

type GetMastersParams = {
  username: string;
  dealerCode: string;
  token: string;
};

export const getMasters = async ({
  username,
  dealerCode,
  token,
}: GetMastersParams) => {
  try {
    const response = await fetch(`${API_BASE}/api/v1/masters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ❌ no client_id
        Authentication: token, // ✅ your backend expects this
      },
      body: JSON.stringify({
        username,
        dealercode: dealerCode, // ⚠️ keep lowercase (backend expects this)
      }),
    });

    const data = await response.json();

    if (!data?.isSuccess) {
      throw new Error(
        data?.errorList?.[0]?.message || 'Failed to fetch masters'
      );
    }

    // ✅ store locally (optional but useful)
    await AsyncStorage.setItem('masters', JSON.stringify(data.responseData));

    return data.responseData;

  } catch (error: any) {
    console.error('🚨 getMasters error:', error);
    throw error;
  }
};