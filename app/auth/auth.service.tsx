import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '@/constants/env';
import { router } from 'expo-router';
import { sendLog } from '../logger';

const BACKEND_REFRESH_URL = `${API_BASE}/salesforce/refresh-token`;

// Check if token is still valid (less than 2 hours old)
export const getValidAccessToken = async (): Promise<string | null> => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const issuedAtStr = await AsyncStorage.getItem('issuedAt');

  const issuedAt = issuedAtStr ? parseInt(issuedAtStr, 10) : 0;
  const now = Date.now();

  if (accessToken && now - issuedAt < 7200000) {
    return accessToken;
  }

  sendLog(`error`,'🔁 Access token expired or missing, refreshing...');
  return await refreshAccessToken();
};

// Refresh the Salesforce access token
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');

  if (!refreshToken) {
    sendLog('error','❌ Missing refresh token');
    return null;
  }

  try {
    const response = await fetch(BACKEND_REFRESH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();

    if (data.access_token) {
      // 🧠 Save refreshed tokens in AsyncStorage
      await AsyncStorage.setItem('accessToken', data.access_token);
      await AsyncStorage.setItem('refreshToken', data.refresh_token);
      await AsyncStorage.setItem('instanceUrl', data.instance_url);
      await AsyncStorage.setItem('issuedAt', data.issued_at || `${Date.now()}`);

      return data.access_token;
    } else {
      sendLog('error',`❌ Failed to refresh token: ${data}`);
        await AsyncStorage.clear();
        router.replace('/auth/webviewlogin'); 
      return null;
    }
  } catch (err) {
    sendLog('error',`🔥 Refresh error: ${err}`);
    return null;
  }
};