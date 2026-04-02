import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '@/constants/env';

type ProductItem = {
  charger: string;
  color: string;
  sku: string;
  description?: string;
};

// Fetch from API and cache in AsyncStorage after login
export const fetchAndCacheProducts = async (token: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/api/products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authentication: token,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch products');

  const data: ProductItem[] = await response.json();
  await AsyncStorage.setItem('productMaster', JSON.stringify(data));
};

export const getProductMaster = async (): Promise<ProductItem[]> => {
  const raw = await AsyncStorage.getItem('productMaster');
  if (!raw) throw new Error('Product master missing from cache');
  return JSON.parse(raw);
};

export const getChargers = async (): Promise<string[]> => {
  const data = await getProductMaster();
  return [...new Set(data.map((p) => p.charger))];
};

export const getColorsByCharger = async (charger: string): Promise<string[]> => {
  const data = await getProductMaster();
  return data.filter((p) => p.charger === charger).map((p) => p.color);
};

// Returns only the SKU string — that's the productCode for the lead payload
export const getSkuByChargerAndColor = async (
  charger: string,
  color: string
): Promise<string> => {
  const data = await getProductMaster();
  const match = data.find((p) => p.charger === charger && p.color === color);
  if (!match) throw new Error(`No product found for charger=${charger}, color=${color}`);
  return match.sku;
};