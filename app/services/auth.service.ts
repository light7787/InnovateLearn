import { API_BASE, ENV } from '@/constants/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAndCacheProducts } from './productMapper';

type LoginResponse = {
  authToken: string;
  dealer: {
    dealerCode: string;
    [key: string]: any;
  };
  [key: string]: any;
};

export const loginUser = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const url = "http://dev.dms.ps.rideriver.com/api/v1/login";
    console.log('🌐 Fetching:', url);
    console.log('📦 Body:', JSON.stringify({ username, password }));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.log('❌ RAW RESPONSE:', text);
      throw new Error(`Server returned non-JSON (${response.status}). Check API_BASE URL.`);
    }

    const data = await response.json();
    ENV === 'dev' && console.log('✅ Login raw response:', JSON.stringify(data, null, 2));

    if (!data?.isSuccess) {
      throw new Error(data?.errorList?.[0]?.message ?? 'Login failed');
    }

    // ── response is nested: data.responseData.data.data ──
    const responseData = data.responseData.data.data;

    // ── persist auth token ────────────────────────────────
    await AsyncStorage.setItem('authToken', responseData.authToken);

    // ── persist user profile ──────────────────────────────
    await AsyncStorage.setItem('userProfile', JSON.stringify({
      UserName: username,
      UserId: responseData.dealers?.[0]?.dealerCode ?? '',
      UserEmail: '',
      UserPhone: responseData.phoneNo ?? '',
      UserDesignation: responseData.designation ?? null,
      StoreName: responseData.dealers?.[0]?.dealerName ?? '',
      StorePhone: '',
    }));

    // ── persist locationCode (used as branchCode in leads) ─
    await AsyncStorage.setItem(
      'locationCode',
      responseData.dealers?.[0]?.locations?.[0]?.locationCode ?? ''
    );

    ENV === 'dev' && console.log('✅ Stored authToken, userProfile, locationCode');

    // ── fetch + cache products right after login ──────────
    await fetchAndCacheProducts(responseData.authToken);

    ENV === 'dev' && console.log('✅ Products cached');

    return {
      authToken: responseData.authToken,
      dealer: responseData.dealers?.[0] ?? {},
    };

  } catch (error) {
    console.error('🚨 loginUser error:', error);
    throw error;
  }
};