import Constants from 'expo-constants';

const {
  ENVIRONMENT = 'prod',
  API_URL,
  API_URL_DEV,
} = Constants.expoConfig?.extra ?? {};

export const ENV = ENVIRONMENT;

export const API_BASE ='http://dev.dms.ps.rideriver.com';