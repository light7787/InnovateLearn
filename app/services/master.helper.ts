import AsyncStorage from '@react-native-async-storage/async-storage';

export const getMasters = async () => {
  const data = await AsyncStorage.getItem('masters');
  return data ? JSON.parse(data) : null;
};