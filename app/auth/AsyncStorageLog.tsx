import { ENV } from '@/constants/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendLog } from '../logger';

export const logAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const stores = await AsyncStorage.multiGet(keys);

    // Build one object with all key-value pairs
    const storageDump: Record<string, string | null> = {};
    stores.forEach(([key, value]) => {
      storageDump[key] = value;
    });

    if (ENV === 'dev') {
      console.log('📦 AsyncStorage dump:', storageDump);
    } else {
      sendLog('info', {
        message: '📦 AsyncStorage dump',
        data: storageDump,
      });
    }
  } catch (e) {
    sendLog('error', `❌ Failed to load AsyncStorage contents`);
  }
};
