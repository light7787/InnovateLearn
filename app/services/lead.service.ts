import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '@/constants/env';
import { mapLeadSource, mapSecondarySource } from './masterMapper';
import { getSkuByChargerAndColor } from './productMapper';

type CreateLeadParams = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  leadSource: string;
  secondarySource?: string;
  charger: string;
  color: string;
};

export const createLead = async ({
  firstName,
  lastName,
  phone,
  email,
  leadSource,
  secondarySource,
  charger,
  color,
}: CreateLeadParams): Promise<string> => {
  const profileRaw = await AsyncStorage.getItem('userProfile');
  const locationCode = await AsyncStorage.getItem('locationCode');
  const token = await AsyncStorage.getItem('authToken');

  if (!profileRaw) throw new Error('User profile missing');

  const profile = JSON.parse(profileRaw);
  const leadSourceCode = await mapLeadSource(leadSource);
  const secondarySourceCode = secondarySource
    ? await mapSecondarySource(secondarySource, leadSourceCode)
    : undefined;

  // Single SKU string — this becomes productCode in the payload
  const productCode = await getSkuByChargerAndColor(charger, color);

  const payload = {
    username: profile.UserName,
    dealerCode: profile.UserId,
    branchCode: locationCode,
    salutation: '1',
    firstName,
    lastName,
    countryCode: '91',
    phone,
    email: email || '',
    stateCode: '1',
    leadSourceCode,
    leadSecondarySourceCode: secondarySourceCode,
    productCode,       // SKU e.g. "R165257753"
    opportunityId: '',
  };

  const response = await fetch(`${API_BASE}/lead/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authentication: token } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!data?.isSuccess) {
    throw new Error(data?.errorList?.[0]?.message ?? 'Lead creation failed');
  }

  return data.responseData?.opportunityId;
};