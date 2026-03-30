import Constants from 'expo-constants';

const {
  ENVIRONMENT = 'prod',
  API_URL,
  API_URL_DEV,
} = Constants.expoConfig?.extra ?? {};

export const ENV = ENVIRONMENT;

export const API_BASE =
  ENV === 'dev'
    ? API_URL_DEV
    : API_URL ?? 'https://dev.ps.rideriver.com';