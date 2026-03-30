
import { getValidAccessToken } from './auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const callSalesforceAPI = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = await getValidAccessToken();
  const instanceUrl = await AsyncStorage.getItem('instanceUrl');

  if (!token || !instanceUrl) {
    throw new Error('❌ No valid access token or instance URL found');
  }

  const res = await fetch(`${instanceUrl}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`🚨 API Error ${res.status}: ${errorBody}`);
  }

  return res.json();
};

